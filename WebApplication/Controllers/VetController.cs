using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using WebApp.Data;
using WebApp.Helpers;
using WebApp.Models;
using WebApp.ViewModels.Vet;

namespace WebApp.Controllers
{
    public class VetController : Controller
    {
        private readonly ApplicationDbContext _dbContext;

        public VetController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private static readonly string[] AvatarVariants = { "", "secondary", "neutral", "fixed", "tertiary" };
        // GET: VetController
        public async Task<IActionResult> Index()
        {
            var vets = await _dbContext.VetProfiles
            .Include(v => v.User)
            .OrderByDescending(v => v.IsVerified)
            .ThenByDescending(v => v.Rating)
            .ToListAsync();

            var viewModel = new VeterinariansIndexViewModel
            {
                Veterinarians = vets.Select((v, index) => MapToListViewModel(v, index)).ToList()
            };

            return View(viewModel);
        }

        // GET: VetController/Details/5
        public async Task<IActionResult> Profile(string id)
        {
            // Slug isn't stored, so scan and regenerate to find the match.
            var allVets = await _dbContext.VetProfiles
                .Include(v => v.User)
                .ToListAsync();

            var matchedId = allVets.FirstOrDefault(v => DisplayHelpers.GenerateSlug(v.User.FullName) == id)?.Id;
            if (matchedId == null)
            {
                return NotFound();
            }

            var vet = await _dbContext.VetProfiles
                .Include(v => v.User)
                .Include(v => v.Services)
                .Include(v => v.TimelineEvents)
                .Include(v => v.WeeklySchedule)
                .Include(v => v.Reviews).ThenInclude(r => r.Reviewer)
                .FirstAsync(v => v.Id == matchedId);

            var reviews = vet.Reviews.OrderByDescending(r => r.CreatedAt).ToList();
            var reviewCount = reviews.Count;
            var averageRating = reviewCount == 0 ? 0 : reviews.Average(r => r.Rating);

            var completedAppointments = await _dbContext.Appointments
                .CountAsync(a => a.VetProfileId == vet.Id && a.Status == AppointmentStatus.Completed);

            var viewModel = new VeterinarianProfileViewModel
            {
                Slug = id,
                Name = vet.User.FullName,
                AvatarInitials = DisplayHelpers.GetInitials(vet.User.FullName),
                CredentialBadge = vet.Credential ?? "",
                Badges = BuildBadges(vet),

                SpecialtyLabel = vet.Specialty,
                LocationNote = vet.ClinicLocation ?? "",
                ExperienceLabel = $"{vet.YearsOfExperience}+ Years Experience",
                Rating = Math.Round(averageRating, 1),
                ReviewCount = reviewCount,

                SpeciesTreated = MapSpeciesFromSpecialty(vet.Specialty)
                    .Select(s => char.ToUpper(s[0]) + s.Substring(1))
                    .ToList(),

                AboutParagraphs = string.IsNullOrWhiteSpace(vet.Bio)
                    ? new List<string>()
                    : vet.Bio.Split("\n\n", StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList(),

                Stats = new List<StatBoxViewModel>
            {
                new() { Label = "Experience", Value = $"{vet.YearsOfExperience}+", SubLabel = "Years" },
                new() { Label = "Appointments", Value = completedAppointments.ToString(), SubLabel = "Completed" },
                new() { Label = "Rating", Value = averageRating.ToString("0.0"), SubLabel = $"{reviewCount} Reviews" }
            },

                Services = vet.Services.Select(s => new ServiceCardViewModel
                {
                    Icon = s.Icon ?? "medical_services",
                    IconVariant = s.IsUrgent ? "error" : "",
                    Title = s.Title,
                    Description = s.Description ?? "",
                    FooterText = s.Price.HasValue ? $"From ${s.Price:0}" : "Contact for pricing",
                    IsUrgent = s.IsUrgent
                }).ToList(),

                Timeline = vet.TimelineEvents
                    .OrderByDescending(t => t.StartDate)
                    .Select((t, i) => new TimelineItemViewModel
                    {
                        DotVariant = i == 0 ? "primary" : (i % 2 == 0 ? "secondary" : "tertiary"),
                        DateRangeLabel = FormatDateRange(t.StartDate, t.EndDate),
                        Title = t.Title,
                        Description = t.Description ?? ""
                    }).ToList(),

                RatingBreakdown = BuildRatingBreakdown(reviews),

                Reviews = reviews.Select((r, i) => new ReviewViewModel
                {
                    ReviewerInitials = DisplayHelpers.GetInitials(r.Reviewer.FullName),
                    ReviewerName = r.Reviewer.FullName,
                    ReviewerRole = "Verified Client",
                    AvatarVariant = i % 3 == 0 ? "" : (i % 3 == 1 ? "secondary" : "primary"),
                    DateLabel = r.CreatedAt.ToString("MMMM yyyy"),
                    StarCount = r.Rating,
                    Text = r.Text ?? ""
                }).ToList(),

                ConsultationPriceFrom = vet.ConsultationFee,
                WeeklySchedule = vet.WeeklySchedule.Select(s => new ScheduleRowViewModel
                {
                    Day = s.DayOfWeek,
                    TimeLabel = s.TimeLabel ?? "",
                    Status = s.Status,
                    Icon = s.Status switch
                    {
                        "limited" => "schedule",
                        "emergency" => "priority_high",
                        "off" => "block",
                        _ => null // "available"
                    }
                }).ToList(),

                PracticeLocationName = "",
                PracticeAddress = vet.ClinicLocation ?? "",
                ResponseTimeText = "",
                LanguagesText = ""
            };

            return View(viewModel);
        }

        private static VeterinarianListViewModel MapToListViewModel(VetProfile v, int index)
        {
            var isVerified = v.IsVerified;

            return new VeterinarianListViewModel
            {
                Slug = DisplayHelpers.GenerateSlug(v.User.FullName),
                Name = v.User.FullName,
                AvatarInitials = DisplayHelpers.GetInitials(v.User.FullName),
                AvatarVariant = AvatarVariants[index % AvatarVariants.Length],
                SpecialtyLabel = v.Specialty,

                SpecialtyFilterValues = new List<string> { v.Specialty.ToLowerInvariant().Replace(" ", "-") },
                RegionFilterValue = (v.ClinicLocation ?? "").ToLowerInvariant().Replace(" ", "-"),
                AvailabilityFilterValue = v.AvailabilityWindow,
                SpeciesFilterValues = MapSpeciesFromSpecialty(v.Specialty),

                Rating = v.Rating,
                ReviewCount = v.ReviewCount,
                ExperienceYears = v.YearsOfExperience,

                LicenseIcon = isVerified ? "verified" : "pending",
                LicenseText = isVerified ? "Licensed & Verified" : "License Pending Verification",
                IsLicenseHighlight = isVerified,

                AvailabilityBadgeVariant = MapAvailabilityBadgeVariant(v.AvailabilityStatus),
                AvailabilityBadgeText = string.IsNullOrWhiteSpace(v.AvailabilityText)
                    ? DefaultAvailabilityText(v.AvailabilityStatus)
                    : v.AvailabilityText,
                AvailabilityBadgeIcon = v.AvailabilityStatus == "available" ? null : "schedule",

                MetaLines = BuildMetaLines(v),
                SpecPills = BuildSpecPills(v),
                ConsultationPriceFrom = v.ConsultationFee
            };
        }

        private static string MapAvailabilityBadgeVariant(string status) => status switch
        {
            "available" => "available",
            "busy" => "today",
            _ => "scheduled" // "unavailable"
        };

        private static string DefaultAvailabilityText(string status) => status switch
        {
            "available" => "Available Now",
            "busy" => "Busy Today",
            _ => "By Appointment"
        };

        private static List<VetMetaItemViewModel> BuildMetaLines(VetProfile v)
        {
            var lines = new List<VetMetaItemViewModel>();
            if (!string.IsNullOrWhiteSpace(v.ClinicLocation))
                lines.Add(new VetMetaItemViewModel { Icon = "location_on", Text = v.ClinicLocation });
            lines.Add(new VetMetaItemViewModel { Icon = "work_history", Text = $"{v.YearsOfExperience} Years Experience" });
            return lines;
        }

        private static List<string> BuildSpecPills(VetProfile v)
        {
            var pills = new List<string> { v.Specialty };
            if (v.IsVerified) pills.Add("Licensed");
            if (v.YearsOfExperience >= 10) pills.Add("Senior Vet");
            return pills;
        }

        private static List<ProfileBadgeViewModel> BuildBadges(VetProfile v)
        {
            var badges = new List<ProfileBadgeViewModel>();
            if (v.IsVerified)
                badges.Add(new ProfileBadgeViewModel { Icon = "verified", Text = "Verified & Licensed", Style = "verified" });
            if (v.AvailabilityStatus == "available")
                badges.Add(new ProfileBadgeViewModel { Icon = "circle", Text = "Available Now", Style = "starting", HasPulseDot = true });
            badges.Add(new ProfileBadgeViewModel { Icon = "pets", Text = v.Specialty, Style = "spec" });
            return badges;
        }

        private static List<RatingBarViewModel> BuildRatingBreakdown(List<VetReview> reviews)
        {
            var total = reviews.Count;
            var result = new List<RatingBarViewModel>();
            for (int stars = 5; stars >= 1; stars--)
            {
                var count = reviews.Count(r => r.Rating == stars);
                var percent = total == 0 ? 0 : (int)Math.Round(count * 100.0 / total);
                result.Add(new RatingBarViewModel
                {
                    Stars = stars,
                    Count = count,
                    Percent = percent,
                    FillVariant = stars >= 4 ? "" : stars == 3 ? "secondary" : "muted"
                });
            }
            return result;
        }

        private static string FormatDateRange(DateTime start, DateTime? end) =>
            $"{start:yyyy} - {(end.HasValue ? end.Value.ToString("yyyy") : "Present")}";

        private static List<string> MapSpeciesFromSpecialty(string specialty)
        {
            var s = specialty.ToLowerInvariant();
            return s switch
            {
                var x when x.Contains("equine") => new List<string> { "horse" },
                var x when x.Contains("poultry") => new List<string> { "poultry" },
                var x when x.Contains("livestock") => new List<string> { "cattle", "sheep", "goat" },
                var x when x.Contains("large animal") => new List<string> { "cattle", "horse", "camel" },
                var x when x.Contains("small animal") => new List<string>(),
                _ => new List<string>()
            };
        }
    }
}
