namespace OnePieceTierList.API.Models;

public class Character
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Crew { get; set; }

    public string? DevilFruit { get; set; }
}