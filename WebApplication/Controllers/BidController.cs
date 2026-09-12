using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.DTOs;
using WebApp.Models;

namespace WebApp.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class BidController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public BidController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [HttpPost("place/{auctionId}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> PlaceBid(string auctionId, [FromBody] PlaceBidRequest request)
        {
            if (!(User.Identity?.IsAuthenticated ?? false))
            {
                return Unauthorized(new { message = "You must be logged in to place a bid." });
            }

            var userId = _userManager.GetUserId(User)!;
            const int maxRetries = 3;

            for (var attempt = 0; attempt < maxRetries; attempt++)
            {
                var auction = await _dbContext.Auctions
                    .Include(a => a.Animal)
                    .FirstOrDefaultAsync(a => a.Id == auctionId);

                if (auction == null)
                {
                    return NotFound(new { message = "Auction not found." });
                }

                if (auction.ModerationStatus != AuctionModerationStatus.Approved)
                {
                    return BadRequest(new { message = "This auction is not available for bidding." });
                }

                if (auction.Animal.OwnerId == userId)
                {
                    return BadRequest(new { message = "You can't bid on your own listing." });
                }

                if (auction.EndTime <= DateTime.UtcNow)
                {
                    if (auction.Status != AuctionStatus.Ended)
                    {
                        auction.Status = AuctionStatus.Ended;
                        await _dbContext.SaveChangesAsync();
                    }
                    return BadRequest(new { message = "This auction has ended." });
                }

                if (auction.Status != AuctionStatus.Live && auction.Status != AuctionStatus.EndingSoon)
                {
                    return BadRequest(new { message = "This auction isn't open for bidding yet." });
                }

                var minNextBid = auction.CurrentPrice + auction.MinIncrement;
                if (request.Amount < minNextBid)
                {
                    return BadRequest(new
                    {
                        message = $"Your bid must be at least {minNextBid:0.##}.",
                        minNextBid
                    });
                }

                var bid = new Bid
                {
                    AuctionId = auction.Id,
                    UserId = userId,
                    Amount = request.Amount,
                    PlacedAt = DateTime.UtcNow
                };
                _dbContext.Bids.Add(bid);

                auction.CurrentPrice = request.Amount;
                auction.HighestBidderId = userId;

                try
                {
                    await _dbContext.SaveChangesAsync();

                    var bidCount = await _dbContext.Bids.CountAsync(b => b.AuctionId == auction.Id);

                    return Ok(new
                    {
                        currentPrice = auction.CurrentPrice,
                        minNextBid = auction.CurrentPrice + auction.MinIncrement,
                        bidCount,
                        isHighestBidder = true
                    });
                }
                catch (DbUpdateConcurrencyException)
                {
                    // Someone else's bid landed first — detach and retry with fresh data
                    _dbContext.Entry(auction).State = EntityState.Detached;
                    _dbContext.Entry(bid).State = EntityState.Detached;
                }
            }

            return Conflict(new { message = "Someone just outbid you. Please refresh and try again." });
        }

        [HttpGet("status/{auctionId}")]
        public async Task<IActionResult> Status(string auctionId)
        {
            var auction = await _dbContext.Auctions
                .Include(a => a.Bids)
                .FirstOrDefaultAsync(a => a.Id == auctionId);

            if (auction == null)
            {
                return NotFound();
            }

            if (auction.ModerationStatus != AuctionModerationStatus.Approved)
            {
                return NotFound();
            }

            var userId = _userManager.GetUserId(User);

            return Ok(new
            {
                currentPrice = auction.CurrentPrice,
                minNextBid = auction.CurrentPrice + auction.MinIncrement,
                bidCount = auction.Bids.Count,
                status = auction.Status.ToString(),
                endTime = auction.EndTime,
                isHighestBidder = userId != null && auction.HighestBidderId == userId
            });
        }
    }
}
