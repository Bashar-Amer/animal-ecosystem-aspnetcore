namespace WebApp.ViewModels.Vet
{
    public class RatingBarViewModel
    {
        public int Stars { get; set; }
        public int Count { get; set; }
        public int Percent { get; set; }
        // "" (primary/secondary color) | "secondary" | "muted"
        public string FillVariant { get; set; } = "";
    }
}
