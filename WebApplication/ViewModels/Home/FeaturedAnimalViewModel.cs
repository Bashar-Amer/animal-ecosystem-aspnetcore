namespace WebApp.ViewModels.Home
{
    public class FeaturedAnimalViewModel
    {
        public int Id { get; set; }
        // "sheep" | "cattle" | "horse" | "goat" -- must match the home filter-tab data-category values
        public string Category { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public string BadgeText { get; set; } = "";
        public string LocationBadge { get; set; } = "";
        public string VerificationText { get; set; } = "";
        public string Title { get; set; } = "";
        public string MetaLine { get; set; } = "";
        public string PriceLabel { get; set; } = "Asking Price";
        public decimal Price { get; set; }
    }
}
