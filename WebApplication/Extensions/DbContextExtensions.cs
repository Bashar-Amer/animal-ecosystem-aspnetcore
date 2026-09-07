using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApp.Models;

namespace WebApp.Extensions
{
    public static class DbContextExtensions
    {
        public static void SeedAnimalEcosystem(this ModelBuilder modelBuilder)
        {
            
            
            // 1. SEED USERS

            string ownerId = "user-owner-guid-1";
            string bidderId = "user-bidder-guid-2";
            string vetUserId = "user-vet-guid-3";

            string owner2Id = "user-owner-guid-4";
            string owner3Id = "user-owner-guid-5";
            string owner4Id = "user-owner-guid-6";
            string buyer2Id = "user-buyer-guid-7";
            string buyer3Id = "user-buyer-guid-8";
            string buyer4Id = "user-buyer-guid-9";

            var ownerUser = new ApplicationUser
            {
                Id = ownerId,
                UserName = "ahmad_farmer",
                NormalizedUserName = "AHMAD_FARMER",
                Email = "ahmad@example.com",
                NormalizedEmail = "AHMAD@EXAMPLE.COM",
                EmailConfirmed = true,
                FullName = "Ahmad Al-Farmawi",
                Location = "Irbid, Jordan",
                IsVerified = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                PasswordHash = "PREGENERATED_HASH_1",
                ConcurrencyStamp = "e49ccae4-2d95-4e73-82ad-fe4bf1414b8c",
                SecurityStamp = "e49ccae4-2d95-4e73-82ad-fe4bf1414b8c"
            };

            var bidderUser = new ApplicationUser
            {
                Id = bidderId,
                UserName = "sami_buyer",
                NormalizedUserName = "SAMI_BUYER",
                Email = "sami@example.com",
                NormalizedEmail = "SAMI@EXAMPLE.COM",
                EmailConfirmed = true,
                FullName = "Sami Al-Khatib",
                Location = "Amman, Jordan",
                IsVerified = true,
                CreatedAt = new DateTime(2026, 1, 5, 0, 0, 0, DateTimeKind.Utc),
                PasswordHash = "PREGENERATED_HASH_1",
                ConcurrencyStamp = "e34de3c3-3ac8-423a-8a1b-6abd62098c13",
                SecurityStamp = "e34de3c3-3ac8-423a-8a1b-6abd62098c13"
            };

            var vetUser = new ApplicationUser
            {
                Id = vetUserId,
                UserName = "dr_rami",
                NormalizedUserName = "DR_RAMI",
                Email = "rami.vet@example.com",
                NormalizedEmail = "RAMI.VET@EXAMPLE.COM",
                EmailConfirmed = true,
                FullName = "Dr. Rami Naser",
                Location = "Irbid, Jordan",
                IsVerified = true,
                CreatedAt = new DateTime(2026, 1, 10, 0, 0, 0, DateTimeKind.Utc),
                PasswordHash = "PREGENERATED_HASH_1",
                ConcurrencyStamp = "6b77ad96-eaca-4af0-a5da-8a05e6d2ecb4",
                SecurityStamp = "6b77ad96-eaca-4af0-a5da-8a05e6d2ecb4"
            };

            var owner2User = new ApplicationUser
            {
                Id = owner2Id,
                UserName = "yousef_livestock",
                NormalizedUserName = "YOUSEF_LIVESTOCK",
                Email = "yousef@example.com",
                NormalizedEmail = "YOUSEF@EXAMPLE.COM",
                EmailConfirmed = true,
                FullName = "Yousef Haddad",
                Location = "Mafraq, Jordan",
                IsVerified = true,
                CreatedAt = new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc),
                PasswordHash = "PREGENERATED_HASH_1",
                ConcurrencyStamp = "10000000-0000-0000-0000-000000000004",
                SecurityStamp = "10000000-0000-0000-0000-000000000004"
            };

