
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Enums;
using WebApp.Models;
using WebApp.ViewModels.Animals;
using WebApp.ViewModels.Auctions;
using WebApp.ViewModels.Users;

public class MarketplaceController : Controller
{
    private readonly ApplicationDbContext _dbContext;

    public MarketplaceController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // GET: ANIMALS
    public async Task<IActionResult> Index()
    {
        var animals = await _dbContext.Animals
        .Where(a => a.Status == AnimalStatus.Available && a.ModerationStatus == ModerationStatus.Approved)
        .OrderByDescending(a => a.CreatedAt)
        .Select(a => new AnimalListViewModel
        {
            Id = a.Id,
            Name = a.Name,
            Breed = a.Breed,
            Gender = a.Gender,
            AgeInMonths = a.AgeInMonths,
            Price = a.Price,
            Location = a.Location,
            IsOwnerVerified = a.Owner.IsVerified,
            IsVetVerified = a.IsVetChecked,
            MainImageUrl = a.Images.Where(i => i.IsMain).Select(i => i.ImageUrl).FirstOrDefault()
                           ?? a.Images.Select(i => i.ImageUrl).FirstOrDefault()
        })
        .ToListAsync();

        return View(animals);
    }

    // GET: ANIMALS/Details/5
    public async Task<IActionResult> Details(string id)
    {
        var animal = await _dbContext.Animals
            .Include(a => a.Species)
            .Include(a => a.Images)
            .Include(a => a.Owner)
            .Include(a => a.HealthRecords)
            .FirstOrDefaultAsync(a => a.Id == id
                && a.Status == AnimalStatus.Available
                && a.ModerationStatus == ModerationStatus.Approved);

        if (animal == null)
        {
            return NotFound();
        }

        var moreFromSeller = await _dbContext.Animals
            .Where(a => a.OwnerId == animal.OwnerId
                        && a.Id != animal.Id
                        && a.Status == AnimalStatus.Available
                        && a.ModerationStatus == ModerationStatus.Approved
                        )
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new AnimalListViewModel
            {
                Id = a.Id,
                Name = a.Name,
                Breed = a.Breed,
                Gender = a.Gender,
                AgeInMonths = a.AgeInMonths,
                Price = a.Price,
                Location = a.Location,
                IsOwnerVerified = a.Owner != null && a.Owner.IsVerified,
                IsVetVerified = a.IsVetChecked,
                MainImageUrl = a.Images
                    .Where(i => i.IsMain)
                    .Select(i => i.ImageUrl)
                    .FirstOrDefault()
                    ?? a.Images.Select(i => i.ImageUrl).FirstOrDefault()
            })
            .Take(4)
            .ToListAsync();

        var similarListings = await _dbContext.Animals
            .Where(a => a.SpeciesId == animal.SpeciesId
                        && a.Id != animal.Id
                        && a.Status == AnimalStatus.Available
                        && a.ModerationStatus == ModerationStatus.Approved)
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new AnimalListViewModel
            {
                Id = a.Id,
                Name = a.Name,
                Breed = a.Breed,
                Gender = a.Gender,
                AgeInMonths = a.AgeInMonths,
                Price = a.Price,
                Location = a.Location,
                IsOwnerVerified = a.Owner != null && a.Owner.IsVerified,
                IsVetVerified = a.IsVetChecked,
                MainImageUrl = a.Images
                    .Where(i => i.IsMain)
                    .Select(i => i.ImageUrl)
                    .FirstOrDefault()
                    ?? a.Images.Select(i => i.ImageUrl).FirstOrDefault()
            })
            .Take(4)
            .ToListAsync();

        var viewModel = new AnimalDetailsViewModel
        {
            animalInfo = new AnimalDetailViewModel
            {
                Id = animal.Id,
                Name = animal.Name,
                Breed = animal.Breed,
                Gender = animal.Gender,
                AgeInMonths = animal.AgeInMonths,
                Description = animal.Description,
                Price = animal.Price,
                Location = animal.Location,
                Status = animal.Status.ToString(),
                IsVerified = animal.IsVerified,
                IsVetChecked = animal.IsVetChecked,
                CreatedAt = animal.CreatedAt,
                SpeciesName = animal.Species?.Name ?? "Unknown species",
                ImageUrls = animal.Images
                    .OrderByDescending(i => i.IsMain)
                    .Select(i => i.ImageUrl)
                    .ToList(),
                BreederNotes = string.IsNullOrWhiteSpace(animal.BreederNotes)
                    ? new List<string>()
                    : animal.BreederNotes.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList(),
                HealthRecords = animal.HealthRecords.Select(h => new AuctionHealthItemViewModel
                {
                    Title = h.Title,
                    Meta = h.Meta ?? (h.RecordDate.HasValue ? h.RecordDate.Value.ToString("MMMM yyyy") : "")
                }).ToList()
            },
            MoreFromSeller = moreFromSeller,
            SimilarListings = similarListings,
            owner = new UserListViewModel
            {
                Id = animal.Owner?.Id ?? "",
                FullName = animal.Owner?.FullName ?? "Unknown seller",
                CreatedAt = animal.Owner?.CreatedAt ?? DateTime.UtcNow,
                IsVerified = animal.Owner?.IsVerified ?? false,
                Location = animal.Owner?.Location,
                PhoneNumber = animal.Owner?.PhoneNumber
            }
        };

        return View(viewModel);
    }

}
