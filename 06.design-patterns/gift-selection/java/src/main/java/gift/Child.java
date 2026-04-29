package gift;

import java.util.List;

public record Child(
        String firstName,
        String lastName,
        int age,
        Behavior behavior,
        List<GiftRequest> giftRequests
) {
    public Child {
        giftRequests = giftRequests != null ? List.copyOf(giftRequests) : List.of();
    }
}