import { Outlet, Link } from "react-router-dom";
import {WalletDisconnectButton, WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import UserInfo from './components/UserInfo';
import {useAnchorWallet, useConnection, useWallet} from "@solana/wallet-adapter-react";
import BountyProgram from "./utils/bounty-program";
import {Program} from "@project-serum/anchor";
import {AnchorProvider, Wallet} from "@project-serum/anchor";
import { Bountyhunter } from "../../target/types/bountyhunter";
import OctokitWrapper from "./octokit-wrapper";

export default function Layout() {
  const {connected} = useWallet();
  const connection = useConnection();
  const [program, setProgram] = useState<BountyProgram | null>(null);
  const ghApi = new OctokitWrapper();
  const wallet = useAnchorWallet();
  useEffect(() => {
    async function getContract() {
      const bprogram = await Program.at(
        BountyProgram.programId,
        new AnchorProvider(
          connection.connection,
          wallet!,
          AnchorProvider.defaultOptions()
        )
      ) as Program<Bountyhunter>;
      setProgram(new BountyProgram(bprogram));
    }

    if (connected) {
      getContract();
    }
  }, [connected]);


  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "row"
      }}>
        <Column>
          <Link to={"/"}>
            <span>LOGO</span>
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
            <Link to={"/"}>
              <span>FAQ</span>
            </Link>
          </HeaderSection>
        </Column>
        <Column>
          <IdSection>
            <WalletMultiButton/>
            {connected && program !== null ? <UserInfo program={program}/> : null}
          </IdSection>
        </Column>
      </div>
      {/*<WalletDisconnectButton/>*/}
      <div style={{display: "flex", flexDirection: "row"}}>
        <SideColumn>
          <span style={{fontSize: "xx-large"}}>Outsource <br/> Your Open Source</span>
          <PostBounty>POST BOUNTY</PostBounty>
          <hr style={{width: "89%"}}/>
        </SideColumn>
        <MainBody>
          <Outlet context={{program: program}}/>
        </MainBody>
      </div>
    </>
  );
}

const PostBounty = styled.button`
  background-color: var(--blue);
  font-size: x-large;
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 80%;
`;

const SideColumn = styled.div`
  flex: 33.33%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--background-secondary);
  margin: 2rem;
  padding: 1rem;
  align-items: center;
  //flex-wrap: wrap;
`;

const MainBody = styled.div`
  flex: 66.66%;
  display: flex;
  flex-direction: column;
  justify-content: center;
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