using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.DTOs;
using WebApp.Interfaces.Services;
using WebApp.Models;
using WebApp.ViewModels.Animals;

namespace WebApp.Services
{
    public class AnimalService : IAnimalService
    {
        private readonly ApplicationDbContext _dbContext;

        public AnimalService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ICollection<Animal>> GetAllAsync()
        => await _dbContext.Animals.ToListAsync();

        public async Task<Animal?> GetById(string id)
        {
            if (id == null)
                return null;
           
            var animal = await _dbContext.Animals.FirstOrDefaultAsync(m => m.Id == id);

            if (animal == null)
                return null;
            else
                return animal;
        }

        public async Task<Result> AddAsync(AnimalCreateViewModel userData)
        {
            var animal = new Animal
            {
                Name = userData.Name,
                Breed = userData.Breed,
                AgeInMonths = userData.AgeInMonths,
                Description = userData.Description,
                Price = userData.Price,
                Location = userData.Location,
                Status = userData.Status,
                SpeciesId = userData.SpeciesId,
                OwnerId = userData.OwnerId,
                Images = userData.Images
            };
            try
            {
                _dbContext.Animals.Add(animal);
                await _dbContext.SaveChangesAsync();
                return Result.Success();
            }
            catch(Exception e)
            {
                return Result.Failure(e.ToString());
            }
        }
    }
}
