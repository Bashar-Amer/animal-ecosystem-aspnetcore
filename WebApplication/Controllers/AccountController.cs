using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Enums;
using WebApp.Models;
using WebApp.ViewModels.Account;

namespace WebApp.Controllers
{
    public class AccountController : Controller
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _dbContext;

        public AccountController(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext dbContext
        )
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _dbContext = dbContext;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Watchlist(string? search = null, string filter = "all")
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Challenge();
            }

            var favorites = await _dbContext.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Animal!)
                    .ThenInclude(a => a.Species)
                .Include(f => f.Animal!)
                    .ThenInclude(a => a.Images)
                .Include(f => f.Animal!)
                    .ThenInclude(a => a.Auction!)
                        .ThenInclude(a => a.Bids)
                .AsSplitQuery()
                .ToListAsync();

            var items = favorites
                .Where(f => f.Animal != null)
                .Select(f => MapWatchlistItem(f.Animal!))
                .Where(item => item.IsVisible)
                .ToList();

            if (filter.Equals("auctions", StringComparison.OrdinalIgnoreCase))
            {
                items = items.Where(item => item.IsAuction).ToList();
            }
            else if (filter.Equals("listings", StringComparison.OrdinalIgnoreCase))
            {
                items = items.Where(item => !item.IsAuction).ToList();
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                items = items.Where(item =>
                    item.Name.Contains(term, StringComparison.OrdinalIgnoreCase)
                    || item.SpeciesName.Contains(term, StringComparison.OrdinalIgnoreCase)
                    || (item.Breed?.Contains(term, StringComparison.OrdinalIgnoreCase) ?? false)
                    || (item.Location?.Contains(term, StringComparison.OrdinalIgnoreCase) ?? false)
                    || (item.LotNumber?.Contains(term, StringComparison.OrdinalIgnoreCase) ?? false))
                    .ToList();
            }

            return View(new WatchlistViewModel
            {
                Items = items,
                SearchQuery = search,
                ActiveFilter = filter
            });
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Profile()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Challenge();
            }

            var userId = user.Id;
            var roles = await _userManager.GetRolesAsync(user);

            var profile = new ProfileViewModel
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Location = user.Location,
                ProfileImageUrl = user.ProfileImageUrl,
                IsVerified = user.IsVerified,
                Rating = user.Rating,
                CreatedAt = user.CreatedAt,
                Roles = roles.ToArray(),
                ListingCount = await _dbContext.Animals
                    .CountAsync(animal => animal.OwnerId == userId),
                FavoriteCount = await _dbContext.Favorites
                    .CountAsync(favorite => favorite.UserId == userId),
                BidCount = await _dbContext.Bids
                    .CountAsync(bid => bid.UserId == userId)
            };

            return View(profile);
        }

        private static WatchlistItemViewModel MapWatchlistItem(Animal animal)
        {
            var auction = animal.Auction;
            var isAuction = auction != null
                && auction.ModerationStatus == AuctionModerationStatus.Approved
                && animal.ModerationStatus == ModerationStatus.Approved
                && animal.Status == AnimalStatus.InAuction;

            return new WatchlistItemViewModel
            {
                AnimalId = animal.Id,
                Name = animal.Name,
                SpeciesName = animal.Species?.Name ?? "Livestock",
                Breed = animal.Breed,
                Location = animal.Location,
                ImageUrl = animal.Images.FirstOrDefault(i => i.IsMain)?.ImageUrl
                    ?? animal.Images.FirstOrDefault()?.ImageUrl
                    ?? "/images/placeholder-animal.jpg",
                Price = animal.Price,
                IsAuction = isAuction,
                AuctionId = isAuction ? auction!.Id : null,
                LotNumber = isAuction ? $"Lot #{auction!.LotNumber}" : null,
                CurrentBid = isAuction ? auction!.CurrentPrice : null,
                BidCount = isAuction ? auction!.Bids.Count : 0,
                AuctionStatus = isAuction ? auction!.Status.ToString() : "",
                AuctionEndTime = isAuction ? auction!.EndTime : null,
                IsVisible = isAuction
                    || (animal.Auction == null
                        && animal.ModerationStatus == ModerationStatus.Approved
                        && animal.Status == AnimalStatus.Available)
            };
        }

        [HttpGet]
        public IActionResult Login(string? returnUrl = null)
        {
            return View(new LoginViewModel { ReturnUrl = returnUrl });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Identity signs in by UserName by default, so look up the user by Email first
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Invalid email or password.");
                return View(model);
            }

            var result = await _signInManager.PasswordSignInAsync(
                user,
                model.Password,
                isPersistent: model.RememberMe, // tied to RememberMe, see note below
                lockoutOnFailure: true);

            if (result.Succeeded)
            {
                if (!string.IsNullOrEmpty(model.ReturnUrl) && Url.IsLocalUrl(model.ReturnUrl))
                {
                    return Redirect(model.ReturnUrl);
                }
                return RedirectToAction("Index", "Home");
            }

            if (result.IsLockedOut)
            {
                ModelState.AddModelError(string.Empty, "This account has been locked out. Try again later.");
                return View(model);
            }

            ModelState.AddModelError(string.Empty, "Invalid email or password.");
            return View(model);
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View(new RegisterViewModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Map "breeder" | "vet" to an Identity role name
            var roleName = model.Role == "vet" ? "Vet" : "Breeder";

            var user = new ApplicationUser
            {
                UserName = model.Email, 
                Email = model.Email,
                FullName = model.FullName,
                PhoneNumber = string.IsNullOrWhiteSpace(model.PhoneNumber)
                    ? null
                    : model.PhoneNumber.Trim(),
                Location = string.Join(", ", new[] { model.City, model.Country }
                    .Where(value => !string.IsNullOrWhiteSpace(value))
                    .Select(value => value.Trim())),
                CreatedAt = DateTime.UtcNow
            };

            var createResult = await _userManager.CreateAsync(user, model.Password);

            if (!createResult.Succeeded)
            {
                foreach (var error in createResult.Errors)
                {
                    if (error.Code == "DuplicateUserName")
                    {
                        ModelState.AddModelError(nameof(model.Email), "An account with this email already exists.");
                    }
                    else
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }
                return View(model);
            }

            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new IdentityRole(roleName));
            }
            await _userManager.AddToRoleAsync(user, roleName);

            return RedirectToAction("Login", "Account");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }

    }
}
