import {Octokit} from "octokit";
import {useEffect, useState} from "react";
import styled from "styled-components";
import Popup from 'reactjs-popup';
import {DarkOverlay} from "./Styled";
import {LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import BountyProgram from "../utils/bounty-program";
import {toast} from "react-toastify";
import {WalletSignTransactionError} from "@solana/wallet-adapter-base";

interface Props {
  bounty: any,
  octokit: Octokit,
  connectedKey: PublicKey | null,
  program: BountyProgram | null
}

export default function BountyListing(props: Props) {
  const {bounty, octokit, connectedKey, program} = props;
  const b = bounty.account;
  const [issueInfo, setIsseInfo] = useState<any>(null)
  const [openPop, setOpenPop] = useState(false);
  const closeModal = () => setOpenPop(false);
  const [payee, setPayee] = useState("");

  useEffect(() => {
    (async () => {
      if (bounty) {
        const issue = await octokit.rest.issues.get({
          owner: b.repoOwner,
          repo: b.repoName,
          issue_number: b.issueNumber});
        const avatar = await octokit.request('GET /users/{username}', {
          username: b.repoOwner
        });
        setIsseInfo({...issue.data, avatar: avatar.data.avatar_url});
      }
    })();
  }, [bounty]);

  return (
    <>
      {issueInfo ?
        <>
          <DarkOverlay style={{visibility: openPop ? "visible" : "hidden"}}>
          <Popup open={openPop} modal closeOnDocumentClick closeOnEscape onClose={closeModal}>
            <PopupContainer>
              <p>Enter the address of the payee to manually release this bounty</p>
                <input
                  type={'text'}
                  value={payee}
                  onChange={e => setPayee(e.target.value)}
                />
              <ReleaseDiv>
                <button onClick={async _ => {
                  program?.releaseBounty(
                    new PublicKey(payee),
                    bounty.publicKey,
                    connectedKey!,
                  ).then(_ => {
                    closeModal();
                    toast("Success!");
                  }).catch(err => {
                    console.log(err);
                    closeModal();
                    if (!(err instanceof WalletSignTransactionError))
                      toast("Transaction failed");
                  });
                }}>
                  Release
                </button>
                <button onClick={closeModal}>Cancel</button>
              </ReleaseDiv>
            </PopupContainer>
          </Popup>
        </DarkOverlay>
        <Wrapper>
          <a href={issueInfo.html_url} target={"_blank"}>
        <Row>
          <OwnerImage src={issueInfo.avatar}/>
          <Content>
            <h1>{issueInfo.title}</h1>
            <span>{`Reward: ${b.bountyAmount / LAMPORTS_PER_SOL} SOL`}</span>
          </Content>

        </Row>
        </a>
          {b !== null && connectedKey?.toString() === b.poster.toString()
          ?<ManageButton onClick={_ => setOpenPop(true)}>
              Manage
            </ManageButton>
          : null}
        </Wrapper>
        </>
        : null}
    </>
  );
}

const ReleaseDiv = styled.div`
  display: flex;
  //margin: 2rem;
  //align-items: ;
  margin-bottom: 2rem;
  
  button {
    background-color: var(--blue);
    //margin-left: 1rem;
    margin-top: 1rem;
  }
`;

const PopupContainer = styled.div`
  span {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  width: 50vw;
  //height: 50vh;
  background-color: var(--background-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ManageButton = styled.button`
  margin-left: auto;
  margin-right: 3rem;
  background-color: var(--blue);
  width: 8rem;
  height: 2.5rem;
  font-size: large;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const OwnerImage = styled.img`
  width: 8rem;
  height: 8rem;
  margin: 2rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: var(--background-secondary);
  margin-right: 2rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  //background-color: var(--background-secondary);
  width: 80vw;
`;