using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApp.Models;
using WebApp.ViewModels.Home;

namespace WebApp.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            // TODO: replace with real queries (featured listings service, live auctions service, top-rated vets query)
            var vm = new HomeIndexViewModel
            {
                HeroShowcase = new HeroShowcaseViewModel
                {
                    LotNumber = "Lot #1042",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDrxb5Tvxbgy6PN4brLofGGyWjwcFvJXuiQQpjGYeSgsi15TgYruszzKWcqhzHbLkucFcWldYUjec1ind6DYwROJmP8zGpEBHFtu53BKaUstVZ76e--kXKr8yiGlTnT_Wt0FEYSyfvpc07oc7JR8wa7rjl3NitHkutbkY_lbp3d7ro-EfD_IwlhaSuOstxR4rmCkTz2eiOmL36AyO9vaaRY4-LqVnkdmaGvxH4Z1kg0vGJK-CXnEINw",
                    ImageCaption = "Pedigree Certified • WAHO",
                    Title = "Purebred Arabian Stallion",
                    Location = "Premium Stables",
                    CurrentBid = 12500,
                    CountdownTarget = new DateTime(2026, 12, 31, 18, 0, 0)
                },
                TrustStats = new()
            {
                new() { Value = "50+", Label = "Countries Served" },
                new() { Value = "100%", Label = "Verified Veterinarians" },
                new() { Value = "24/7", Label = "Escrow Protection" },
                new() { Value = "50,000+", Label = "Active Breeders" }
            },
                FeaturedAnimals = new()
            {
                new FeaturedAnimalViewModel
                {
                    Id = 1, Category = "sheep",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCRAZVkBvyMRaFpC29oHRzbnz1CCWZRjxxkCEoUAZogaO1pzRCk8a7_CWs8PEpigf4kAq_tyO-XQTKCwF3KoqwupSUzlU9nViU7vSpcdSNK0Vycb-MH-WIyJlF7J3NVAQ9ezLpgwSK-XAUpaydxVaBiZj7UmSMcnW9FU0jz5yi5IX8VWOICM19Jm0NV3IVirFiS4baojy7SAz5lqTWrq0yqxmZBnSc43ZP0_cwjKJoRMJYGUqRhjiBT",
                    BadgeText = "Purebred", LocationBadge = "Premium Farm",
                    VerificationText = "Verified Owner • Vet Checked",
                    Title = "Premium Breeding Ram",
                    MetaLine = "2 Years • Male • Full Vaccination Record",
                    PriceLabel = "Asking Price", Price = 850
                },
                new FeaturedAnimalViewModel
                {
                    Id = 2, Category = "cattle",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBGaVcPEWBp1bEPjvGvCuWLCUWkQEscJKSj_1JCCrD9gPDbIH90M3l6YIXkSe4Ec6Z7YMggCQ2Ell7wKvXmNxbQfGVM0vw3c0YXEfMiIxD0YIwPFAtkn0_MioVJ0WHbiGBdNN1elRl3oTNHEGxX4ffBPfvlNN-l90CDxMtXQmvEbkqTGexU70BD4sWCBvVvmf6hT1uV3lqJEt_dDw1h0F04qP0bAKepEaBXFgAk-sqqDPdOf9r9vjIa",
                    BadgeText = "Holstein Friesian", LocationBadge = "Certified Dairy",
                    VerificationText = "Certified Dairy Facility",
                    Title = "High-Yield Dairy Cow",
                    MetaLine = "3 Years • Female • 28L Daily Production",
                    PriceLabel = "Direct Price", Price = 3200
                },
                new FeaturedAnimalViewModel
                {
                    Id = 3, Category = "horse",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBXU1Lm2h4lT12QCDOv2AzEn7lrrYgSF6DebvekJgimklmWtTFkWdhdUsOUFdv_tvyG5Udi8CqbUF9OPJCjQG-ZC_OmYOUV7yQsTS-VjyQJxW4umfjLeuS4ChBCWOomm49XIAhOapjuPmmgRUIhBbRqDCi16vh0PNuCpMKVLfzFlNFdqWzBjVVG5OSQfqvWnY2xCdnrRa0t0B2pfXvgJYBpJ3JxuU0nlHZdM4mFPlOX0tmIFgyuowgI",
                    BadgeText = "WAHO Registered", LocationBadge = "Elite Stables",
                    VerificationText = "Verified Owner • Vet Checked",
                    Title = "Arabian Stallion (Najm)",
                    MetaLine = "4 Years • Male • Championship Bloodline",
                    PriceLabel = "Fixed Price", Price = 18000
                },
                new FeaturedAnimalViewModel
                {
                    Id = 4, Category = "goat",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDnV2cGMcSjjtRp1OtK-oezv7-fqAYpV9jVwdx_TghmZ8BDU7Dgu00Dc239Qg9M5HeF9YVrLNhbA7ASPz1-Fl7ViQG3kYR_PsFcI_31Trwz8xSffSK4-QoLC3kJGqLkLks4SnFixEnUNt2NwidNae-OVG9_-UFYP84VkFQDBYG-hQ4pY3zuN4hMBL1BQiqufmHX76d-kX0uCMrEFkbHebTsZxCq2AL_1WJH9MBkbiUkPA8P7gmq6auP",
                    BadgeText = "Purebred Boer", LocationBadge = "Heritage Farm",
                    VerificationText = "Vaccinated • Breeding Ready",
                    Title = "Premium Boer Buck",
                    MetaLine = "2 Years • Male • Health Certified",
                    PriceLabel = "Direct Price", Price = 750
                }
            },
                LiveAuctions = new()
            {
                new HomeAuctionCardViewModel
                {
                    Id = 1042, LotNumber = "Lot #1042",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDziebzI7ZQmFr0MNtxJgsM7l-9vcjhHnBz5YkgcK6Lgsuh4k7ZMnacNNuTLCeB-zEUdehz-WDsLNfEGRwzAjAFTEpEWrXu4GRhGWa2jNL413o4UjkB7L2PV1KcOIE2b-BSRP0lz43vulpDGQBH5EljzmzFl1GB-fWzw-5Kef-9IGfwJIpL7ZWVtI8IU7kEy7ui3ucIrhsD-JNN5GLG30Jp1_XkxwkiFjmBKcHvEsFbnSWlzB29pUYe",
                    Title = "Championship Arabian Stallion",
                    Description = "Registered bloodline with international competition history.",
                    Status = "live", CurrentBid = 12500,
                    CountdownTarget = new DateTime(2026, 12, 31, 18, 0, 0)
                },
                new HomeAuctionCardViewModel
                {
                    Id = 1043, LotNumber = "Lot #1043",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBCD-UAttpSfgjLQ3icLSUIGwZR2Qg83yToJqi_QCxBo6apS_Tsq2my_FH8NmtPnO29M-GvSiz8AGE1KAvUSY3OLzV8l-S4goh1pPCfx_QWizyEYNWS7a6a0Yyaf3RcehqbZSVQhjtRaWwzjHXrlAyWMN00j7MdSjvWul5qqu95NcEc6KiL8BrSEf4azCh5gc5YNRAavBMd_Kz-C0h0r_l0F-MDtR9aFxbP7o-isTY_ZN5EHo26pQU6",
                    Title = "Premium Breeding Flock (10)",
                    Description = "Elite breeding ewes and champion ram with complete health records.",
                    Status = "live", CurrentBid = 5800,
                    CountdownTarget = new DateTime(2026, 12, 31, 20, 0, 0)
                },
                new HomeAuctionCardViewModel
                {
                    Id = 1045, LotNumber = "Lot #1045",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDuUOCLfEu4brCPG6wmxHhVDnm734uxCl90SbQLSfZAbMmqn4fjGpC9jAh8TdyZVaVBsTX0vDH41bJEsWC79tr7dQQQouOGCC8v2EbqQz1eX9NydGEtvljhU6RW8La7c_JeiW6yrVGZDHmUmPeMGF6XujmuWFz5NZ7dp7UlFdAGfCvkBlHRpMcqDN720qJqnlnBhP73smpouszdcV2qWiQicRDhBl8I--ZLwDrcfhX-_W3xvj18wvUK",
                    Title = "Champion Boer Buck",
                    Description = "Award-winning stud with proven genetics and full health screening.",
                    Status = "ending-soon", CurrentBid = 920,
                    CountdownTarget = new DateTime(2026, 1, 1, 8, 0, 0)
                }
            },
                FeaturedVets = new()
            {
                new FeaturedVetViewModel
                {
                    Slug = "michael-anderson",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAHHYMz3PtxFgBDrBuHsppu3JDhgk1m-V9C8py0u1i9qqlQ7m2FCvU9kOR2QJCeGF49SB8IaKnYxc0QxUBYPlG9j9CtMMqyCw3HQYjD7_s1kuXcSVM5--K1gf66QL_YCpdNAKOj5GMGo1etbWq_nl_J6pfCBkqtFhevPH_dDjw_sJJ0nA2_IUl3GJi3LKm64TXUVX8nSzSRwRjZCGjRgWVBOGZSX-RXMfpkzv5mDPHWXIMtLHizh3f2",
                    Name = "Dr. Michael Anderson", Specialty = "Large Animal & Herd Health",
                    LocationLabel = "Texas, USA", Rating = 4.9, ReviewCount = 247,
                    ExperienceLabel = "15+ yrs experience",
                    AvailabilityStatus = "available", AvailabilityText = "Available Now", FeeFrom = 85
                },
                new FeaturedVetViewModel
                {
                    Slug = "sarah-mitchell",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuB1hykTC8KOnVw5jUF03Agw374ikPqZ1FoM5eQR4izkL8JY9QrxcItiIbAEQBHuRIt888frz_wly0eiIJ3sl9g66b4ZF6BBpH6hsipBQISETZMHqBgYEy-S7bShxsAW4ENAi_Br7Ua0tVS_nel3ZKgANo0deqPkiC8lV-WEI-hS_UH9btMk-c3Sb1FLbDFPIEvv1nL2bSURubZVkjsuTc_aa8EZAeFtV11Z3Zwd8X58PR0Q6iJ_8DGV",
                    Name = "Dr. Sarah Mitchell", Specialty = "Equine Specialist & Surgeon",
                    LocationLabel = "Kentucky, USA", Rating = 5.0, ReviewCount = 183,
                    ExperienceLabel = "12 yrs experience",
                    AvailabilityStatus = "available", AvailabilityText = "Available Today", FeeFrom = 95
                },
                new FeaturedVetViewModel
                {
                    Slug = "james-patterson",
                    ImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDfKn8GXpDG91zl-0QJJHRIgXEBfoKn4EZDdq_SwPTTTuYgIEhfpLMJxW1gqQ4k_njYzEVxftWlNBTF5sOrQTQ6-1Vs_MVmEYJOjEBw1Y5g5nm_f36VFCX7BAo09ZS5cZ9YDxBhVYhLk7Nr1W4wHoZ9kpqH7w3dekRUAJ6ifuxzcc3zi7-H2Oki-UtpZSabKUcTGZupDtTa56FCwAoEtMenDfwEpTZmU96W0X7QAUMOh3dsPe-Pjnsq",
                    Name = "Dr. James Patterson", Specialty = "Livestock Health & Nutrition",
                    LocationLabel = "Ontario, Canada", Rating = 4.8, ReviewCount = 310,
                    ExperienceLabel = "20+ yrs experience",
                    AvailabilityStatus = "scheduled", AvailabilityText = "Tomorrow 9:00 AM", FeeFrom = 75
                }
            }
            };

            return View(vm);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
