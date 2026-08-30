namespace OnePieceTierList.API.Models;

public class Character
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Crew { get; set; } = string.Empty;

    public string DevilFruit { get; set; } = string.Empty;

    // Navigation property
    public ICollection<TierListItem> TierListItems { get; set; }
        = new List<TierListItem>();
}