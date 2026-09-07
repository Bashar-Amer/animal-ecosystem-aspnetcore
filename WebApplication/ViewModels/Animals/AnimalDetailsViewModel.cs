using WebApp.Models;
using WebApp.ViewModels.Users;

namespace WebApp.ViewModels.Animals
{
    public class AnimalDetailsViewModel
    {
        public Animal animalInfo { get; set; }
        public ICollection<AnimalListViewModel> MoreFromSeller { get; set; } = [];

        public ICollection<AnimalListViewModel> SimilarListings { get; set; } = [];

        public UserListViewModel owner { get; set; }
    }
}
