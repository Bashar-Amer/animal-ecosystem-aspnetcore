
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Numerics;
using WebApp.Data;
using WebApp.Helpers;
using WebApp.Interfaces.Services;
using WebApp.Models;
using WebApp.ViewModels.Auctions;

public class AuctionController : Controller
{
    private readonly ApplicationDbContext _dbContext;

    public AuctionController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    private static readonly AuctionStatus[] ActiveStatuses =
    {
        AuctionStatus.StartingSoon,
        AuctionStatus.Upcoming,
        AuctionStatus.Live,
        AuctionStatus.EndingSoon
    };

    // GET: AUCTIONS
    public async Task<IActionResult> Index()
    {
        var auctions = await _dbContext.Auctions
            .Where(a => a.Status != AuctionStatus.Cancelled)
            .Include(a => a.Animal)
                .ThenInclude(an => an.Species)
            .Include(a => a.Animal)
                .ThenInclude(an => an.Images)
            .Include(a => a.Animal)
                .ThenInclude(an => an.Owner)
            .Include(a => a.Bids)
            .OrderByDescending(a => a.Status == AuctionStatus.Live)
            .ThenBy(a => a.EndTime)
            .ToListAsync();

        var auctionCards = auctions.Select(MapToListViewModel).ToList();

        var activeBiddersCount = await _dbContext.Bids
            .Where(b => ActiveStatuses.Contains(b.Auction.Status))
            .Select(b => b.UserId)
            .Distinct()
            .CountAsync();

        var verifiedPercentage = auctionCards.Count == 0
            ? 0
            : (int)Math.Round(auctionCards.Count(c => c.IsVerified) * 100.0 / auctionCards.Count);

        var viewModel = new AuctionsIndexViewModel
        {
            Auctions = auctionCards,
            ActiveAuctionsCount = auctionCards.Count(c => c.Status != "ended"),
            ActiveBiddersCount = activeBiddersCount,
            VerifiedPercentage = verifiedPercentage
        };

        return View(viewModel);
    }

