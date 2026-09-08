using System.ComponentModel.DataAnnotations;

namespace WebApp.ViewModels.Account
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Enter a valid email address")]
        [Display(Name = "Email Address")]
        public string Email { get; set; } = "";

        [Required(ErrorMessage = "Password is required")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = "";

        //[Display(Name = "Remember this device for 30 days")]
        //public bool RememberMe { get; set; }

        public string? ReturnUrl { get; set; }
    }
}
