/*
    Animal Ecosystem - production-like demo data

    Run against the database configured by appsettings.json:
      sqlcmd -S "(localdb)\MSSQLLocalDB" -d AnimalEcosystem -E -i Scripts\SeedProductionDemoData.sql

    Demo login password for every account created here:
      Passw0rd!123

    This script is intentionally repeat-safe. It leaves the application's original
    seed data untouched and exits when the demo batch has already been inserted.
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
SET XACT_ABORT ON;

IF DB_NAME() <> N'AnimalEcosystem'
    THROW 51000, 'Run this script against the AnimalEcosystem database.', 1;

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = N'AspNetUsers')
    THROW 51001, 'The Identity schema is missing. Apply EF migrations first.', 1;

IF EXISTS (SELECT 1 FROM AspNetUsers WHERE Email = N'demo.owner01@animalecosystem.test')
BEGIN
    PRINT 'Demo data already exists. No changes were made.';
    RETURN;
END;

BEGIN TRANSACTION;

DECLARE @Now datetime2 = DATEADD(hour, 3, SYSUTCDATETIME());
DECLARE @PasswordHash nvarchar(max) =
    N'AQAAAAIAAYagAAAAEJ4mFwzUvFksHXn3aQmTEe7efr1sBch5Uqj6TUlu59VpCDfBkaM3/PxlNsH5x/i+yg==';
DECLARE @AdminId nvarchar(450) = (SELECT TOP (1) Id FROM AspNetUsers WHERE Email = N'admin@example.com');
DECLARE @BreederRoleId nvarchar(450);
DECLARE @VetRoleId nvarchar(450);
DECLARE @DemoSpeciesHorse int;
DECLARE @DemoSpeciesCattle int;
DECLARE @DemoSpeciesSheep int;
DECLARE @DemoSpeciesGoat int;
DECLARE @DemoSpeciesCamel int;

/* Roles are also created by the application seed, but are included for clean databases. */
IF NOT EXISTS (SELECT 1 FROM AspNetRoles WHERE NormalizedName = N'BREEDER')
    INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
    VALUES (N'role-demo-breeder', N'Breeder', N'BREEDER', CONVERT(nvarchar(36), NEWID()));

IF NOT EXISTS (SELECT 1 FROM AspNetRoles WHERE NormalizedName = N'VET')
    INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
    VALUES (N'role-demo-vet', N'Vet', N'VET', CONVERT(nvarchar(36), NEWID()));

SELECT @BreederRoleId = Id FROM AspNetRoles WHERE NormalizedName = N'BREEDER';
SELECT @VetRoleId = Id FROM AspNetRoles WHERE NormalizedName = N'VET';

/* Reuse existing species when present; otherwise create the complete catalog. */
IF NOT EXISTS (SELECT 1 FROM Species WHERE Name = N'Arabian Horse')
    INSERT INTO Species (Name, Description, IconUrl) VALUES (N'Arabian Horse', N'Purebred Arabian horses', N'/images/seed/horse1.jpg');
IF NOT EXISTS (SELECT 1 FROM Species WHERE Name = N'Cattle')
    INSERT INTO Species (Name, Description, IconUrl) VALUES (N'Cattle', N'Dairy and beef cattle', N'/images/seed/cattle1.jpg');
IF NOT EXISTS (SELECT 1 FROM Species WHERE Name = N'Sheep')
    INSERT INTO Species (Name, Description, IconUrl) VALUES (N'Sheep', N'Local and Awassi sheep breeds', N'/images/seed/sheep1.jpg');
IF NOT EXISTS (SELECT 1 FROM Species WHERE Name = N'Goat')
    INSERT INTO Species (Name, Description, IconUrl) VALUES (N'Goat', N'Dairy and meat goats', N'/images/seed/goat1.jpg');
IF NOT EXISTS (SELECT 1 FROM Species WHERE Name = N'Camel')
    INSERT INTO Species (Name, Description, IconUrl) VALUES (N'Camel', N'Dromedary camels', N'/images/seed/camel1.jpg');

SELECT @DemoSpeciesHorse = Id FROM Species WHERE Name = N'Arabian Horse';
SELECT @DemoSpeciesCattle = Id FROM Species WHERE Name = N'Cattle';
SELECT @DemoSpeciesSheep = Id FROM Species WHERE Name = N'Sheep';
SELECT @DemoSpeciesGoat = Id FROM Species WHERE Name = N'Goat';
SELECT @DemoSpeciesCamel = Id FROM Species WHERE Name = N'Camel';

