import {ChildBuilder} from "./childBuilder";
import {selectGiftFor} from "../src/giftSelector";

const toy = "Toy";
const book = "Book";

describe('select', () => {
    type ChildConfiguration = (builder: ChildBuilder) => ChildBuilder;

    function evaluateRequestFor(childConfiguration: ChildConfiguration): string | null {
        return selectGiftFor(
            childConfiguration(ChildBuilder.aChild()).build()
        );
    }

    test('the first feasible gift for a nice child', () => {
        expect(evaluateRequestFor(
            child => child
                .nice()
                .requestingFeasibleGift(toy)
                .requestingFeasibleGift(book)
        )).toBe(toy);
    });

    test('nothing for a nice child with only infeasible gifts', () => {
        expect(evaluateRequestFor(
            child => child
                .nice()
                .requestingInfeasibleGift()
                .requestingInfeasibleGift()
        )).toBeNull();
    });

    test('the last feasible gift for a normal child', () => {
        expect(evaluateRequestFor(
            child => child
                .normal()
                .requestingFeasibleGift(toy)
                .requestingFeasibleGift("PS5")
                .requestingFeasibleGift(book)
        )).toBe(book);
    });

    test('nothing for a normal child with only infeasible gifts', () => {
        expect(evaluateRequestFor(
            child => child
                .normal()
                .requestingInfeasibleGift(toy)
                .requestingInfeasibleGift(book)
        )).toBeNull();
    });

    test('nothing for a naughty child, regardless of gifts', () => {
        expect(evaluateRequestFor(
            child => child
                .naughty()
                .requestingFeasibleGift(toy)
        )).toBeNull();
    });
});