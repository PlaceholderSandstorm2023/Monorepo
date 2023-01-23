import {PublicKey, LAMPORTS_PER_SOL, Connection} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import {AnchorError, AnchorProvider, Program, Wallet} from "@project-serum/anchor";
import { Bountyhunter } from "../../../target/types/bountyhunter";


export default class BountyProgram {

  private program: Program<Bountyhunter>;

  private readonly userAccountSeed = 'user-account';
  static readonly programId = new PublicKey("FAuRwCnsvpMHVBDcL47SGM5XSC7oY5u5u9VU3GDqWaZm");

  constructor(program: Program<Bountyhunter>) {
    this.program = program;
  }

  async getAllBounties() {
    return await this.program.account.bounty.all();
  }

  async createBounty(
    issueNumber: number,
    repoName: string,
    repoOwner: string,
    amount: number,
    poster: PublicKey
  ) {
    return await this.program.methods
      .createBounty(
        issueNumber,
        repoName,
        repoOwner,
        new anchor.BN(amount * LAMPORTS_PER_SOL),
        Math.floor(Date.now() / 1000))
      .accounts({
        bounty: this.getBountyPDA(issueNumber, repoName),
        poster: poster
      })
      .rpc();
  }

  async releaseBounty(payee: PublicKey, bountyAddress: PublicKey, poster: PublicKey) {
    return await this.program.methods
      .releaseBounty()
      .accounts({
        bounty: bountyAddress,
        poster: poster,
        recipient: payee,
        recipientAccount: await this.getUserAccount(payee) ? this.getAccountPDA(payee) : null
      })
      .rpc()
  }

  async createUserAccount(address: PublicKey, username: string) {
    return await this.program.methods
      .createUserAccount(username)
      .accounts({
        userAccount: this.getAccountPDA(address),
        user: address
      }).rpc();
  }

  async closeUserAccount(address: PublicKey) {
    return await this.program.methods
      .closeUserAccount()
      .accounts({
        userAccount: this.getAccountPDA(address),
        userAddress: address
      }).rpc()
  }

  async getUserAccount(address: PublicKey) {
    const pda = this.getAccountPDA(address);
    return await this.program.account.userAccount.fetchNullable(pda);
  }

  private getAccountPDA(key: PublicKey) {
    return this.getPDA(this.userAccountSeed, key);
  }

  private getBountyPDA(
    issueNumber: number,
    repoName: string) {
    const phrase = Uint8Array.from(
      Buffer.from(
        anchor.utils.sha256.hash(`bounty${issueNumber}${repoName}`),
        'hex'
      )
    );

    const [pda, _] = PublicKey.findProgramAddressSync(
      [phrase],
      this.program.programId
    );
    return pda;
  }

  private getPDA(name: string, key: PublicKey) {
    const [pda, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(name),
        key.toBuffer()
      ],
      this.program.programId
    );
    return pda;
  }
}