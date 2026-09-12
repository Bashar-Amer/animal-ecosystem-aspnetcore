namespace WebApp.ViewModels.MyAnimals
{
    public class MyAnimalListViewModel
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public string SpeciesName { get; set; } = "";
        public string? Breed { get; set; }
        public int? AgeInMonths { get; set; }
        public string? Gender { get; set; }
        public decimal Price { get; set; }
        public string ModerationStatus { get; set; } = "";
        public string Status { get; set; } = "";
        public string? RejectionReason { get; set; }

        public bool CanEdit { get; set; }
        public bool CanWithdraw { get; set; }
        public bool CanCreateAuction { get; set; }

        public AuctionSummaryViewModel? Auction { get; set; } // null unless this animal is in an active auction
    }
}
