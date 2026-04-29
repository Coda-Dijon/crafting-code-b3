namespace GiftSelection;

public enum Behavior { Naughty, Normal, Nice }

public record Child(
    string FirstName,
    string LastName,
    int Age,
    Behavior Behavior,
    List<GiftRequest>? GiftRequests = null)
{
    public List<GiftRequest> GiftRequests { get; } = GiftRequests ?? new List<GiftRequest>();
}
