using WebApp.Models;
using WebApp.ViewModels.Users;

namespace WebApp.ViewModels.Animals
{
    public class AnimalDetailsViewModel
    {
        public AnimalDetailViewModel animalInfo { get; set; } = new();
        public ICollection<AnimalListViewModel> MoreFromSeller { get; set; } = [];
        public ICollection<AnimalListViewModel> SimilarListings { get; set; } = [];
        public UserListViewModel owner { get; set; } = new();
    }
}
