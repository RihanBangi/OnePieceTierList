namespace OnePieceTierList.API.Models;

public class User
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public ICollection<TierList> TierLists { get; set; }
        = new List<TierList>();
}