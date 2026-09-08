namespace WebApp.ViewModels.Auctions
{
    public class AuctionBidViewModel
    {
        public string BidderInitial { get; set; } = "";
        public string BidderName { get; set; } = "";
        public string TimeAgo { get; set; } = "";
        public decimal Amount { get; set; }
        public bool IsWinning { get; set; }
        public string? Tag { get; set; }             // "Winning Bid" | "Starting Reserve" | null
    }
}
