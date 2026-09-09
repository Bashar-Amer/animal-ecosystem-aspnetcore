using WebApp.ViewModels.Auctions;

namespace WebApp.ViewModels.Animals
{
    public class AnimalDetailViewModel
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string? Breed { get; set; }
        public string? Gender { get; set; }
        public int? AgeInMonths { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? Location { get; set; }
        public string Status { get; set; } = "";
        public bool IsVerified { get; set; }
        public bool IsVetChecked { get; set; }
        public DateTime CreatedAt { get; set; }
        public string SpeciesName { get; set; } = "";
        public List<string> ImageUrls { get; set; } = new();
        public List<string> BreederNotes { get; set; } = new();
        public List<AuctionHealthItemViewModel> HealthRecords { get; set; } = new(); // reusing the record shape from AuctionDetailsViewModel
    }
}
