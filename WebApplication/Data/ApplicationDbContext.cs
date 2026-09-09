using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using WebApp.Extensions;
using WebApp.Models;

namespace WebApp.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Animal> Animals { get; set; }
        public DbSet<AnimalImage> AnimalImages { get; set; }
        public DbSet<AnimalHealthRecord> AnimalHealthRecords { get; set; }
        public DbSet<Species> Species { get; set; }
        public DbSet<Auction> Auctions { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<VetProfile> VetProfiles { get; set; }
        public DbSet<VetReview> VetReviews { get; set; }
        public DbSet<VeterinaryService> VeterinaryServices { get; set; }
        public DbSet<VetTimelineEvent> VetTimelineEvents { get; set; }
        public DbSet<VetScheduleSlot> VetScheduleSlots { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Global default: no cascading deletes. This prevents multi-path cascade
            // cycles (common once ApplicationUser is referenced from many entities)
            // and is generally safer — deleting a user shouldn't silently wipe out
            // their bids, reviews, appointments, etc.
            foreach (var foreignKey in modelBuilder.Model
                .GetEntityTypes()
                .SelectMany(e => e.GetForeignKeys())
                .Where(fk => fk.DeleteBehavior == DeleteBehavior.Cascade))
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
            }

            modelBuilder.Entity<Animal>()
                .HasMany(a => a.Images)
                .WithOne(i => i.Animal)
                .HasForeignKey(i => i.AnimalId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Animal>()
                .HasMany(a => a.HealthRecords)
                .WithOne(h => h.Animal)
                .HasForeignKey(h => h.AnimalId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Auction>()
                .HasMany(a => a.Bids)
                .WithOne(b => b.Auction)
                .HasForeignKey(b => b.AuctionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VetProfile>()
                .HasMany(v => v.Services)
                .WithOne(s => s.VetProfile)
                .HasForeignKey(s => s.VetProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VetProfile>()
                .HasMany(v => v.TimelineEvents)
                .WithOne(t => t.VetProfile)
                .HasForeignKey(t => t.VetProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VetProfile>()
                .HasMany(v => v.WeeklySchedule)
                .WithOne(s => s.VetProfile)
                .HasForeignKey(s => s.VetProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VetProfile>()
                .HasMany(v => v.Reviews)
                .WithOne(r => r.VetProfile)
                .HasForeignKey(r => r.VetProfileId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
