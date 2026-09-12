namespace WebApp.ViewModels.Admin
{
    public class PendingAuctionViewModel
    {
        public string Id { get; set; } = "";
        public string LotNumber { get; set; } = "";
        public string Title { get; set; } = "";
        public string AnimalName { get; set; } = "";
        public string? ImageUrl { get; set; }
        public string SellerName { get; set; } = "";
        public decimal StartingPrice { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}
