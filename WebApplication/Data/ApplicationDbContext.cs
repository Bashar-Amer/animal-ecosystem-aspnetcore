using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApp.Models;

namespace WebApp.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Animal> Animals { get; set; }
        public DbSet<AnimalImage> AnimalImages { get; set; }
        public DbSet<Species> Species { get; set; }
        public DbSet<Auction> Auctions { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<VetProfile> VetProfiles { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        // NOTE: EF Core has no data-annotation attribute for delete behavior (CASCADE/RESTRICT),
        // so this is the only fluent configuration left. Everything else (foreign keys, unique
        // constraints for one-to-one relationships, column types) is on the model classes via
        // [ForeignKey], [Index], and [Column] attributes.
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); // required for Identity tables

            builder.Entity<Animal>()
                .HasOne(a => a.Species)
                .WithMany(c => c.Animals)
                .HasForeignKey(a => a.SpeciesId)
                .OnDelete(DeleteBehavior.Restrict); // don't wipe animals if a category is deleted

            builder.Entity<Auction>()
                .HasOne(au => au.HighestBidder)
                .WithMany()
                .HasForeignKey(au => au.HighestBidderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Bid>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bids)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict); // keep bid history even if a user is removed

            builder.Entity<Appointment>()
                .HasOne(ap => ap.Client)
                .WithMany(u => u.AppointmentsAsClient)
                .HasForeignKey(ap => ap.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            // Everything else (Animal->Owner, Auction->Animal, VetProfile->User,
            // Appointment->VetProfile, Bid->Auction) uses EF Core's default Cascade
            // behavior, which is what we want for those relationships anyway.
        }
    }
}
