namespace WebApp.ViewModels.Auctions
{
    public class AuctionMediaItemViewModel
    {
        // "image" | "video" | "doc"
        public string Type { get; set; } = "image";
        public string? ImageUrl { get; set; }
        public string? Label { get; set; }          // for video/doc placeholders
        public string? Icon { get; set; }            // material symbol name for video/doc
        public bool IsActive { get; set; }
    }
}
