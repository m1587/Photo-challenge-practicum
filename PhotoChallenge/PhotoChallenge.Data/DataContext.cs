using PhotoChallenge.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
namespace PhotoChallenge.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Challenge> Challenges { get; set; }
        public DbSet<Vote> Votes { get; set; }
        public DbSet<Image> Images { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string dbServer = Environment.GetEnvironmentVariable("DB_SERVER");
            string dbPort = Environment.GetEnvironmentVariable("DB_PORT");
            string dbName = Environment.GetEnvironmentVariable("DB_DATABASE");
            string dbUser = Environment.GetEnvironmentVariable("DB_USER");
            string dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

            string connectionString = $"Server={dbServer};Port={dbPort};Database={dbName};User={dbUser};Password={dbPassword}";
            optionsBuilder.UseMySql(
              @connectionString,
                new MySqlServerVersion(new Version(9, 0, 0))
            );
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Challenge>()
                .HasOne(c => c.WinnerImg)
                .WithMany()
                .HasForeignKey(c => c.WinnerImgId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Challenge>()
                .HasOne(c => c.WinnerUser)
                .WithMany()
                .HasForeignKey(c => c.WinnerUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
    }
}
