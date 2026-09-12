namespace WebApp.ViewModels.Admin
{
    public class PendingListingViewModel
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public string SpeciesName { get; set; } = "";
        public string? Breed { get; set; }
        public int? AgeInMonths { get; set; }
        public decimal Price { get; set; }
        public string SellerName { get; set; } = "";
        public string? Location { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
