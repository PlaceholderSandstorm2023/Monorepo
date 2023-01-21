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
        gh_username: String
    ) -> Result<()> {
        return instructions::create_user_account(ctx, gh_username);
    }

    pub fn edit_gh_username(ctx: Context<EditGhUsername>, new_gh_username: String) -> Result<()> {
        return instructions::edit_gh_username(ctx, new_gh_username);
    }

    pub fn close_user_account(ctx: Context<CloseAccount>) -> Result<()> {
        return instructions::close_account(ctx);
    }

    pub fn create_bounty(
        ctx: Context<CreateBounty>,
        issue_number: u32,
        repo_name: String,
        repo_owner: String,
        bounty_amount: u64,
        timestamp: i32
    ) -> Result<()> {
        return instructions::create_bounty(
            ctx,
            issue_number,
            repo_name,
            repo_owner,
            bounty_amount,
            timestamp
        );
    }

    pub fn release_bounty(ctx: Context<ReleaseBounty>) -> Result<()> {
        return instructions::release_bounty(ctx);
    }
}