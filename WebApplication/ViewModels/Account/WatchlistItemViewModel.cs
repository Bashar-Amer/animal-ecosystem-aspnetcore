namespace WebApp.ViewModels.Account
{
    public class WatchlistItemViewModel
    {
        public string AnimalId { get; set; } = "";
        public string Name { get; set; } = "";
        public string SpeciesName { get; set; } = "";
        public string? Breed { get; set; }
        public string? Location { get; set; }
        public string ImageUrl { get; set; } = "/images/placeholder-animal.jpg";
        public decimal Price { get; set; }
        public bool IsAuction { get; set; }
        public string? AuctionId { get; set; }
        public string? LotNumber { get; set; }
        public decimal? CurrentBid { get; set; }
        public int BidCount { get; set; }
        public string AuctionStatus { get; set; } = "";
        public DateTime? AuctionEndTime { get; set; }
        public bool IsVisible { get; set; }
    }
}
