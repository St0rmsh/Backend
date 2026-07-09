// Maps broad categories to their specific subcategories, each with keywords
// matched (case-insensitively) against a product's title + description.
const CATEGORY_MAP = {
    Clothing: {
        "T-Shirt": ["t-shirt", "tshirt", "tee "],
        "Shirt": ["shirt", "formal shirt", "casual shirt"],
        "Jeans": ["jean", "denim"],
        "Trousers": ["trouser", "chinos", "pants"],
        "Jacket": ["jacket", "bomber", "windcheater"],
        "Hoodie": ["hoodie", "sweatshirt"],
        "Shorts": ["shorts", "boxer"],
        "Dress": ["dress", "gown"],
    },
    Footwear: {
        "Sneakers": ["sneaker", "trainer"],
        "Sandals": ["sandal", "flip-flop", "flip flop"],
        "Formal Shoes": ["formal shoe", "oxford", "loafers"],
        "Boots": ["boot"],
        "Slippers": ["slipper", "slide"],
    },
    Accessories: {
        "Watch": ["watch", "wristwatch"],
        "Belt": ["belt"],
        "Wallet": ["wallet"],
        "Bag": ["backpack", "handbag", "bag "],
        "Sunglasses": ["sunglass", "shades"],
        "Cap": ["cap ", "hat "],
    },
    Electronics: {
        "Headphones": ["headphone", "earbud", "earphone"],
        "Smartwatch": ["smartwatch", "smart watch"],
        "Charger": ["charger", "power bank", "powerbank"],
        "Speaker": ["speaker", "bluetooth speaker"],
    },
};

/**
 * Given a product's title and description, suggest the best-matching
 * { category, subcategory } pair. Falls back to "Uncategorized" for both
 * if nothing matches — the seller can always override manually.
 */
export function suggestCategory(title = "", description = "") {
    const text = `${title} ${description}`.toLowerCase();

    for (const [category, subcategories] of Object.entries(CATEGORY_MAP)) {
        for (const [subcategory, keywords] of Object.entries(subcategories)) {
            if (keywords.some(kw => text.includes(kw))) {
                return { category, subcategory };
            }
        }
    }

    return { category: "Uncategorized", subcategory: "Uncategorized" };
}

// Exposed so the frontend can show a static fallback list before any
// products exist, and so sellers can pick a category/subcategory manually
// from a dropdown instead of relying purely on auto-suggestion.
export function getCategoryTree() {
    return Object.fromEntries(
        Object.entries(CATEGORY_MAP).map(([cat, subs]) => [cat, Object.keys(subs)])
    );
}