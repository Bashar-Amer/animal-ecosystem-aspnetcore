using WebApp.Data;
using WebApp.Interfaces.Services;

namespace WebApp.Services
{
    public class AuctionService : IAuctionService
    {
        private readonly ApplicationDbContext _context;

        public AuctionService(ApplicationDbContext context)
        {
            _context = context;
        }
    }
}
