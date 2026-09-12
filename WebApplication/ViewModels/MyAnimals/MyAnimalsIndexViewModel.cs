namespace WebApp.ViewModels.MyAnimals
{
    public class MyAnimalsIndexViewModel
    {
        public MyAnimalsStatsViewModel Stats { get; set; } = new();
        public List<MyAnimalListViewModel> Animals { get; set; } = new();
        public string ActiveTab { get; set; } = "all";
        public string? SearchQuery { get; set; }
        public string SortBy { get; set; } = "newest";
    }
}
