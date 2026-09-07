using WebApp.Models;
using WebApp.ViewModels.Auctions;

namespace WebApp.Interfaces.Services
{
    public interface IAuctionService
    {
        Task<ICollection<AuctionListViewModel>> GetAllAsync();
        Task<AuctionListViewModel?> GetByIdAsync(string id);
    }
}
