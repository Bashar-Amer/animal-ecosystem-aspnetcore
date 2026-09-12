using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Models;

namespace WebApp.Services
{
    public class AuctionStatusUpdaterService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<AuctionStatusUpdaterService> _logger;

        private static readonly TimeSpan PollInterval = TimeSpan.FromMinutes(1);
        private static readonly TimeSpan EndingSoonThreshold = TimeSpan.FromHours(1);

        public AuctionStatusUpdaterService(
            IServiceScopeFactory scopeFactory,
            ILogger<AuctionStatusUpdaterService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await UpdateAuctionStatusesAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error while updating auction statuses.");
                }

                await Task.Delay(PollInterval, stoppingToken);
            }
        }

        private async Task UpdateAuctionStatusesAsync(CancellationToken ct)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var now = DateTime.UtcNow;

            var activeAuctions = await dbContext.Auctions
                .Where(a => a.Status == AuctionStatus.StartingSoon
                         || a.Status == AuctionStatus.Upcoming
                         || a.Status == AuctionStatus.Live
                         || a.Status == AuctionStatus.EndingSoon)
                .Where(a => a.ModerationStatus == AuctionModerationStatus.Approved)
                .ToListAsync(ct);

            foreach (var auction in activeAuctions)
            {
                var newStatus = DetermineStatus(auction, now);
                if (newStatus == auction.Status) continue;

                auction.Status = newStatus;

                try
                {
                    // Saved individually so one conflicting auction (e.g. a bid just
                    // landed on it) doesn't block status updates for the rest of the batch.
                    await dbContext.SaveChangesAsync(ct);
                }
                catch (DbUpdateConcurrencyException)
                {
                    dbContext.Entry(auction).State = EntityState.Detached;
                    _logger.LogWarning(
                        "Skipped a concurrent status update for auction {AuctionId}; will retry next cycle.",
                        auction.Id);
                }
            }
        }

        private static AuctionStatus DetermineStatus(Auction auction, DateTime now)
        {
            if (now >= auction.EndTime)
            {
                return AuctionStatus.Ended;
            }

            if (now >= auction.StartTime)
            {
                var timeUntilEnd = auction.EndTime - now;
                return timeUntilEnd <= EndingSoonThreshold ? AuctionStatus.EndingSoon : AuctionStatus.Live;
            }

            return AuctionStatus.StartingSoon;
        }
    }
}
