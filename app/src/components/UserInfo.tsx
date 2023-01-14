import styled from "styled-components";
import {useWallet} from "@solana/wallet-adapter-react";
import {useContract} from '../hooks';

const Container = styled.div`
  background-color: black;
`;

export default function UserInfo() {
  const {connected} = useWallet();
  const contract = useContract();
  return (
    <Container>

    </Container>
  );
}