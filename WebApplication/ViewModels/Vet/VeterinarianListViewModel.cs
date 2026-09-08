namespace WebApp.ViewModels.Vet
{
    public class VeterinarianListViewModel
    {
        public string Slug { get; set; } = "";
        public string Name { get; set; } = "";
        public string AvatarInitials { get; set; } = "";
        // "" (default/tertiary) | "secondary" | "neutral" | "fixed" | "tertiary"
        public string AvatarVariant { get; set; } = "";
        public string SpecialtyLabel { get; set; } = "";

        // space-joined into data-specialty / data-breed for the existing filter JS
        public List<string> SpecialtyFilterValues { get; set; } = new();
        public string RegionFilterValue { get; set; } = "";
        // "now" | "today" | "week"
        public string AvailabilityFilterValue { get; set; } = "";
        public List<string> SpeciesFilterValues { get; set; } = new();

        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public int ExperienceYears { get; set; }

        public string LicenseIcon { get; set; } = "";
        public string LicenseText { get; set; } = "";
        public bool IsLicenseHighlight { get; set; }

        // "available" | "today" | "scheduled"
        public string AvailabilityBadgeVariant { get; set; } = "available";
        public string AvailabilityBadgeText { get; set; } = "";
        public string? AvailabilityBadgeIcon { get; set; }  // null when the badge just shows a pulsing dot

        public List<VetMetaItemViewModel> MetaLines { get; set; } = new();
        public List<string> SpecPills { get; set; } = new();
        public decimal ConsultationPriceFrom { get; set; }

        public string SpecialtyFilterAttr => string.Join(" ", SpecialtyFilterValues);
        public string SpeciesFilterAttr => string.Join(" ", SpeciesFilterValues);
    }
}
