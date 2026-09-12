using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Enums;
using WebApp.Helpers;
using WebApp.Models;
using WebApp.Services;

namespace WebApp.Extensions
{
    //public static class DbContextExtensions
    //{
    //    public static class SeedData
    //    {
    //        public static async Task SeedAsync(IServiceProvider services)
    //        {
    //            var dbContext = services.GetRequiredService<ApplicationDbContext>();
    //            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    //            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

    //            // Only seed if the DB is empty — never re-seed on every startup
    //            if (await dbContext.Users.AnyAsync())
    //            {
    //                return;
    //            }

    //            // ---------- Roles ----------
    //            foreach (var roleName in new[] { "Admin","Breeder", "Vet" })
    //            {
    //                if (!await roleManager.RoleExistsAsync(roleName))
    //                {
    //                    await roleManager.CreateAsync(new IdentityRole(roleName));
    //                }
    //            }

                

    //            // ---------- Species ----------
    //            var horse = new Species { Name = "Arabian Horse", Description = "Purebred Arabian horses" };
    //            var cattle = new Species { Name = "Cattle", Description = "Dairy and beef cattle" };
    //            var sheep = new Species { Name = "Sheep", Description = "Local and Awassi sheep breeds" };
    //            var goat = new Species { Name = "Goat", Description = "Dairy and meat goats" };
    //            var camel = new Species { Name = "Camel", Description = "Dromedary camels" };
    //            dbContext.Species.AddRange(horse, cattle, sheep, goat, camel);
    //            await dbContext.SaveChangesAsync();

    //            // ---------- Users ----------
    //            const string password = "Passw0rd!123";

    //            var breeder1 = await CreateUser(userManager, "khalid.farm@example.com", "Khalid Al-Nashmi", "Irbid, Jordan", password, "Breeder", verified: true);
    //            var breeder2 = await CreateUser(userManager, "layla.livestock@example.com", "Layla Haddad", "Mafraq, Jordan", password, "Breeder", verified: true);
    //            var buyer1 = await CreateUser(userManager, "buyer@example.com", "Sami Odeh", "Amman, Jordan", password, null, verified: false);
    //            var vetUser1 = await CreateUser(userManager, "dr.ahmad@example.com", "Dr. Ahmad Khalil", "Amman, Jordan", password, "Vet", verified: true);
    //            var vetUser2 = await CreateUser(userManager, "dr.rana@example.com", "Dr. Rana Saleh", "Zarqa, Jordan", password, "Vet", verified: true);

    //            // Add a seeded admin user:
    //            var adminUser = await CreateUser(userManager, "admin@example.com", "Platform Admin", "Amman, Jordan", password, "Admin", verified: true);

