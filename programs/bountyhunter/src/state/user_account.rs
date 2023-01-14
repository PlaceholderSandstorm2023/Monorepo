use anchor_lang::prelude::*;
use crate::DISCRIM_SIZE;

#[account]
pub struct UserAccount {
    pub user_address: Pubkey,
    pub gh_user_id: u32,
    pub completed_tasks: u32,
    pub bounty_earned: u32
}

impl UserAccount {
    pub const SIZE: usize = 32 + 8 + 4 + 4 + DISCRIM_SIZE;
}