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
            optionsBuilder.UseMySql(
               @"Server=btqq5f1cn9nne7cyrqrr-mysql.services.clever-cloud.com;Port=3306;Database=btqq5f1cn9nne7cyrqrr;User=uxwrf8zl2kvyjklr;Password=WsmHc65KprRKxTf928gE",
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
