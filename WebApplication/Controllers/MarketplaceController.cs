
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Interfaces.Services;
using WebApp.Models;
using WebApp.Services;
using WebApp.ViewModels.Animals;
using WebApp.ViewModels.Users;

public class MarketplaceController : Controller
{
    private readonly IAnimalService _animalService;
    private readonly IUserService _userService;

    public MarketplaceController(IAnimalService animalService, IUserService userService)
    {
        _animalService = animalService;
        _userService = userService;
    }

    // GET: ANIMALS
    public async Task<IActionResult> Index()    
    {
        var animals = await _animalService.GetAllAsync();
        return View(animals);
    }

    // GET: ANIMALS/Details/5
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
            owner= new UserListViewModel
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
