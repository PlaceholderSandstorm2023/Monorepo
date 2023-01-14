import * as anchor from "@project-serum/anchor";
import {AnchorError, Program} from "@project-serum/anchor";
import { Bountyhunter } from "../target/types/bountyhunter";
import { expect } from 'chai';
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";


describe("bountyhunter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Bountyhunter as Program<Bountyhunter>;
  const programProvider = program.provider as anchor.AnchorProvider;
  const user_id = 100;
  const user = programProvider.wallet;
  const userAccountString = 'user-account';
  const bountyAccountString = 'bounty';
  const accountBalance = 100 * LAMPORTS_PER_SOL;
  let connection = programProvider.connection;
  connection.requestAirdrop(user.publicKey, accountBalance);

  function getPDA(name, key) {
      const [userAccountPda, _] = PublicKey.findProgramAddressSync(
          [
              anchor.utils.bytes.utf8.encode(name),
              key.toBuffer()
          ],
          program.programId
      );
      return userAccountPda;
  }

  const userAccountPda = getPDA(userAccountString, user.publicKey);

  it("create user account", async () => {


      await program.methods
      .createUserAccount(user_id)
      .accounts({
        userAccount: userAccountPda,
        user: user.publicKey
      })
      .rpc();

    let user_account = await program.account.userAccount.fetch(userAccountPda);
    expect(user_account.ghUserId).to.eql(user_id);
    expect(user_account.userAddress).to.eql(user.publicKey);
    expect(user_account.bountyEarned).to.eql(0);
    expect(user_account.completedTasks).to.eql(0);
  });

  it("edit gh user id", async () => {
    await program.methods
      .editGhId(20)
      .accounts({
        userAccount: userAccountPda,
        user: user.publicKey
      }).rpc();

    let user_account = await program.account.userAccount.fetch(userAccountPda);
    expect(user_account.ghUserId).to.eql(20);
  });

  const issueId = 5;
  const timestamp = Math.floor(Date.now() / 1000);
  const bountyPda = getPDA(`${bountyAccountString}-${issueId}`, user.publicKey);
  it("create bounty", async () => {

    await program.methods
      .createBounty(issueId, 10, timestamp, 10)
      .accounts({
        bounty: bountyPda,
        user: user.publicKey
      }).rpc();

    let bounty = await program.account.bounty.fetch(bountyPda);

    expect(bounty.issueId).to.eql(issueId);
    expect(bounty.bountyAmount).to.eql(10);
    expect(bounty.timestamp).to.eql(timestamp);
    expect(bounty.repoId).to.eql(10);
    expect(bounty.poster).to.eql(user.publicKey);

    expect(await connection.getBalance(bountyPda)).gte(10);
  });

  it("non creator releasing bounty", async () => {
    let rando = anchor.web3.Keypair.generate();
    let recipient = anchor.web3.Keypair.generate();
    await connection.requestAirdrop(recipient.publicKey, 10 * LAMPORTS_PER_SOL);

    try {
      await program.methods
        .releaseBounty()
        .accounts({
          bounty: bountyPda,
          signer: rando.publicKey,
          recipient: recipient.publicKey
        }).signers([rando]).rpc();
    } catch (_err) {
      expect(_err).to.be.instanceof(AnchorError);
      const err: AnchorError = _err;
      expect(err.error.errorCode.number).eql(6000);
      expect(err.error.errorCode.code).eql("CreatorNotSigner");
      expect(err.program.equals(program.programId)).is.true
      expect(err.error.comparedValues).eql([user.publicKey, rando.publicKey]);
    }
  });

  it("release bounty", async () => {
    let recipient = anchor.web3.Keypair.generate();
    let pre_signer_balance = await connection.getBalance(user.publicKey);

    await program.methods
      .releaseBounty()
      .accounts({
        bounty: bountyPda,
        signer: user.publicKey,
        recipient: recipient.publicKey
      }).rpc();

    expect(await connection.getBalance(recipient.publicKey)).eql(10 * LAMPORTS_PER_SOL);
    expect(await connection.getBalance(user.publicKey)).gt(pre_signer_balance);
  });
});