/* Identity users. All use the documented demo password above. */
INSERT INTO AspNetUsers
    (Id, FullName, ProfileImageUrl, Location, IsVerified, Rating, CreatedAt, UserName,
     NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash,
     SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed,
     TwoFactorEnabled, LockoutEnabled, AccessFailedCount)
VALUES
    (N'demo-owner-01', N'Yousef Al-Khatib', NULL, N'Amman, Jordan', 1, 4.7, DATEADD(day, -180, @Now), N'demo.owner01@animalecosystem.test', N'DEMO.OWNER01@ANIMALECOSYSTEM.TEST', N'demo.owner01@animalecosystem.test', N'DEMO.OWNER01@ANIMALECOSYSTEM.TEST', 1, @PasswordHash, CONVERT(nvarchar(36), NEWID()), CONVERT(nvarchar(36), NEWID()), N'+962790000101', 1, 0, 1, 0),
    (N'demo-owner-02', N'Mariam Al-Rashid', NULL, N'Irbid, Jordan', 1, 4.9, DATEADD(day, -165, @Now), N'demo.owner02@animalecosystem.test', N'DEMO.OWNER02@ANIMALECOSYSTEM.TEST', N'demo.owner02@animalecosystem.test', N'DEMO.OWNER02@ANIMALECOSYSTEM.TEST', 1, @PasswordHash, CONVERT(nvarchar(36), NEWID()), CONVERT(nvarchar(36), NEWID()), N'+962790000102', 1, 0, 1, 0),
    (N'demo-owner-03', N'Fadi Al-Masri', NULL, N'Zarqa, Jordan', 0, 4.2, DATEADD(day, -140, @Now), N'demo.owner03@animalecosystem.test', N'DEMO.OWNER03@ANIMALECOSYSTEM.TEST', N'demo.owner03@animalecosystem.test', N'DEMO.OWNER03@ANIMALECOSYSTEM.TEST', 1, @PasswordHash, CONVERT(nvarchar(36), NEWID()), CONVERT(nvarchar(36), NEWID()), N'+962790000103', 1, 0, 1, 0),
    (N'demo-owner-04', N'Reem Haddad', NULL, N'Madaba, Jordan', 1, 4.5, DATEADD(day, -120, @Now), N'demo.owner04@animalecosystem.test', N'DEMO.OWNER04@ANIMALECOSYSTEM.TEST', N'demo.owner04@animalecosystem.test', N'DEMO.OWNER04@ANIMALECOSYSTEM.TEST', 1, @PasswordHash, CONVERT(nvarchar(36), NEWID()), CONVERT(nvarchar(36), NEWID()), N'+962790000104', 1, 0, 1, 0),
    (N'demo-buyer-01', N'Omar Nasser', NULL, N'Aqaba, Jordan', 1, 4.1, DATEADD(day, -95, @Now), N'demo.buyer01@animalecosystem.test', N'DEMO.BUYER01@ANIMALECOSYSTEM.TEST', N'demo.buyer01@animalecosystem.test', N'DEMO.BUYER01@ANIMALECOSYSTEM.TEST', 1, @PasswordHash, CONVERT(nvarchar(36), NEWID()), CONVERT(nvarchar(36), NEWID()), N'+962790000105', 1, 0, 1, 0),
    (N'demo-buyer-02', N'Lina Odeh', NULL, N'Salt, Jordan', 1, 4.4, DATEADD(day, -80, @Now), N'demo.buyer02@animalecosystem.test', N'DEMO.BUYER02@ANIMALECOSYSTEM.TEST', N'demo.buyer02@animalecosystem.test', N'DEMO.BUYER02@ANIMALECOSYSTEM.TEST', 1, @PasswordHash, CONVERT(nvarchar(36), NEWID()), CONVERT(nvarchar(36), NEWID()), N'+962790000106', 1, 0, 1, 0),
    (N'demo-vet-01', N'Dr. Hala Mansour', NULL, N'Irbid, Jordan', 1, 4.8, DATEADD(day, -260, @Now), N'demo.vet01@animalecosystem.test', N'DEMO.VET01@ANIMALECOSYSTEM.TEST', N'demo.vet01@animalecosystem.test', N'DEMO.VET01@ANIMALECOSYSTEM.TEST', 1, @PasswordHash, CONVERT(nvarchar(36), NEWID()), CONVERT(nvarchar(36), NEWID()), N'+962790000107', 1, 0, 1, 0),
    (N'demo-vet-02', N'Dr. Tareq Abu Ali', NULL, N'Karak, Jordan', 1, 4.6, DATEADD(day, -240, @Now), N'demo.vet02@animalecosystem.test', N'DEMO.VET02@ANIMALECOSYSTEM.TEST', N'demo.vet02@animalecosystem.test', N'DEMO.VET02@ANIMALECOSYSTEM.TEST', 1, @PasswordHash, CONVERT(nvarchar(36), NEWID()), CONVERT(nvarchar(36), NEWID()), N'+962790000108', 1, 0, 1, 0);

INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT v.UserId, v.RoleId
FROM (VALUES
    (N'demo-owner-01', @BreederRoleId), (N'demo-owner-02', @BreederRoleId),
    (N'demo-owner-03', @BreederRoleId), (N'demo-owner-04', @BreederRoleId),
    (N'demo-vet-01', @VetRoleId), (N'demo-vet-02', @VetRoleId)
) v(UserId, RoleId)
WHERE NOT EXISTS (SELECT 1 FROM AspNetUserRoles r WHERE r.UserId = v.UserId AND r.RoleId = v.RoleId);

/* Animals: available, reserved, sold, and auction inventory. */
INSERT INTO Animals
    (Id, Name, Breed, Gender, AgeInMonths, Description, Price, Location, Status, IsFeatured,
     IsVerified, IsVetChecked, BreederNotes, CreatedAt, SpeciesId, OwnerId, ModerationStatus)
VALUES
    (N'demo-animal-01', N'Najm Al-Sham', N'Arabian', N'Stallion', 48, N'Well-trained Arabian stallion with excellent movement and calm temperament.', 7200, N'Amman, Jordan', 0, 1, 1, 1, N'Annual vaccination complete.', DATEADD(day, -18, @Now), @DemoSpeciesHorse, N'demo-owner-01', 1),
    (N'demo-animal-02', N'Wardah', N'Holstein', N'Female', 32, N'Healthy dairy cow with strong production records and complete vaccination history.', 2400, N'Irbid, Jordan', 0, 1, 1, 1, N'Milk production records available on request.', DATEADD(day, -16, @Now), @DemoSpeciesCattle, N'demo-owner-02', 1),
    (N'demo-animal-03', N'Barq', N'Awassi', N'Ram', 20, N'Large-framed Awassi ram suitable for breeding programs.', 550, N'Zarqa, Jordan', 2, 1, 1, 1, N'Pedigree documentation included.', DATEADD(day, -15, @Now), @DemoSpeciesSheep, N'demo-owner-03', 1),
    (N'demo-animal-04', N'Sama', N'Damascus', N'Doe', 26, N'High-quality dairy goat, gentle and easy to handle.', 680, N'Madaba, Jordan', 0, 0, 1, 1, N'Good dairy lineage.', DATEADD(day, -13, @Now), @DemoSpeciesGoat, N'demo-owner-04', 1),
    (N'demo-animal-05', N'Wadi Champion', N'Majaheem', N'Bull Camel', 66, N'Racing camel from a proven champion bloodline.', 18500, N'Mafraq, Jordan', 2, 1, 1, 1, N'Race results and veterinary report attached.', DATEADD(day, -12, @Now), @DemoSpeciesCamel, N'demo-owner-02', 1),
    (N'demo-animal-06', N'Layali', N'Arabian', N'Mare', 42, N'Graceful mare with show experience and a responsive nature.', 9200, N'Salt, Jordan', 0, 1, 1, 1, N'Experienced rider recommended.', DATEADD(day, -10, @Now), @DemoSpeciesHorse, N'demo-owner-01', 1),
    (N'demo-animal-07', N'Fajr', N'Jersey', N'Female', 28, N'Compact dairy cow with consistent yield and quiet behavior.', 2100, N'Irbid, Jordan', 1, 0, 1, 0, N'Awaiting transfer inspection.', DATEADD(day, -9, @Now), @DemoSpeciesCattle, N'demo-owner-02', 1),
    (N'demo-animal-08', N'Qamar', N'Baladi', N'Doe', 18, N'Healthy young goat suitable for household dairy production.', 420, N'Jerash, Jordan', 0, 0, 1, 0, N'Young and recently weaned.', DATEADD(day, -8, @Now), @DemoSpeciesGoat, N'demo-owner-03', 1),
    (N'demo-animal-09', N'Rimal', N'Awassi', N'Ewe', 30, N'Productive ewe with healthy lambing history.', 390, N'Karak, Jordan', 0, 0, 1, 1, N'Veterinary check completed this season.', DATEADD(day, -7, @Now), @DemoSpeciesSheep, N'demo-owner-04', 1),
    (N'demo-animal-10', N'Asil', N'Arabian', N'Filly', 16, N'Promising young filly with a documented pedigree.', 4600, N'Amman, Jordan', 0, 1, 1, 1, N'Very good conformation.', DATEADD(day, -6, @Now), @DemoSpeciesHorse, N'demo-owner-01', 1),
    (N'demo-animal-11', N'Najah', N'Baladi', N'Female', 36, N'Reliable local dairy cow for a small farm operation.', 1650, N'Aqaba, Jordan', 3, 0, 1, 1, N'Sold demo listing.', DATEADD(day, -5, @Now), @DemoSpeciesCattle, N'demo-owner-04', 1),
    (N'demo-animal-12', N'Sahab', N'Dromedary', N'Camel', 54, N'Healthy working camel with a calm disposition.', 8700, N'Tafilah, Jordan', 0, 0, 1, 0, N'Available for a farm inspection.', DATEADD(day, -4, @Now), @DemoSpeciesCamel, N'demo-owner-03', 1);

