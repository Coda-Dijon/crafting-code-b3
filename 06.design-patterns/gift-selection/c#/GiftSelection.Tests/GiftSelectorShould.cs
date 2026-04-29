using static GiftSelection.GiftSelector;

namespace GiftSelection.Tests;

using ChildConfiguration = Func<ChildBuilder, ChildBuilder>;

public class GiftSelectorTests
{
    private static string? EvaluateRequestFor(ChildConfiguration childConfiguration)
        => SelectGiftFor(
            childConfiguration(ChildBuilder.AChild()).Build()
        );

    [Fact]
    public void Select_First_Feasible_Gift_For_Nice_Child()
        => Assert.Equal("Toy", EvaluateRequestFor(child =>
            child.Nice()
                .RequestingFeasibleGift("Toy")
                .RequestingFeasibleGift("Book")
        ));

    [Fact]
    public void Return_Nothing_For_Nice_Child_With_Only_Infeasible_Gifts()
        => Assert.Null(EvaluateRequestFor(child =>
            child.Nice()
                .RequestingInfeasibleGift()
                .RequestingInfeasibleGift()
                .RequestingInfeasibleGift()
        ));

    [Fact]
    public void Select_Last_Feasible_Gift_For_Normal_Child()
        => Assert.Equal("Book", EvaluateRequestFor(child =>
            child.Normal()
                .RequestingFeasibleGift("Toy")
                .RequestingFeasibleGift("PS5")
                .RequestingFeasibleGift("Book")
        ));

    [Fact]
    public void Return_Nothing_For_Normal_Child_With_Only_Infeasible_Gifts()
        => Assert.Null(EvaluateRequestFor(child =>
            child.Normal()
                .RequestingInfeasibleGift("Toy")
                .RequestingInfeasibleGift("Book")
        ));

    [Fact]
    public void Return_Nothing_For_Naughty_Child_Regardless_Of_Gifts()
        => Assert.Null(EvaluateRequestFor(child =>
            child.Naughty()
                .RequestingFeasibleGift("Toy")
        ));
}