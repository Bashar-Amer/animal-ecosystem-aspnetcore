namespace WebApp.Helpers
{
    public static class JordanTime
    {
        private static readonly TimeSpan JordanOffset = TimeSpan.FromHours(3);

        public static DateTime Now =>
            DateTime.SpecifyKind(DateTime.UtcNow.Add(JordanOffset), DateTimeKind.Unspecified);
    }
}
