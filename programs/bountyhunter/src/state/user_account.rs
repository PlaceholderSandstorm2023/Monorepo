use anchor_lang::prelude::*;
use crate::DISCRIM_SIZE;

#[account]
pub struct UserAccount {
    pub user_address: Pubkey,
    pub gh_username: String,
    pub completed_tasks: u32,
    pub bounty_earned: u64
}

impl UserAccount {
    pub const SIZE: usize = 32 + (39 + 4) + 4 + 8 + DISCRIM_SIZE;
}