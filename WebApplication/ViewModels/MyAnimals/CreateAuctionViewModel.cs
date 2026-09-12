using System.ComponentModel.DataAnnotations;
using WebApp.Helpers;

namespace WebApp.ViewModels.MyAnimals
{
    public class CreateAuctionViewModel
    {
        public string AnimalId { get; set; } = "";
        public string AnimalName { get; set; } = "";
        public string ImageUrl { get; set; } = "";

        [Required, MaxLength(200)]
        public string Title { get; set; } = "";

        [Required, Range(1, double.MaxValue, ErrorMessage = "Enter a valid starting price")]
        public decimal StartingPrice { get; set; }

        [Required, Range(1, double.MaxValue)]
        public decimal MinIncrement { get; set; } = 5;

        [Required]
        public DateTime StartTime { get; set; } = JordanTime.Now;

        [Required]
        public DateTime EndTime { get; set; } = JordanTime.Now.AddDays(3);
    }
}
