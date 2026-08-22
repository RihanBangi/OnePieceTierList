using Microsoft.EntityFrameworkCore;
using OnePieceTierList.API.Models;

namespace OnePieceTierList.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Character> Characters => Set<Character>();

    public DbSet<TierList> TierLists => Set<TierList>();

    public DbSet<TierListItem> TierListItems => Set<TierListItem>();
}