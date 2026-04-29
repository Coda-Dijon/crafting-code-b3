namespace GiftSelection.Tests;

public class ChildBuilder
{
    private Behavior _behavior = Behavior.Nice;
    private readonly List<GiftRequest> _giftRequests = [];

    public static ChildBuilder AChild() => new();

    public ChildBuilder Nice()
    {
        _behavior = Behavior.Nice;
        return this;
    }

    public ChildBuilder Normal()
    {
        _behavior = Behavior.Normal;
        return this;
    }

    public ChildBuilder Naughty()
    {
        _behavior = Behavior.Naughty;
        return this;
    }

    public ChildBuilder RequestingFeasibleGift(string? giftName = null)
    {
        _giftRequests.Add(new GiftRequest(giftName ?? "A feasible gift", true));
        return this;
    }

    public ChildBuilder RequestingInfeasibleGift(string? giftName = null)
    {
        _giftRequests.Add(new GiftRequest(giftName ?? "An infeasible gift", false));
        return this;
    }

    public Child Build() => new("Jane", "Doe", 9, _behavior, _giftRequests);
}