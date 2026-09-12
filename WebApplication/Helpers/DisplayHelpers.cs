using System.Text.RegularExpressions;

namespace WebApp.Helpers
{
    public static class DisplayHelpers
    {
        public static string GenerateSlug(string name)
        {
            var slug = name.ToLowerInvariant().Trim();
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = Regex.Replace(slug, @"\s+", "-");
            return slug;
        }

        public static string GetInitials(string fullName, int maxLetters = 2)
        {
            var parts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            return string.Concat(parts.Take(maxLetters).Select(p => p[0])).ToUpper();
        }

        public static string FormatAge(int ageInMonths)
        {
            if (ageInMonths < 12)
                return $"{ageInMonths} Month{(ageInMonths == 1 ? "" : "s")}";

            var years = ageInMonths / 12;
            return $"{years} Year{(years == 1 ? "" : "s")}";
        }

        public static string MapCategory(string speciesName)
        {
            var name = speciesName.ToLowerInvariant();
            return name switch
            {
                var n when n.Contains("horse") => "horse",
                var n when n.Contains("cattle") || n.Contains("cow") || n.Contains("bull") => "cattle",
                var n when n.Contains("sheep") => "sheep",
                var n when n.Contains("goat") => "goat",
                var n when n.Contains("camel") => "camel",
                _ => name
            };
        }

    }
}
