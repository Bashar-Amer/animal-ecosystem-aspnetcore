using WebApp.Models;
using WebApp.ViewModels.Animals;

namespace WebApp.ViewModels.Auctions
{
    public class AuctionListViewModel
    {
        public required string Id { get; set; }
        public int LotNumber { get; set; }
        public string Title { get; set; } = "";
        //public string ImageUrl { get; set; } = "";

        public AuctionStatus Status { get; set; } = AuctionStatus.Live;

        //public string Category { get; set; } = "";

        //public decimal Price { get; set; }

        public int BidCount { get; set; }
        //public bool IsVerified { get; set; }

        //public string DetailsLine { get; set; } = "";
        //public string Location { get; set; } = "";

        public required AnimalListViewModel Animal { get; set; }
        //public List<string> SpecPills { get; set; } = new();

        public DateTime? CountdownTarget { get; set; }
        public string? CountdownStaticText { get; set; } = "Ended";

        public bool IsUpcoming => Status == AuctionStatus.Upcoming;
        public string BidLabel => IsUpcoming ? "Starting Bid" : "Current Bid";
        public string TimerLabel => IsUpcoming ? "Starts in" : "Ends in";

        public string ActionText => Status switch
        {
            AuctionStatus.Live => "Bid Now",
            AuctionStatus.Upcoming => "Notify Me",
            _ => "Place Bid"
        };

        public string ActionCssClass => Status switch
        {
            AuctionStatus.Live => "btn btn-urgent btn-block",
            AuctionStatus.Upcoming => "btn btn-secondary btn-block",
            _ => "btn btn-primary btn-block"
        };
    }
}