            var owner3User = new ApplicationUser
            {
                Id = owner3Id,
                UserName = "omar_farm",
                NormalizedUserName = "OMAR_FARM",
                Email = "omar@example.com",
                NormalizedEmail = "OMAR@EXAMPLE.COM",
                EmailConfirmed = true,
                FullName = "Omar Al-Zoubi",
                Location = "Zarqa, Jordan",
                IsVerified = false,
                CreatedAt = new DateTime(2026, 1, 20, 0, 0, 0, DateTimeKind.Utc),
                PasswordHash = "PREGENERATED_HASH_1",
                ConcurrencyStamp = "10000000-0000-0000-0000-000000000005",
                SecurityStamp = "10000000-0000-0000-0000-000000000005"
            };

            var owner4User = new ApplicationUser
            {
                Id = owner4Id,
                UserName = "khaled_horses",
                NormalizedUserName = "KHALED_HORSES",
                Email = "khaled@example.com",
                NormalizedEmail = "KHALED@EXAMPLE.COM",
                EmailConfirmed = true,
                FullName = "Khaled Al-Rashdan",
                Location = "Amman, Jordan",
                IsVerified = true,
                CreatedAt = new DateTime(2026, 1, 25, 0, 0, 0, DateTimeKind.Utc),
                PasswordHash = "PREGENERATED_HASH_1",
                ConcurrencyStamp = "10000000-0000-0000-0000-000000000006",
                SecurityStamp = "10000000-0000-0000-0000-000000000006"
            };

            var buyer2User = new ApplicationUser
            {
                Id = buyer2Id,
                UserName = "ali_buyer",
                NormalizedUserName = "ALI_BUYER",
                Email = "ali@example.com",
                NormalizedEmail = "ALI@EXAMPLE.COM",
                EmailConfirmed = true,
                FullName = "Ali Saleh",
                Location = "Amman, Jordan",
                IsVerified = true,
                CreatedAt = new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc),
                PasswordHash = "PREGENERATED_HASH_1",
                ConcurrencyStamp = "10000000-0000-0000-0000-000000000007",
                SecurityStamp = "10000000-0000-0000-0000-000000000007"
            };

            var buyer3User = new ApplicationUser
            {
                Id = buyer3Id,
                UserName = "mohammad_farmer",
                NormalizedUserName = "MOHAMMAD_FARMER",
                Email = "mohammad@example.com",
                NormalizedEmail = "MOHAMMAD@EXAMPLE.COM",
                EmailConfirmed = true,
                FullName = "Mohammad Ahmad",
                Location = "Salt, Jordan",
                IsVerified = false,
                CreatedAt = new DateTime(2026, 2, 5, 0, 0, 0, DateTimeKind.Utc),
                PasswordHash = "PREGENERATED_HASH_1",
                ConcurrencyStamp = "10000000-0000-0000-0000-000000000008",
                SecurityStamp = "10000000-0000-0000-0000-000000000008"
            };

            var buyer4User = new ApplicationUser
            {
                Id = buyer4Id,
                UserName = "fadi_animals",
                NormalizedUserName = "FADI_ANIMALS",
                Email = "fadi@example.com",
                NormalizedEmail = "FADI@EXAMPLE.COM",
                EmailConfirmed = true,
                FullName = "Fadi Nassar",
                Location = "Jerash, Jordan",
                IsVerified = true,
                CreatedAt = new DateTime(2026, 2, 8, 0, 0, 0, DateTimeKind.Utc),
                PasswordHash = "PREGENERATED_HASH_1",
                ConcurrencyStamp = "10000000-0000-0000-0000-000000000009",
                SecurityStamp = "10000000-0000-0000-0000-000000000009"
            };

            modelBuilder.Entity<ApplicationUser>().HasData(
                ownerUser,
                bidderUser,
                vetUser,
                owner2User,
                owner3User,
                owner4User,
                buyer2User,
                buyer3User,
                buyer4User
            );


            
            // 2. SEED SPECIES
            

            modelBuilder.Entity<Species>().HasData(
                new Species
                {
                    Id = 1,
                    Name = "Livestock",
                    Description = "Sheep, goats, cows, and camels",
                    IconUrl = "/images/species/livestock.png"
                },

                new Species
                {
                    Id = 2,
                    Name = "Equine",
                    Description = "Horses, donkeys, and ponies",
                    IconUrl = "/images/species/equine.png"
                },

                new Species
                {
                    Id = 3,
                    Name = "Poultry",
                    Description = "Chickens, ducks, and turkeys",
                    IconUrl = "/images/species/poultry.png"
                }
            );


            
            // 3. SEED VET PROFILE
            