    // GET: AUCTIONS/Details/5
    public async Task<IActionResult> Details(int id)
    {

        var auction = await _dbContext.Auctions
             .Include(a => a.Animal).ThenInclude(an => an.Species)
             .Include(a => a.Animal).ThenInclude(an => an.Images)
             .Include(a => a.Animal).ThenInclude(an => an.Owner)
             .Include(a => a.Animal).ThenInclude(an => an.HealthRecords)
             .Include(a => a.Bids).ThenInclude(b => b.User)
             .Include(a => a.HighestBidder)
             .FirstOrDefaultAsync(a => a.LotNumber == id);

        if (auction == null)
        {
            return NotFound();
        }

        var animal = auction.Animal;
        var owner = animal.Owner;

        var completedAuctions = await _dbContext.Auctions
            .CountAsync(a => a.Animal.OwnerId == owner.Id && a.Status == AuctionStatus.Ended);

        var activeListings = await _dbContext.Animals
            .CountAsync(a => a.OwnerId == owner.Id &&
                (a.Status == AnimalStatus.Available || a.Status == AnimalStatus.InAuction));

        var similarAuctions = await _dbContext.Auctions
            .Where(a => a.Id != auction.Id &&
                        a.Animal.SpeciesId == animal.SpeciesId &&
                        a.Status != AuctionStatus.Ended &&
                        a.Status != AuctionStatus.Cancelled)
            .Include(a => a.Animal).ThenInclude(an => an.Images)
            .Include(a => a.Animal).ThenInclude(an => an.Owner)
            .Include(a => a.Bids)
            .OrderBy(a => a.EndTime)
            .Take(4)
            .ToListAsync();

        var viewModel = new AuctionDetailsViewModel
        {
            Id = auction.LotNumber,
            LotNumber = $"Lot #{auction.LotNumber}",
            Title = auction.Title,
            StatusLabel = BuildStatusLabel(auction.Status),
            Location = animal.Location ?? "",
            IsVerifiedOwnership = animal.IsVerified && owner.IsVerified,

            MainImageUrl = animal.Images.FirstOrDefault(i => i.IsMain)?.ImageUrl
                           ?? animal.Images.FirstOrDefault()?.ImageUrl
                           ?? "/images/placeholder-animal.jpg",
            Thumbnails = animal.Images.Select(img => new AuctionMediaItemViewModel
            {
                Type = "image",
                ImageUrl = img.ImageUrl,
                IsActive = img.IsMain
            }).ToList(),

            Specs = BuildSpecs(animal),
            BreederNotes = string.IsNullOrWhiteSpace(animal.BreederNotes)
                ? new List<string>()
                : animal.BreederNotes.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList(),

            HealthRecords = animal.HealthRecords.Select(h => new AuctionHealthItemViewModel
            {
                Title = h.Title,
                Meta = h.Meta ?? (h.RecordDate.HasValue ? h.RecordDate.Value.ToString("MMMM yyyy") : "")
            }).ToList(),

            BidHistory = auction.Bids
                .OrderByDescending(b => b.PlacedAt)
                .Select(b => new AuctionBidViewModel
                {
                    BidderInitial = string.IsNullOrWhiteSpace(b.User.FullName) ? "?" : b.User.FullName[0].ToString().ToUpper(),
                    BidderName = b.User.FullName,
                    TimeAgo = FormatTimeAgo(b.PlacedAt),
                    Amount = b.Amount,
                    IsWinning = b.UserId == auction.HighestBidderId,
                    Tag = b.UserId == auction.HighestBidderId ? "Winning Bid" : null
                }).ToList(),

            CountdownTarget = auction.Status == AuctionStatus.StartingSoon || auction.Status == AuctionStatus.Upcoming
                ? auction.StartTime
                : auction.EndTime,
            TimeRemainingLabel = BuildTimeRemainingLabel(auction),

            CurrentBid = auction.CurrentPrice,
            BidIncrement = auction.MinIncrement,
            QuickBidAmounts = new List<decimal>
            {
                auction.CurrentPrice + auction.MinIncrement,
                auction.CurrentPrice + auction.MinIncrement * 2,
                auction.CurrentPrice + auction.MinIncrement * 5
            },

            Seller = new AuctionSellerViewModel
            {
                Id = owner.Id,
                Name = owner.FullName,
                Initials = DisplayHelpers.GetInitials(owner.FullName),
                Rating = owner.Rating,
                CompletedAuctions = completedAuctions,
                Location = owner.Location ?? "",
                MemberSinceYear = owner.CreatedAt.Year,
                ActiveListingsCount = activeListings
            },

            SimilarAuctions = similarAuctions.Select(a => new SimilarAuctionViewModel
            {
                Id = a.LotNumber,
                Title = a.Title,
                ImageUrl = a.Animal.Images.FirstOrDefault(i => i.IsMain)?.ImageUrl
                           ?? a.Animal.Images.FirstOrDefault()?.ImageUrl
                           ?? "/images/placeholder-animal.jpg",
                FarmName = a.Animal.Owner.FullName,
                BidCount = a.Bids.Count,
                EndsLabel = BuildTimeRemainingLabel(a),
                CurrentBid = a.CurrentPrice
            }).ToList()
        };

        return View(viewModel);
    }

    private static AuctionListViewModel MapToListViewModel(Auction auction)
    {
        var animal = auction.Animal;
        var status = MapStatus(auction.Status);
        var isVerified = animal.IsVerified && animal.Owner.IsVerified;

        return new AuctionListViewModel
        {
            Id = auction.LotNumber,
            LotNumber = $"Lot #{auction.LotNumber}",
            Title = auction.Title,
            ImageUrl = animal.Images.FirstOrDefault(i => i.IsMain)?.ImageUrl
                       ?? animal.Images.FirstOrDefault()?.ImageUrl
                       ?? "/images/placeholder-animal.jpg",
            Status = status,
            Category = DisplayHelpers.MapCategory(animal.Species.Name),
            Price = auction.CurrentPrice,
            BidCount = auction.Bids.Count,
            IsVerified = isVerified,
            DetailsLine = BuildDetailsLine(animal),
            Location = animal.Location ?? "",
            SpecPills = BuildSpecPills(animal),
            CountdownTarget = status == "upcoming" ? auction.StartTime
                             : status == "ended" ? null
                             : auction.EndTime,
            CountdownStaticText = null
        };
    }

