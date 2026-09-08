
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Numerics;
using WebApp.Data;
using WebApp.Interfaces.Services;
using WebApp.Models;
using WebApp.ViewModels.Auctions;

public class AuctionController : Controller
{
    private readonly IAuctionService _auctionService;

    public AuctionController(IAuctionService auctionService)
    {
        _auctionService = auctionService;
    }

    // GET: AUCTIONS
    public async Task<IActionResult> Index()
    {
        //var auctions = await _auctionService.GetAllAsync();

        //var data = new AuctionsIndexViewModel
        //{
        //    Auctions = auctions,
        //    ActiveAuctionsCount = auctions.Count,
        //    ActiveBiddersCount = auctions.Aggregate<AuctionListViewModel, int>(0, (total, auction) => total += auction.BidCount),
        //    VerifiedPercentage = auctions.Aggregate<AuctionListViewModel, int>(0, (total, auction) => total += auction.Animal.IsOwnerVerified ? 1 : 0) / auctions.Count * 100
        //};

        //return View(data);

        // TODO: replace with a real query once the auctions service/repo exists
        var vm = new AuctionsIndexViewModel
        {
            ActiveAuctionsCount = 24,
            ActiveBiddersCount = 1342,
            VerifiedPercentage = 100,
            Auctions = new()
            {
                new AuctionListViewModel
                {
                    Id = 1042, LotNumber = "Lot #1042",
                    Title = "Championship Arabian Stallion",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDziebzI7ZQmFr0MNtxJgsM7l-9vcjhHnBz5YkgcK6Lgsuh4k7ZMnacNNuTLCeB-zEUdehz-WDsLNfEGRwzAjAFTEpEWrXu4GRhGWa2jNL413o4UjkB7L2PV1KcOIE2b-BSRP0lz43vulpDGQBH5EljzmzFl1GB-fWzw-5Kef-9IGfwJIpL7ZWVtI8IU7kEy7ui3ucIrhsD-JNN5GLG30Jp1_XkxwkiFjmBKcHvEsFbnSWlzB29pUYe",
                    Status = "live", Category = "horse", Price = 12500, BidCount = 24,
                    IsVerified = true,
                    DetailsLine = "Arabian Horse • 5 Years • Stallion",
                    Location = "Premium Stables, TX",
                    SpecPills = new() { "WAHO Registered", "Health Certified", "Championship Bloodline" },
                    CountdownTarget = new DateTime(2026, 12, 31, 18, 0, 0)
                },
                new AuctionListViewModel
                {
                    Id = 1043, LotNumber = "Lot #1043",
                    Title = "Premium Breeding Flock (10)",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBCD-UAttpSfgjLQ3icLSUIGwZR2Qg83yToJqi_QCxBo6apS_Tsq2my_FH8NmtPnO29M-GvSiz8AGE1KAvUSY3OLzV8l-S4goh1pPCfx_QWizyEYNWS7a6a0Yyaf3RcehqbZSVQhjtRaWwzjHXrlAyWMN00j7MdSjvWul5qqu95NcEc6KiL8BrSEf4azCh5gc5YNRAavBMd_Kz-C0h0r_l0F-MDtR9aFxbP7o-isTY_ZN5EHo26pQU6",
                    Status = "live", Category = "sheep", Price = 5800, BidCount = 18,
                    IsVerified = true,
                    DetailsLine = "Elite Breeding Ewes • 1 Champion Ram",
                    Location = "Heritage Farm, WY",
                    SpecPills = new() { "Full Health Records", "Vaccinated" },
                    CountdownTarget = new DateTime(2026, 12, 31, 20, 0, 0)
                },
                new AuctionListViewModel
                {
                    Id = 1045, LotNumber = "Lot #1045",
                    Title = "Champion Boer Buck",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDuUOCLfEu4brCPG6wmxHhVDnm734uxCl90SbQLSfZAbMmqn4fjGpC9jAh8TdyZVaVBsTX0vDH41bJEsWC79tr7dQQQouOGCC8v2EbqQz1eX9NydGEtvljhU6RW8La7c_JeiW6yrVGZDHmUmPeMGF6XujmuWFz5NZ7dp7UlFdAGfCvkBlHRpMcqDN720qJqnlnBhP73smpouszdcV2qWiQicRDhBl8I--ZLwDrcfhX-_W3xvj18wvUK",
                    Status = "ending-soon", Category = "goat", Price = 920, BidCount = 12,
                    IsVerified = true,
                    DetailsLine = "Boer Goat • 2 Years • Buck",
                    Location = "Mountain Farm, CO",
                    SpecPills = new() { "Award Winner", "Proven Genetics" },
                    CountdownTarget = new DateTime(2026, 12, 31, 16, 30, 0)
                },
                new AuctionListViewModel
                {
                    Id = 1046, LotNumber = "Lot #1046",
                    Title = "Premium Holstein Heifer",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBGaVcPEWBp1bEPjvGvCuWLCUWkQEscJKSj_1JCCrD9gPDbIH90M3l6YIXkSe4Ec6Z7YMggCQ2Ell7wKvXmNxbQfGVM0vw3c0YXEfMiIxD0YIwPFAtkn0_MioVJ0WHbiGBdNN1elRl3oTNHEGxX4ffBPfvlNN-l90CDxMtXQmvEbkqTGexU70BD4sWCBvVvmf6hT1uV3lqJEt_dDw1h0F04qP0bAKepEaBXFgAk-sqqDPdOf9r9vjIa",
                    Status = "upcoming", Category = "cattle", Price = 8500,
                    IsVerified = true,
                    DetailsLine = "Holstein • 2 Years • Heifer",
                    Location = "Elite Dairy, WI",
                    SpecPills = new() { "High Production Line", "AI Ready" },
                    CountdownStaticText = "2h 15m"
                }
            }
        };

        return View(vm);
    }

