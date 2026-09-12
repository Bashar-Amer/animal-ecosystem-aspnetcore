using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebApp.Data;
using WebApp.Helpers;
using WebApp.Models;

namespace WebApp.Controllers
{
    [ApiController]
    [Route("api/vet-favorite")]
    public class VetFavoriteController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public VetFavoriteController(
            ApplicationDbContext dbContext,
            UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [HttpGet("status/{slug}")]
        public async Task<IActionResult> Status(string slug)
        {
            var vetProfileId = await FindVetProfileId(slug);
            if (vetProfileId == null)
            {
                return NotFound();
            }

            if (!(User.Identity?.IsAuthenticated ?? false))
            {
                return Ok(new { isFavorited = false });
            }

            var currentUser = await FindCurrentUserAsync();
            if (currentUser == null)
            {
                return Ok(new { isFavorited = false });
            }

            var userId = currentUser.Id;
            var isFavorited = await _dbContext.VetFavorites
                .AnyAsync(f => f.UserId == userId && f.VetProfileId == vetProfileId);

            return Ok(new { isFavorited });
        }

        [HttpPost("toggle/{slug}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Toggle(string slug)
        {
            if (!(User.Identity?.IsAuthenticated ?? false))
            {
                return Unauthorized(new { message = "You must be logged in to save veterinarians." });
            }

            var vetProfileId = await FindVetProfileId(slug);
            if (vetProfileId == null)
            {
                return NotFound();
            }

            var currentUser = await FindCurrentUserAsync();
            if (currentUser == null)
            {
                return Unauthorized(new { message = "Your session has expired. Please sign in again." });
            }

            var userId = currentUser.Id;
            var existing = await _dbContext.VetFavorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.VetProfileId == vetProfileId);

            bool isFavorited;
            if (existing != null)
            {
                _dbContext.VetFavorites.Remove(existing);
                isFavorited = false;
            }
            else
            {
                _dbContext.VetFavorites.Add(new VetFavorite
                {
                    UserId = userId,
                    VetProfileId = vetProfileId
                });
                isFavorited = true;
            }

            await _dbContext.SaveChangesAsync();
            return Ok(new { isFavorited });
        }

        private async Task<ApplicationUser?> FindCurrentUserAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user != null)
            {
                return user;
            }

            var email = User.FindFirstValue(ClaimTypes.Email);
            return string.IsNullOrWhiteSpace(email)
                ? null
                : await _userManager.FindByEmailAsync(email);
        }

        private async Task<string?> FindVetProfileId(string slug)
        {
            var vets = await _dbContext.VetProfiles
                .Include(v => v.User)
                .ToListAsync();

            return vets
                .FirstOrDefault(v => DisplayHelpers.GenerateSlug(v.User.FullName) == slug)
                ?.Id;
        }
    }
}
