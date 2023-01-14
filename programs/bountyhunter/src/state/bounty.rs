use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use crate::DISCRIM_SIZE;


#[account]
pub struct Bounty {
    pub poster: Pubkey,
    pub issue_id: u32,
    pub bounty_amount: u32,
    pub timestamp: i32,
    pub repo_id: u32
}

impl Bounty {
    pub const SIZE: usize = 32 + 8 + 4 + 4 + 8 + DISCRIM_SIZE;

    pub fn get_bounty_lamports(&self) -> u64 {
        return self.bounty_amount as u64 * LAMPORTS_PER_SOL;
    }
}