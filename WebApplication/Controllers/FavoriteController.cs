using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Models;

namespace WebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoriteController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public FavoriteController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [HttpGet("status/{animalId}")]
        public async Task<IActionResult> Status(string animalId)
        {
            if (!(User.Identity?.IsAuthenticated ?? false))
            {
                return Ok(new { isFavorited = false });
            }

            var userId = _userManager.GetUserId(User);
            var isFavorited = await _dbContext.Favorites
                .AnyAsync(f => f.UserId == userId && f.AnimalId == animalId);

            return Ok(new { isFavorited });
        }

        [HttpPost("toggle/{animalId}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Toggle(string animalId)
        {
            if (!(User.Identity?.IsAuthenticated ?? false))
            {
                return Unauthorized(new { message = "You must be logged in to save items." });
            }

            var animalExists = await _dbContext.Animals.AnyAsync(a => a.Id == animalId);
            if (!animalExists)
            {
                return NotFound();
            }

            var userId = _userManager.GetUserId(User)!;

            var existing = await _dbContext.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.AnimalId == animalId);

            bool isFavorited;
            if (existing != null)
            {
                _dbContext.Favorites.Remove(existing);
                isFavorited = false;
            }
            else
            {
                _dbContext.Favorites.Add(new Favorite { UserId = userId, AnimalId = animalId });
                isFavorited = true;
            }

            await _dbContext.SaveChangesAsync();

            return Ok(new { isFavorited });
        }

        [HttpPost("remove/{animalId}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Remove(string animalId)
        {
            if (!(User.Identity?.IsAuthenticated ?? false))
            {
                return Unauthorized(new { message = "You must be logged in to manage your watchlist." });
            }

            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            var favorite = await _dbContext.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.AnimalId == animalId);
            if (favorite == null)
            {
                return NotFound();
            }

            _dbContext.Favorites.Remove(favorite);
            await _dbContext.SaveChangesAsync();
            return Ok(new { removed = true });
        }
    }
}
