import {GiftRequest} from "./giftRequest";

export type Behavior = "naughty" | "normal" | "nice";

export class Child {
    public readonly firstName: string;
    private readonly lastName: string;
    private readonly age: number;
    public readonly behavior: Behavior;
    public readonly giftRequest: GiftRequest[];

    constructor(firstName: string,
                lastName: string,
                age: number,
                behavior: Behavior,
                giftRequest: GiftRequest[]) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.behavior = behavior;
        this.giftRequest = giftRequest ?? [];
    }
}