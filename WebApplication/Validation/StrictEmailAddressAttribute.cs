

using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace WebApp.Validation
{
    public class StrictEmailAddressAttribute : ValidationAttribute
    {
        private static readonly Regex EmailRegex = new(
            @"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$",
            RegexOptions.Compiled | RegexOptions.IgnoreCase);

        public StrictEmailAddressAttribute() : base("Enter a valid email address") { }

        public override bool IsValid(object? value)
        {
            if (value is not string email || string.IsNullOrWhiteSpace(email))
            {
                return true; // let [Required] handle emptiness — this only validates format
            }

            return EmailRegex.IsMatch(email);
        }
    }
}
