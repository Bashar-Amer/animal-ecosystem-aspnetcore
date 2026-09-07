using WebApp.Data;
using WebApp.Interfaces.Services;
using WebApp.Models;

namespace WebApp.Services
{
    public class VetService : IVetService
    {
        private readonly ApplicationDbContext _context;

        public VetService(ApplicationDbContext context)
        {
            _context = context;
        }

        public ICollection<VetProfile> GetAll()
        {
            throw new NotImplementedException();
        }

        public VetProfile? GetById(string Id)
        {
            throw new NotImplementedException();
        }
    }
}