INSERT INTO AnimalImages (AnimalId, ImageUrl, IsMain)
SELECT v.AnimalId, v.ImageUrl, 1
FROM (VALUES
    (N'demo-animal-01', N'/images/seed/horse1.jpg'), (N'demo-animal-02', N'/images/seed/cattle1.jpg'),
    (N'demo-animal-03', N'/images/seed/sheep1.jpg'), (N'demo-animal-04', N'/images/seed/goat1.jpg'),
    (N'demo-animal-05', N'/images/seed/camel1.jpg'), (N'demo-animal-06', N'/images/seed/horse1.jpg'),
    (N'demo-animal-07', N'/images/seed/cattle1.jpg'), (N'demo-animal-08', N'/images/seed/goat1.jpg'),
    (N'demo-animal-09', N'/images/seed/sheep1.jpg'), (N'demo-animal-10', N'/images/seed/horse1.jpg'),
    (N'demo-animal-11', N'/images/seed/cattle1.jpg'), (N'demo-animal-12', N'/images/seed/camel1.jpg')
) v(AnimalId, ImageUrl)
WHERE NOT EXISTS (SELECT 1 FROM AnimalImages i WHERE i.AnimalId = v.AnimalId AND i.IsMain = 1);

INSERT INTO AnimalHealthRecords (AnimalId, Title, Meta, RecordDate)
VALUES
    (N'demo-animal-01', N'Annual vaccination', N'Dr. Hala Mansour', DATEADD(month, -2, @Now)),
    (N'demo-animal-02', N'Brucellosis screening', N'Clear - laboratory report', DATEADD(month, -1, @Now)),
    (N'demo-animal-05', N'Racing fitness certificate', N'Dr. Ahmad Khalil', DATEADD(day, -20, @Now)),
    (N'demo-animal-09', N'Pregnancy and herd health check', N'Dr. Tareq Abu Ali', DATEADD(day, -30, @Now));

/* Auction inventory includes live, ending soon, upcoming, and completed examples. */
INSERT INTO Auctions
    (Id, LotNumber, AnimalId, Title, StartingPrice, CurrentPrice, MinIncrement, StartTime, EndTime,
     Status, ModerationStatus, ModeratedAt, ModeratedByAdminId, HighestBidderId)
VALUES
    (N'demo-auction-01', 2101, N'demo-animal-03', N'Prime Awassi Ram - Breeding Lot', 350, 620, 20, DATEADD(hour, -4, @Now), DATEADD(hour, 3, @Now), 5, 1, DATEADD(day, -1, @Now), @AdminId, N'demo-buyer-01'),
    (N'demo-auction-02', 2102, N'demo-animal-05', N'Wadi Champion Racing Camel', 12000, 16800, 250, DATEADD(hour, -2, @Now), DATEADD(hour, 18, @Now), 1, 1, DATEADD(day, -1, @Now), @AdminId, N'demo-buyer-02'),
    (N'demo-auction-03', 2103, N'demo-animal-07', N'Jersey Dairy Cow - Verified Production', 1500, 1500, 50, DATEADD(day, 1, @Now), DATEADD(day, 3, @Now), 4, 1, DATEADD(day, -1, @Now), @AdminId, NULL),
    (N'demo-auction-04', 2104, N'demo-animal-11', N'Local Dairy Cow - Completed Sale', 1100, 1480, 40, DATEADD(day, -8, @Now), DATEADD(day, -6, @Now), 2, 1, DATEADD(day, -7, @Now), @AdminId, N'demo-buyer-01');

