use anchor_lang::prelude::*;
use crate::state::bounty::*;
use anchor_lang::system_program;
use crate::error::BountyErrors;
use crate::state::UserAccount;
use anchor_lang::solana_program::hash::hash;


/**
Proof of concept is going to facilitate payments by storing sol in the bounty
account, in the future use a USDC token account owned by the bounty account
 */

pub fn create_bounty(
    ctx: Context<CreateBounty>,
    issue_number: u32,
    repo_name: String,
    repo_owner: String,
    bounty_amount: u64,
    timestamp: i32
) -> Result<()> {
    let poster = ctx.accounts.poster.key();
    let bounty = &mut ctx.accounts.bounty;

    bounty.poster = poster;
    bounty.issue_number = issue_number;
    bounty.bounty_amount = bounty_amount;
    bounty.timestamp = timestamp;
    bounty.repo_name = repo_name;
    bounty.repo_owner = repo_owner;

    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.poster.to_account_info(),
            to: bounty.to_account_info(),
        }
    );

    return system_program::transfer(
        cpi_context,
        bounty.bounty_amount
    );
}

#[derive(Accounts)]
#[instruction(issue_number: u32, repo_name: String)]
pub struct CreateBounty<'info> {
    #[account(
        init,
        payer = poster,
        space = Bounty::SIZE,
        seeds = [
            hash(format!("bounty{}{}", issue_number, repo_name).as_bytes()).as_ref(),
        ],
        bump
    )]
    pub bounty: Account<'info, Bounty>,
    #[account(mut)]
    pub poster: Signer<'info>,
    pub system_program: Program<'info, System>
}

pub fn release_bounty(ctx: Context<ReleaseBounty>) -> Result<()> {
    let bounty = &mut ctx.accounts.bounty;
    let bounty_amount = bounty.bounty_amount;

    **bounty.to_account_info().try_borrow_mut_lamports()? -= bounty_amount;
    **ctx.accounts.recipient.try_borrow_mut_lamports()? += bounty_amount;

    if let Some(ra) = &mut ctx.accounts.recipient_account {
        ra.bounty_earned += bounty_amount;
    }

    return Ok(());
}

#[derive(Accounts)]
pub struct ReleaseBounty<'info> {
    #[account(
        mut,
        close = poster,
        has_one = poster @ BountyErrors::CreatorNotSigner
    )]
    pub bounty: Account<'info, Bounty>,
    #[account(mut)]
    pub poster: Signer<'info>,
    /// CHECK: All we're doing is paying out to this address
    #[account(mut)]
    pub recipient: AccountInfo<'info>,
    #[account(mut)]
    pub recipient_account: Option<Account<'info, UserAccount>>,
    pub system_program: Program<'info, System>
}