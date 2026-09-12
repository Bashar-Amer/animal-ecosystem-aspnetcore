namespace WebApp.ViewModels.Admin
{
    public class VetQueueItemViewModel
    {
        public string VetProfileId { get; set; } = "";
        public string Name { get; set; } = "";
        public string Initials { get; set; } = "";
        public string Specialty { get; set; } = "";
        public string? Location { get; set; }
        public bool IsVerified { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}
