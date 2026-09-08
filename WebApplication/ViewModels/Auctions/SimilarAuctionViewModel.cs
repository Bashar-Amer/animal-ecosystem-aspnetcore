namespace WebApp.ViewModels.Auctions
{
    public class SimilarAuctionViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public string FarmName { get; set; } = "";
        public int BidCount { get; set; }
        public string EndsLabel { get; set; } = "";   // "Ends in 2h", "Ends Tomorrow"
        public decimal CurrentBid { get; set; }
    }
}
