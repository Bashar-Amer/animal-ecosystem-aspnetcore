namespace WebApp.ViewModels.Vet
{
    public class VeterinarianProfileViewModel
    {
        public string Slug { get; set; } = "";
        public string Name { get; set; } = "";
        public string? PhoneNumber { get; set; }
        public string AvatarInitials { get; set; } = "";
        public string CredentialBadge { get; set; } = "";   // "D.V.M."
        public List<ProfileBadgeViewModel> Badges { get; set; } = new();

        public string SpecialtyLabel { get; set; } = "";
        public string LocationNote { get; set; } = "";
        public string ExperienceLabel { get; set; } = "";
        public double Rating { get; set; }
        public int ReviewCount { get; set; }

        public List<string> SpeciesTreated { get; set; } = new();

        public List<string> AboutParagraphs { get; set; } = new();
        public List<StatBoxViewModel> Stats { get; set; } = new();

        public List<ServiceCardViewModel> Services { get; set; } = new();
        public List<TimelineItemViewModel> Timeline { get; set; } = new();

        public List<RatingBarViewModel> RatingBreakdown { get; set; } = new();
        public List<ReviewViewModel> Reviews { get; set; } = new();

        public decimal ConsultationPriceFrom { get; set; }
        public List<ScheduleRowViewModel> WeeklySchedule { get; set; } = new();

        public string PracticeLocationName { get; set; } = "";
        public string PracticeAddress { get; set; } = "";
        public string ResponseTimeText { get; set; } = "";
        public string LanguagesText { get; set; } = "";
    }
}