    //            // ---------- Animals ----------
    //            var animal1 = new Animal
    //            {
    //                Name = "Zephyr",
    //                Breed = "Arabian",
    //                Gender = "Stallion",
    //                AgeInMonths = 60,
    //                Description = "Champion bloodline Arabian stallion, excellent temperament.",
    //                Price = 8500,
    //                Location = "Irbid, Jordan",
    //                Status = AnimalStatus.Available,
    //                IsVerified = true,
    //                IsVetChecked = true,
    //                IsFeatured = true,
    //                BreederNotes = "Trained for shows since age 2.\nNo history of illness.",
    //                SpeciesId = horse.Id,
    //                OwnerId = breeder1.Id
    //            };
    //            var animal2 = new Animal
    //            {
    //                Name = "Bella",
    //                Breed = "Holstein",
    //                Gender = "Female",
    //                AgeInMonths = 30,
    //                Description = "High milk yield dairy cow, vaccinated.",
    //                Price = 1800,
    //                Location = "Mafraq, Jordan",
    //                Status = AnimalStatus.Available,
    //                IsVerified = true,
    //                IsVetChecked = true,
    //                IsFeatured = true,
    //                SpeciesId = cattle.Id,
    //                OwnerId = breeder2.Id
    //            };
    //            var animal3 = new Animal
    //            {
    //                Name = "Storm",
    //                Breed = "Awassi",
    //                Gender = "Ram",
    //                AgeInMonths = 18,
    //                Description = "Strong Awassi ram, ready for breeding.",
    //                Price = 450,
    //                Location = "Mafraq, Jordan",
    //                Status = AnimalStatus.InAuction,
    //                IsVerified = true,
    //                IsVetChecked = false,
    //                SpeciesId = sheep.Id,
    //                OwnerId = breeder2.Id
    //            };
    //            var animal4 = new Animal
    //            {
    //                Name = "Nour",
    //                Breed = "Damascus",
    //                Gender = "Doe",
    //                AgeInMonths = 24,
    //                Description = "Damascus dairy goat, calm and healthy.",
    //                Price = 600,
    //                Location = "Irbid, Jordan",
    //                Status = AnimalStatus.Available,
    //                IsVerified = false,
    //                IsVetChecked = false,
    //                SpeciesId = goat.Id,
    //                OwnerId = breeder1.Id
    //            };
    //            var animal5 = new Animal
    //            {
    //                Name = "Sultan",
    //                Breed = "Majaheem",
    //                Gender = "Bull Camel",
    //                AgeInMonths = 72,
    //                Description = "Purebred racing camel, multiple race wins.",
    //                Price = 15000,
    //                Location = "Mafraq, Jordan",
    //                Status = AnimalStatus.InAuction,
    //                IsVerified = true,
    //                IsVetChecked = true,
    //                IsFeatured = true,
    //                SpeciesId = camel.Id,
    //                OwnerId = breeder2.Id
    //            };

    //            animal1.ModerationStatus = ModerationStatus.Approved;
    //            animal2.ModerationStatus = ModerationStatus.Approved;
    //            animal3.ModerationStatus = ModerationStatus.Approved;
    //            animal4.ModerationStatus = ModerationStatus.Approved;
    //            animal5.ModerationStatus = ModerationStatus.Approved;

    //            dbContext.Animals.AddRange(animal1, animal2, animal3, animal4, animal5);
    //            await dbContext.SaveChangesAsync();

    //            dbContext.AnimalImages.AddRange(
    //                new AnimalImage { AnimalId = animal1.Id, ImageUrl = "/images/seed/horse1.jpg", IsMain = true },
    //                new AnimalImage { AnimalId = animal2.Id, ImageUrl = "/images/seed/cattle1.jpg", IsMain = true },
    //                new AnimalImage { AnimalId = animal3.Id, ImageUrl = "/images/seed/sheep1.jpg", IsMain = true },
    //                new AnimalImage { AnimalId = animal4.Id, ImageUrl = "/images/seed/goat1.jpg", IsMain = true },
    //                new AnimalImage { AnimalId = animal5.Id, ImageUrl = "/images/seed/camel1.jpg", IsMain = true }
    //            );

    //            dbContext.AnimalHealthRecords.Add(new AnimalHealthRecord
    //            {
    //                AnimalId = animal1.Id,
    //                Title = "Vaccination - Rabies",
    //                Meta = "Dr. Ahmad Khalil",
    //                RecordDate = JordanTime.Now.AddMonths(-3)
    //            });
    //            await dbContext.SaveChangesAsync();

    //            // ---------- Auctions ----------
    //            var auction1 = new Auction
    //            {
    //                LotNumber = 1001,
    //                AnimalId = animal3.Id,
    //                Title = "Awassi Ram - Prime Breeding Stock",
    //                StartingPrice = 300,
    //                CurrentPrice = 420,
    //                MinIncrement = 10,
    //                StartTime = JordanTime.Now.AddHours(-3),
    //                EndTime = JordanTime.Now.AddHours(2),
    //                Status = AuctionStatus.EndingSoon
    //            };
    //            var auction2 = new Auction
    //            {
    //                LotNumber = 1002,
    //                AnimalId = animal5.Id,
    //                Title = "Majaheem Racing Camel - Champion Bloodline",
    //                StartingPrice = 10000,
    //                CurrentPrice = 12500,
    //                MinIncrement = 250,
    //                StartTime = JordanTime.Now.AddHours(-1),
    //                EndTime = JordanTime.Now.AddDays(1),
    //                Status = AuctionStatus.Live
    //            };
    //            dbContext.Auctions.AddRange(auction1, auction2);
    //            await dbContext.SaveChangesAsync();

