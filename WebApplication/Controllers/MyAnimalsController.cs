using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Enums;
using WebApp.Helpers;
using WebApp.Models;
using WebApp.ViewModels.MyAnimals;

namespace WebApp.Controllers
{
    [Authorize]
    public class MyAnimalsController : Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _environment;

        public MyAnimalsController(
            ApplicationDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            IWebHostEnvironment environment)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _environment = environment;
        }

        // GET: /MyAnimals?tab=all&search=&sort=newest
        public async Task<IActionResult> Index(string tab = "all", string? search = null, string sort = "newest")
        {
            var userId = _userManager.GetUserId(User)!;

            var allOwnedAnimals = await _dbContext.Animals
                .Where(a => a.OwnerId == userId && a.Status != AnimalStatus.Withdrawn)
                .Include(a => a.Species)
                .Include(a => a.Images)
                .Include(a => a.Auction).ThenInclude(auc => auc!.Bids)
                .Include(a => a.Auction).ThenInclude(auc => auc!.HighestBidder)
                .AsSplitQuery()
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            var stats = new MyAnimalsStatsViewModel
            {
                TotalActiveListings = allOwnedAnimals.Count(a => a.Status != AnimalStatus.Sold),
                MarketplaceCount = allOwnedAnimals.Count(a => a.Status == AnimalStatus.Available),
                AuctionCount = allOwnedAnimals.Count(a => a.Status == AnimalStatus.InAuction),
                ActiveCatalogValue = allOwnedAnimals.Where(a => a.Status != AnimalStatus.Sold).Sum(a => a.Price),
                PendingReviewCount = allOwnedAnimals.Count(a => a.ModerationStatus == ModerationStatus.Pending),
                CompletedCount = allOwnedAnimals.Count(a => a.Status == AnimalStatus.Sold)
            };

            IEnumerable<Animal> filtered = tab switch
            {
                "auctions" => allOwnedAnimals.Where(a => a.Status == AnimalStatus.InAuction),
                "marketplace" => allOwnedAnimals.Where(a => a.Status == AnimalStatus.Available && a.ModerationStatus == ModerationStatus.Approved),
                "pending" => allOwnedAnimals.Where(a => a.ModerationStatus == ModerationStatus.Pending),
                "completed" => allOwnedAnimals.Where(a => a.Status == AnimalStatus.Sold),
                _ => allOwnedAnimals
            };

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                filtered = filtered.Where(a =>
                    a.Name.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                    (a.Breed?.Contains(term, StringComparison.OrdinalIgnoreCase) ?? false) ||
                    a.Species.Name.Contains(term, StringComparison.OrdinalIgnoreCase));
            }

            filtered = sort switch
            {
                "price-high" => filtered.OrderByDescending(a => a.Price),
                "price-low" => filtered.OrderBy(a => a.Price),
                "ending-soon" => filtered.OrderBy(a => a.Auction != null ? a.Auction.EndTime : DateTime.MaxValue),
                _ => filtered.OrderByDescending(a => a.CreatedAt)
            };

            var viewModel = new MyAnimalsIndexViewModel
            {
                Stats = stats,
                ActiveTab = tab,
                SearchQuery = search,
                SortBy = sort,
                Animals = filtered.Select(MapToListViewModel).ToList()
            };

            return View(viewModel);
        }

        // GET: /MyAnimals/Create
        public async Task<IActionResult> Create()
        {
            var viewModel = new AnimalFormViewModel
            {
                SpeciesOptions = await GetSpeciesOptionsAsync()
            };
            return View(viewModel);
        }

        // POST: /MyAnimals/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(AnimalFormViewModel model)
        {
            ValidateImageUploads(model.NewImages, requireAtLeastOne: true);

            if (!ModelState.IsValid)
            {
                model.SpeciesOptions = await GetSpeciesOptionsAsync();
                return View(model);
            }

            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Challenge();
            }

            var currentUser = await _userManager.FindByIdAsync(userId);
            if (currentUser == null)
            {
                return Challenge();
            }

            var animal = new Animal
            {
                Name = model.Name,
                SpeciesId = model.SpeciesId,
                Breed = model.Breed,
                Gender = model.Gender,
                AgeInMonths = model.AgeInMonths,
                Description = model.Description,
                Price = model.Price,
                Location = model.Location,
                BreederNotes = model.BreederNotes,
                OwnerId = currentUser.Id,
                Status = AnimalStatus.Available,
                ModerationStatus = ModerationStatus.Pending
            };

            _dbContext.Animals.Add(animal);
            await _dbContext.SaveChangesAsync();

            if (model.NewImages.Any())
            {
                var savedUrls = await SaveImagesAsync(model.NewImages);
                for (var i = 0; i < savedUrls.Count; i++)
                {
                    _dbContext.AnimalImages.Add(new AnimalImage
                    {
                        AnimalId = animal.Id,
                        ImageUrl = savedUrls[i],
                        IsMain = i == 0
                    });
                }
                await _dbContext.SaveChangesAsync();
            }

            TempData["Message"] = "Your listing was submitted and is pending admin approval.";
            return RedirectToAction(nameof(Index));
        }

        // GET: /MyAnimals/Edit/{id}
        public async Task<IActionResult> Edit(string id)
        {
            var userId = _userManager.GetUserId(User)!;

            var animal = await _dbContext.Animals
                .Include(a => a.Images)
                .FirstOrDefaultAsync(a => a.Id == id && a.OwnerId == userId);

            if (animal == null) return NotFound();

            if (animal.Status != AnimalStatus.Available)
            {
                TempData["Error"] = "This listing can't be edited while it's in an auction or sold.";
                return RedirectToAction(nameof(Index));
            }

            var viewModel = new AnimalFormViewModel
            {
                Id = animal.Id,
                Name = animal.Name,
                SpeciesId = animal.SpeciesId,
                Breed = animal.Breed,
                Gender = animal.Gender,
                AgeInMonths = animal.AgeInMonths,
                Description = animal.Description,
                Price = animal.Price,
                Location = animal.Location,
                BreederNotes = animal.BreederNotes,
                SpeciesOptions = await GetSpeciesOptionsAsync(animal.SpeciesId),
                ExistingImages = animal.Images.Select(i => new ExistingImageViewModel
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    IsMain = i.IsMain
                }).ToList()
            };

            return View(viewModel);
        }

        // POST: /MyAnimals/Edit/{id}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, AnimalFormViewModel model)
        {
            var userId = _userManager.GetUserId(User)!;

            var animal = await _dbContext.Animals
                .Include(a => a.Images)
                .FirstOrDefaultAsync(a => a.Id == id && a.OwnerId == userId);

            if (animal == null) return NotFound();

            if (animal.Status != AnimalStatus.Available)
            {
                TempData["Error"] = "This listing can't be edited while it's in an auction or sold.";
                return RedirectToAction(nameof(Index));
            }

            var hasNewImages = model.NewImages.Any(IsValidImageUpload);
            if (!animal.Images.Any() && !hasNewImages)
            {
                ModelState.AddModelError(nameof(model.NewImages), "Add at least one valid image before saving the listing.");
            }
            else
            {
                ValidateImageUploads(model.NewImages, requireAtLeastOne: false);
            }

            if (!ModelState.IsValid)
            {
                model.SpeciesOptions = await GetSpeciesOptionsAsync(model.SpeciesId);
                model.ExistingImages = animal.Images.Select(i => new ExistingImageViewModel
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    IsMain = i.IsMain
                }).ToList();
                return View(model);
            }

            animal.Name = model.Name;
            animal.SpeciesId = model.SpeciesId;
            animal.Breed = model.Breed;
            animal.Gender = model.Gender;
            animal.AgeInMonths = model.AgeInMonths;
            animal.Description = model.Description;
            animal.Price = model.Price;
            animal.Location = model.Location;
            animal.BreederNotes = model.BreederNotes;

            // Any edit sends it back for re-review
            animal.ModerationStatus = ModerationStatus.Pending;
            animal.ModeratedAt = null;
            animal.ModeratedByAdminId = null;
            animal.RejectionReason = null;

            if (model.NewImages.Any())
            {
                var savedUrls = await SaveImagesAsync(model.NewImages);
                var hasExistingMain = animal.Images.Any(i => i.IsMain);
                var newPrimaryIndex = model.NewPrimaryImageIndex.GetValueOrDefault(0);
                var promoteNewImage = model.NewPrimaryImageIndex.HasValue
                                      && newPrimaryIndex >= 0
                                      && newPrimaryIndex < savedUrls.Count;

                if (promoteNewImage)
                {
                    foreach (var image in animal.Images)
                    {
                        image.IsMain = false;
                    }
                }

                for (var i = 0; i < savedUrls.Count; i++)
                {
                    _dbContext.AnimalImages.Add(new AnimalImage
                    {
                        AnimalId = animal.Id,
                        ImageUrl = savedUrls[i],
                        IsMain = promoteNewImage
                            ? i == newPrimaryIndex
                            : !hasExistingMain && i == 0
                    });
                }
            }

            await _dbContext.SaveChangesAsync();

            TempData["Message"] = "Your changes were saved and the listing is pending re-review.";
            return RedirectToAction(nameof(Index));
        }

        // POST: /MyAnimals/Delete/{id}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = _userManager.GetUserId(User)!;

            var animal = await _dbContext.Animals
                .FirstOrDefaultAsync(a => a.Id == id && a.OwnerId == userId);

            if (animal == null) return NotFound();

            if (animal.Status == AnimalStatus.InAuction)
            {
                TempData["Error"] = "You can't withdraw a listing that's currently in an active auction.";
                return RedirectToAction(nameof(Index));
            }

            animal.Status = AnimalStatus.Withdrawn;
            await _dbContext.SaveChangesAsync();

            TempData["Message"] = "Listing withdrawn.";
            return RedirectToAction(nameof(Index));
        }

        // GET: /MyAnimals/CreateAuction/{animalId}
        public async Task<IActionResult> CreateAuction(string animalId)
        {
            var userId = _userManager.GetUserId(User)!;

            var animal = await _dbContext.Animals
                .Include(a => a.Images)
                .Include(a => a.Auction)
                .FirstOrDefaultAsync(a => a.Id == animalId && a.OwnerId == userId);

            if (animal == null) return NotFound();

            if (animal.ModerationStatus != ModerationStatus.Approved)
            {
                TempData["Error"] = "This animal must be approved before it can be auctioned.";
                return RedirectToAction(nameof(Index));
            }

            if (animal.Status != AnimalStatus.Available || animal.Auction != null)
            {
                TempData["Error"] = "This animal isn't available to auction right now.";
                return RedirectToAction(nameof(Index));
            }

            var viewModel = new CreateAuctionViewModel
            {
                AnimalId = animal.Id,
                AnimalName = animal.Name,
                ImageUrl = animal.Images.FirstOrDefault(i => i.IsMain)?.ImageUrl
                           ?? animal.Images.FirstOrDefault()?.ImageUrl
                           ?? "/images/placeholder-animal.jpg",
                Title = $"{animal.Name} - {animal.Breed}".Trim(' ', '-'),
                StartingPrice = animal.Price
            };

            return View(viewModel);
        }

        // POST: /MyAnimals/CreateAuction/{animalId}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateAuction(string animalId, CreateAuctionViewModel model)
        {
            var userId = _userManager.GetUserId(User)!;

            var animal = await _dbContext.Animals
                .Include(a => a.Auction)
                .FirstOrDefaultAsync(a => a.Id == animalId && a.OwnerId == userId);

            if (animal == null) return NotFound();

            if (animal.ModerationStatus != ModerationStatus.Approved)
            {
                ModelState.AddModelError(string.Empty, "This animal must be approved before it can be auctioned.");
            }

            if (animal.Status != AnimalStatus.Available || animal.Auction != null)
            {
                ModelState.AddModelError(string.Empty, "This animal isn't available to auction right now.");
            }

            if (model.EndTime <= model.StartTime)
            {
                ModelState.AddModelError(nameof(model.EndTime), "End time must be after the start time.");
            }

            if (!ModelState.IsValid)
            {
                model.AnimalId = animal.Id;
                model.AnimalName = animal.Name;
                return View(model);
            }

            const int maxRetries = 3;
            for (var attempt = 0; attempt < maxRetries; attempt++)
            {
                var maxLotNumber = await _dbContext.Auctions.MaxAsync(a => (int?)a.LotNumber) ?? 1000;

                var auction = new Auction
                {
                    LotNumber = maxLotNumber + 1,
                    AnimalId = animal.Id,
                    Title = model.Title,
                    StartingPrice = model.StartingPrice,
                    CurrentPrice = model.StartingPrice,
                    MinIncrement = model.MinIncrement,
                    StartTime = model.StartTime,
                    EndTime = model.EndTime,
                    Status = model.StartTime <= JordanTime.Now ? AuctionStatus.Live : AuctionStatus.StartingSoon,
                    ModerationStatus = AuctionModerationStatus.Pending
                };

                _dbContext.Auctions.Add(auction);
                animal.Status = AnimalStatus.InAuction;

                try
                {
                    await _dbContext.SaveChangesAsync();
                    TempData["Message"] = "Auction submitted successfully and is waiting for admin approval. It will appear publicly after approval.";
                    return RedirectToAction(nameof(Index), new { tab = "all" });
                }
                catch (DbUpdateException) when (attempt < maxRetries - 1)
                {
                    _dbContext.Entry(auction).State = EntityState.Detached;
                    animal.Status = AnimalStatus.Available; // undo in-memory change before retry
                }
            }

            ModelState.AddModelError(string.Empty, "Couldn't create the auction right now — please try again.");
            model.AnimalId = animal.Id;
            model.AnimalName = animal.Name;
            return View(model);
        }

        // POST: /MyAnimals/DeleteImage/{imageId}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteImage(int imageId, string animalId)
        {
            var userId = _userManager.GetUserId(User)!;

            var image = await _dbContext.AnimalImages
                .Include(i => i.Animal)
                .FirstOrDefaultAsync(i => i.Id == imageId && i.Animal.OwnerId == userId);

            if (image == null) return NotFound();

            var wasMain = image.IsMain;
            _dbContext.AnimalImages.Remove(image);
            await _dbContext.SaveChangesAsync();

            // If we just removed the primary image, promote whatever's left
            if (wasMain)
            {
                var nextImage = await _dbContext.AnimalImages
                    .Where(i => i.AnimalId == animalId)
                    .FirstOrDefaultAsync();
                if (nextImage != null)
                {
                    nextImage.IsMain = true;
                    await _dbContext.SaveChangesAsync();
                }
            }

            return RedirectToAction(nameof(Edit), new { id = animalId });
        }

        // POST: /MyAnimals/SetPrimaryImage/{imageId}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SetPrimaryImage(int imageId, string animalId)
        {
            var userId = _userManager.GetUserId(User)!;

            var images = await _dbContext.AnimalImages
                .Include(i => i.Animal)
                .Where(i => i.AnimalId == animalId && i.Animal.OwnerId == userId)
                .ToListAsync();

            if (!images.Any(i => i.Id == imageId)) return NotFound();

            foreach (var img in images)
            {
                img.IsMain = img.Id == imageId;
            }

            await _dbContext.SaveChangesAsync();
            return RedirectToAction(nameof(Edit), new { id = animalId });
        }


        private async Task<List<SelectListItem>> GetSpeciesOptionsAsync(int? selectedId = null)
        {
            return await _dbContext.Species
                .OrderBy(s => s.Name)
                .Select(s => new SelectListItem
                {
                    Value = s.Id.ToString(),
                    Text = s.Name,
                    Selected = s.Id == selectedId
                })
                .ToListAsync();
        }

        private async Task<List<string>> SaveImagesAsync(List<IFormFile> files)
        {
            var urls = new List<string>();
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "animals");
            Directory.CreateDirectory(uploadsFolder);

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            const long maxFileSize = 5 * 1024 * 1024; // 5 MB

            foreach (var file in files)
            {
                if (file.Length == 0 || file.Length > maxFileSize) continue;

                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension)) continue;

                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                urls.Add($"/uploads/animals/{fileName}");
            }

            return urls;
        }

        private void ValidateImageUploads(IEnumerable<IFormFile>? files, bool requireAtLeastOne)
        {
            var uploads = files?.ToList() ?? new List<IFormFile>();
            if (requireAtLeastOne && !uploads.Any(IsValidImageUpload))
            {
                ModelState.AddModelError(nameof(AnimalFormViewModel.NewImages), "Add at least one valid image before submitting the listing.");
            }

            foreach (var file in uploads)
            {
                if (file.Length == 0 || file.Length > 5 * 1024 * 1024)
                {
                    ModelState.AddModelError(nameof(AnimalFormViewModel.NewImages), $"{file.FileName} must be no larger than 5MB.");
                    continue;
                }

                if (!IsValidImageUpload(file))
                {
                    ModelState.AddModelError(nameof(AnimalFormViewModel.NewImages), $"{file.FileName} must be a JPG, PNG, or WebP image.");
                }
            }
        }

        private static bool IsValidImageUpload(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            return file.Length > 0
                   && file.Length <= 5 * 1024 * 1024
                   && (extension == ".jpg" || extension == ".jpeg" || extension == ".png" || extension == ".webp");
        }

        private static MyAnimalListViewModel MapToListViewModel(Animal a)
        {
            var vm = new MyAnimalListViewModel
            {
                Id = a.Id,
                Name = a.Name,
                ImageUrl = a.Images.FirstOrDefault(i => i.IsMain)?.ImageUrl
                           ?? a.Images.FirstOrDefault()?.ImageUrl
                           ?? "/images/placeholder-animal.jpg",
                SpeciesName = a.Species.Name,
                Breed = a.Breed,
                AgeInMonths = a.AgeInMonths,
                Gender = a.Gender,
                Price = a.Price,
                ModerationStatus = a.ModerationStatus.ToString(),
                Status = a.Status.ToString(),
                RejectionReason = a.RejectionReason,
                CanEdit = a.Status == AnimalStatus.Available,
                CanWithdraw = a.Status == AnimalStatus.Available || a.Status == AnimalStatus.Reserved,
                CanCreateAuction = a.ModerationStatus == ModerationStatus.Approved
                                   && a.Status == AnimalStatus.Available
                                   && a.Auction == null
            };

            if (a.Auction != null &&
                (a.Auction.Status == AuctionStatus.Live || a.Auction.Status == AuctionStatus.EndingSoon
                 || a.Auction.Status == AuctionStatus.StartingSoon || a.Auction.Status == AuctionStatus.Upcoming))
            {
                vm.Auction = new AuctionSummaryViewModel
                {
                    AuctionId = a.Auction.Id,
                    LotNumber = $"Lot #{a.Auction.LotNumber}",
                    CurrentPrice = a.Auction.CurrentPrice,
                    BidCount = a.Auction.Bids.Count,
                    TopBidderName = a.Auction.HighestBidder?.FullName,
                    EndTime = a.Auction.EndTime,
                    Status = a.Auction.Status == AuctionStatus.EndingSoon ? "ending-soon"
                           : a.Auction.Status == AuctionStatus.Live ? "live"
                           : "upcoming",
                    ModerationStatus = a.Auction.ModerationStatus.ToString(),
                    RejectionReason = a.Auction.RejectionReason
                };
            }

            return vm;
        }

    }
}
