namespace WebApp.ViewModels.Home
{
    public class HeroShowcaseViewModel
    {
        public string LotNumber { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public string ImageCaption { get; set; } = "";
        public string Title { get; set; } = "";
        public string Location { get; set; } = "";
        public decimal CurrentBid { get; set; }
        public DateTime CountdownTarget { get; set; }
    }
}
