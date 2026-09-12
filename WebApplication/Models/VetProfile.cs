using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApp.Services;

namespace WebApp.Models
{
    public enum AppointmentStatus
    {
        Pending,
        Accepted,
        Declined,
        Completed,
        Cancelled
    }

    [Index(nameof(UserId), IsUnique = true)]
    public class VetProfile
    {
        public string Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;

        [MaxLength(100)]
        public string Specialty { get; set; } = string.Empty; // e.g. Equine, Poultry, Livestock

        [MaxLength(1000)]
        public string? Bio { get; set; }

        [MaxLength(150)]
        public string? ClinicLocation { get; set; }

        public int YearsOfExperience { get; set; }

        public bool IsVerified { get; set; } = false; // separate from ApplicationUser.IsVerified for license checks
        public string? LicenseDocumentUrl { get; set; }

        public double Rating { get; set; } = 0;
        public int ReviewCount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal ConsultationFee { get; set; }

        [MaxLength(30)]
        public string AvailabilityStatus { get; set; } = "available";

        [MaxLength(20)]
        public string AvailabilityWindow { get; set; } = "week"; // "now" | "today" | "week" — for filter UI, distinct from AvailabilityStatus

        [MaxLength(100)]
        public string? AvailabilityText { get; set; }

        public bool IsFeatured { get; set; } = false;

        [MaxLength(30)]
        public string? Credential { get; set; } // e.g. "D.V.M."

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? VerifiedAt { get; set; }
        public string? VerifiedByAdminId { get; set; }
        [ForeignKey(nameof(VerifiedByAdminId))]
        public ApplicationUser? VerifiedByAdmin { get; set; }

        public ICollection<VetReview> Reviews { get; set; } = new List<VetReview>();
        public ICollection<VeterinaryService> Services { get; set; } = new List<VeterinaryService>();
        public ICollection<VetTimelineEvent> TimelineEvents { get; set; } = new List<VetTimelineEvent>();
        public ICollection<VetScheduleSlot> WeeklySchedule { get; set; } = new List<VetScheduleSlot>();

        // Navigation
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }

    public class Appointment
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string ClientId { get; set; } = string.Empty;

        [ForeignKey(nameof(ClientId))]
        public ApplicationUser Client { get; set; } = null!;

        public string VetProfileId { get; set; }

        [ForeignKey(nameof(VetProfileId))]
        public VetProfile VetProfile { get; set; } = null!;

        public DateTime RequestedDate { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; } // e.g. symptoms, reason for visit

        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
