using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text.RegularExpressions;
using WebApp.Data;
using WebApp.Helpers;
using WebApp.Models;
using WebApp.ViewModels.Home;

namespace WebApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _dbContext;

        public HomeController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IActionResult> Index()
        {
            var heroAuction = await _dbContext.Auctions
            .Where(a => a.Status == AuctionStatus.Live || a.Status == AuctionStatus.EndingSoon)
            .Include(a => a.Animal).ThenInclude(an => an.Images)
            .Include(a => a.Bids)
            .OrderByDescending(a => a.Bids.Count)
            .ThenBy(a => a.EndTime)
            .FirstOrDefaultAsync();

            var totalVerifiedSellers = await _dbContext.Users.CountAsync(u => u.IsVerified);
            var animalsListed = await _dbContext.Animals.CountAsync(a => a.Status == AnimalStatus.Available);
            var successfulAuctions = await _dbContext.Auctions
                .CountAsync(a => a.Status == AuctionStatus.Ended && a.HighestBidderId != null);
            var registeredVets = await _dbContext.VetProfiles.CountAsync(v => v.IsVerified);

            var featuredAnimals = await _dbContext.Animals
                .Where(a => a.IsFeatured && a.Status == AnimalStatus.Available)
                .Include(a => a.Species)
                .Include(a => a.Images)
                .Include(a => a.Owner)
                .OrderByDescending(a => a.CreatedAt)
                .Take(6)
                .ToListAsync();

            var liveAuctions = await _dbContext.Auctions
                .Where(a => a.Status == AuctionStatus.Live || a.Status == AuctionStatus.EndingSoon)
                .Include(a => a.Animal)
                .Include(a => a.Bids)
                .OrderBy(a => a.EndTime)
                .Take(4)
                .ToListAsync();

            var featuredVets = await _dbContext.VetProfiles
                .Where(v => v.IsFeatured)
                .Include(v => v.User)
                .OrderByDescending(v => v.Rating)
                .Take(4)
                .ToListAsync();

            var viewModel = new HomeIndexViewModel
            {
                HeroShowcase = heroAuction == null ? new HeroShowcaseViewModel() : new HeroShowcaseViewModel
                {
                    LotNumber = $"Lot #{heroAuction.LotNumber}",
                    ImageUrl = heroAuction.Animal.Images.FirstOrDefault(i => i.IsMain)?.ImageUrl
                               ?? heroAuction.Animal.Images.FirstOrDefault()?.ImageUrl
                               ?? "/images/placeholder-animal.jpg",
                    ImageCaption = heroAuction.Animal.Name,
                    Title = heroAuction.Title,
                    Location = heroAuction.Animal.Location ?? "",
                    CurrentBid = heroAuction.CurrentPrice,
                    CountdownTarget = heroAuction.EndTime
                },

                TrustStats = new List<TrustStatViewModel>
            {
                new() { Value = totalVerifiedSellers.ToString(), Label = "Verified Sellers" },
                new() { Value = animalsListed.ToString(), Label = "Animals Listed" },
                new() { Value = successfulAuctions.ToString(), Label = "Successful Auctions" },
                new() { Value = registeredVets.ToString(), Label = "Registered Vets" }
            },

                FeaturedAnimals = featuredAnimals.Select(a => new FeaturedAnimalViewModel
                {
                    Id = a.Id,
                    Species = DisplayHelpers.MapCategory(a.Species.Name),
                    ImageUrl = a.Images.FirstOrDefault(i => i.IsMain)?.ImageUrl
                               ?? a.Images.FirstOrDefault()?.ImageUrl
                               ?? "/images/placeholder-animal.jpg",
                    BadgeText = a.IsVetChecked ? "Vet Checked" : "",
                    LocationBadge = a.Location ?? "",
                    VerificationText = a.Owner.IsVerified ? "Verified Seller" : "",
                    Title = a.Name,
                    MetaLine = BuildMetaLine(a),
                    Price = a.Price
                }).ToList(),

                LiveAuctions = liveAuctions.Select(a => new HomeAuctionCardViewModel
                {
                    Id = a.LotNumber,
                    LotNumber = $"Lot #{a.LotNumber}",
                    ImageUrl = a.Animal.Images.FirstOrDefault(i => i.IsMain)?.ImageUrl
                               ?? "/images/placeholder-animal.jpg",
                    Title = a.Title,
                    Description = a.Animal.Description ?? "",
                    Status = a.Status == AuctionStatus.EndingSoon ? "ending-soon" : "live",
                    CurrentBid = a.CurrentPrice,
                    CountdownTarget = a.EndTime
                }).ToList(),

                FeaturedVets = featuredVets.Select(v => new FeaturedVetViewModel
                {
                    Slug = DisplayHelpers.GenerateSlug(v.User.FullName),
                    ImageUrl = v.User.ProfileImageUrl ?? "/images/placeholder-avatar.jpg",
                    Name = v.User.FullName,
                    Specialty = v.Specialty,
                    LocationLabel = v.ClinicLocation ?? "",
                    Rating = v.Rating,
                    ReviewCount = v.ReviewCount,
                    ExperienceLabel = $"{v.YearsOfExperience}+ Years Experience",
                    AvailabilityStatus = v.AvailabilityStatus,
                    AvailabilityText = v.AvailabilityText ?? "",
                    FeeFrom = v.ConsultationFee
                }).ToList()
            };

            return View(viewModel);
        }

        //public IActionResult Privacy()
        //{
        //    return View();
        //}

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        private static string MapCategory(string speciesName)
        {
            var name = speciesName.ToLowerInvariant();
            return name switch
            {
                var n when n.Contains("horse") => "horse",
                var n when n.Contains("cattle") || n.Contains("cow") || n.Contains("bull") => "cattle",
                var n when n.Contains("sheep") => "sheep",
                var n when n.Contains("goat") => "goat",
                var n when n.Contains("camel") => "camel",
                _ => name
            };
        }

        private static string BuildMetaLine(Animal animal)
        {
            var parts = new List<string>();
            if (!string.IsNullOrWhiteSpace(animal.Breed)) parts.Add(animal.Breed);
            if (animal.AgeInMonths.HasValue) parts.Add(DisplayHelpers.FormatAge(animal.AgeInMonths.Value));
            if (!string.IsNullOrWhiteSpace(animal.Gender)) parts.Add(animal.Gender);
            return string.Join(" • ", parts);
        }

        private static string FormatAge(int ageInMonths)
        {
            if (ageInMonths < 12) return $"{ageInMonths} Month{(ageInMonths == 1 ? "" : "s")}";
            var years = ageInMonths / 12;
            return $"{years} Year{(years == 1 ? "" : "s")}";
        }

        private static string GenerateSlug(string name)
        {
            var slug = name.ToLowerInvariant().Trim();
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = Regex.Replace(slug, @"\s+", "-");
            return slug;
        }
    }
}
