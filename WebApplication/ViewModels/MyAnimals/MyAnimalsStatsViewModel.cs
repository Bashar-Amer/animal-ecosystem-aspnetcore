namespace WebApp.ViewModels.MyAnimals
{
    public class MyAnimalsStatsViewModel
    {
        public int TotalActiveListings { get; set; }
        public int MarketplaceCount { get; set; }
        public int AuctionCount { get; set; }
        public decimal ActiveCatalogValue { get; set; }
        public int PendingReviewCount { get; set; }
        public int CompletedCount { get; set; }
    }
}
