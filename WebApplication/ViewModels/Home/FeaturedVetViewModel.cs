namespace WebApp.ViewModels.Home
{
    public class FeaturedVetViewModel
    {
        public string Slug { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public string Name { get; set; } = "";
        public string Specialty { get; set; } = "";
        public string LocationLabel { get; set; } = "";
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public string ExperienceLabel { get; set; } = "";
        // "available" | "scheduled"
        public string AvailabilityStatus { get; set; } = "available";
        public string AvailabilityText { get; set; } = "";
        public decimal FeeFrom { get; set; }
    }
}
