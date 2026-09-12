namespace WebApp.ViewModels.Account
{
    public class ProfileViewModel
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Location { get; set; }
        public string? ProfileImageUrl { get; set; }
        public bool IsVerified { get; set; }
        public double Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public IReadOnlyList<string> Roles { get; set; } = Array.Empty<string>();
        public int ListingCount { get; set; }
        public int FavoriteCount { get; set; }
        public int BidCount { get; set; }
    }
}
