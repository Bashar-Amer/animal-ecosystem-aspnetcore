namespace WebApp.ViewModels.Admin
{
    public class LiveAuctionMonitorViewModel
    {
        public string Id { get; set; } = "";
        public string LotNumber { get; set; } = "";
        public string Title { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public string? Location { get; set; }
        public decimal CurrentPrice { get; set; }
        public int BidCount { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; } = "";
    }
}
