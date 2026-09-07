using System.ComponentModel.DataAnnotations;

namespace WebApp.Models
{
    public class Favorite
    {
        public int Id { get; set; }
        public required string UserId { get; set; }
        public ApplicationUser? User { get; set; }

        public required string AnimalId { get; set; }
        public Animal? Animal { get; set; }
    }
}
