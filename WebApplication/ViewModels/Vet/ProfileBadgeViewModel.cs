namespace WebApp.ViewModels.Vet
{
    public class ProfileBadgeViewModel
    {
        public string Icon { get; set; } = "";
        public string Text { get; set; } = "";
        // "verified" | "starting" | "spec" -> maps to badge-verified / badge-starting / badge-spec
        public string Style { get; set; } = "spec";
        public bool HasPulseDot { get; set; }
    }
}
