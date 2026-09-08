using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApp.ViewModels.Vet;

namespace WebApp.Controllers
{
    public class VetController : Controller
    {
        // GET: VetController
        public ActionResult Index()
        {
            // TODO: replace with a real query once the vet directory service/repo exists
            var vm = new VeterinariansIndexViewModel
            {
                Veterinarians = new()
            {
                new VeterinarianListViewModel
                {
                    Slug = "ahmed-ali", Name = "Dr. Ahmed Ali", AvatarInitials = "AA",
                    SpecialtyLabel = "Large Animal & Herd Health",
                    SpecialtyFilterValues = new() { "large-animal", "livestock" },
                    RegionFilterValue = "central", AvailabilityFilterValue = "now",
                    SpeciesFilterValues = new() { "cattle", "sheep-goat", "camel" },
                    Rating = 4.9, ReviewCount = 48, ExperienceYears = 10,
                    LicenseIcon = "badge", LicenseText = "#VET-412",
                    AvailabilityBadgeVariant = "available", AvailabilityBadgeText = "Available Now",
                    MetaLines = new()
                    {
                        new() { Icon = "location_on", Text = "On-site & Clinic" },
                        new() { Icon = "work_history", Text = "10+ years experience" },
                        new() { Icon = "verified_user", Text = "Licensed Veterinary Surgeon" }
                    },
                    SpecPills = new() { "Cattle", "Sheep & Goats", "Camels" },
                    ConsultationPriceFrom = 30
                },
                new VeterinarianListViewModel
                {
                    Slug = "sarah-mahmoud", Name = "Dr. Sarah Mahmoud", AvatarInitials = "SM", AvatarVariant = "secondary",
                    SpecialtyLabel = "Equine Specialist & Surgeon",
                    SpecialtyFilterValues = new() { "equine" },
                    RegionFilterValue = "central", AvailabilityFilterValue = "today",
                    SpeciesFilterValues = new() { "horse" },
                    Rating = 5.0, ReviewCount = 62, ExperienceYears = 8,
                    LicenseIcon = "military_tech", LicenseText = "Equine Consultant", IsLicenseHighlight = true,
                    AvailabilityBadgeVariant = "today", AvailabilityBadgeText = "Available Today",
                    MetaLines = new()
                    {
                        new() { Icon = "location_on", Text = "Stable & Clinic Visits" },
                        new() { Icon = "work_history", Text = "8 years specialized equine" },
                        new() { Icon = "verified_user", Text = "FEI Certified Delegate" }
                    },
                    SpecPills = new() { "Horses", "Purebred", "Sport Horses" },
                    ConsultationPriceFrom = 35
                },
                new VeterinarianListViewModel
                {
                    Slug = "omar-hassan", Name = "Dr. Omar Hassan", AvatarInitials = "OH", AvatarVariant = "neutral",
                    SpecialtyLabel = "Livestock Health & Epidemiology",
                    SpecialtyFilterValues = new() { "livestock", "large-animal" },
                    RegionFilterValue = "north", AvailabilityFilterValue = "week",
                    SpeciesFilterValues = new() { "cattle", "sheep-goat" },
                    Rating = 4.8, ReviewCount = 35, ExperienceYears = 15,
                    LicenseIcon = "vaccines", LicenseText = "Vaccination Lead",
                    AvailabilityBadgeVariant = "scheduled", AvailabilityBadgeIcon = "event", AvailabilityBadgeText = "Tomorrow 9AM",
                    MetaLines = new()
                    {
                        new() { Icon = "location_on", Text = "Northern Region" },
                        new() { Icon = "work_history", Text = "15 years field practice" },
                        new() { Icon = "verified_user", Text = "Regional Supervisor" }
                    },
                    SpecPills = new() { "Cattle", "Sheep", "Dairy Herds" },
                    ConsultationPriceFrom = 30
                },
                new VeterinarianListViewModel
                {
                    Slug = "layla-nasser", Name = "Dr. Layla Nasser", AvatarInitials = "LN", AvatarVariant = "fixed",
                    SpecialtyLabel = "Equine & Camel Specialist",
                    SpecialtyFilterValues = new() { "equine", "large-animal" },
                    RegionFilterValue = "east", AvailabilityFilterValue = "today",
                    SpeciesFilterValues = new() { "horse", "camel" },
                    Rating = 4.9, ReviewCount = 53, ExperienceYears = 7,
                    LicenseIcon = "explore", LicenseText = "Field Unit",
                    AvailabilityBadgeVariant = "today", AvailabilityBadgeText = "Available Today",
                    MetaLines = new()
                    {
                        new() { Icon = "location_on", Text = "Eastern & Field Operations" },
                        new() { Icon = "work_history", Text = "7 years arid zone" },
                        new() { Icon = "verified_user", Text = "Desert Service Registry" }
                    },
                    SpecPills = new() { "Horses", "Camels", "Endurance Breeds" },
                    ConsultationPriceFrom = 50
                },
                new VeterinarianListViewModel
                {
                    Slug = "faris-khalil", Name = "Dr. Faris Khalil", AvatarInitials = "FK", AvatarVariant = "neutral",
                    SpecialtyLabel = "Poultry Health & Broilers",
                    SpecialtyFilterValues = new() { "poultry" },
                    RegionFilterValue = "north", AvailabilityFilterValue = "week",
                    SpeciesFilterValues = new() { "poultry" },
                    Rating = 4.7, ReviewCount = 29, ExperienceYears = 5,
                    LicenseIcon = "sanitizer", LicenseText = "Biosecurity Consultant",
                    AvailabilityBadgeVariant = "scheduled", AvailabilityBadgeIcon = "calendar_today", AvailabilityBadgeText = "Book for Thursday",
                    MetaLines = new()
                    {
                        new() { Icon = "location_on", Text = "Northern Farms" },
                        new() { Icon = "work_history", Text = "5 years intensive consulting" },
                        new() { Icon = "verified_user", Text = "Avian Certification" }
                    },
                    SpecPills = new() { "Poultry", "Game Birds", "Layers" },
                    ConsultationPriceFrom = 20
                },
                new VeterinarianListViewModel
                {
                    Slug = "rima-barakat", Name = "Dr. Rima Barakat", AvatarInitials = "RB", AvatarVariant = "tertiary",
                    SpecialtyLabel = "Small & Mixed Rural Practice",
                    SpecialtyFilterValues = new() { "mixed", "livestock" },
                    RegionFilterValue = "south", AvailabilityFilterValue = "now",
                    SpeciesFilterValues = new() { "cattle", "sheep-goat" },
                    Rating = 4.9, ReviewCount = 41, ExperienceYears = 12,
                    LicenseIcon = "apartment", LicenseText = "Surgical Lead",
                    AvailabilityBadgeVariant = "available", AvailabilityBadgeText = "Available Now",
                    MetaLines = new()
                    {
                        new() { Icon = "location_on", Text = "Southern Region" },
                        new() { Icon = "work_history", Text = "12 years clinical practice" },
                        new() { Icon = "verified_user", Text = "Diagnostics & Surgery" }
                    },
                    SpecPills = new() { "Sheep", "Goats", "Cattle", "Guard Dogs" },
                    ConsultationPriceFrom = 25
                }
            }
            };

            return View(vm);
        }

