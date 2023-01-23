# DevMill
Instructions are contained in the About page in the 
web app

# Why?
Financial incentives to contribute to open source are
essentially non-existent, and in the current economic conditions,
contributing time for free isn't a viable option for many people.

Many bounty boards already exist, but they are mostly off-chain,
and the burden on core maintainers to create/payout these bounties
means most teams tend to only bother for large, big ticket items.

Introducing a largely automated solution empowers project teams
to add small incentives on most of their core feature requests
and bugs, while having low impact on their typical workflow.
It also allows open source contributors to be properly
rewarded for their contributions.

Given that crypto has a growing culture of large, well funded
teams open sourcing their code, offering financial incentive
to outside contributors might very boost their number of outside
contributions. Allowing them to keep their core team count low,
and productive as they scale up.

# Reflections
This project was built for the 2023 Solana Sandstorm
hackathon, and therefore,
in its current state this project serves mostly as a 
proof of concept. The contract is deployed to devnet,
but the frontend is not currently hosted anywhere.
Further features, and quality improvements are required
before this project might be productions ready.
This is my first crack at writing a complete Solana
based application, and I had a lot of fun :).

## What's good
A completely automated bounty management solution, only requiring
a handful of additions to issue, and pull request descriptions,
as well as an entry in contributors profile repo README

## Future improvements
- Storing private keys in the github secret store is a naive solution.
Poses a security threat to project owners funds.
- Using magic strings to handle automation is a brittle solution.
Growing my knowledge of Github Apps to offer a more robust UX in
the future is desirable
- I am very bad at CSS