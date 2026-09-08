namespace WebApp.ViewModels.Home
{
    public class HomeIndexViewModel
    {
        public HeroShowcaseViewModel HeroShowcase { get; set; } = new();
        public List<TrustStatViewModel> TrustStats { get; set; } = new();
        public List<FeaturedAnimalViewModel> FeaturedAnimals { get; set; } = new();
        public List<HomeAuctionCardViewModel> LiveAuctions { get; set; } = new();
        public List<FeaturedVetViewModel> FeaturedVets { get; set; } = new();
    }
}
