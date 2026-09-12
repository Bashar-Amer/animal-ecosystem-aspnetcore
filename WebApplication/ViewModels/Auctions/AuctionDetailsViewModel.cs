namespace WebApp.ViewModels.Auctions
{
    public class AuctionDetailsViewModel
    {
        public string Id { get; set; } = "";
        public string LotNumber { get; set; } = "";
        public string Title { get; set; } = "";
        public string StatusLabel { get; set; } = "OPEN AUCTION • LIVE";
        public string Location { get; set; } = "";
        public bool IsVerifiedOwnership { get; set; }

        public string MainImageUrl { get; set; } = "";
        public List<AuctionMediaItemViewModel> Thumbnails { get; set; } = new();

        public List<AuctionSpecItemViewModel> Specs { get; set; } = new();
        public List<string> BreederNotes { get; set; } = new();

        public List<AuctionHealthItemViewModel> HealthRecords { get; set; } = new();

        public List<AuctionBidViewModel> BidHistory { get; set; } = new();
        public int TotalBidsPlaced => BidHistory.Count;

        public DateTime CountdownTarget { get; set; }
        public string TimeRemainingLabel { get; set; } = "Ends Today";

        public decimal CurrentBid { get; set; }
        public decimal BidIncrement { get; set; } = 25;
        public decimal MinNextBid => CurrentBid + BidIncrement;
        public List<decimal> QuickBidAmounts { get; set; } = new();

        public AuctionSellerViewModel Seller { get; set; } = new();
        public List<SimilarAuctionViewModel> SimilarAuctions { get; set; } = new();

        public string AnimalId { get; set; } = "";
    }
}
