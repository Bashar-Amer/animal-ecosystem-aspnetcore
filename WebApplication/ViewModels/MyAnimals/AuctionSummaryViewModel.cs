namespace WebApp.ViewModels.MyAnimals
{
    public class AuctionSummaryViewModel
    {
        public string AuctionId { get; set; } = "";
        public string LotNumber { get; set; } = "";
        public decimal CurrentPrice { get; set; }
        public int BidCount { get; set; }
        public string? TopBidderName { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; } = ""; // "live" | "ending-soon" | "upcoming"
        public string ModerationStatus { get; set; } = "";
        public string? RejectionReason { get; set; }
    }
}
