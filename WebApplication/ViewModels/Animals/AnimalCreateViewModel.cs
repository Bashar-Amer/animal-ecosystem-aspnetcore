using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApp.Models;

namespace WebApp.ViewModels.Animals
{
    public class AnimalCreateViewModel
    {
        [Required, MaxLength(150)]
        public required string Name { get; set; }

        [MaxLength(100)]
        public string? Breed { get; set; }

        public int? AgeInMonths { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [MaxLength(150)]
        public string? Location { get; set; }

        public AnimalStatus Status { get; set; } = AnimalStatus.Available;

        public int SpeciesId { get; set; }

        public string OwnerId { get; set; } = string.Empty;

        public ICollection<AnimalImage> Images { get; set; } = new List<AnimalImage>();
    }
}
