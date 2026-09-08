using System.ComponentModel.DataAnnotations;

namespace WebApp.ViewModels.Account
{
    public class RegisterViewModel
    {
        // "breeder" | "vet"
        public string Role { get; set; } = "breeder";

        [Required(ErrorMessage = "Full name is required")]
        [Display(Name = "Full Legal Name")]
        public string FullName { get; set; } = "";

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Enter a valid email address")]
        [Display(Name = "Email Address")]
        public string Email { get; set; } = "";

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = "";

        [Required(ErrorMessage = "Please confirm your password")]
        [DataType(DataType.Password)]
        [Compare(nameof(Password), ErrorMessage = "Passwords do not match")]
        [Display(Name = "Confirm Password")]
        public string ConfirmPassword { get; set; } = "";

        [Range(typeof(bool), "true", "true", ErrorMessage = "You must agree to the Terms of Service to continue")]
        public bool AgreeToTerms { get; set; }
    }
}
