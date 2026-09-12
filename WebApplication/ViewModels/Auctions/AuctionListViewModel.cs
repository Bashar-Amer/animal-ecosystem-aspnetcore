using WebApp.Models;
using WebApp.ViewModels.Animals;

namespace WebApp.ViewModels.Auctions
{
    public class AuctionListViewModel
    {
        public string Id { get; set; } = "";
        public string LotNumber { get; set; } = "";
        public string Title { get; set; } = "";
        public string ImageUrl { get; set; } = "";

        // "live" | "ending-soon" | "upcoming" | "ended"
        public string Status { get; set; } = "live";

        // "horse" | "cattle" | "sheep" | "goat" | "camel"
        public string Category { get; set; } = "";

        public decimal Price { get; set; }
        public int BidCount { get; set; }
        public bool IsVerified { get; set; }

        public string DetailsLine { get; set; } = "";   // "Arabian Horse • 5 Years • Stallion"
        public string Location { get; set; } = "";
        public List<string> SpecPills { get; set; } = new();

        public DateTime? CountdownTarget { get; set; }  // null for static "Starts in 2h 15m" style
        public string? CountdownStaticText { get; set; }

        public bool IsUpcoming => Status == "upcoming";
        public string BidLabel => IsUpcoming ? "Starting Bid" : "Current Bid";
        public string TimerLabel => IsUpcoming ? "Starts in" : "Ends in";

        public string ActionText => Status switch
        {
            "ending-soon" => "Bid Now",
            "upcoming" => "Notify Me",
            _ => "Place Bid"
        };

        public string ActionCssClass => Status switch
        {
            "ending-soon" => "btn btn-urgent btn-block",
            "upcoming" => "btn btn-secondary btn-block",
            _ => "btn btn-primary btn-block"
        };

        public string AnimalId { get; set; } = "";
    }
}
