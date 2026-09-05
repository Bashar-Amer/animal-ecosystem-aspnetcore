using WebApp.Models;

namespace WebApp.Interfaces.Services
{
    public interface IAnimalService
    {
        Task<ICollection<Animal>> GetAllAsync();
        Task<Animal?> GetById(string Id);
    }
}
