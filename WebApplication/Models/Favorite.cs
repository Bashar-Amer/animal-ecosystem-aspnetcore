using System.ComponentModel.DataAnnotations;

namespace WebApp.Models
{
    public class Favorite
    {
        public int Id { get; set; }
        public required string UserId { get; set; }
        public ApplicationUser? User { get; set; }

        public ICollection<Animal> Animals { get; set; } = new List<Animal>();
    }
}
