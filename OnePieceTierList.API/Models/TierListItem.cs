namespace OnePieceTierList.API.Models;

public class TierListItem
{
    public int Id { get; set; }

    public int TierListId { get; set; }

    public TierList? TierList { get; set; }

    public int CharacterId { get; set; }

    public Character? Character { get; set; }

    public string Tier { get; set; } = "Unranked";

    public int Position { get; set; }
}