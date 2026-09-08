using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp.Models
{
    public class VetScheduleSlot
    {
        public int Id { get; set; }

        public string VetProfileId { get; set; } = string.Empty;
        [ForeignKey(nameof(VetProfileId))]
        public VetProfile VetProfile { get; set; } = null!;

        [Required, MaxLength(20)]
        public string DayOfWeek { get; set; } = string.Empty; // "Monday" etc.

        [MaxLength(50)]
        public string? TimeLabel { get; set; } // "9:00 AM - 5:00 PM"

        [MaxLength(20)]
        public string Status { get; set; } = "available"; // "available" | "limited" | "emergency" | "off"
    }
}
