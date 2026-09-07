using WebApp.Models;
using WebApp.ViewModels.Animals;

namespace WebApp.Interfaces.Services
{
    public interface IAnimalService
    {
        Task<ICollection<AnimalListViewModel>> GetAllAsync();
        Task<Animal?> GetByIdAsync(string Id);
        Task<ICollection<AnimalListViewModel>> GetSimilarAsync(Animal animal);
        Task<ICollection<AnimalListViewModel>> GetByOwnerAsync(string userId);
    }
}
