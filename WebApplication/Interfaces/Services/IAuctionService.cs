using WebApp.Models;

namespace WebApp.Interfaces.Services
{
    public interface IAuctionService
    {
        ICollection<Auction> GetAll();
        Auction? GetById(string Id);
    }
}
