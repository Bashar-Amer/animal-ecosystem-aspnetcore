using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp.Models
{
    public class VeterinaryService
    {
        public int Id { get; set; }

        public string VetProfileId { get; set; } = string.Empty;
        [ForeignKey(nameof(VetProfileId))]
        public VetProfile VetProfile { get; set; } = null!;

        [Required, MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Price { get; set; }

        public bool IsUrgent { get; set; } = false;

        [MaxLength(50)]
        public string? Icon { get; set; }
    }
}
