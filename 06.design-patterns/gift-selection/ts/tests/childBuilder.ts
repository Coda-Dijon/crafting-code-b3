import {Behavior, Child} from "../src/child";
import {GiftRequest} from "../src/giftRequest";

export class ChildBuilder {
    private behavior: Behavior = "nice";
    private readonly giftRequests: GiftRequest[] = [];

    static aChild(): ChildBuilder {
        return new ChildBuilder();
    }

    nice(): this {
        this.behavior = "nice";
        return this;
    }

    normal(): this {
        this.behavior = "normal";
        return this;
    }

    naughty(): this {
        this.behavior = "naughty";
        return this;
    }

    requestingFeasibleGift(giftName?: string): this {
        this.giftRequests.push(new GiftRequest(giftName ?? "A feasible gift", true));
        return this;
    }

    requestingInfeasibleGift(giftName?: string): this {
        this.giftRequests.push(new GiftRequest(giftName ?? "An infeasible gift", false));
        return this;
    }

    build(): Child {
        return new Child(
            "Jane",
            "Doe",
            9,
            this.behavior,
            this.giftRequests
        );
    }
}