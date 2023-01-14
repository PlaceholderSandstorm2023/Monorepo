use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use crate::state::bounty::*;
use anchor_lang::system_program;
use crate::error::BountyErrors;


/**
Proof of concept is going to facilitate payments by storing sol in the bounty
account, in the future use a USDC token account owned by the bounty account
 */

pub fn create_bounty(
    ctx: Context<CreateBounty>,
    issue_id: u32,
    bounty_amount: u32,
    timestamp: i32,
    repo_id: u32
) -> Result<()> {
    let user = ctx.accounts.user.key();
    let bounty = &mut ctx.accounts.bounty;

    bounty.poster = user;
    bounty.issue_id = issue_id;
    bounty.bounty_amount = bounty_amount;
    bounty.timestamp = timestamp;
    bounty.repo_id = repo_id;
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: bounty.to_account_info(),
        }
    );

    return system_program::transfer(
        cpi_context,
        bounty.get_bounty_lamports()
    );
}

#[derive(Accounts)]
#[instruction(issue_id: u32)]
pub struct CreateBounty<'info> {
    #[account(
        init,
        payer = user,
        space = Bounty::SIZE,
        seeds = [format!("bounty-{}", issue_id).as_ref(), user.key().as_ref()],
        bump
    )]
    pub bounty: Account<'info, Bounty>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

pub fn release_bounty(ctx: Context<ReleaseBounty>) -> Result<()> {
    let bounty = &mut ctx.accounts.bounty;
    let signer = ctx.accounts.signer.to_account_info();
    require_keys_eq!(bounty.poster, signer.key(), BountyErrors::CreatorNotSigner);

    let bounty_amount = bounty.get_bounty_lamports();

    **bounty.to_account_info().try_borrow_mut_lamports()? -= bounty_amount;
    **ctx.accounts.recipient.try_borrow_mut_lamports()? += bounty_amount;

    // return rent to bounty creator
    bounty.close(signer)?;

    return Ok(());
}

#[derive(Accounts)]
pub struct ReleaseBounty<'info> {
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
    pub signer: Signer<'info>,
    /// CHECK: All we're doing is paying out to this address
    #[account(mut)]
    pub recipient: AccountInfo<'info>,
    pub system_program: Program<'info, System>
}