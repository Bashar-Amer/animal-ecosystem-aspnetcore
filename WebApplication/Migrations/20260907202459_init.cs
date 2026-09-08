using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebApp.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfileImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    VerificationDocumentUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Species",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Species", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VetProfiles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Specialty = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Bio = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ClinicLocation = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    YearsOfExperience = table.Column<int>(type: "int", nullable: false),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    LicenseDocumentUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VetProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VetProfiles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Animals",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Breed = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    AgeInMonths = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    IsVetChecked = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SpeciesId = table.Column<int>(type: "int", nullable: false),
                    OwnerId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Animals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Animals_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Animals_Species_SpeciesId",
                        column: x => x.SpeciesId,
                        principalTable: "Species",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    VetProfileId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RequestedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointments_AspNetUsers_ClientId",
                        column: x => x.ClientId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Appointments_VetProfiles_VetProfileId",
                        column: x => x.VetProfileId,
                        principalTable: "VetProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnimalImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AnimalId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IsMain = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnimalImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnimalImages_Animals_AnimalId",
                        column: x => x.AnimalId,
                        principalTable: "Animals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Auctions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LotNumber = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AnimalId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartingPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CurrentPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MinIncrement = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    HighestBidderId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auctions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Auctions_Animals_AnimalId",
                        column: x => x.AnimalId,
                        principalTable: "Animals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Auctions_AspNetUsers_HighestBidderId",
                        column: x => x.HighestBidderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Favorite",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AnimalId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Favorite", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Favorite_Animals_AnimalId",
                        column: x => x.AnimalId,
                        principalTable: "Animals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Favorite_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Bids",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AuctionId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PlacedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bids", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bids_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Bids_Auctions_AuctionId",
                        column: x => x.AuctionId,
                        principalTable: "Auctions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "CreatedAt", "Email", "EmailConfirmed", "FullName", "IsVerified", "Location", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "ProfileImageUrl", "SecurityStamp", "TwoFactorEnabled", "UserName", "VerificationDocumentUrl" },
                values: new object[,]
                {
                    { "user-bidder-guid-2", 0, "e34de3c3-3ac8-423a-8a1b-6abd62098c13", new DateTime(2026, 1, 5, 0, 0, 0, 0, DateTimeKind.Utc), "sami@example.com", true, "Sami Al-Khatib", true, "Amman, Jordan", false, null, "SAMI@EXAMPLE.COM", "SAMI_BUYER", "PREGENERATED_HASH_1", null, false, null, "e34de3c3-3ac8-423a-8a1b-6abd62098c13", false, "sami_buyer", null },
                    { "user-buyer-guid-7", 0, "10000000-0000-0000-0000-000000000007", new DateTime(2026, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), "ali@example.com", true, "Ali Saleh", true, "Amman, Jordan", false, null, "ALI@EXAMPLE.COM", "ALI_BUYER", "PREGENERATED_HASH_1", null, false, null, "10000000-0000-0000-0000-000000000007", false, "ali_buyer", null },
                    { "user-buyer-guid-8", 0, "10000000-0000-0000-0000-000000000008", new DateTime(2026, 2, 5, 0, 0, 0, 0, DateTimeKind.Utc), "mohammad@example.com", true, "Mohammad Ahmad", false, "Salt, Jordan", false, null, "MOHAMMAD@EXAMPLE.COM", "MOHAMMAD_FARMER", "PREGENERATED_HASH_1", null, false, null, "10000000-0000-0000-0000-000000000008", false, "mohammad_farmer", null },
                    { "user-buyer-guid-9", 0, "10000000-0000-0000-0000-000000000009", new DateTime(2026, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "fadi@example.com", true, "Fadi Nassar", true, "Jerash, Jordan", false, null, "FADI@EXAMPLE.COM", "FADI_ANIMALS", "PREGENERATED_HASH_1", null, false, null, "10000000-0000-0000-0000-000000000009", false, "fadi_animals", null },
                    { "user-owner-guid-1", 0, "e49ccae4-2d95-4e73-82ad-fe4bf1414b8c", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "ahmad@example.com", true, "Ahmad Al-Farmawi", true, "Irbid, Jordan", false, null, "AHMAD@EXAMPLE.COM", "AHMAD_FARMER", "PREGENERATED_HASH_1", null, false, null, "e49ccae4-2d95-4e73-82ad-fe4bf1414b8c", false, "ahmad_farmer", null },
                    { "user-owner-guid-4", 0, "10000000-0000-0000-0000-000000000004", new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), "yousef@example.com", true, "Yousef Haddad", true, "Mafraq, Jordan", false, null, "YOUSEF@EXAMPLE.COM", "YOUSEF_LIVESTOCK", "PREGENERATED_HASH_1", null, false, null, "10000000-0000-0000-0000-000000000004", false, "yousef_livestock", null },
                    { "user-owner-guid-5", 0, "10000000-0000-0000-0000-000000000005", new DateTime(2026, 1, 20, 0, 0, 0, 0, DateTimeKind.Utc), "omar@example.com", true, "Omar Al-Zoubi", false, "Zarqa, Jordan", false, null, "OMAR@EXAMPLE.COM", "OMAR_FARM", "PREGENERATED_HASH_1", null, false, null, "10000000-0000-0000-0000-000000000005", false, "omar_farm", null },
                    { "user-owner-guid-6", 0, "10000000-0000-0000-0000-000000000006", new DateTime(2026, 1, 25, 0, 0, 0, 0, DateTimeKind.Utc), "khaled@example.com", true, "Khaled Al-Rashdan", true, "Amman, Jordan", false, null, "KHALED@EXAMPLE.COM", "KHALED_HORSES", "PREGENERATED_HASH_1", null, false, null, "10000000-0000-0000-0000-000000000006", false, "khaled_horses", null },
                    { "user-vet-guid-3", 0, "6b77ad96-eaca-4af0-a5da-8a05e6d2ecb4", new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Utc), "rami.vet@example.com", true, "Dr. Rami Naser", true, "Irbid, Jordan", false, null, "RAMI.VET@EXAMPLE.COM", "DR_RAMI", "PREGENERATED_HASH_1", null, false, null, "6b77ad96-eaca-4af0-a5da-8a05e6d2ecb4", false, "dr_rami", null }
                });

            migrationBuilder.InsertData(
                table: "Species",
                columns: new[] { "Id", "Description", "IconUrl", "Name" },
                values: new object[,]
                {
                    { 1, "Sheep, goats, cows, and camels", "/images/species/livestock.png", "Livestock" },
                    { 2, "Horses, donkeys, and ponies", "/images/species/equine.png", "Equine" },
                    { 3, "Chickens, ducks, and turkeys", "/images/species/poultry.png", "Poultry" }
                });

            migrationBuilder.InsertData(
                table: "Animals",
                columns: new[] { "Id", "AgeInMonths", "Breed", "CreatedAt", "Description", "Gender", "IsVerified", "IsVetChecked", "Location", "Name", "OwnerId", "Price", "SpeciesId", "Status" },
                values: new object[,]
                {
                    { "animal-guid-1", 14, "Assaf", new DateTime(2026, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Healthy, high-grade breeding ram. Fully vaccinated.", "Male", true, true, "Irbid, Jordan", "Assaf Ram", "user-owner-guid-1", 350.00m, 1, 2 },
                    { "animal-guid-10", 72, "Dromedary", new DateTime(2026, 2, 18, 0, 0, 0, 0, DateTimeKind.Utc), "Strong healthy Arabian camel suitable for breeding and farm use.", "Male", true, true, "Mafraq, Jordan", "Arabian Camel", "user-owner-guid-4", 3200.00m, 1, 2 },
                    { "animal-guid-11", 36, "Dromedary", new DateTime(2026, 2, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Young female camel with good health indicators.", "Female", false, false, "Azraq, Jordan", "Young Female Camel", "user-owner-guid-5", 2900.00m, 1, 0 },
                    { "animal-guid-12", 60, "Arabian", new DateTime(2026, 2, 22, 0, 0, 0, 0, DateTimeKind.Utc), "Well-trained Arabian stallion with strong bloodline and excellent movement.", "Male", true, true, "Amman, Jordan", "Arabian Stallion", "user-owner-guid-6", 7500.00m, 2, 2 },
                    { "animal-guid-13", 84, "Arabian", new DateTime(2026, 2, 24, 0, 0, 0, 0, DateTimeKind.Utc), "Experienced Arabian mare with calm temperament.", "Female", true, false, "Salt, Jordan", "Chestnut Mare", "user-owner-guid-6", 4200.00m, 2, 0 },
                    { "animal-guid-14", 54, "Baladi", new DateTime(2026, 2, 25, 0, 0, 0, 0, DateTimeKind.Utc), "Strong working donkey suitable for farm transportation.", "Male", false, true, "Jerash, Jordan", "Baladi Donkey", "user-owner-guid-5", 650.00m, 2, 0 },
                    { "animal-guid-15", 20, "Local", new DateTime(2026, 2, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Young healthy donkey with calm behavior.", "Female", false, false, "Irbid, Jordan", "Young Donkey", "user-owner-guid-1", 500.00m, 2, 0 },
                    { "animal-guid-16", 8, "Rhode Island Red", new DateTime(2026, 2, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Healthy rooster suitable for breeding.", "Male", true, true, "Zarqa, Jordan", "Rhode Island Rooster", "user-owner-guid-5", 35.00m, 3, 0 },
                    { "animal-guid-17", 10, "Rhode Island Red", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Healthy laying hen with good egg production.", "Female", true, true, "Irbid, Jordan", "Rhode Island Hen", "user-owner-guid-1", 30.00m, 3, 0 },
                    { "animal-guid-18", 7, "Broad Breasted White", new DateTime(2026, 3, 2, 0, 0, 0, 0, DateTimeKind.Utc), "Healthy large turkey suitable for farm breeding.", "Male", false, false, "Mafraq, Jordan", "Broad Breasted Turkey", "user-owner-guid-4", 80.00m, 3, 2 },
                    { "animal-guid-2", 24, "Straight Egyptian", new DateTime(2026, 2, 3, 0, 0, 0, 0, DateTimeKind.Utc), "Purebred young Arabian horse with excellent temperament.", "Female", true, true, "Amman, Jordan", "Arabian Filly", "user-owner-guid-1", 2500.00m, 2, 0 },
                    { "animal-guid-3", 22, "Awassi", new DateTime(2026, 2, 6, 0, 0, 0, 0, DateTimeKind.Utc), "Healthy Awassi ewe suitable for breeding. Good milk production.", "Female", true, true, "Mafraq, Jordan", "Awassi Ewe", "user-owner-guid-4", 280.00m, 1, 0 },
                    { "animal-guid-4", 6, "Awassi", new DateTime(2026, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "Young Awassi lamb with excellent body condition.", "Male", false, false, "Irbid, Jordan", "Young Awassi Lamb", "user-owner-guid-5", 150.00m, 1, 0 },
                    { "animal-guid-5", 30, "Damascus (Shami)", new DateTime(2026, 2, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Large Shami goat with excellent milk production history.", "Female", true, true, "Zarqa, Jordan", "Shami Doe", "user-owner-guid-5", 450.00m, 1, 0 },
                    { "animal-guid-6", 18, "Boer", new DateTime(2026, 2, 12, 0, 0, 0, 0, DateTimeKind.Utc), "Strong Boer buck suitable for breeding and meat production.", "Male", true, false, "Mafraq, Jordan", "Boer Buck", "user-owner-guid-4", 520.00m, 1, 2 },
                    { "animal-guid-7", 8, "Shami", new DateTime(2026, 2, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Young healthy Shami goat with good growth potential.", "Male", false, true, "Salt, Jordan", "Young Shami Goat", "user-buyer-guid-8", 190.00m, 1, 0 },
                    { "animal-guid-8", 48, "Holstein", new DateTime(2026, 2, 15, 0, 0, 0, 0, DateTimeKind.Utc), "High-producing dairy cow with healthy udder and excellent milk history.", "Female", true, true, "Irbid, Jordan", "Holstein Dairy Cow", "user-owner-guid-1", 1800.00m, 1, 0 },
                    { "animal-guid-9", 9, "Baladi", new DateTime(2026, 2, 17, 0, 0, 0, 0, DateTimeKind.Utc), "Healthy young calf, ideal for small farms.", "Male", true, true, "Jerash, Jordan", "Baladi Calf", "user-buyer-guid-9", 850.00m, 1, 0 }
                });

            migrationBuilder.InsertData(
                table: "VetProfiles",
                columns: new[] { "Id", "Bio", "ClinicLocation", "IsVerified", "LicenseDocumentUrl", "Specialty", "UserId", "YearsOfExperience" },
                values: new object[] { "vet-profile-id-1", "Experienced large animal veterinarian with over 10 years of practice in northern Jordan.", "Irbid Veterinary Clinic, Main Street", true, "/docs/licenses/vet_rami.pdf", "Livestock & Equine", "user-vet-guid-3", 10 });

            migrationBuilder.InsertData(
                table: "AnimalImages",
                columns: new[] { "Id", "AnimalId", "ImageUrl", "IsMain" },
                values: new object[,]
                {
                    { 1, "animal-guid-1", "/images/animals/placeholder.jfif", true },
                    { 2, "animal-guid-1", "/images/animals/placeholder.jfif", false },
                    { 3, "animal-guid-2", "/images/animals/placeholder.jfif", true },
                    { 4, "animal-guid-3", "/images/animals/placeholder.jfif", true },
                    { 5, "animal-guid-4", "/images/animals/placeholder.jfif", true },
                    { 6, "animal-guid-5", "/images/animals/placeholder.jfif", true },
                    { 7, "animal-guid-6", "/images/animals/placeholder.jfif", true },
                    { 8, "animal-guid-7", "/images/animals/placeholder.jfif", true },
                    { 9, "animal-guid-8", "/images/animals/placeholder.jfif", true },
                    { 10, "animal-guid-9", "/images/animals/placeholder.jfif", true },
                    { 11, "animal-guid-10", "/images/animals/placeholder.jfif", true },
                    { 12, "animal-guid-11", "/images/animals/placeholder.jfif", true },
                    { 13, "animal-guid-12", "/images/animals/placeholder.jfif", true },
                    { 14, "animal-guid-13", "/images/animals/placeholder.jfif", true },
                    { 15, "animal-guid-14", "/images/animals/placeholder.jfif", true },
                    { 16, "animal-guid-15", "/images/animals/placeholder.jfif", true },
                    { 17, "animal-guid-16", "/images/animals/placeholder.jfif", true },
                    { 18, "animal-guid-17", "/images/animals/placeholder.jfif", true },
                    { 19, "animal-guid-18", "/images/animals/placeholder.jfif", true }
                });

            migrationBuilder.InsertData(
                table: "Appointments",
                columns: new[] { "Id", "ClientId", "CreatedAt", "Notes", "RequestedDate", "Status", "VetProfileId" },
                values: new object[,]
                {
                    { "appointment-guid-1", "user-bidder-guid-2", new DateTime(2026, 3, 4, 0, 0, 0, 0, DateTimeKind.Utc), "Routine checkup for a new calf.", new DateTime(2026, 3, 10, 10, 0, 0, 0, DateTimeKind.Utc), 1, "vet-profile-id-1" },
                    { "appointment-guid-2", "user-buyer-guid-7", new DateTime(2026, 3, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Pre-purchase veterinary examination for Boer goat.", new DateTime(2026, 3, 11, 11, 0, 0, 0, DateTimeKind.Utc), 1, "vet-profile-id-1" },
                    { "appointment-guid-3", "user-buyer-guid-8", new DateTime(2026, 3, 6, 0, 0, 0, 0, DateTimeKind.Utc), "Camel health examination and vaccination review.", new DateTime(2026, 3, 12, 9, 30, 0, 0, DateTimeKind.Utc), 1, "vet-profile-id-1" },
                    { "appointment-guid-4", "user-buyer-guid-9", new DateTime(2026, 3, 7, 0, 0, 0, 0, DateTimeKind.Utc), "General examination of Arabian stallion before auction.", new DateTime(2026, 3, 14, 14, 0, 0, 0, DateTimeKind.Utc), 1, "vet-profile-id-1" }
                });

            migrationBuilder.InsertData(
                table: "Auctions",
                columns: new[] { "Id", "AnimalId", "CurrentPrice", "EndTime", "HighestBidderId", "MinIncrement", "StartTime", "StartingPrice", "Status", "Title" },
                values: new object[,]
                {
                    { "auction-guid-1", "animal-guid-1", 320.00m, new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), "user-bidder-guid-2", 10.00m, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), 300.00m, 1, "Auction1" },
                    { "auction-guid-2", "animal-guid-6", 500.00m, new DateTime(2026, 3, 20, 0, 0, 0, 0, DateTimeKind.Utc), "user-buyer-guid-7", 10.00m, new DateTime(2026, 3, 5, 0, 0, 0, 0, DateTimeKind.Utc), 450.00m, 1, "Auction2" },
                    { "auction-guid-3", "animal-guid-10", 3100.00m, new DateTime(2026, 3, 25, 0, 0, 0, 0, DateTimeKind.Utc), "user-buyer-guid-8", 50.00m, new DateTime(2026, 3, 6, 0, 0, 0, 0, DateTimeKind.Utc), 2800.00m, 1, "Auction3" },
                    { "auction-guid-4", "animal-guid-12", 7000.00m, new DateTime(2026, 3, 30, 0, 0, 0, 0, DateTimeKind.Utc), "user-buyer-guid-9", 100.00m, new DateTime(2026, 3, 7, 0, 0, 0, 0, DateTimeKind.Utc), 6500.00m, 1, "Auction4" },
                    { "auction-guid-5", "animal-guid-18", 70.00m, new DateTime(2026, 3, 18, 0, 0, 0, 0, DateTimeKind.Utc), "user-bidder-guid-2", 5.00m, new DateTime(2026, 3, 8, 0, 0, 0, 0, DateTimeKind.Utc), 60.00m, 1, "Auction5" }
                });

            migrationBuilder.InsertData(
                table: "Favorite",
                columns: new[] { "Id", "AnimalId", "UserId" },
                values: new object[,]
                {
                    { 1, "animal-guid-1", "user-bidder-guid-2" },
                    { 2, "animal-guid-2", "user-bidder-guid-2" },
                    { 3, "animal-guid-12", "user-bidder-guid-2" },
                    { 4, "animal-guid-6", "user-buyer-guid-7" },
                    { 5, "animal-guid-8", "user-buyer-guid-7" },
                    { 6, "animal-guid-10", "user-buyer-guid-8" },
                    { 7, "animal-guid-11", "user-buyer-guid-8" },
                    { 8, "animal-guid-12", "user-buyer-guid-9" },
                    { 9, "animal-guid-13", "user-buyer-guid-9" },
                    { 10, "animal-guid-8", "user-owner-guid-1" }
                });

            migrationBuilder.InsertData(
                table: "Bids",
                columns: new[] { "Id", "Amount", "AuctionId", "PlacedAt", "UserId" },
                values: new object[,]
                {
                    { 1, 310.00m, "auction-guid-1", new DateTime(2026, 3, 2, 10, 0, 0, 0, DateTimeKind.Utc), "user-bidder-guid-2" },
                    { 2, 320.00m, "auction-guid-1", new DateTime(2026, 3, 2, 12, 0, 0, 0, DateTimeKind.Utc), "user-buyer-guid-7" },
                    { 3, 460.00m, "auction-guid-2", new DateTime(2026, 3, 5, 10, 0, 0, 0, DateTimeKind.Utc), "user-bidder-guid-2" },
                    { 4, 480.00m, "auction-guid-2", new DateTime(2026, 3, 5, 11, 0, 0, 0, DateTimeKind.Utc), "user-buyer-guid-7" },
                    { 5, 500.00m, "auction-guid-2", new DateTime(2026, 3, 5, 13, 0, 0, 0, DateTimeKind.Utc), "user-buyer-guid-8" },
                    { 6, 2900.00m, "auction-guid-3", new DateTime(2026, 3, 6, 9, 0, 0, 0, DateTimeKind.Utc), "user-buyer-guid-8" },
                    { 7, 3000.00m, "auction-guid-3", new DateTime(2026, 3, 6, 12, 0, 0, 0, DateTimeKind.Utc), "user-bidder-guid-2" },
                    { 8, 3100.00m, "auction-guid-3", new DateTime(2026, 3, 7, 9, 0, 0, 0, DateTimeKind.Utc), "user-buyer-guid-8" },
                    { 9, 6700.00m, "auction-guid-4", new DateTime(2026, 3, 7, 10, 0, 0, 0, DateTimeKind.Utc), "user-buyer-guid-9" },
                    { 10, 6900.00m, "auction-guid-4", new DateTime(2026, 3, 7, 14, 0, 0, 0, DateTimeKind.Utc), "user-bidder-guid-2" },
                    { 11, 7000.00m, "auction-guid-4", new DateTime(2026, 3, 8, 10, 0, 0, 0, DateTimeKind.Utc), "user-buyer-guid-9" },
                    { 12, 65.00m, "auction-guid-5", new DateTime(2026, 3, 8, 11, 0, 0, 0, DateTimeKind.Utc), "user-bidder-guid-2" },
                    { 13, 70.00m, "auction-guid-5", new DateTime(2026, 3, 8, 13, 0, 0, 0, DateTimeKind.Utc), "user-buyer-guid-7" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnimalImages_AnimalId",
                table: "AnimalImages",
                column: "AnimalId");

            migrationBuilder.CreateIndex(
                name: "IX_Animals_OwnerId",
                table: "Animals",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Animals_SpeciesId",
                table: "Animals",
                column: "SpeciesId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_ClientId",
                table: "Appointments",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_VetProfileId",
                table: "Appointments",
                column: "VetProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Auctions_AnimalId",
                table: "Auctions",
                column: "AnimalId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Auctions_HighestBidderId",
                table: "Auctions",
                column: "HighestBidderId");

            migrationBuilder.CreateIndex(
                name: "IX_Bids_AuctionId",
                table: "Bids",
                column: "AuctionId");

            migrationBuilder.CreateIndex(
                name: "IX_Bids_UserId",
                table: "Bids",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Favorite_AnimalId",
                table: "Favorite",
                column: "AnimalId");

            migrationBuilder.CreateIndex(
                name: "IX_Favorite_UserId",
                table: "Favorite",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_VetProfiles_UserId",
                table: "VetProfiles",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnimalImages");

            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Bids");

            migrationBuilder.DropTable(
                name: "Favorite");

            migrationBuilder.DropTable(
                name: "VetProfiles");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "Auctions");

            migrationBuilder.DropTable(
                name: "Animals");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Species");
        }
    }
}
