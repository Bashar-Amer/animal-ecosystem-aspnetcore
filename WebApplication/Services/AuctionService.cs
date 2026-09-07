using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Interfaces.Services;
using WebApp.Models;
using WebApp.ViewModels.Animals;
using WebApp.ViewModels.Auctions;

namespace WebApp.Services
{
    public class AuctionService : IAuctionService
    {
        private readonly ApplicationDbContext _dbContext;

        public AuctionService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ICollection<AuctionListViewModel>> GetAllAsync()
        {
            var list = await _dbContext.Auctions
                .AsNoTracking()
                .Include(auc => auc.Animal)
                    .ThenInclude(anim => anim.Images)
                .Include(auc => auc.Animal)
                    .ThenInclude(anim => anim.Owner)
                .Include(auc=>auc.Bids)
                .Select(auc => new AuctionListViewModel
                {
                    Id = auc.Id,
                    LotNumber = auc.LotNumber,
                    Title = auc.Title,
                    Status = auc.Status,
                    BidCount = auc.Bids.Count,
                    Animal = new AnimalListViewModel
                    {
                        MainImageUrl = auc.Animal.Images.FirstOrDefault(i=>i.IsMain == true).ImageUrl,
                        Breed = auc.Animal.Breed,
                        Price = auc.Animal.Price,
                        IsOwnerVerified = auc.Animal.IsVerified,
                        Location = auc.Animal.Location
                    }
                }).ToListAsync();
            return list;
        }

        public async Task<AuctionListViewModel?> GetByIdAsync(string id)
        {
            if (id == null)
                return null;

            var auction = await _dbContext.Animals.Include(a => a.Species).FirstOrDefaultAsync(m => m.Id == id);

            if (auction == null)
                return null;

            //await _dbContext.Entry<Auction>(auction).Collection(a => a.Images).LoadAsync();
            return auction;
        }
    }
}
