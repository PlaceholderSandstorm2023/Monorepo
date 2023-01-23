import React, {useMemo} from 'react';
import './App.css';
import Home from './pages/Home';
import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {clusterApiUrl} from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  BackpackWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout';
import { createGlobalStyle } from 'styled-components';
import About from './pages/About';
import PostBounty from "./pages/PostBounty";

import * as buffer from "buffer";
window.Buffer = buffer.Buffer;
require('@solana/wallet-adapter-react-ui/styles.css');

const GlobalStyles = createGlobalStyle`
  :root {
    background-color: #121212;
    color: white;
    --background-secondary: #2f2f2f;
    --blue: #0088AA;
    a, a:hover, a:visited, a:active {
      color: inherit;
      text-decoration: none;
    }
  }

`;


function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = [
      new PhantomWalletAdapter(),
      new BackpackWalletAdapter()
    ];

  return (
    <>
      <GlobalStyles/>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout/>}>
                  <Route index element={<Home/>}/>
                  <Route path="/about" element={<About/>} />
                  <Route path={"/bounty"} element={<PostBounty/>}/>
                </Route>
              </Routes>
            </BrowserRouter>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
