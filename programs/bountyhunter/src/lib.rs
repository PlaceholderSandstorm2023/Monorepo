use anchor_lang::prelude::*;
use instructions::*;

pub mod instructions;
pub mod state;
pub mod error;

declare_id!("FAuRwCnsvpMHVBDcL47SGM5XSC7oY5u5u9VU3GDqWaZm");

const DISCRIM_SIZE: usize = 8;

#[program]
pub mod bountyhunter {
    use super::*;

    pub fn create_user_account(
        ctx: Context<Signup>,
        gh_user_id: u32
    ) -> Result<()> {
        return instructions::create_user_account(ctx, gh_user_id);
    }

    pub fn edit_gh_id(ctx: Context<EditGhId>, new_gh_id: u32) -> Result<()> {
        return instructions::edit_gh_id(ctx, new_gh_id);
    }

    pub fn create_bounty(
        ctx: Context<CreateBounty>,
        issue_id: u32,
        bounty_amount: u32,
        timestamp: i32,
        repo_id: u32
    ) -> Result<()> {
        return instructions::create_bounty(
            ctx,
            issue_id,
            bounty_amount,
            timestamp,
            repo_id
        );
    }

    pub fn release_bounty(ctx: Context<ReleaseBounty>) -> Result<()> {
        return instructions::release_bounty(ctx);
    }
}