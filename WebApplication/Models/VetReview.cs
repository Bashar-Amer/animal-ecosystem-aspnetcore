namespace WebApp.Models
{
    public class VetReview
    {
        public int Id { get; set; }

        public string AppointmentId { get; set; } = string.Empty;
        [ForeignKey(nameof(AppointmentId))]
        public Appointment Appointment { get; set; } = null!;

        public string VetProfileId { get; set; } = string.Empty;
        [ForeignKey(nameof(VetProfileId))]
        public VetProfile VetProfile { get; set; } = null!;

        public string ReviewerId { get; set; } = string.Empty;
        [ForeignKey(nameof(ReviewerId))]
        public ApplicationUser Reviewer { get; set; } = null!;

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? Text { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