        // GET: VetController/Details/5
        public ActionResult Profile(string id)
        {
            // TODO: replace with a real lookup by slug once the vet directory service/repo exists
            var vm = new VeterinarianProfileViewModel
            {
                Slug = id,
                Name = "Dr. Ahmed Ali",
                AvatarInitials = "AA",
                CredentialBadge = "D.V.M.",
                Badges = new()
        {
            new() { Icon = "verified_user", Text = "Verified Veterinarian", Style = "verified" },
            new() { Icon = "", Text = "Available for Booking", Style = "starting", HasPulseDot = true },
            new() { Icon = "military_tech", Text = "Top Rated 2025", Style = "spec" }
        },
                SpecialtyLabel = "Large Animal & Herd Health Specialist",
                LocationNote = "On-site farm visits available",
                ExperienceLabel = "10+ Years Experience",
                Rating = 4.9,
                ReviewCount = 48,
                SpeciesTreated = new() { "Cattle", "Sheep", "Goats", "Camels", "Horses" },
                AboutParagraphs = new()
        {
            "Dr. Ahmed Ali is a veterinary clinician and herd health consultant specializing in large ruminants, epidemiology, and production livestock wellbeing.",
            "Over the past decade, he has led biosecurity programs, herd vaccination campaigns, and reproductive optimization protocols for dairy herds, sheep genetics, and working camels. His practice combines clinical diagnostics with practical farm management to improve productivity while maintaining high animal welfare standards."
        },
                Stats = new()
        {
            new() { Label = "Field Visits", Value = "1,400+", SubLabel = "Farms visited" },
            new() { Label = "Herd Size Covered", Value = "45,000+", SubLabel = "Heads examined" },
            new() { Label = "Accuracy Rate", Value = "99.4%", SubLabel = "Soundness inspections" },
            new() { Label = "License", Value = "#884-A", SubLabel = "Active Class-A" }
        },
                Services = new()
        {
            new() { Icon = "health_and_safety", Title = "Herd Examination & Farm Visits",
                Description = "Comprehensive on-site physical evaluations, biometric monitoring, and pathology screenings.",
                FooterText = "Base Rate: $30" },
            new() { Icon = "syringe", IconVariant = "secondary", Title = "Vaccination & Immunity Schedules",
                Description = "Custom vaccination schedules with official health record logging.",
                FooterText = "Preventative Care" },
            new() { Icon = "science", Title = "Reproductive & AI Consultation",
                Description = "Ultrasound pregnancy checks, artificial insemination, and breeding synchronization.",
                FooterText = "Genetics & Fertility" },
            new() { Icon = "emergency", IconVariant = "error", Title = "Emergency Trauma & Colic Care",
                Description = "Rapid triage for acute conditions, wound trauma, and obstetrical emergencies.",
                FooterText = "24/7 On-Call Triage", IsUrgent = true },
            new() { Icon = "fact_check", IconVariant = "tertiary", Title = "Pre-Purchase Soundness Inspections",
                Description = "Independent vetting with detailed health certificates and lab profiling.",
                FooterText = "Official Health Dossier" },
            new() { Icon = "grass", IconVariant = "secondary", Title = "Nutritional Counseling",
                Description = "Dietary analysis and feed optimization for dairy, sheep, and camels.",
                FooterText = "Yield Optimization" }
        },
                Timeline = new()
        {
            new() { DotVariant = "primary", DateRangeLabel = "2021 — Present",
                Title = "Certified Livestock Biosecurity & Herd Health Auditor",
                Description = "Accredited inspector for commercial breeding herds and quarantine protocols." },
            new() { DotVariant = "secondary", DateRangeLabel = "2015",
                Title = "Board Specialist in Large Animal Internal Medicine",
                Description = "Advanced certification in ruminant metabolic diseases and herd prophylaxis." },
            new() { DotVariant = "tertiary", DateRangeLabel = "2012",
                Title = "Doctor of Veterinary Medicine (D.V.M.)",
                Description = "Faculty of Veterinary Medicine — Graduated with honors in Large Animal Surgery." }
        },
                RatingBreakdown = new()
        {
            new() { Stars = 5, Count = 44, Percent = 92 },
            new() { Stars = 4, Count = 4, Percent = 8, FillVariant = "secondary" },
            new() { Stars = 3, Count = 0, Percent = 0, FillVariant = "muted" }
        },
                Reviews = new()
        {
            new() { ReviewerInitials = "KR", ReviewerName = "Khalid R.", ReviewerRole = "Pastoral Farm Owner",
                DateLabel = "March 2025",
                Text = "Thorough health checks for our breeding flock and cattle. Fast response, thorough examination, and precise diagnosis. We rely exclusively on him for reproductive ultrasound." },
            new() { ReviewerInitials = "LS", ReviewerName = "Lina S.", ReviewerRole = "Dairy Facility Manager", AvatarVariant = "secondary",
                DateLabel = "Jan 2025",
                Text = "Highly responsive for emergency care during difficult calving. Established our vaccination calendar which lowered calf mortality to zero. Exceptional with large ruminants." },
            new() { ReviewerInitials = "TA", ReviewerName = "Tariq H.", ReviewerRole = "Livestock Trading Co.", AvatarVariant = "primary",
                DateLabel = "Dec 2024",
                Text = "His pre-purchase inspection saved us from buying sick livestock with dormant infections. Complete transparency and officially stamped documentation." }
        },
                ConsultationPriceFrom = 30,
                WeeklySchedule = new()
        {
            new() { Day = "Saturday", TimeLabel = "8:00 AM – 5:00 PM", Status = "available" },
            new() { Day = "Sunday", TimeLabel = "8:00 AM – 5:00 PM", Status = "available" },
            new() { Day = "Monday", TimeLabel = "8:00 AM – 4:00 PM", Status = "available" },
            new() { Day = "Tuesday", TimeLabel = "8:00 AM – 5:00 PM", Status = "available" },
            new() { Day = "Wednesday", TimeLabel = "Field Operations", Status = "limited", Icon = "block" },
            new() { Day = "Thursday", TimeLabel = "Emergency Only", Status = "emergency", Icon = "bolt" },
            new() { Day = "Friday", TimeLabel = "Rest Day", Status = "off", Icon = "hotel" }
        },
                PracticeLocationName = "Central Vet Complex",
                PracticeAddress = "Building 42, Veterinary District",
                ResponseTimeText = "under 1 hour",
                LanguagesText = "English & Arabic"
            };

            return View(vm);
        }

        // GET: VetController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: VetController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: VetController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: VetController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: VetController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: VetController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
