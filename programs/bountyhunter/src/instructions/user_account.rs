use anchor_lang::prelude::*;
use crate::state::user_account::*;

pub fn create_user_account(ctx: Context<Signup>, gh_user_id: u32) -> Result<()> {
    let account = &mut ctx.accounts.user_account;
    account.user_address = ctx.accounts.user.key();
    account.gh_user_id = gh_user_id;
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

pub fn edit_gh_id(ctx: Context<EditGhId>, new_gh_id: u32) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;
    user_account.gh_user_id = new_gh_id;

    return Ok(());
}

#[derive(Accounts)]
pub struct EditGhId<'info> {
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    pub user: Signer<'info>
}