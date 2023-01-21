import {Octokit} from "octokit";


export default class OctokitWrapper {
  base: Octokit;

  constructor() {
    this.base = new Octokit();
  }

  async getUser(username: string) {
    return await this.base.request('GET /users/{username}', {username: username});
  }
}