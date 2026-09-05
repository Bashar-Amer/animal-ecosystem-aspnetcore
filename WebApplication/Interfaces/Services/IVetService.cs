using WebApp.Models;

namespace WebApp.Interfaces.Services
{
    public interface IVetService
    {
        ICollection<VetProfile> GetAll();
        VetProfile? GetById(string Id);
    }
}
