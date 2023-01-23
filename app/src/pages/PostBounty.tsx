import styled from "styled-components";
import React, {useState} from "react";
import {Octokit} from "octokit";
import {useOutletContext} from "react-router-dom";
import {BodyContext} from "../types";
import {toast, ToastContainer} from "react-toastify";
import {useWallet} from "@solana/wallet-adapter-react";

interface FormState {
  repoOwner: string,
  repoName: string,
  issueNumber: number,
  amount: number
}

export default function PostBounty() {
  const {ghApi, program} = useOutletContext<BodyContext>();
  const [state, setState] = useState<FormState>({
    repoOwner: "",
    repoName: "",
    issueNumber: 0,
    amount: 0
  });
  const {publicKey, connected} = useWallet()

  function handleSubmit(e: any) {
    e.preventDefault();

    if (!connected) {
      toast('Please connect wallet!');
      return;
    }

    ghApi.rest.issues.get({
      owner: state.repoOwner,
      repo: state.repoName,
      issue_number: state.issueNumber
    }).then(_ => {
      program
        ? program.createBounty(
          state.issueNumber,
          state.repoName,
          state.repoOwner,
          state.amount,
          publicKey!
        ).then(_ => toast('Bounty created!'))
          .catch(err => {
            console.log(err);
            toast('Bounty creation failed');
          })
        : toast("can't connect to contract");
    }).catch(err => {
      console.log(err);
      toast('Issue not found');
    });
  }

  return (
    <Container>
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
      <h1>Create a Bounty</h1>
      <div style={{marginTop: "3rem"}}>
        <form onSubmit={handleSubmit}>
          <label>
            Repo Owner:
            <input
              type={'text'}
              value={state.repoOwner}
              onChange={e => setState({...state, repoOwner: e.target.value.trim()})}
            />
          </label>
          <br/>
          <label>
            Repo Name:
            <input
              type={'text'}
              value={state.repoName}
              onChange={e => setState({...state, repoName: e.target.value.trim()})}
            />
          </label>
          <br/>
          <label>
            Issue Number:
            <input
              type={"number"}
              value={state.issueNumber}
              onChange={e => setState({...state, issueNumber: e.target.valueAsNumber})}
            />
          </label>
          <br/>
          <label>
            Amount (in SOL):
            <input
              type={"number"}
              value={state.amount}
              onChange={e => setState({...state, amount: e.target.valueAsNumber})}
            />
          </label>
          <br/>
          <br/>
          <input
            type={'submit'}
            value={'Post'}
            style={{
              backgroundColor: "var(--blue)",
              width: "5rem",
            }}
          />
        </form>
      </div>
    </Container>
  );
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--background-secondary);
  height: 30vh;
  width: 50vw;
  align-items: center;
`;

