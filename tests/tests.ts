import * as anchor from "@project-serum/anchor";
import {AnchorError, BN, Program} from "@project-serum/anchor";
import { Bountyhunter } from "../target/types/bountyhunter";
import { expect } from 'chai';
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";


describe("bountyhunter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Bountyhunter as Program<Bountyhunter>;
  const programProvider = program.provider as anchor.AnchorProvider;
  const username = 'bgreni';
  const user = programProvider.wallet;
  const userAccountString = 'user-account';
  const bountyAccountString = 'bounty';
  const accountBalance = 100 * LAMPORTS_PER_SOL;
  let connection = programProvider.connection;
  connection.requestAirdrop(user.publicKey, accountBalance);

  function getPDA(name, key=null) {
    console.log('LEN: ' + name.length);
    const seeds = key === null
    ? [name]
      : [
          anchor.utils.bytes.utf8.encode(name),
          key.toBuffer()
        ];

      const [userAccountPda, _] = PublicKey.findProgramAddressSync(
          seeds,
          program.programId
      );
      return userAccountPda;
  }

  const userAccountPda = getPDA(userAccountString, user.publicKey);

  it("create user account", async () => {

      await program.methods
      .createUserAccount(username)
      .accounts({
        userAccount: userAccountPda,
        user: user.publicKey
      })
      .rpc();

    let user_account = await program.account.userAccount.fetch(userAccountPda);
    expect(user_account.ghUsername).to.eql(username);
    expect(user_account.userAddress).to.eql(user.publicKey);
    expect(user_account.bountyEarned.toString()).to.eql(new BN(0).toString());
    expect(user_account.completedTasks).to.eql(0);
  });

  it("edit gh username", async () => {
    await program.methods
      .editGhUsername("other")
      .accounts({
        userAccount: userAccountPda,
        user: user.publicKey
      }).rpc();

    let user_account = await program.account.userAccount.fetch(userAccountPda);
    expect(user_account.ghUsername).to.eql("other");
  });

  const issueNumber = 5;
  const timestamp = Math.floor(Date.now() / 1000);
  const repoName = "funrepo";
  const repoOwner = "bgreni";
  const bountyPda = getPDA(
    Uint8Array.from(Buffer.from(
      anchor.utils.sha256.hash(`${bountyAccountString}${issueNumber}${repoName}`),
      'hex'
    ))
    );
  it("create bounty", async () => {

    await program.methods
      .createBounty(issueNumber, repoName, repoOwner, new BN(10 * LAMPORTS_PER_SOL), timestamp)
      .accounts({
        bounty: bountyPda,
        poster: user.publicKey
      }).rpc();

    let bounty = await program.account.bounty.fetch(bountyPda);

    expect(bounty.issueNumber).to.eql(issueNumber);
    expect(bounty.bountyAmount.toString()).to.eql(new BN(10 * LAMPORTS_PER_SOL).toString());
    expect(bounty.timestamp).to.eql(timestamp);
    expect(bounty.repoName).to.eql(repoName);
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
          poster: rando.publicKey,
          recipient: recipient.publicKey,
          recipientAccount: null,
        }).signers([rando]).rpc();
    } catch (_err) {
      expect(_err).to.be.instanceof(AnchorError);
      const err: AnchorError = _err;
      expect(err.error.errorCode.number).eql(6000);
      expect(err.error.errorCode.code).eql("CreatorNotSigner");
      expect(err.program.equals(program.programId)).is.true
    }
  });

  it("release bounty without registered account", async () => {
    let recipient = anchor.web3.Keypair.generate();
    let pre_signer_balance = await connection.getBalance(user.publicKey);

    await program.methods
      .releaseBounty()
      .accounts({
        bounty: bountyPda,
        poster: user.publicKey,
        recipient: recipient.publicKey,
        recipientAccount: null,
      }).rpc();

    expect(await connection.getBalance(recipient.publicKey)).eql(10 * LAMPORTS_PER_SOL);
    expect(await connection.getBalance(user.publicKey)).gt(pre_signer_balance);
  });

  it("release bounty to registered account", async () => {

    await program.methods
      .createBounty(issueNumber, repoName, repoOwner, new BN(10 * LAMPORTS_PER_SOL), timestamp)
      .accounts({
        bounty: bountyPda,
        poster: user.publicKey
      }).rpc();

    await program.methods
      .releaseBounty()
      .accounts({
        bounty: bountyPda,
        poster: user.publicKey,
        recipient: user.publicKey,
        recipientAccount: userAccountPda
      })
      .rpc();

    let account = await program.account.userAccount.fetch(userAccountPda);
    expect(account.bountyEarned.toString()).eql(new BN(10 * LAMPORTS_PER_SOL).toString());
  });

  it("Close account", async() => {
    let pre_balance = await connection.getBalance(user.publicKey);
    await program.methods
      .closeUserAccount()
      .accounts({
        userAccount: userAccountPda,
        userAddress: user.publicKey
      }).rpc();
    expect(await connection.getBalance(user.publicKey)).gt(pre_balance);
  });
});
