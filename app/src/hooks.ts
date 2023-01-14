import {AnchorError, AnchorProvider, Program} from "@project-serum/anchor";
import { Bountyhunter } from "../../target/types/bountyhunter";
import * as anchor from "@project-serum/anchor";
import {useMemo} from "react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";


function useContract() {

  return useMemo(() => {
    const {wallet} = useWallet();
    const connection = useConnection();
    anchor.setProvider(new anchor.AnchorProvider(
      connection.connection,
      wallet,
      AnchorProvider.defaultOptions()
    ));
    return anchor.workspace.Bountyhunter as Program<Bountyhunter>;
  }[]);
}


export  {
  useContract
};

