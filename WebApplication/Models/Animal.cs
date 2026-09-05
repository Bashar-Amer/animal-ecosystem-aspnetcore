using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp.Models
{
    public enum AnimalStatus
    {
        Available,
        Reserved,
        InAuction,
        Sold
    }

    public class Animal
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty; // e.g. "Holstein Dairy Cow"

        [MaxLength(100)]
        public string? Breed { get; set; }

        public int? AgeInMonths { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [MaxLength(150)]
        public string? Location { get; set; } // e.g. "Irbid, Jordan"

        public AnimalStatus Status { get; set; } = AnimalStatus.Available;

        public bool IsVerified { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public int SpeciesId { get; set; }

        [ForeignKey(nameof(SpeciesId))]
        public Species Species { get; set; } = null!;

        public string OwnerId { get; set; } = string.Empty;

        [ForeignKey(nameof(OwnerId))]
        public ApplicationUser Owner { get; set; } = null!;

        // Navigation
        public ICollection<AnimalImage> Images { get; set; } = new List<AnimalImage>();
        public Auction? Auction { get; set; } // one-to-one, present only if listed for auction

        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    }

    // Separate table so an animal can have multiple listing photos
    public class AnimalImage
    {
        public int Id { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        [Required]
        public string AnimalId { get; set; }

        [ForeignKey(nameof(AnimalId))]
        public Animal Animal { get; set; } = null!;
    }
}
