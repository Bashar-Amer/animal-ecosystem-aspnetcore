using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

    // Extended profile data, only created for users with the "Veterinarian" role.
    // [Index] with IsUnique enforces the one-to-one relationship with ApplicationUser.
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