            modelBuilder.Entity<VetProfile>().HasData(
                new VetProfile
                {
                    Id = "vet-profile-id-1",
                    UserId = vetUserId,
                    Specialty = "Livestock & Equine",
                    Bio = "Experienced large animal veterinarian with over 10 years of practice in northern Jordan.",
                    ClinicLocation = "Irbid Veterinary Clinic, Main Street",
                    YearsOfExperience = 10,
                    IsVerified = true,
                    LicenseDocumentUrl = "/docs/licenses/vet_rami.pdf"
                }
            );


            
            // 4. SEED ANIMALS
            

            // ------------------------------------------------------------
            // Animal IDs
            // ------------------------------------------------------------

            string animalId1 = "animal-guid-1";
            string animalId2 = "animal-guid-2";
            string animalId3 = "animal-guid-3";
            string animalId4 = "animal-guid-4";
            string animalId5 = "animal-guid-5";
            string animalId6 = "animal-guid-6";
            string animalId7 = "animal-guid-7";
            string animalId8 = "animal-guid-8";
            string animalId9 = "animal-guid-9";
            string animalId10 = "animal-guid-10";
            string animalId11 = "animal-guid-11";
            string animalId12 = "animal-guid-12";
            string animalId13 = "animal-guid-13";
            string animalId14 = "animal-guid-14";
            string animalId15 = "animal-guid-15";
            string animalId16 = "animal-guid-16";
            string animalId17 = "animal-guid-17";
            string animalId18 = "animal-guid-18";

