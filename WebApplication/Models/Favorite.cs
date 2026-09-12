using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace WebApp.Models
{
    [Index(nameof(UserId), nameof(AnimalId), IsUnique = true)]
    public class Favorite
    {
        public int Id { get; set; }
        public required string UserId { get; set; }
        public ApplicationUser? User { get; set; }

        public required string AnimalId { get; set; }
        public Animal? Animal { get; set; }
    }
}
