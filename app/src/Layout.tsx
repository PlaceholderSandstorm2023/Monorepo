import { Outlet, Link } from "react-router-dom";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import UserInfo from './components/UserInfo';
import {useAnchorWallet, useConnection, useWallet} from "@solana/wallet-adapter-react";
import BountyProgram from "./utils/bounty-program";
import {AnchorProvider, Program} from "@project-serum/anchor";
import { Bountyhunter } from "../../target/types/bountyhunter";
import {Keypair} from "@solana/web3.js";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import {Octokit} from "octokit";


export default function Layout() {
  const {connected} = useWallet();
  const connection = useConnection();
  const [program, setProgram] = useState<BountyProgram | null>(null);
  const ghApi = new Octokit();
  const wallet = useAnchorWallet();
  const [userAccount, setUserAccount] = useState<any>(null);

  useEffect(() => {

    async function getContract() {
      const bprogram = await Program.at(
        BountyProgram.programId,
        new AnchorProvider(
          connection.connection,
          wallet ?? new NodeWallet(Keypair.generate()),
          AnchorProvider.defaultOptions()
        )
      ) as Program<Bountyhunter>;
      setProgram(new BountyProgram(bprogram));
      setUserAccount(await program?.getUserAccount(wallet?.publicKey!))
    }
    getContract();
  }, [connected]);


  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "row"
      }}>
        <Column>
          <Link to={"/"}>
            <h1>DevMill</h1>
          </Link>
        </Column>
        <Column>
          <HeaderSection>
            <Link to={"/"}>
              <span>Bounties</span>
            </Link>
            <Link to={"/about"}>
              <span>About</span>
            </Link>
            <Link to={"/bounty"}>
              <span>Post Bounty</span>
            </Link>
          </HeaderSection>
        </Column>
        <Column>
          <IdSection>
            <WalletMultiButton/>
            {connected && program !== null ? <UserInfo program={program} userAccount={userAccount}/> : null}
          </IdSection>
        </Column>
      </div>
      <div style={{display: "flex", flexDirection: "row"}}>
        <MainBody>
          <Outlet context={{program: program, ghApi: ghApi, userAccount: userAccount}}/>
        </MainBody>
      </div>
    </>
  );
}


const MainBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5rem;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  font-size: xx-large;
  
  span:hover {
    color: var(--blue);
  }
  span {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

const IdSection = styled.div`
  display: flex;
  align-items: end;
  flex-direction: column;
`;

const Column = styled.div`
  flex: 33.33%;
  margin: 1rem;
  justify-content: center;
`;