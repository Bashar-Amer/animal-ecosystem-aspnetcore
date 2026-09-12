namespace WebApp.ViewModels.Admin
{
    public class AdminDashboardViewModel
    {
        public int TotalActiveListings { get; set; }
        public int NewListingsThisWeek { get; set; }
        public int PendingListingsCount { get; set; }
        public int PendingAuctionsCount { get; set; }

        public int LiveAuctionsCount { get; set; }
        public int LiveNowCount { get; set; }
        public int EndingSoonCount { get; set; }
        public int TotalActiveBids { get; set; }

        public int VerifiedVetsCount { get; set; }
        public int PendingVetsCount { get; set; }

        public List<PendingListingViewModel> PendingListings { get; set; } = new();
        public List<PendingAuctionViewModel> PendingAuctions { get; set; } = new();
        public List<LiveAuctionMonitorViewModel> LiveAuctions { get; set; } = new();
        public List<VetQueueItemViewModel> VetQueue { get; set; } = new();
    }
}
