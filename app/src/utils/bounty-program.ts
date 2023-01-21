import {PublicKey, LAMPORTS_PER_SOL, Connection} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import {AnchorError, AnchorProvider, Program, Wallet} from "@project-serum/anchor";
import { Bountyhunter } from "../../../target/types/bountyhunter";


export default class BountyProgram {

  private program: Program<Bountyhunter>;

  private readonly userAccountSeed = 'user-account';
  private readonly bountyAccountSeed = 'bounty-{0}';
  static readonly programId = new PublicKey("FAuRwCnsvpMHVBDcL47SGM5XSC7oY5u5u9VU3GDqWaZm");

  constructor(program: Program<Bountyhunter>) {
    this.program = program;
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
    try {
      const pda = this.getAccountPDA(address);
      return await this.program.account.userAccount.fetch(pda);
    } catch {
      return null;
    }

  }

  private getAccountPDA(key: PublicKey) {
    return this.getPDA(this.userAccountSeed, key);
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