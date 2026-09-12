using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Enums;
using WebApp.Helpers;
using WebApp.Models;
using WebApp.ViewModels.Admin;

namespace WebApp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task<IActionResult> Index()
        {
            var now = JordanTime.Now;
            var weekAgo = now.AddDays(-7);

            var totalActiveListings = await _dbContext.Animals
                .CountAsync(a => a.ModerationStatus == ModerationStatus.Approved && a.Status != AnimalStatus.Sold);
            var newListingsThisWeek = await _dbContext.Animals.CountAsync(a => a.CreatedAt >= weekAgo);
            var pendingListingsCount = await _dbContext.Animals.CountAsync(a => a.ModerationStatus == ModerationStatus.Pending);
            var pendingAuctionsCount = await _dbContext.Auctions.CountAsync(a => a.ModerationStatus == AuctionModerationStatus.Pending);

            var activeAuctionStatuses = new[] { AuctionStatus.StartingSoon, AuctionStatus.Upcoming, AuctionStatus.Live, AuctionStatus.EndingSoon };
            var liveAuctionsCount = await _dbContext.Auctions.CountAsync(a => a.ModerationStatus == AuctionModerationStatus.Approved && activeAuctionStatuses.Contains(a.Status));
            var liveNowCount = await _dbContext.Auctions.CountAsync(a => a.ModerationStatus == AuctionModerationStatus.Approved && a.Status == AuctionStatus.Live);
            var endingSoonCount = await _dbContext.Auctions.CountAsync(a => a.ModerationStatus == AuctionModerationStatus.Approved && a.Status == AuctionStatus.EndingSoon);
            var totalActiveBids = await _dbContext.Bids.CountAsync(b => b.Auction.ModerationStatus == AuctionModerationStatus.Approved && activeAuctionStatuses.Contains(b.Auction.Status));

            var verifiedVetsCount = await _dbContext.VetProfiles.CountAsync(v => v.IsVerified);
            var pendingVetsCount = await _dbContext.VetProfiles.CountAsync(v => !v.IsVerified);

            var pendingListings = await _dbContext.Animals
                .Where(a => a.ModerationStatus == ModerationStatus.Pending)
                .Include(a => a.Species)
                .Include(a => a.Images)
                .Include(a => a.Owner)
                .OrderBy(a => a.CreatedAt)
                .Take(10)
                .Select(a => new PendingListingViewModel
                {
                    Id = a.Id,
                    Name = a.Name,
                    ImageUrl = a.Images.Where(i => i.IsMain).Select(i => i.ImageUrl).FirstOrDefault()
                               ?? a.Images.Select(i => i.ImageUrl).FirstOrDefault()
                               ?? "/images/placeholder-animal.jpg",
                    SpeciesName = a.Species.Name,
                    Breed = a.Breed,
                    AgeInMonths = a.AgeInMonths,
                    Price = a.Price,
                    SellerName = a.Owner.FullName,
                    Location = a.Location,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();

            var liveAuctions = await _dbContext.Auctions
                .Where(a => a.ModerationStatus == AuctionModerationStatus.Approved && activeAuctionStatuses.Contains(a.Status))
                .Include(a => a.Animal).ThenInclude(an => an.Images)
                .Include(a => a.Bids)
                .OrderBy(a => a.EndTime)
                .Take(10)
                .Select(a => new LiveAuctionMonitorViewModel
                {
                    Id = a.Id,
                    LotNumber = $"Lot #{a.LotNumber}",
                    Title = a.Title,
                    ImageUrl = a.Animal.Images.Where(i => i.IsMain).Select(i => i.ImageUrl).FirstOrDefault()
                               ?? "/images/placeholder-animal.jpg",
                    Location = a.Animal.Location,
                    CurrentPrice = a.CurrentPrice,
                    BidCount = a.Bids.Count,
                    EndTime = a.EndTime,
                    Status = a.Status == AuctionStatus.EndingSoon ? "ending-soon"
                           : a.Status == AuctionStatus.Live ? "live"
                           : "upcoming"
                })
                .ToListAsync();

            var pendingAuctions = await _dbContext.Auctions
                .Where(a => a.ModerationStatus == AuctionModerationStatus.Pending)
                .OrderBy(a => a.StartTime)
                .Take(10)
                .Select(a => new PendingAuctionViewModel
                {
                    Id = a.Id,
                    LotNumber = $"Lot #{a.LotNumber}",
                    Title = a.Title,
                    AnimalName = a.Animal.Name,
                    ImageUrl = a.Animal.Images.Where(i => i.IsMain).Select(i => i.ImageUrl).FirstOrDefault()
                               ?? a.Animal.Images.Select(i => i.ImageUrl).FirstOrDefault()
                               ?? "/images/placeholder-animal.jpg",
                    SellerName = a.Animal.Owner.FullName,
                    StartingPrice = a.StartingPrice,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime,
                    SubmittedAt = a.Animal.CreatedAt
                })
                .ToListAsync();

            var vetQueue = await _dbContext.VetProfiles
                .Include(v => v.User)
                .OrderBy(v => v.IsVerified)   // unverified first
                .ThenBy(v => v.CreatedAt)
                .Take(10)
                .Select(v => new VetQueueItemViewModel
                {
                    VetProfileId = v.Id,
                    Name = v.User.FullName,
                    Initials = "", // filled below, not translatable via EF
                    Specialty = v.Specialty,
                    Location = v.ClinicLocation,
                    IsVerified = v.IsVerified,
                    SubmittedAt = v.CreatedAt
                })
                .ToListAsync();

            // Initials need to be computed in memory (DisplayHelpers isn't EF-translatable)
            foreach (var vq in vetQueue)
            {
                vq.Initials = DisplayHelpers.GetInitials(vq.Name);
            }

            var viewModel = new AdminDashboardViewModel
            {
                TotalActiveListings = totalActiveListings,
                NewListingsThisWeek = newListingsThisWeek,
                PendingListingsCount = pendingListingsCount,
                PendingAuctionsCount = pendingAuctionsCount,
                LiveAuctionsCount = liveAuctionsCount,
                LiveNowCount = liveNowCount,
                EndingSoonCount = endingSoonCount,
                TotalActiveBids = totalActiveBids,
                VerifiedVetsCount = verifiedVetsCount,
                PendingVetsCount = pendingVetsCount,
                PendingListings = pendingListings,
                PendingAuctions = pendingAuctions,
                LiveAuctions = liveAuctions,
                VetQueue = vetQueue
            };

            return View(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ApproveAuction(string id)
        {
            var auction = await _dbContext.Auctions
                .Include(a => a.Animal)
                .FirstOrDefaultAsync(a => a.Id == id);
            if (auction == null) return NotFound();

            if (auction.Animal.ModerationStatus != ModerationStatus.Approved)
            {
                TempData["Error"] = "The animal must be approved before its auction can be approved.";
                return RedirectToAction(nameof(Index));
            }

            auction.ModerationStatus = AuctionModerationStatus.Approved;
            auction.ModeratedAt = JordanTime.Now;
            auction.ModeratedByAdminId = _userManager.GetUserId(User);
            auction.RejectionReason = null;

            await _dbContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RejectAuction(string id, string? reason)
        {
            var auction = await _dbContext.Auctions.FirstOrDefaultAsync(a => a.Id == id);
            if (auction == null) return NotFound();

            auction.ModerationStatus = AuctionModerationStatus.Rejected;
            auction.ModeratedAt = JordanTime.Now;
            auction.ModeratedByAdminId = _userManager.GetUserId(User);
            auction.RejectionReason = reason;

            await _dbContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ApproveListing(string id)
        {
            var animal = await _dbContext.Animals.FirstOrDefaultAsync(a => a.Id == id);
            if (animal == null) return NotFound();

            animal.ModerationStatus = ModerationStatus.Approved;
            animal.ModeratedAt = JordanTime.Now;
            animal.ModeratedByAdminId = _userManager.GetUserId(User);
            animal.RejectionReason = null;

            await _dbContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RejectListing(string id, string? reason)
        {
            var animal = await _dbContext.Animals.FirstOrDefaultAsync(a => a.Id == id);
            if (animal == null) return NotFound();

            animal.ModerationStatus = ModerationStatus.Rejected;
            animal.ModeratedAt = JordanTime.Now;
            animal.ModeratedByAdminId = _userManager.GetUserId(User);
            animal.RejectionReason = reason;

            await _dbContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> VerifyVet(string vetProfileId)
        {
            var vetProfile = await _dbContext.VetProfiles.FirstOrDefaultAsync(v => v.Id == vetProfileId);
            if (vetProfile == null) return NotFound();

            vetProfile.IsVerified = true;
            vetProfile.VerifiedAt = JordanTime.Now;
            vetProfile.VerifiedByAdminId = _userManager.GetUserId(User);

            await _dbContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}
