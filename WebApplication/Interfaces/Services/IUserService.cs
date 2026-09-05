using WebApp.Models;

namespace WebApp.Interfaces.Services
{
    public interface IUserService
    {
        ICollection<ApplicationUser> GetAll();
        ApplicationUser? GetById(string Id);
    }
}
