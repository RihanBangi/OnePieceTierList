using Microsoft.EntityFrameworkCore;
using OnePieceTierList.API.Models;

namespace OnePieceTierList.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // Tables
    public DbSet<User> Users => Set<User>();

    public DbSet<Character> Characters => Set<Character>();

    public DbSet<TierList> TierLists => Set<TierList>();

    public DbSet<TierListItem> TierListItems => Set<TierListItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User -> TierLists
        modelBuilder.Entity<TierList>()
            .HasOne(t => t.User)
            .WithMany(u => u.TierLists)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // TierList -> TierListItems
        modelBuilder.Entity<TierListItem>()
            .HasOne(t => t.TierList)
            .WithMany(t => t.Items)
            .HasForeignKey(t => t.TierListId)
            .OnDelete(DeleteBehavior.Cascade);

        // Character -> TierListItems
        modelBuilder.Entity<TierListItem>()
            .HasOne(t => t.Character)
            .WithMany(c => c.TierListItems)
            .HasForeignKey(t => t.CharacterId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}