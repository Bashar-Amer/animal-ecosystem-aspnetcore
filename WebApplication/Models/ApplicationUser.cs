using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;

namespace WebApp.Models
{
    // Extends ASP.NET Identity's default user with platform-specific fields.
    // Roles ("Regular User", "Veterinarian", "Admin") are handled via Identity's
    // built-in Role system (AspNetRoles / UserManager.AddToRoleAsync), not a column here.
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public string? Location { get; set; } // City/Governorate in Jordan

        // Trust System
        public bool IsVerified { get; set; } = false;
        public string? VerificationDocumentUrl { get; set; } // uploaded ID/license for admin review

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Animal> Animals { get; set; } = new List<Animal>();
        public ICollection<Bid> Bids { get; set; } = new List<Bid>();
        public VetProfile? VetProfile { get; set; } // null if not a veterinarian
        public ICollection<Appointment> AppointmentsAsClient { get; set; } = new List<Appointment>();
    }
}
