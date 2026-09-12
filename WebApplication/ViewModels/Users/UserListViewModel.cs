using WebApp.Models;

namespace WebApp.ViewModels.Users
{
    public class UserListViewModel
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsVerified { get; set; } = false;
        public string? Location { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
