export class GiftRequest {
    public readonly giftName: string;
    public readonly isFeasible: boolean;

    constructor(giftName: string, isFeasible: boolean) {
        this.giftName = giftName;
        this.isFeasible = isFeasible;
    }
}