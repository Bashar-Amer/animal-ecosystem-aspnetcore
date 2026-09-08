namespace WebApp.ViewModels.Vet
{
    public class ReviewViewModel
    {
        public string ReviewerInitials { get; set; } = "";
        public string ReviewerName { get; set; } = "";
        public string ReviewerRole { get; set; } = "";
        // "" | "secondary" | "primary"
        public string AvatarVariant { get; set; } = "";
        public string DateLabel { get; set; } = "";
        public int StarCount { get; set; } = 5;
        public string Text { get; set; } = "";
    }
}