    //            var bid1 = new Bid { AuctionId = auction1.Id, UserId = buyer1.Id, Amount = 420, PlacedAt = JordanTime.Now.AddMinutes(-20) };
    //            var bid2 = new Bid { AuctionId = auction1.Id, UserId = buyer1.Id, Amount = 380, PlacedAt = JordanTime.Now.AddHours(-1) };
    //            var bid3 = new Bid { AuctionId = auction2.Id, UserId = buyer1.Id, Amount = 12500, PlacedAt = JordanTime.Now.AddMinutes(-10) };
    //            dbContext.Bids.AddRange(bid1, bid2, bid3);
    //            auction1.HighestBidderId = buyer1.Id;
    //            auction2.HighestBidderId = buyer1.Id;
    //            await dbContext.SaveChangesAsync();

    //            // ---------- Vet Profiles ----------
    //            var vetProfile1 = new VetProfile
    //            {
    //                Id = Guid.NewGuid().ToString(),
    //                UserId = vetUser1.Id,
    //                Specialty = "Equine",
    //                Bio = "Dr. Ahmad has over 12 years of experience treating horses across Jordan.\n\nHe specializes in reproductive health and lameness diagnostics.",
    //                ClinicLocation = "Amman, Jordan",
    //                YearsOfExperience = 12,
    //                IsVerified = true,
    //                Rating = 4.8,
    //                ReviewCount = 2,
    //                ConsultationFee = 40,
    //                AvailabilityStatus = "available",
    //                AvailabilityText = "Available Today",
    //                AvailabilityWindow = "today",
    //                IsFeatured = true,
    //                Credential = "D.V.M."
    //            };
    //            var vetProfile2 = new VetProfile
    //            {
    //                Id = Guid.NewGuid().ToString(),
    //                UserId = vetUser2.Id,
    //                Specialty = "Livestock",
    //                Bio = "Dr. Rana focuses on livestock herd health, vaccination programs, and dairy cattle nutrition.",
    //                ClinicLocation = "Zarqa, Jordan",
    //                YearsOfExperience = 8,
    //                IsVerified = true,
    //                Rating = 4.5,
    //                ReviewCount = 1,
    //                ConsultationFee = 30,
    //                AvailabilityStatus = "busy",
    //                AvailabilityText = "Next slot Thursday",
    //                AvailabilityWindow = "week",
    //                IsFeatured = true,
    //                Credential = "D.V.M."
    //            };
    //            dbContext.VetProfiles.AddRange(vetProfile1, vetProfile2);
    //            await dbContext.SaveChangesAsync();

    //            dbContext.VeterinaryServices.AddRange(
    //                new VeterinaryService { VetProfileId = vetProfile1.Id, Title = "General Checkup", Description = "Routine health examination", Price = 40, Icon = "medical_services" },
    //                new VeterinaryService { VetProfileId = vetProfile1.Id, Title = "Emergency Call-out", Description = "Urgent on-site visit", Price = 90, IsUrgent = true, Icon = "emergency" },
    //                new VeterinaryService { VetProfileId = vetProfile2.Id, Title = "Herd Vaccination", Description = "Vaccination program for livestock groups", Price = 25, Icon = "vaccines" }
    //            );

    //            dbContext.VetTimelineEvents.AddRange(
    //                new VetTimelineEvent { VetProfileId = vetProfile1.Id, Title = "Jordan University of Science and Technology", Description = "D.V.M. Degree", StartDate = new DateTime(2010, 9, 1), EndDate = new DateTime(2014, 6, 1) },
    //                new VetTimelineEvent { VetProfileId = vetProfile1.Id, Title = "Amman Equine Clinic", Description = "Senior Veterinarian", StartDate = new DateTime(2014, 9, 1), EndDate = null }
    //            );

