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

        public async Task<ICollection<AnimalListViewModel>> GetAllAsync()
        {
            var list = await _dbContext.Animals
                .AsNoTracking()
                .Where(a => a.Status == AnimalStatus.Available)
                .Include(a => a.Owner)
                .Include(a => a.Species)
                .Include(a => a.Images)
                .Select(a => new AnimalListViewModel
                {
                    Id = a.Id,
                    Name = a.Name,
                    Breed = a.Breed,
                    AgeInMonths = a.AgeInMonths,
                    Price = a.Price,
                    Location = a.Location,
                    IsOwnerVerified = a.Owner.IsVerified,
                    IsVetVerified = a.IsVerified,
                    MainImageUrl = a.Images.FirstOrDefault(i=>i.IsMain == true).ImageUrl
                }).ToListAsync();
            return list;
        }

        public async Task<Animal?> GetByIdAsync(string id)
        {
            if (id == null)
                return null;
           
            var animal = await _dbContext.Animals.Include(a=>a.Species).FirstOrDefaultAsync(m => m.Id == id);
            
            if (animal == null)
                return null;

            await _dbContext.Entry<Animal>(animal).Collection(a => a.Images).LoadAsync();
            return animal;
        }

        public async Task<ICollection<AnimalListViewModel>> GetSimilarAsync(Animal animal)
        {
            var list = await _dbContext.Animals
                .AsNoTracking()
                .Where(a => a.Status == AnimalStatus.Available)
                .Where(a=>a.Breed == animal.Breed) //|| a.Species == a.Species
                .Include(a => a.Owner)
                .Include(a => a.Species)
                .Include(a => a.Images)
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
                    IsVetVerified = a.IsVerified,
                    MainImageUrl = a.Images.FirstOrDefault(i => i.IsMain == true).ImageUrl
                }).ToListAsync();
            return list;
        }

        public async Task<ICollection<AnimalListViewModel>> GetByOwnerAsync(string userId)
        {
            var list = await _dbContext.Animals
                .AsNoTracking()
                .Where(a => a.Status == AnimalStatus.Available)
                .Where(a => a.OwnerId == userId)
                .Include(a => a.Owner)
                .Include(a => a.Species)
                .Include(a => a.Images)
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
                    IsVetVerified = a.IsVerified,
                    MainImageUrl = a.Images.FirstOrDefault(i => i.IsMain == true).ImageUrl
                }).ToListAsync();
            return list;
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

        //Task<ICollection<Animal>> IAnimalService.GetAllAsync()
        //{
        //    throw new NotImplementedException();
        //}
    }
}
