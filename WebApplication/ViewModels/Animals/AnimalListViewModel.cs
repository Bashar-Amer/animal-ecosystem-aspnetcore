using WebApp.Models;

namespace WebApp.ViewModels.Animals
{
    public class AnimalListViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public string? Breed { get; set; }

        public string? Gender { get; set; }

        public int? AgeInMonths { get; set; }

        public decimal Price { get; set; }

        public string? Location { get; set; }

        public bool IsOwnerVerified { get; set; }
        public bool IsVetVerified { get; set; }

        public string? MainImageUrl { get; set; }
    }
}