    private static string MapStatus(AuctionStatus status) => status switch
    {
        AuctionStatus.Live => "live",
        AuctionStatus.EndingSoon => "ending-soon",
        AuctionStatus.StartingSoon => "upcoming",
        AuctionStatus.Upcoming => "upcoming",
        AuctionStatus.Ended => "ended",
        _ => "ended"
    };

    
    private static string BuildDetailsLine(Animal animal)
    {
        var breedAndSpecies = string.IsNullOrWhiteSpace(animal.Breed)
            ? animal.Species.Name
            : $"{animal.Breed} {animal.Species.Name}";

        var parts = new List<string> { breedAndSpecies };

        if (animal.AgeInMonths.HasValue)
            parts.Add(DisplayHelpers.FormatAge(animal.AgeInMonths.Value));

        if (!string.IsNullOrWhiteSpace(animal.Gender))
            parts.Add(animal.Gender);

        return string.Join(" • ", parts);
    }

    
    private static List<string> BuildSpecPills(Animal animal)
    {
        var pills = new List<string>();
        if (!string.IsNullOrWhiteSpace(animal.Breed)) pills.Add(animal.Breed);
        if (animal.AgeInMonths.HasValue) pills.Add(DisplayHelpers.FormatAge(animal.AgeInMonths.Value));
        if (!string.IsNullOrWhiteSpace(animal.Gender)) pills.Add(animal.Gender);
        if (animal.IsVetChecked) pills.Add("Vet Checked");
        return pills;
    }

    private static string BuildStatusLabel(AuctionStatus status) => status switch
    {
        AuctionStatus.Live => "OPEN AUCTION • LIVE",
        AuctionStatus.EndingSoon => "OPEN AUCTION • ENDING SOON",
        AuctionStatus.StartingSoon => "AUCTION • STARTING SOON",
        AuctionStatus.Upcoming => "AUCTION • UPCOMING",
        AuctionStatus.Ended => "AUCTION • ENDED",
        _ => "AUCTION"
    };

    private static string BuildTimeRemainingLabel(Auction auction)
    {
        if (auction.Status == AuctionStatus.Ended) return "Auction Ended";

        var target = (auction.Status == AuctionStatus.StartingSoon || auction.Status == AuctionStatus.Upcoming)
            ? auction.StartTime : auction.EndTime;
        var verb = (auction.Status == AuctionStatus.StartingSoon || auction.Status == AuctionStatus.Upcoming)
            ? "Starts" : "Ends";

        var diff = target - DateTime.UtcNow;
        if (diff <= TimeSpan.Zero) return $"{verb} shortly";
        if (diff.TotalHours < 1) return $"{verb} in {diff.Minutes}m";
        if (diff.TotalDays < 1) return $"{verb} in {diff.Hours}h {diff.Minutes}m";
        if (diff.TotalDays < 2) return $"{verb} Tomorrow";
        return $"{verb} in {(int)diff.TotalDays} days";
    }

    private static string FormatTimeAgo(DateTime placedAt)
    {
        var diff = DateTime.UtcNow - placedAt;
        if (diff.TotalMinutes < 1) return "Just now";
        if (diff.TotalMinutes < 60) return $"{(int)diff.TotalMinutes}m ago";
        if (diff.TotalHours < 24) return $"{(int)diff.TotalHours}h ago";
        return $"{(int)diff.TotalDays}d ago";
    }

    private static List<AuctionSpecItemViewModel> BuildSpecs(Animal animal)
    {
        var specs = new List<AuctionSpecItemViewModel>
        {
            new() { Label = "Species", Value = animal.Species.Name, IsHighlight = true }
        };

        if (!string.IsNullOrWhiteSpace(animal.Breed))
            specs.Add(new AuctionSpecItemViewModel { Label = "Breed", Value = animal.Breed });

        if (animal.AgeInMonths.HasValue)
            specs.Add(new AuctionSpecItemViewModel { Label = "Age", Value = DisplayHelpers.FormatAge(animal.AgeInMonths.Value) });

        if (!string.IsNullOrWhiteSpace(animal.Gender))
            specs.Add(new AuctionSpecItemViewModel { Label = "Gender", Value = animal.Gender });

        specs.Add(new AuctionSpecItemViewModel { Label = "Vet Checked", Value = animal.IsVetChecked ? "Yes" : "No" });

        if (!string.IsNullOrWhiteSpace(animal.Description))
            specs.Add(new AuctionSpecItemViewModel { Label = "Description", Value = animal.Description, IsWide = true });

        return specs;
    }


}
