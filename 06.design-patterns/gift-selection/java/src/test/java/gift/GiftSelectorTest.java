package gift;

import org.junit.jupiter.api.Test;

import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class GiftSelectorTest {
    @Test
    void select_first_feasible_gift_for_nice_child() {
        assertEquals("Toy",
                evaluateRequestFor(child ->
                        child.nice()
                                .requestingFeasibleGift("Toy")
                                .requestingFeasibleGift("Book")
                ));
    }

    @Test
    void return_nothing_for_nice_child_with_only_infeasible_gifts() {
        assertNull(evaluateRequestFor(child ->
                child.nice()
                        .requestingInfeasibleGift("Toy")
                        .requestingInfeasibleGift("Book")
        ));
    }

    @Test
    void select_last_feasible_gift_for_normal_child() {
        assertEquals("Book", evaluateRequestFor(child ->
                child.normal()
                        .requestingFeasibleGift("Toy")
                        .requestingFeasibleGift("PS5")
                        .requestingFeasibleGift("Book")
        ));
    }

    @Test
    void returns_nothing_for_normal_child_with_only_infeasible_gifts() {
        assertNull(evaluateRequestFor(child ->
                child.normal()
                        .requestingInfeasibleGift("Toy")
                        .requestingInfeasibleGift("Book")
        ));
    }

    @Test
    void returns_nothing_for_naughty_child_regardless_of_gifts() {
        assertNull(evaluateRequestFor(child ->
                child.naughty()
                        .requestingFeasibleGift("Toy")
        ));
    }

    private String evaluateRequestFor(Function<ChildBuilder, ChildBuilder> childConfiguration) {
        return GiftSelector.selectGiftFor(
                childConfiguration.apply(ChildBuilder.aChild()).build()
        );
    }
}