namespace WebApp.ViewModels.Vet
{
    public class ScheduleRowViewModel
    {
        public string Day { get; set; } = "";
        public string TimeLabel { get; set; } = "";
        // "available" | "limited" | "emergency" | "off"
        public string Status { get; set; } = "available";
        public string? Icon { get; set; }  // null -> render the small dot instead (available rows)
    }
}
