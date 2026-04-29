package gift;

public class GiftSelector {
    private GiftSelector() {
    }

    public static String selectGiftFor(Child child) {
        if (child.behavior() == Behavior.NAUGHTY) {
            return null;
        } else if (child.behavior() == Behavior.NORMAL) {
            return child.giftRequests()
                    .reversed()
                    .stream()
                    .filter(GiftRequest::isFeasible)
                    .map(GiftRequest::giftName)
                    .findFirst()
                    .orElse(null);
        } else {
            return child.giftRequests().stream()
                    .filter(GiftRequest::isFeasible)
                    .map(GiftRequest::giftName)
                    .findFirst()
                    .orElse(null);
        }
    }
}