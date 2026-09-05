
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Interfaces.Services;
using WebApp.Models;
using WebApp.ViewModels.Animals;

public class MarketplaceController : Controller
{
    private readonly IAnimalService _animalService;

    public MarketplaceController(IAnimalService animalService)
    {
        _animalService = animalService;
    }

    // GET: ANIMALS
    public async Task<IActionResult> Index()    
    {
        return View(await _context.Animals.ToListAsync());
    }

    // GET: ANIMALS/Details/5
    public async Task<IActionResult> Details(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var animal = await _context.Animals
            .FirstOrDefaultAsync(m => m.Id == id);
        if (animal == null)
        {
            return NotFound();
        }

        return View(animal);
    }

    // GET: ANIMALS/Create
    public IActionResult Create()
    {
        return View();
    }

    [Authorize]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(AnimalCreateViewModel userData)
    {
        if (ModelState.IsValid)
        {
            
            return RedirectToAction(nameof(Index));
        }
        return View(animal);
    }

    // GET: ANIMALS/Edit/5
    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var animal = await _context.Animals.FindAsync(id);
        if (animal == null)
        {
            return NotFound();
        }
        return View(animal);
    }

    // POST: ANIMALS/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int? id, [Bind("Id,Name,Breed,AgeInMonths,Description,Price,Location,Status,CreatedAt,CategoryId,Category,OwnerId,Owner,Images,Auction")] Animal animal)
    {
        if (id != animal.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(animal);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AnimalExists(animal.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return RedirectToAction(nameof(Index));
        }
        return View(animal);
    }

    // GET: ANIMALS/Delete/5
    public async Task<IActionResult> Delete(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var animal = await _context.Animals
            .FirstOrDefaultAsync(m => m.Id == id);
        if (animal == null)
        {
            return NotFound();
        }

        return View(animal);
    }

    // POST: ANIMALS/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int? id)
    {
        var animal = await _context.Animals.FindAsync(id);
        if (animal != null)
        {
            _context.Animals.Remove(animal);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool AnimalExists(int? id)
    {
        return _context.Animals.Any(e => e.Id == id);
    }
}
