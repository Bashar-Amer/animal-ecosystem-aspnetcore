
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
        var auctions = await _auctionService.GetAllAsync();

        var data = new AuctionsIndexViewModel
        {
            Auctions = auctions,
            ActiveAuctionsCount = auctions.Count,
            ActiveBiddersCount = auctions.Aggregate<AuctionListViewModel, int>(0, (total, auction) => total += auction.BidCount),
            VerifiedPercentage = auctions.Aggregate<AuctionListViewModel, int>(0, (total, auction) => total += auction.Animal.IsOwnerVerified ? 1 : 0) / auctions.Count * 100
        };

        return View(data);
    }

    // GET: AUCTIONS/Details/5
    public async Task<IActionResult> Details(string id)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        if (id == null)
        {
            return NotFound();
        }

        var animal = await _animalService.GetByIdAsync(id);

        if (animal == null)
            return NotFound();

        var user = await _userService.GetByIdAsync(animal?.OwnerId);

        var data = new AnimalDetailsViewModel
        {
            animalInfo = animal,
            MoreFromSeller = await _animalService.GetByOwnerAsync(user.Id),
            SimilarListings = await _animalService.GetSimilarAsync(animal),
            owner = new UserListViewModel
            {
                Id = user.Id,
                FullName = user.FullName,
                CreatedAt = user.CreatedAt,
                IsVerified = user.IsVerified,
                Location = user.Location
            }
        };

        return View(data);
    }

    
}
