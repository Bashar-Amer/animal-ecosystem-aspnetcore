namespace WebApp.ViewModels.Auctions
{
    public class AuctionSellerViewModel
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Initials { get; set; } = "";
        public string Tier { get; set; } = "";
        public double Rating { get; set; }
        public int CompletedAuctions { get; set; }
        public string Location { get; set; } = "";
        public int MemberSinceYear { get; set; }
        public string ResponseTimeText { get; set; } = "";
        public int ActiveListingsCount { get; set; }
    }
}
