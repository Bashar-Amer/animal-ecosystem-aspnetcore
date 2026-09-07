using WebApp.Models;

namespace WebApp.Interfaces.Services
{
    public interface IUserService
    {
        Task<ICollection<ApplicationUser>> GetAllAsync();
        Task<ApplicationUser?> GetByIdAsync(string Id);
    }
}
