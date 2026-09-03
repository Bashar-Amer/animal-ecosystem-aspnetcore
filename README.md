🐾 Animal Ecosystem - Project Documentation
📖 1. Project Overview
Animal Ecosystem is a specialized digital platform designed for the Jordanian market to connect animal owners, farmers, buyers, sellers, and veterinarians.

Purpose
The system aims to solve the "Trust Gap" in animal commerce by integrating health verification and professional veterinary services directly into the marketplace and auction house.

Main Features
Animal Marketplace: A classifieds section for buying/selling animals with category filters.
Live Auctions: A real-time bidding system for high-value livestock or pets.
Veterinary Directory: A booking system to connect with verified specialists (Equine, Poultry, etc.).
Trust System: Verification badges for sellers and veterinarians to ensure platform safety.
Target Users
Farmers/Owners: Manage their herds, sell animals, and track vet appointments.
Buyers: Search for animals, compare prices, and participate in auctions.
Veterinarians: Offer professional services and manage medical consultations.
Admins: Oversee the platform, verify users, and moderate content.

⚙️ 2. Functional Requirements
Authentication & Authorization
Identity Management: Users can register as "Regular User" or "Veterinarian."
Role-Based Access (RBAC):
Users can list animals and bid.
Vets can manage their medical profiles.
Admins can access the dashboard for moderation.
Core System Features
Animal Management (CRUD): Users can Create, Read, Update, and Delete animal listings.
Auction Logic: System manages auction states (Starting Soon, Live, Ended) and tracks the highest bidder.
Booking System: Users can request appointments; Vets can accept or decline.
Search & Filter: Advanced filtering by animal type, breed, location, and price.
Admin Functionalities
Verification Portal: Review user documents and grant "Verified" badges.
Category Control: Manage animal categories and medical specialties.
System Moderation: Remove inappropriate listings or ban fraudulent users.

🛡️ 3. Non-Functional Requirements
Performance: All pages (especially the Marketplace) should load within 2 seconds.
Security: Use of Anti-Forgery Tokens (CSRF protection) and password hashing via ASP.NET Identity.
Usability: Mobile-first design (Bootstrap) to ensure accessibility for farmers in the field.
Reliability: Use of Entity Framework Transactions to ensure auction bids are recorded accurately without data loss.

🗄️ 4. Database Design & Connection
The system uses SQL Server and is implemented via Entity Framework Core (Code First).

Entities & Relationships
Users: Stores profile info, roles, and verification status.
Animals: Linked to a Category and an Owner (User).
Auctions: One-to-one relationship with an Animal.
Bids: Many-to-one relationship with Auctions and Users.
VetProfiles: Extended data for veterinarian users.
Appointments: Links a User and a Veterinarian.
Implementation Details
Approach: Code First.
ORM: Entity Framework Core.
Migrations: All database changes are tracked via Add-Migration.
Connection String: Configured in appsettings.json.

🎨 5. Front-End Design
The frontend is built using a component-based architecture with HTML5, CSS3, JavaScript, and Bootstrap.

Page Mapping
The following vanilla pages are migrated to ASP.NET MVC Views:

index.html → Home/Index.cshtml
marketplace.html → Marketplace/Index.cshtml
animal-details.html → Marketplace/Details.cshtml
auctions.html → Auction/Index.cshtml
veterinary.html → Vet/Index.cshtml
my-animals.html → Dashboard/MyAnimals.cshtml
Design System
The project follows a "Premium Natural" aesthetic:

Colors: Earthy tones (Greens/Browns) mixed with modern professional grays.
CSS Architecture:
abstracts/: Variables and mixins.
components/: Reusable buttons, cards, and badges.
utilities/: RTL support and spacing.

💻 6. Technical Stack
Backend: ASP.NET Core 8.0 MVC (or API).
Database: MS SQL Server.
Frontend: Bootstrap 5, Vanilla JS, CSS3.
Tools: Visual Studio 2022, Git/GitHub.

🧩 7. Installation & Setup
Clone the repository: git clone [Your-Repo-Link]
Navigate to the project folder.
Update appsettings.json with your SQL Server connection string.
Run migrations:

Bash

dotnet ef database update
Run the project:
Bash

dotnet run