INSERT INTO Bids (AuctionId, UserId, Amount, PlacedAt)
VALUES
    (N'demo-auction-01', N'demo-buyer-01', 410, DATEADD(hour, -3, @Now)),
    (N'demo-auction-01', N'demo-buyer-02', 470, DATEADD(hour, -2, @Now)),
    (N'demo-auction-01', N'demo-buyer-01', 620, DATEADD(minute, -35, @Now)),
    (N'demo-auction-02', N'demo-buyer-01', 12500, DATEADD(hour, -1, @Now)),
    (N'demo-auction-02', N'demo-buyer-02', 15000, DATEADD(minute, -40, @Now)),
    (N'demo-auction-02', N'demo-buyer-02', 16800, DATEADD(minute, -12, @Now)),
    (N'demo-auction-04', N'demo-buyer-01', 1480, DATEADD(day, -6, @Now));

/* Two additional veterinarian profiles plus their services, history, and schedules. */
INSERT INTO VetProfiles
    (Id, UserId, Specialty, Bio, ClinicLocation, YearsOfExperience, IsVerified, Rating, ReviewCount,
     ConsultationFee, AvailabilityStatus, AvailabilityWindow, AvailabilityText, IsFeatured,
     Credential, CreatedAt, VerifiedAt, VerifiedByAdminId)
VALUES
    (N'demo-vet-profile-01', N'demo-vet-01', N'Equine and Large Animal',
     N'Dr. Hala provides mobile herd health, equine reproductive care, and preventive medicine across northern Jordan.',
     N'Irbid, Jordan', 14, 1, 4.8, 3, 45, N'available', N'today', N'Available Today', 1,
     N'D.V.M.', DATEADD(day, -250, @Now), DATEADD(day, -240, @Now), NULL),
    (N'demo-vet-profile-02', N'demo-vet-02', N'Livestock Nutrition',
     N'Dr. Tareq specializes in cattle nutrition, flock vaccination programs, and on-farm disease prevention.',
     N'Karak, Jordan', 10, 1, 4.6, 2, 35, N'busy', N'week', N'Next slot Thursday', 1,
     N'D.V.M.', DATEADD(day, -230, @Now), DATEADD(day, -220, @Now), NULL);

INSERT INTO VeterinaryServices (VetProfileId, Title, Description, Price, IsUrgent, Icon)
VALUES
    (N'demo-vet-profile-01', N'Equine Health Examination', N'Complete mobile examination and written care plan.', 45, 0, N'medical_services'),
    (N'demo-vet-profile-01', N'Emergency Farm Call', N'Priority on-site response for urgent animal cases.', 110, 1, N'emergency'),
    (N'demo-vet-profile-01', N'Breeding Consultation', N'Reproductive planning and ultrasound referral.', 65, 0, N'female'),
    (N'demo-vet-profile-02', N'Herd Nutrition Audit', N'Feed review and practical nutrition recommendations.', 35, 0, N'grass'),
    (N'demo-vet-profile-02', N'Flock Vaccination Program', N'Group vaccination planning and follow-up.', 25, 0, N'vaccines');

INSERT INTO VetTimelineEvents (VetProfileId, Title, Description, StartDate, EndDate)
VALUES
    (N'demo-vet-profile-01', N'Jordan University of Science and Technology', N'D.V.M. Degree', '2007-09-01', '2011-06-01'),
    (N'demo-vet-profile-01', N'Northern Mobile Vet Clinic', N'Lead Equine Veterinarian', '2012-01-01', NULL),
    (N'demo-vet-profile-02', N'Mutasim Veterinary College', N'D.V.M. Degree', '2011-09-01', '2015-06-01'),
    (N'demo-vet-profile-02', N'Karak Livestock Health Center', N'Livestock Nutrition Specialist', '2016-01-01', NULL);

