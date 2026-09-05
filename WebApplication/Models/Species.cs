using System.ComponentModel.DataAnnotations;

namespace WebApp.Models
{
    // Used for both animal Species (e.g., Livestock, Poultry, Pets)
    public class Species
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public string? IconUrl { get; set; }

        // Navigation
        public ICollection<Animal> Animals { get; set; } = new List<Animal>();
    }
}
