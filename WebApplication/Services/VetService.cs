using WebApp.Data;
using WebApp.Interfaces.Services;

namespace WebApp.Services
{
    public class VetService : IVetService
    {
        private readonly ApplicationDbContext _context;

        public VetService(ApplicationDbContext context)
        {
            _context = context;
        }
    }
}
