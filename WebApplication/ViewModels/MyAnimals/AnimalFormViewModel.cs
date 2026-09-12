using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace WebApp.ViewModels.MyAnimals
{
    public class AnimalFormViewModel
    {
        public string? Id { get; set; } // null when creating

        [Required, MaxLength(150)]
        public string Name { get; set; } = "";

        [Required]
        public int SpeciesId { get; set; }
        public List<SelectListItem> SpeciesOptions { get; set; } = new();

        [MaxLength(100)]
        public string? Breed { get; set; }

        [MaxLength(50)]
        public string? Gender { get; set; }

        public int? AgeInMonths { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required, Range(0.01, double.MaxValue, ErrorMessage = "Enter a valid price")]
        public decimal Price { get; set; }

        [MaxLength(150)]
        public string? Location { get; set; }

        [MaxLength(2000)]
        public string? BreederNotes { get; set; }

        public List<IFormFile> NewImages { get; set; } = new();
        public int? NewPrimaryImageIndex { get; set; }
        public List<ExistingImageViewModel> ExistingImages { get; set; } = new();
    }
}
