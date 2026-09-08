namespace WebApp.ViewModels.Vet
{
    public class TimelineItemViewModel
    {
        // "primary" | "secondary" | "tertiary"
        public string DotVariant { get; set; } = "primary";
        public string DateRangeLabel { get; set; } = "";
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
    }
}
