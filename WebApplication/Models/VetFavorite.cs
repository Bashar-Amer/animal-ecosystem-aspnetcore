using Microsoft.EntityFrameworkCore;

namespace WebApp.Models
{
    [Index(nameof(UserId), nameof(VetProfileId), IsUnique = true)]
    public class VetFavorite
    {
        public int Id { get; set; }
        public required string UserId { get; set; }
        public ApplicationUser? User { get; set; }

        public required string VetProfileId { get; set; }
        public VetProfile? VetProfile { get; set; }
    }
}
