namespace WebApp.ViewModels.Home
{
    public class FeaturedAnimalViewModel
    {
        public string Id { get; set; }
        public string Species { get; set; } = "";
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
