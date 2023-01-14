import { Outlet, Link } from "react-router-dom";
import {WalletDisconnectButton, WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import React from "react";
import styled from "styled-components";

const IdSection = styled.div`
  display: flex;
  justify-content: right;
  margin: 2rem;
  flex-direction: row;
`;

export default function Layout() {
  return (
    <>
      <IdSection>
        <WalletMultiButton/>
      </IdSection>
      {/*<WalletDisconnectButton/>*/}
      <Outlet/>
    </>
  );
}