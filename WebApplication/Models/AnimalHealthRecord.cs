using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp.Models
{
    public class AnimalHealthRecord
    {
        public int Id { get; set; }

        [Required]
        public string AnimalId { get; set; } = string.Empty;

        [ForeignKey(nameof(AnimalId))]
        public Animal Animal { get; set; } = null!;

        [Required, MaxLength(150)]
        public string Title { get; set; } = string.Empty; // e.g. "Vaccination - Rabies"

        [MaxLength(300)]
        public string? Meta { get; set; } // e.g. "Dr. Ahmad Khalil • March 2026"

        public DateTime? RecordDate { get; set; }
    }
}
