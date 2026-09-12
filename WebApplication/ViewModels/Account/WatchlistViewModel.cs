namespace WebApp.ViewModels.Account
{
    public class WatchlistViewModel
    {
        public List<WatchlistItemViewModel> Items { get; set; } = new();
        public string? SearchQuery { get; set; }
        public string ActiveFilter { get; set; } = "all";
    }
}
