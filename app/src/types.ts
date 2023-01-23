import BountyProgram from "./utils/bounty-program";
import {Octokit} from "octokit";

interface BodyContext {
  program: BountyProgram
  ghApi: Octokit,
  userAccount: any
}


export type {BodyContext};