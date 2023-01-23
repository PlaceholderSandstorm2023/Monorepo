import React, {useEffect, useState} from 'react';
import {useOutletContext} from "react-router-dom";
import {BodyContext} from "../types";
import BountyListing from "../components/BountyListing";
import {useWallet} from "@solana/wallet-adapter-react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const {program, ghApi} = useOutletContext<BodyContext>();
  const [bounties, setBounties] = useState<any>([]);
  const {publicKey} = useWallet();

  useEffect(() => {
    async function getBounties() {
      setBounties(await program.getAllBounties());
    }
    if (program !== null)
      getBounties().then();
  }, [program])

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"/>
    {bounties.map((bounty: any) => <BountyListing bounty={bounty} octokit={ghApi} connectedKey={publicKey} program={program}/>)}
    </>
  );
}