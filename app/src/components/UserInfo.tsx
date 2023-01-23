import styled from "styled-components";
import {useWallet} from "@solana/wallet-adapter-react";
import {useState} from "react";
import BountyProgram from "../utils/bounty-program";
import Popup from 'reactjs-popup';
import {DarkOverlay} from "./Styled";


interface Props {
  program: BountyProgram,
  userAccount: any
}

export default function UserInfo(props: Props) {
  const program = props.program;
  const {connected, publicKey} = useWallet();
  const [userAccount, setUserAccount] = useState<any>(props.userAccount);
  const [openPop, setOpenPop] = useState(false);
  const closeModal = () => setOpenPop(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("dick");

  const fetchData = async () => {
    if (!connected || program === null) {
      setUserAccount(null);
      return;
    }
    const account = await program.getUserAccount(publicKey!);

    setUserAccount(account);

  }

  function registerUser() {
    fetch(`https://raw.githubusercontent.com/${username}/${username}/main/README.md`)
      .then(resp => resp.text())
      .then(async(text ) => {
        const reg = new RegExp("DevMill: ([1-9A-HJ-NP-Za-km-z]{32,44})")
        const match = text.match(reg);
        if (match !== null) {
          const address = match[1];
          // @ts-ignore
          if (address !== publicKey.toString()) {
            setError("Linked address is not connected address");
          }
          program.createUserAccount(publicKey!, username).then(_ => fetchData().then());
          setError("");
        } else {
          setError("no address in github user readme");
        }

        closeModal();
      });
  }

  return (
    <>
      {!userAccount
        ?
        <>
          <a onClick={() => setOpenPop(true)}>
          <Container>
            <span>Register with Github</span>
          </Container>
        </a>
          <DarkOverlay style={{visibility: openPop ? "visible" : "hidden"}}>
          <Popup open={openPop} modal closeOnDocumentClick closeOnEscape onClose={closeModal}>
            <PopupContainer>
              <label>
                Github username:
                <input
                  style={{marginLeft: "0.3rem"}}
                  type={"text"}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}/>
              </label>
              <div className={"button-row"}>
                <button onClick={registerUser}>Register</button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            </PopupContainer>
          </Popup>
          </DarkOverlay>
        </>
        :
        <a onClick={async () => await program.closeUserAccount(publicKey!)}>
          <Container>
            <span>connected as: {userAccount.ghUsername}</span>
          </Container>
        </a>
      }
  </>

  );
}

const Container = styled.div`
  background-color: var(--background-secondary);
  color: white;
  display: flex;
  flex-direction: column;
  min-width: 11rem;
  min-height: 2rem;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
`;

const PopupContainer = styled.div`
  min-width: 35vw;
  min-height: 25vh;
  background-color: var(--background-secondary);
  border-color: white;
  border-width: thick;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  
  button {
    width: 8rem;
    margin: 0.5rem;
  }
  
  & .button-row {
    display: flex;
  }
`;