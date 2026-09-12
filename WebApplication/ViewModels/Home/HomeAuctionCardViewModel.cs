namespace WebApp.ViewModels.Home
{
    public class HomeAuctionCardViewModel
    {
        public string Id { get; set; }
        public string LotNumber { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        // "live" | "ending-soon"
        public string Status { get; set; } = "live";
        public decimal CurrentBid { get; set; }
        public DateTime CountdownTarget { get; set; }

        public string ActionText => Status == "ending-soon" ? "Bid Now" : "Place Bid";
        public string ActionCssClass => Status == "ending-soon" ? "btn btn-urgent btn-block" : "btn btn-primary btn-block";
    }
}