INSERT INTO VetScheduleSlots (VetProfileId, DayOfWeek, TimeLabel, Status)
VALUES
    (N'demo-vet-profile-01', N'Sunday', N'9:00 AM - 4:00 PM', N'available'),
    (N'demo-vet-profile-01', N'Monday', N'9:00 AM - 4:00 PM', N'available'),
    (N'demo-vet-profile-01', N'Wednesday', N'10:00 AM - 2:00 PM', N'limited'),
    (N'demo-vet-profile-01', N'Friday', N'Emergency Only', N'emergency'),
    (N'demo-vet-profile-02', N'Sunday', N'8:00 AM - 3:00 PM', N'available'),
    (N'demo-vet-profile-02', N'Tuesday', N'8:00 AM - 3:00 PM', N'available'),
    (N'demo-vet-profile-02', N'Thursday', N'1:00 PM - 5:00 PM', N'limited'),
    (N'demo-vet-profile-02', N'Friday', N'', N'off');

INSERT INTO Appointments (Id, ClientId, VetProfileId, RequestedDate, Notes, Status, CreatedAt)
VALUES
    (N'demo-appointment-01', N'demo-buyer-01', N'demo-vet-profile-01', DATEADD(day, -18, @Now), N'Routine examination for a young mare.', 3, DATEADD(day, -25, @Now)),
    (N'demo-appointment-02', N'demo-owner-02', N'demo-vet-profile-02', DATEADD(day, -9, @Now), N'Vaccination plan for a 30-head flock.', 3, DATEADD(day, -15, @Now)),
    (N'demo-appointment-03', N'demo-owner-01', N'demo-vet-profile-01', DATEADD(day, 2, @Now), N'Follow-up on equine nutrition and conditioning.', 0, DATEADD(day, -1, @Now)),
    (N'demo-appointment-04', N'demo-buyer-02', N'demo-vet-profile-02', DATEADD(day, 5, @Now), N'On-farm herd nutrition audit.', 1, DATEADD(day, -2, @Now));

INSERT INTO VetReviews (AppointmentId, VetProfileId, ReviewerId, Rating, Text, CreatedAt)
VALUES
    (N'demo-appointment-01', N'demo-vet-profile-01', N'demo-buyer-01', 5, N'Clear diagnosis, excellent communication, and very gentle handling.', DATEADD(day, -16, @Now)),
    (N'demo-appointment-02', N'demo-vet-profile-02', N'demo-owner-02', 4, N'Professional vaccination plan with useful follow-up guidance.', DATEADD(day, -7, @Now));

/* Watchlists and saved veterinarians exercise authenticated account flows. */
INSERT INTO Favorites (UserId, AnimalId)
SELECT v.UserId, v.AnimalId
FROM (VALUES
    (N'demo-buyer-01', N'demo-animal-01'), (N'demo-buyer-01', N'demo-animal-06'),
    (N'demo-buyer-02', N'demo-animal-02'), (N'demo-buyer-02', N'demo-animal-09'),
    (N'demo-owner-03', N'demo-animal-10')
) v(UserId, AnimalId)
WHERE NOT EXISTS (SELECT 1 FROM Favorites f WHERE f.UserId = v.UserId AND f.AnimalId = v.AnimalId);

INSERT INTO VetFavorites (UserId, VetProfileId)
SELECT v.UserId, v.VetProfileId
FROM (VALUES
    (N'demo-buyer-01', N'demo-vet-profile-01'),
    (N'demo-buyer-02', N'demo-vet-profile-02'),
    (N'demo-owner-03', N'demo-vet-profile-01')
) v(UserId, VetProfileId)
WHERE NOT EXISTS (SELECT 1 FROM VetFavorites f WHERE f.UserId = v.UserId AND f.VetProfileId = v.VetProfileId);

COMMIT TRANSACTION;

SELECT
    (SELECT COUNT(*) FROM AspNetUsers WHERE Id LIKE N'demo-%') AS DemoUsers,
    (SELECT COUNT(*) FROM Animals WHERE Id LIKE N'demo-%') AS DemoAnimals,
    (SELECT COUNT(*) FROM Auctions WHERE Id LIKE N'demo-%') AS DemoAuctions,
    (SELECT COUNT(*) FROM VetProfiles WHERE Id LIKE N'demo-%') AS DemoVeterinarians,
    (SELECT COUNT(*) FROM Appointments WHERE Id LIKE N'demo-%') AS DemoAppointments;
