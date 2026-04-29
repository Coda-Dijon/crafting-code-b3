package gift;

import java.util.ArrayList;
import java.util.List;

public class ChildBuilder {
    private final List<GiftRequest> giftRequests = new ArrayList<>();
    private Behavior behavior = Behavior.NICE;

    public static ChildBuilder aChild() {
        return new ChildBuilder();
    }

    public ChildBuilder nice() {
        this.behavior = Behavior.NICE;
        return this;
    }

    public ChildBuilder normal() {
        this.behavior = Behavior.NORMAL;
        return this;
    }

    public ChildBuilder naughty() {
        this.behavior = Behavior.NAUGHTY;
        return this;
    }

    public ChildBuilder requestingFeasibleGift(String giftName) {
        this.giftRequests.add(new GiftRequest(giftName, true));
        return this;
    }

    public ChildBuilder requestingInfeasibleGift(String giftName) {
        this.giftRequests.add(new GiftRequest(giftName, false));
        return this;
    }

    public Child build() {
        return new Child("Jane", "Doe", 9, this.behavior, this.giftRequests);
    }
}