    // GET: AUCTIONS/Details/5
    public async Task<IActionResult> Details(int id)
    {
        //if (!ModelState.IsValid)
        //    return BadRequest();

        //if (id == null)
        //{
        //    return NotFound();
        //}

        //var animal = await _auctionService.GetByIdAsync(id);

        //if (animal == null)
        //    return NotFound();

        //var user = await _userService.GetByIdAsync(animal?.OwnerId);

        //var data = new AnimalDetailsViewModel
        //{
        //    animalInfo = animal,
        //    MoreFromSeller = await _animalService.GetByOwnerAsync(user.Id),
        //    SimilarListings = await _animalService.GetSimilarAsync(animal),
        //    owner = new UserListViewModel
        //    {
        //        Id = user.Id,
        //        FullName = user.FullName,
        //        CreatedAt = user.CreatedAt,
        //        IsVerified = user.IsVerified,
        //        Location = user.Location
        //    }
        //};

        //return View();

        // TODO: replace with a real lookup by id once the auctions service/repo exists
        var vm = new AuctionDetailsViewModel
        {
            Id = id,
            LotNumber = "Lot #1045",
            Title = "Boer Goat Buck",
            Location = "Certified Breeding Facility",
            IsVerifiedOwnership = true,
            MainImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuA_eutT2mS1w0QNy5Od4cX896_F2ZvHcVwP_7xlYWnDRExlYFWTD7spk__X4Rvp1Hl_jTEnfwZoxc6usFvuoZkVSMsy99I2O6tn0Q0kLlDrJsx6jpXGWd4DZ6IiKPCMKz7iXs35HqP2mSY97g5cdVFIgTX_BlFikCBM9ONWEeEIvzoFO7JWp87KyYzi_8RA73qqotnYg6RYSpxR8x0MVX15psc8HH-UfGK8851whm07hWQPiYRpk4Up",
            Thumbnails = new()
        {
            new AuctionMediaItemViewModel
            {
                Type = "image", IsActive = true,
                ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuA_eutT2mS1w0QNy5Od4cX896_F2ZvHcVwP_7xlYWnDRExlYFWTD7spk__X4Rvp1Hl_jTEnfwZoxc6usFvuoZkVSMsy99I2O6tn0Q0kLlDrJsx6jpXGWd4DZ6IiKPCMKz7iXs35HqP2mSY97g5cdVFIgTX_BlFikCBM9ONWEeEIvzoFO7JWp87KyYzi_8RA73qqotnYg6RYSpxR8x0MVX15psc8HH-UfGK8851whm07hWQPiYRpk4Up",
                Label = "Full side view"
            },
            new AuctionMediaItemViewModel { Type = "video", Label = "Livestock Video", Icon = "videocam" },
            new AuctionMediaItemViewModel { Type = "doc", Label = "Pedigree Chart", Icon = "description" },
            new AuctionMediaItemViewModel { Type = "doc", Label = "Health Card", Icon = "medical_information" }
        },
            Specs = new()
        {
            new() { Label = "Species", Value = "Goat" },
            new() { Label = "Breed", Value = "Boer" },
            new() { Label = "Age", Value = "2 Years" },
            new() { Label = "Gender", Value = "Male (Buck)" },
            new() { Label = "Live Weight", Value = "68 kg" },
            new() { Label = "Fertility Status", Value = "Proven Sire", IsHighlight = true },
            new() { Label = "Bloodline", Value = "Purebred Grade A", IsWide = true }
        },
            BreederNotes = new()
        {
            "Robust, healthy Boer goat buck raised on pasture in a certified breeding program. This animal exhibits textbook breed characteristics: deep reddish-brown head with white blaze, muscular frame, clean curved horns, and calm temperament around handlers.",
            "Prized for heavy meat production and rapid growth genetics, this buck is ready for immediate herd sire duties. All vaccination certifications and pre-auction veterinary clearance reports have been authenticated."
        },
            HealthRecords = new()
        {
            new() { Title = "Vaccinated — Goat Pox & Enterotoxemia", Meta = "Administered May 2024 • Booster due May 2025 (Ref #VP-88210)" },
            new() { Title = "Dewormed — Ivermectin Treatment", Meta = "Completed August 2024 • Negative fecal egg count pre-listing" },
            new() { Title = "Brucellosis & CAE Negative Certification", Meta = "Certified by accredited veterinary lab" }
        },
            BidHistory = new()
        {
            new() { BidderInitial = "M", BidderName = "M***d A.", TimeAgo = "4 minutes ago", Amount = 275, IsWinning = true, Tag = "Winning Bid" },
            new() { BidderInitial = "K", BidderName = "K***l R.", TimeAgo = "18 minutes ago", Amount = 250 },
            new() { BidderInitial = "T", BidderName = "T***q B.", TimeAgo = "1 hour ago", Amount = 225 },
            new() { BidderInitial = "H", BidderName = "H***n S.", TimeAgo = "3 hours ago", Amount = 200, Tag = "Starting Reserve" }
        },
            CountdownTarget = new DateTime(2026, 1, 1, 23, 59, 59),
            CurrentBid = 275,
            BidIncrement = 25,
            QuickBidAmounts = new() { 300, 325, 375 },
            Seller = new()
            {
                Id = "oa",
                Name = "Omar Al-Fahim",
                Initials = "OA",
                Tier = "Master Breeder • Tier 1",
                Rating = 4.9,
                CompletedAuctions = 42,
                Location = "Certified Breeding Facility",
                MemberSinceYear = 2015,
                ResponseTimeText = "Usually responds within 30 minutes",
                ActiveListingsCount = 8
            },
            SimilarAuctions = new()
        {
            new() { Id = 2001, Title = "Boer Doe (1.5 Years, Proven)", FarmName = "Valley Farm", BidCount = 12, EndsLabel = "Ends in 2h", CurrentBid = 180,
                ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuA_eutT2mS1w0QNy5Od4cX896_F2ZvHcVwP_7xlYWnDRExlYFWTD7spk__X4Rvp1Hl_jTEnfwZoxc6usFvuoZkVSMsy99I2O6tn0Q0kLlDrJsx6jpXGWd4DZ6IiKPCMKz7iXs35HqP2mSY97g5cdVFIgTX_BlFikCBM9ONWEeEIvzoFO7JWp87KyYzi_8RA73qqotnYg6RYSpxR8x0MVX15psc8HH-UfGK8851whm07hWQPiYRpk4Up" },
            new() { Id = 2002, Title = "Awassi Ewe with Twin Lambs", FarmName = "Heritage Farm", BidCount = 18, EndsLabel = "Ends in 5h", CurrentBid = 320,
                ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuA_eutT2mS1w0QNy5Od4cX896_F2ZvHcVwP_7xlYWnDRExlYFWTD7spk__X4Rvp1Hl_jTEnfwZoxc6usFvuoZkVSMsy99I2O6tn0Q0kLlDrJsx6jpXGWd4DZ6IiKPCMKz7iXs35HqP2mSY97g5cdVFIgTX_BlFikCBM9ONWEeEIvzoFO7JWp87KyYzi_8RA73qqotnYg6RYSpxR8x0MVX15psc8HH-UfGK8851whm07hWQPiYRpk4Up" },
            new() { Id = 2003, Title = "Damascus Buck (Pure)", FarmName = "Mountain Ranch", BidCount = 9, EndsLabel = "Ends Tomorrow", CurrentBid = 350,
                ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuA_eutT2mS1w0QNy5Od4cX896_F2ZvHcVwP_7xlYWnDRExlYFWTD7spk__X4Rvp1Hl_jTEnfwZoxc6usFvuoZkVSMsy99I2O6tn0Q0kLlDrJsx6jpXGWd4DZ6IiKPCMKz7iXs35HqP2mSY97g5cdVFIgTX_BlFikCBM9ONWEeEIvzoFO7JWp87KyYzi_8RA73qqotnYg6RYSpxR8x0MVX15psc8HH-UfGK8851whm07hWQPiYRpk4Up" }
        }
        };

        return View(vm);
    }

    
}
