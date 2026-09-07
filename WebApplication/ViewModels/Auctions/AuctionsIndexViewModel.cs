namespace WebApp.ViewModels.Auctions
{
    public class AuctionsIndexViewModel
    {
        public ICollection<AuctionListViewModel> Auctions { get; set; } = new List<AuctionListViewModel>();

        public int ActiveAuctionsCount { get; set; }
        public int ActiveBiddersCount { get; set; }
        public int VerifiedPercentage { get; set; }
    }
}