    //            dbContext.VetScheduleSlots.AddRange(
    //                new VetScheduleSlot { VetProfileId = vetProfile1.Id, DayOfWeek = "Monday", TimeLabel = "9:00 AM - 5:00 PM", Status = "available" },
    //                new VetScheduleSlot { VetProfileId = vetProfile1.Id, DayOfWeek = "Tuesday", TimeLabel = "9:00 AM - 5:00 PM", Status = "available" },
    //                new VetScheduleSlot { VetProfileId = vetProfile1.Id, DayOfWeek = "Friday", TimeLabel = "Emergency Only", Status = "emergency" },
    //                new VetScheduleSlot { VetProfileId = vetProfile1.Id, DayOfWeek = "Saturday", TimeLabel = "", Status = "off" }
    //            );
    //            await dbContext.SaveChangesAsync();

    //            // ---------- Appointments + Reviews ----------
    //            var appointment1 = new Appointment
    //            {
    //                ClientId = buyer1.Id,
    //                VetProfileId = vetProfile1.Id,
    //                RequestedDate = JordanTime.Now.AddDays(-10),
    //                Notes = "Lameness check on stallion",
    //                Status = AppointmentStatus.Completed
    //            };
    //            var appointment2 = new Appointment
    //            {
    //                ClientId = breeder2.Id,
    //                VetProfileId = vetProfile2.Id,
    //                RequestedDate = JordanTime.Now.AddDays(-5),
    //                Notes = "Herd vaccination follow-up",
    //                Status = AppointmentStatus.Completed
    //            };
    //            var appointment3 = new Appointment
    //            {
    //                ClientId = breeder1.Id,
    //                VetProfileId = vetProfile1.Id,
    //                RequestedDate = JordanTime.Now.AddDays(3),
    //                Notes = "Routine checkup request",
    //                Status = AppointmentStatus.Pending
    //            };
    //            dbContext.Appointments.AddRange(appointment1, appointment2, appointment3);
    //            await dbContext.SaveChangesAsync();

    //            dbContext.VetReviews.AddRange(
    //                new VetReview { AppointmentId = appointment1.Id, VetProfileId = vetProfile1.Id, ReviewerId = buyer1.Id, Rating = 5, Text = "Extremely knowledgeable and gentle with the horse. Highly recommend." },
    //                new VetReview { AppointmentId = appointment1.Id, VetProfileId = vetProfile1.Id, ReviewerId = breeder1.Id, Rating = 5, Text = "Diagnosed the issue quickly and explained everything clearly." },
    //                new VetReview { AppointmentId = appointment2.Id, VetProfileId = vetProfile2.Id, ReviewerId = breeder2.Id, Rating = 4, Text = "Very professional, arrived on time for the herd vaccination." }
    //            );

    //            await dbContext.SaveChangesAsync();
    //        }

    //        private static async Task<ApplicationUser> CreateUser(
    //            UserManager<ApplicationUser> userManager,
    //            string email,
    //            string fullName,
    //            string location,
    //            string password,
    //            string? role,
    //            bool verified)
    //        {
    //            var user = new ApplicationUser
    //            {
    //                UserName = email,
    //                Email = email,
    //                EmailConfirmed = true,
    //                FullName = fullName,
    //                Location = location,
    //                IsVerified = verified,
    //                CreatedAt = JordanTime.Now
    //            };

    //            var result = await userManager.CreateAsync(user, password);
    //            if (!result.Succeeded)
    //            {
    //                throw new Exception($"Failed to seed user {email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
    //            }

    //            if (role != null)
    //            {
    //                await userManager.AddToRoleAsync(user, role);
    //            }

    //            return user;
    //        }
    //    }
    
    
    //}
}
