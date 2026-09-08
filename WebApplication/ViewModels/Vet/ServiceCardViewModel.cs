namespace WebApp.ViewModels.Vet
{
    public class ServiceCardViewModel
    {
        public string Icon { get; set; } = "";
        // "" | "secondary" | "error" | "tertiary"
        public string IconVariant { get; set; } = "";
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string FooterText { get; set; } = "";
        public bool IsUrgent { get; set; }
    }
}
