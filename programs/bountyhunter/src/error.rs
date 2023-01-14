use anchor_lang::prelude::*;

#[error_code]
pub enum BountyErrors {
    #[msg("Signer must be the creator of the bounty")]
    CreatorNotSigner,
}