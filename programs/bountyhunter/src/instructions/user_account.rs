use anchor_lang::prelude::*;
use crate::state::user_account::*;
use crate::error::AccountErrors;

pub fn create_user_account(ctx: Context<Signup>, gh_username: String) -> Result<()> {
    let account = &mut ctx.accounts.user_account;
    account.user_address = ctx.accounts.user.key();
    account.gh_username = gh_username;
    account.completed_tasks = 0;
    account.bounty_earned = 0;

    return Ok(());
}

#[derive(Accounts)]
pub struct Signup<'info> {
    #[account(
        init,
        payer = user,
        space = UserAccount::SIZE,
        seeds = [b"user-account", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

pub fn edit_gh_username(ctx: Context<EditGhUsername>, new_gh_username: String) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;
    user_account.gh_username = new_gh_username;

    return Ok(());
}

#[derive(Accounts)]
pub struct EditGhUsername<'info> {
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    pub user: Signer<'info>
}

pub fn close_account(_ctx: Context<CloseAccount>) -> Result<()> { Ok(())}

#[derive(Accounts)]
pub struct CloseAccount<'info> {
    #[account(
        mut,
        has_one = user_address @ AccountErrors::SignerNotAccountOwner,
        close = user_address
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user_address: Signer<'info>
}