            modelBuilder.Entity<Animal>().HasData(

                // ========================================================
                // SHEEP
                // ========================================================

                new Animal
                {
                    Id = animalId1,
                    Name = "Assaf Ram",
                    Breed = "Assaf",
                    Gender = "Male",
                    AgeInMonths = 14,
                    Description = "Healthy, high-grade breeding ram. Fully vaccinated.",
                    Price = 350.00m,
                    Location = "Irbid, Jordan",
                    Status = AnimalStatus.InAuction,
                    IsVerified = true,
                    IsVetChecked = true,
                    CreatedAt = new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 1,
                    OwnerId = ownerId
                },

                new Animal
                {
                    Id = animalId3,
                    Name = "Awassi Ewe",
                    Breed = "Awassi",
                    Gender = "Female",
                    AgeInMonths = 22,
                    Description = "Healthy Awassi ewe suitable for breeding. Good milk production.",
                    Price = 280.00m,
                    Location = "Mafraq, Jordan",
                    Status = AnimalStatus.Available,
                    IsVerified = true,
                    IsVetChecked = true,
                    CreatedAt = new DateTime(2026, 2, 6, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 1,
                    OwnerId = owner2Id
                },

                new Animal
                {
                    Id = animalId4,
                    Name = "Young Awassi Lamb",
                    Breed = "Awassi",
                    Gender = "Male",
                    AgeInMonths = 6,
                    Description = "Young Awassi lamb with excellent body condition.",
                    Price = 150.00m,
                    Location = "Irbid, Jordan",
                    Status = AnimalStatus.Available,
                    IsVerified = false,
                    IsVetChecked = false,
                    CreatedAt = new DateTime(2026, 2, 8, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 1,
                    OwnerId = owner3Id
                },

                // ========================================================
                // GOATS
                // ========================================================

                new Animal
                {
                    Id = animalId5,
                    Name = "Shami Doe",
                    Breed = "Damascus (Shami)",
                    Gender = "Female",
                    AgeInMonths = 30,
                    Description = "Large Shami goat with excellent milk production history.",
                    Price = 450.00m,
                    Location = "Zarqa, Jordan",
                    Status = AnimalStatus.Available,
                    IsVerified = true,
                    IsVetChecked = true,
                    CreatedAt = new DateTime(2026, 2, 10, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 1,
                    OwnerId = owner3Id
                },

                new Animal
                {
                    Id = animalId6,
                    Name = "Boer Buck",
                    Breed = "Boer",
                    Gender = "Male",
                    AgeInMonths = 18,
                    Description = "Strong Boer buck suitable for breeding and meat production.",
                    Price = 520.00m,
                    Location = "Mafraq, Jordan",
                    Status = AnimalStatus.InAuction,
                    IsVerified = true,
                    IsVetChecked = false,
                    CreatedAt = new DateTime(2026, 2, 12, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 1,
                    OwnerId = owner2Id
                },

                new Animal
                {
                    Id = animalId7,
                    Name = "Young Shami Goat",
                    Breed = "Shami",
                    Gender = "Male",
                    AgeInMonths = 8,
                    Description = "Young healthy Shami goat with good growth potential.",
                    Price = 190.00m,
                    Location = "Salt, Jordan",
                    Status = AnimalStatus.Available,
                    IsVerified = false,
                    IsVetChecked = true,
                    CreatedAt = new DateTime(2026, 2, 14, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 1,
                    OwnerId = buyer3Id
                },

                // ========================================================
                // CATTLE
                // ========================================================

                new Animal
                {
                    Id = animalId8,
                    Name = "Holstein Dairy Cow",
                    Breed = "Holstein",
                    Gender = "Female",
                    AgeInMonths = 48,
                    Description = "High-producing dairy cow with healthy udder and excellent milk history.",
                    Price = 1800.00m,
                    Location = "Irbid, Jordan",
                    Status = AnimalStatus.Available,
                    IsVerified = true,
                    IsVetChecked = true,
                    CreatedAt = new DateTime(2026, 2, 15, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 1,
                    OwnerId = ownerId
                },

                new Animal
                {
                    Id = animalId9,
                    Name = "Baladi Calf",
                    Breed = "Baladi",
                    Gender = "Male",
                    AgeInMonths = 9,
                    Description = "Healthy young calf, ideal for small farms.",
                    Price = 850.00m,
                    Location = "Jerash, Jordan",
                    Status = AnimalStatus.Available,
                    IsVerified = true,
                    IsVetChecked = true,
                    CreatedAt = new DateTime(2026, 2, 17, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 1,
                    OwnerId = buyer4Id
                },

                // ========================================================
                // CAMELS
                // ========================================================

                new Animal
                {
                    Id = animalId10,
                    Name = "Arabian Camel",
                    Breed = "Dromedary",
                    Gender = "Male",
                    AgeInMonths = 72,
                    Description = "Strong healthy Arabian camel suitable for breeding and farm use.",
                    Price = 3200.00m,
                    Location = "Mafraq, Jordan",
                    Status = AnimalStatus.InAuction,
                    IsVerified = true,
                    IsVetChecked = true,
                    CreatedAt = new DateTime(2026, 2, 18, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 1,
                    OwnerId = owner2Id
                },

                new Animal
                {
                    Id = animalId11,
                    Name = "Young Female Camel",
                    Breed = "Dromedary",
                    Gender = "Female",
                    AgeInMonths = 36,
                    Description = "Young female camel with good health indicators.",
                    Price = 2900.00m,
                    Location = "Azraq, Jordan",
                    Status = AnimalStatus.Available,
                    IsVerified = false,
                    IsVetChecked = false,
                    CreatedAt = new DateTime(2026, 2, 20, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 1,
                    OwnerId = owner3Id
                },

                // ========================================================
                // HORSES
                // ========================================================

                new Animal
                {
                    Id = animalId2,
                    Name = "Arabian Filly",
                    Breed = "Straight Egyptian",
                    Gender = "Female",
                    AgeInMonths = 24,
                    Description = "Purebred young Arabian horse with excellent temperament.",
                    Price = 2500.00m,
                    Location = "Amman, Jordan",
                    Status = AnimalStatus.Available,
                    IsVerified = true,
                    IsVetChecked = true,
                    CreatedAt = new DateTime(2026, 2, 3, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 2,
                    OwnerId = ownerId
                },

                new Animal
                {
                    Id = animalId12,
                    Name = "Arabian Stallion",
                    Breed = "Arabian",
                    Gender = "Male",
                    AgeInMonths = 60,
                    Description = "Well-trained Arabian stallion with strong bloodline and excellent movement.",
                    Price = 7500.00m,
                    Location = "Amman, Jordan",
                    Status = AnimalStatus.InAuction,
                    IsVerified = true,
                    IsVetChecked = true,
                    CreatedAt = new DateTime(2026, 2, 22, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 2,
                    OwnerId = owner4Id
                },

                new Animal
                {
                    Id = animalId13,
                    Name = "Chestnut Mare",
                    Breed = "Arabian",
                    Gender = "Female",
                    AgeInMonths = 84,
                    Description = "Experienced Arabian mare with calm temperament.",
                    Price = 4200.00m,
                    Location = "Salt, Jordan",
                    Status = AnimalStatus.Available,
                    IsVerified = true,
                    IsVetChecked = false,
                    CreatedAt = new DateTime(2026, 2, 24, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 2,
                    OwnerId = owner4Id
                },

                // ========================================================
                // DONKEYS
                // ========================================================

                new Animal
                {
                    Id = animalId14,
                    Name = "Baladi Donkey",
                    Breed = "Baladi",
                    Gender = "Male",
                    AgeInMonths = 54,
                    Description = "Strong working donkey suitable for farm transportation.",
                    Price = 650.00m,
                    Location = "Jerash, Jordan",
                    Status = AnimalStatus.Available,
                    IsVerified = false,
                    IsVetChecked = true,
                    CreatedAt = new DateTime(2026, 2, 25, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 2,
                    OwnerId = owner3Id
                },

                new Animal
                {
                    Id = animalId15,
                    Name = "Young Donkey",
                    Breed = "Local",
                    Gender = "Female",
                    AgeInMonths = 20,
                    Description = "Young healthy donkey with calm behavior.",
                    Price = 500.00m,
                    Location = "Irbid, Jordan",
                    Status = AnimalStatus.Available,
                    IsVerified = false,
                    IsVetChecked = false,
                    CreatedAt = new DateTime(2026, 2, 27, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 2,
                    OwnerId = ownerId
                },

                // ========================================================
                // POULTRY - CHICKENS
                // ========================================================

                new Animal
                {
                    Id = animalId16,
                    Name = "Rhode Island Rooster",
                    Breed = "Rhode Island Red",
                    Gender = "Male",
                    AgeInMonths = 8,
                    Description = "Healthy rooster suitable for breeding.",
                    Price = 35.00m,
                    Location = "Zarqa, Jordan",
                    Status = AnimalStatus.Available,
                    IsVerified = true,
                    IsVetChecked = true,
                    CreatedAt = new DateTime(2026, 2, 28, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 3,
                    OwnerId = owner3Id
                },

                new Animal
                {
                    Id = animalId17,
                    Name = "Rhode Island Hen",
                    Breed = "Rhode Island Red",
                    Gender = "Female",
                    AgeInMonths = 10,
                    Description = "Healthy laying hen with good egg production.",
                    Price = 30.00m,
                    Location = "Irbid, Jordan",
                    Status = AnimalStatus.Available,
                    IsVerified = true,
                    IsVetChecked = true,
                    CreatedAt = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 3,
                    OwnerId = ownerId
                },

                // ========================================================
                // TURKEY
                // ========================================================

                new Animal
                {
                    Id = animalId18,
                    Name = "Broad Breasted Turkey",
                    Breed = "Broad Breasted White",
                    Gender = "Male",
                    AgeInMonths = 7,
                    Description = "Healthy large turkey suitable for farm breeding.",
                    Price = 80.00m,
                    Location = "Mafraq, Jordan",
                    Status = AnimalStatus.InAuction,
                    IsVerified = false,
                    IsVetChecked = false,
                    CreatedAt = new DateTime(2026, 3, 2, 0, 0, 0, DateTimeKind.Utc),
                    SpeciesId = 3,
                    OwnerId = owner2Id
                }
            );


            
            // 5. SEED ANIMAL IMAGES
            

            modelBuilder.Entity<AnimalImage>().HasData(

                // Assaf Ram
                new AnimalImage
                {
                    Id = 1,
                    AnimalId = animalId1,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                new AnimalImage
                {
                    Id = 2,
                    AnimalId = animalId1,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = false
                },

                // Arabian Filly
                new AnimalImage
                {
                    Id = 3,
                    AnimalId = animalId2,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Awassi Ewe
                new AnimalImage
                {
                    Id = 4,
                    AnimalId = animalId3,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Young Awassi Lamb
                new AnimalImage
                {
                    Id = 5,
                    AnimalId = animalId4,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Shami Goat
                new AnimalImage
                {
                    Id = 6,
                    AnimalId = animalId5,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Boer Buck
                new AnimalImage
                {
                    Id = 7,
                    AnimalId = animalId6,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Young Shami
                new AnimalImage
                {
                    Id = 8,
                    AnimalId = animalId7,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Holstein
                new AnimalImage
                {
                    Id = 9,
                    AnimalId = animalId8,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Baladi Calf
                new AnimalImage
                {
                    Id = 10,
                    AnimalId = animalId9,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Camel
                new AnimalImage
                {
                    Id = 11,
                    AnimalId = animalId10,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Female Camel
                new AnimalImage
                {
                    Id = 12,
                    AnimalId = animalId11,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Arabian Stallion
                new AnimalImage
                {
                    Id = 13,
                    AnimalId = animalId12,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Chestnut Mare
                new AnimalImage
                {
                    Id = 14,
                    AnimalId = animalId13,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Donkey
                new AnimalImage
                {
                    Id = 15,
                    AnimalId = animalId14,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Young Donkey
                new AnimalImage
                {
                    Id = 16,
                    AnimalId = animalId15,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Rooster
                new AnimalImage
                {
                    Id = 17,
                    AnimalId = animalId16,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Hen
                new AnimalImage
                {
                    Id = 18,
                    AnimalId = animalId17,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                },

                // Turkey
                new AnimalImage
                {
                    Id = 19,
                    AnimalId = animalId18,
                    ImageUrl = "/images/animals/placeholder.jfif",
                    IsMain = true
                }
            );


            
            // 6. SEED AUCTIONS
            

            string auctionId1 = "auction-guid-1";
            string auctionId2 = "auction-guid-2";
            string auctionId3 = "auction-guid-3";
            string auctionId4 = "auction-guid-4";
            string auctionId5 = "auction-guid-5";

            modelBuilder.Entity<Auction>().HasData(

                new Auction
                {
                    Id = auctionId1,
                    AnimalId = animalId1,
                    StartingPrice = 300.00m,
                    CurrentPrice = 320.00m,
                    MinIncrement = 10.00m,
                    StartTime = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc),
                    EndTime = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc),
                    Status = AuctionStatus.Live,
                    HighestBidderId = bidderId
                },

                new Auction
                {
                    Id = auctionId2,
                    AnimalId = animalId6,
                    StartingPrice = 450.00m,
                    CurrentPrice = 500.00m,
                    MinIncrement = 10.00m,
                    StartTime = new DateTime(2026, 3, 5, 0, 0, 0, DateTimeKind.Utc),
                    EndTime = new DateTime(2026, 3, 20, 0, 0, 0, DateTimeKind.Utc),
                    Status = AuctionStatus.Live,
                    HighestBidderId = buyer2Id
                },

                new Auction
                {
                    Id = auctionId3,
                    AnimalId = animalId10,
                    StartingPrice = 2800.00m,
                    CurrentPrice = 3100.00m,
                    MinIncrement = 50.00m,
                    StartTime = new DateTime(2026, 3, 6, 0, 0, 0, DateTimeKind.Utc),
                    EndTime = new DateTime(2026, 3, 25, 0, 0, 0, DateTimeKind.Utc),
                    Status = AuctionStatus.Live,
                    HighestBidderId = buyer3Id
                },

                new Auction
                {
                    Id = auctionId4,
                    AnimalId = animalId12,
                    StartingPrice = 6500.00m,
                    CurrentPrice = 7000.00m,
                    MinIncrement = 100.00m,
                    StartTime = new DateTime(2026, 3, 7, 0, 0, 0, DateTimeKind.Utc),
                    EndTime = new DateTime(2026, 3, 30, 0, 0, 0, DateTimeKind.Utc),
                    Status = AuctionStatus.Live,
                    HighestBidderId = buyer4Id
                },

                new Auction
                {
                    Id = auctionId5,
                    AnimalId = animalId18,
                    StartingPrice = 60.00m,
                    CurrentPrice = 70.00m,
                    MinIncrement = 5.00m,
                    StartTime = new DateTime(2026, 3, 8, 0, 0, 0, DateTimeKind.Utc),
                    EndTime = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                    Status = AuctionStatus.Live,
                    HighestBidderId = bidderId
                }
            );


            
            // 7. SEED BIDS
            

            modelBuilder.Entity<Bid>().HasData(

                // Auction 1 - Ram
                new Bid
                {
                    Id = 1,
                    AuctionId = auctionId1,
                    UserId = bidderId,
                    Amount = 310.00m,
                    PlacedAt = new DateTime(2026, 3, 2, 10, 0, 0, DateTimeKind.Utc)
                },

                new Bid
                {
                    Id = 2,
                    AuctionId = auctionId1,
                    UserId = buyer2Id,
                    Amount = 320.00m,
                    PlacedAt = new DateTime(2026, 3, 2, 12, 0, 0, DateTimeKind.Utc)
                },

                // Auction 2 - Boer Goat
                new Bid
                {
                    Id = 3,
                    AuctionId = auctionId2,
                    UserId = bidderId,
                    Amount = 460.00m,
                    PlacedAt = new DateTime(2026, 3, 5, 10, 0, 0, DateTimeKind.Utc)
                },

                new Bid
                {
                    Id = 4,
                    AuctionId = auctionId2,
                    UserId = buyer2Id,
                    Amount = 480.00m,
                    PlacedAt = new DateTime(2026, 3, 5, 11, 0, 0, DateTimeKind.Utc)
                },

                new Bid
                {
                    Id = 5,
                    AuctionId = auctionId2,
                    UserId = buyer3Id,
                    Amount = 500.00m,
                    PlacedAt = new DateTime(2026, 3, 5, 13, 0, 0, DateTimeKind.Utc)
                },

                // Auction 3 - Camel
                new Bid
                {
                    Id = 6,
                    AuctionId = auctionId3,
                    UserId = buyer3Id,
                    Amount = 2900.00m,
                    PlacedAt = new DateTime(2026, 3, 6, 9, 0, 0, DateTimeKind.Utc)
                },

                new Bid
                {
                    Id = 7,
                    AuctionId = auctionId3,
                    UserId = bidderId,
                    Amount = 3000.00m,
                    PlacedAt = new DateTime(2026, 3, 6, 12, 0, 0, DateTimeKind.Utc)
                },

                new Bid
                {
                    Id = 8,
                    AuctionId = auctionId3,
                    UserId = buyer3Id,
                    Amount = 3100.00m,
                    PlacedAt = new DateTime(2026, 3, 7, 9, 0, 0, DateTimeKind.Utc)
                },

                // Auction 4 - Horse
                new Bid
                {
                    Id = 9,
                    AuctionId = auctionId4,
                    UserId = buyer4Id,
                    Amount = 6700.00m,
                    PlacedAt = new DateTime(2026, 3, 7, 10, 0, 0, DateTimeKind.Utc)
                },

                new Bid
                {
                    Id = 10,
                    AuctionId = auctionId4,
                    UserId = bidderId,
                    Amount = 6900.00m,
                    PlacedAt = new DateTime(2026, 3, 7, 14, 0, 0, DateTimeKind.Utc)
                },

                new Bid
                {
                    Id = 11,
                    AuctionId = auctionId4,
                    UserId = buyer4Id,
                    Amount = 7000.00m,
                    PlacedAt = new DateTime(2026, 3, 8, 10, 0, 0, DateTimeKind.Utc)
                },

                // Auction 5 - Turkey
                new Bid
                {
                    Id = 12,
                    AuctionId = auctionId5,
                    UserId = bidderId,
                    Amount = 65.00m,
                    PlacedAt = new DateTime(2026, 3, 8, 11, 0, 0, DateTimeKind.Utc)
                },

                new Bid
                {
                    Id = 13,
                    AuctionId = auctionId5,
                    UserId = buyer2Id,
                    Amount = 70.00m,
                    PlacedAt = new DateTime(2026, 3, 8, 13, 0, 0, DateTimeKind.Utc)
                }
            );


            
            // 8. SEED FAVORITES
            

            modelBuilder.Entity<Favorite>().HasData(

                new Favorite
                {
                    Id = 1,
                    UserId = bidderId,
                    AnimalId = animalId1
                },

                new Favorite
                {
                    Id = 2,
                    UserId = bidderId,
                    AnimalId = animalId2
                },

                new Favorite
                {
                    Id = 3,
                    UserId = bidderId,
                    AnimalId = animalId12
                },

                new Favorite
                {
                    Id = 4,
                    UserId = buyer2Id,
                    AnimalId = animalId6
                },

                new Favorite
                {
                    Id = 5,
                    UserId = buyer2Id,
                    AnimalId = animalId8
                },

                new Favorite
                {
                    Id = 6,
                    UserId = buyer3Id,
                    AnimalId = animalId10
                },

                new Favorite
                {
                    Id = 7,
                    UserId = buyer3Id,
                    AnimalId = animalId11
                },

                new Favorite
                {
                    Id = 8,
                    UserId = buyer4Id,
                    AnimalId = animalId12
                },

                new Favorite
                {
                    Id = 9,
                    UserId = buyer4Id,
                    AnimalId = animalId13
                },

                new Favorite
                {
                    Id = 10,
                    UserId = ownerId,
                    AnimalId = animalId8
                }
            );


            
            // 9. SEED VETERINARY APPOINTMENTS
            

            modelBuilder.Entity<Appointment>().HasData(

                new Appointment
                {
                    Id = "appointment-guid-1",
                    ClientId = bidderId,
                    VetProfileId = "vet-profile-id-1",
                    RequestedDate = new DateTime(2026, 3, 10, 10, 0, 0, DateTimeKind.Utc),
                    Notes = "Routine checkup for a new calf.",
                    Status = AppointmentStatus.Accepted,
                    CreatedAt = new DateTime(2026, 3, 4, 0, 0, 0, DateTimeKind.Utc)
                },

                new Appointment
                {
                    Id = "appointment-guid-2",
                    ClientId = buyer2Id,
                    VetProfileId = "vet-profile-id-1",
                    RequestedDate = new DateTime(2026, 3, 11, 11, 0, 0, DateTimeKind.Utc),
                    Notes = "Pre-purchase veterinary examination for Boer goat.",
                    Status = AppointmentStatus.Accepted,
                    CreatedAt = new DateTime(2026, 3, 5, 0, 0, 0, DateTimeKind.Utc)
                },

                new Appointment
                {
                    Id = "appointment-guid-3",
                    ClientId = buyer3Id,
                    VetProfileId = "vet-profile-id-1",
                    RequestedDate = new DateTime(2026, 3, 12, 9, 30, 0, DateTimeKind.Utc),
                    Notes = "Camel health examination and vaccination review.",
                    Status = AppointmentStatus.Accepted,
                    CreatedAt = new DateTime(2026, 3, 6, 0, 0, 0, DateTimeKind.Utc)
                },

                new Appointment
                {
                    Id = "appointment-guid-4",
                    ClientId = buyer4Id,
                    VetProfileId = "vet-profile-id-1",
                    RequestedDate = new DateTime(2026, 3, 14, 14, 0, 0, DateTimeKind.Utc),
                    Notes = "General examination of Arabian stallion before auction.",
                    Status = AppointmentStatus.Accepted,
                    CreatedAt = new DateTime(2026, 3, 7, 0, 0, 0, DateTimeKind.Utc)
                }
            );

        }
    }
}
