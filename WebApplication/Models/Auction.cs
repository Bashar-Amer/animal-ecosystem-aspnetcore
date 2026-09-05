using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp.Models
{
    public enum AuctionStatus
    {
        StartingSoon,
        Live,
        Ended,
        Cancelled
    }

    // [Index] with IsUnique enforces the one-to-one relationship with Animal at the DB level.
    // EF Core also infers one-to-one by convention here since both navigation properties
    // (Animal.Auction and Auction.Animal) are single references, not collections.
    [Index(nameof(AnimalId), IsUnique = true)]
    public class Auction
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        // One-to-one with Animal
        public string AnimalId { get; set; }

        [ForeignKey(nameof(AnimalId))]
        public Animal Animal { get; set; } = null!;

        [Column(TypeName = "decimal(18,2)")]
        public decimal StartingPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal CurrentPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal MinIncrement { get; set; } = 5.0m; // smallest allowed bid step

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public AuctionStatus Status { get; set; } = AuctionStatus.StartingSoon;

        // Tracks the current highest bidder for fast lookups without recalculating from Bids each time
        public string? HighestBidderId { get; set; }

        [ForeignKey(nameof(HighestBidderId))]
        public ApplicationUser? HighestBidder { get; set; }

        // Navigation
        public ICollection<Bid> Bids { get; set; } = new List<Bid>();
    }

    public class Bid
    {
        public int Id { get; set; }

        public string AuctionId { get; set; }

        [ForeignKey(nameof(AuctionId))]
        public Auction Auction { get; set; } = null!;

        public string UserId { get; set; } = string.Empty;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = null!;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        public DateTime PlacedAt { get; set; } = DateTime.UtcNow;
    }
}
