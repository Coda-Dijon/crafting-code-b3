namespace GiftSelection;

public static class GiftSelector
{
    public static string? SelectGiftFor(Child child)
    {
        if (child.Behavior == Behavior.Naughty)
        {
            return null;
        }
        else if (child.Behavior == Behavior.Normal)
        {
            return child.GiftRequests
                .Where(gift => gift.IsFeasible)
                .Reverse()
                .Select(gift => gift.GiftName)
                .FirstOrDefault();
        }
        else
        {
            return child.GiftRequests
                .Where(gift => gift.IsFeasible)
                .Select(gift => gift.GiftName)
                .FirstOrDefault();
        }
    }
}
