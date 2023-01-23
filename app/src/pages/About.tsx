import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism'

// I can't believe they let me do this lol

const content = `
# DevMill Bounties

DevMill is a proof of concept of an automated bounty system for open source
Github projects.

DevMill enables project owners to integrate bounty rewards into their typical issue
management workflow via the Solana blockchain and Github Actions

# Using DevMill
## Creating a Bounty
Create an action in you repo hooking into the create bounty action like so.
DEVMILLKEY should be the secret key to the wallet responsible for distributing.
bounties.

~~~yaml
on:
  issues:
    types: [opened]
    
jobs:
  create_issue:
    runs-on: ubuntu-latest
    name: Create bounty
    steps:
      - name: create bounty step
        id: bounty
        uses: SolanaDevMill/CreateBountyAction@main
        with:
          wallet-key: \${{ secrets.DEVMILLKEY }}
~~~

To use the action, when creating a new ticket, include a line in the form of
"DevMill Bounty: {amount} SOL". The action will automatically create a new on-chain bounty
for it and transfer the chosen bounty amount from the project wallet to the bounty account.

![](/create_issue.png)

## Paying Contributors
In order to enable contributors to receive payments, they must add the target wallet
address to their profile repo README like so
![](/profile.png)

The release bounty action will look for this address when a pull request containing
a bounty is merged in, and will release the funds in the contract to the contributor.

The release bounty action can be enabled in you repo using an action like this
~~~yaml
on:
  pull_request:
    types: [closed]

jobs:
  release_bounty_job:
    runs-on: ubuntu-latest
    name: release bounty
    steps:
      - name: release bounty
        uses: SolanaDevMill/ReleaseBountyAction@main
        with:
          wallet-key: \${{ secrets.DEVMILLKEY }}
~~~

Then when opening a pull request, put a line referencing the issue attached to the target bounty like so
![](/pr.png)
`

export default function About() {
  return (
    <>
      <Container>
      <ReactMarkdown
        children={content}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                // @ts-ignore
                style={atomDark}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      />
      </Container></>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 4rem;
  margin-right: 4rem;
  margin-bottom: 5rem;
  

  img {
    width: 60vw;
  }
`;