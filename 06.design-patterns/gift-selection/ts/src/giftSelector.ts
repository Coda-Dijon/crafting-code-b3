import {Child} from "./child";

export function selectGiftFor(child: Child): string | null {
    if (child.behavior === "naughty") {
        return null;
    } else if (child.behavior === "normal") {
        return [...child.giftRequest]
            .reverse()
            .filter(gift => gift.isFeasible)
            .map(gift => gift.giftName)[0] ?? null;
    } else if (child.behavior === "nice") {
        return child.giftRequest
            .filter(gift => gift.isFeasible)
            .map(gift => gift.giftName)[0] ?? null;
    }
}