
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Models;
using WebApp.ViewModels.Animals;
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
        .Where(a => a.Status == AnimalStatus.Available)
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
        //if (!ModelState.IsValid)
        //    return BadRequest();

        //if (id == null)
        //{
        //    return NotFound();
        //}

        //var animal = await _animalService.GetByIdAsync(id);
        
        //if (animal == null)
        //    return NotFound();

        //var user = await _userService.GetByIdAsync(animal?.OwnerId);

        //var data = new AnimalDetailsViewModel
        //{
        //    animalInfo = animal,
        //    MoreFromSeller = await _animalService.GetByOwnerAsync(user.Id),
        //    SimilarListings = await _animalService.GetSimilarAsync(animal),
        //    owner= new UserListViewModel
        //    {
        //        Id = user.Id,
        //        FullName = user.FullName,
        //        CreatedAt = user.CreatedAt,
        //        IsVerified = user.IsVerified,
        //        Location = user.Location
        //    }
        //};

        return View();
    }

   
}
