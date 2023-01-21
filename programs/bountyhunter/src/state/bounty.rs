use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use crate::DISCRIM_SIZE;


#[account]
pub struct Bounty {
    pub poster: Pubkey,
    pub issue_number: u32,
    pub repo_name: String,
    pub repo_owner: String,
    pub bounty_amount: u64,
    pub timestamp: i32,
}

impl Bounty {
    pub const SIZE: usize = 32 + 4 + (39 + 4) + (100 + 4) + 8 + 4 + DISCRIM_SIZE;
}