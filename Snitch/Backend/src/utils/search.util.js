/**
 * Builds a tokenized, multi-field search clause for Mongo.
 * Splits the query into words and requires EVERY word to appear
 * somewhere across the given fields (AND of per-word ORs) — this is
 * what lets "Men Shirt" match a product titled "Men's Casual Shirt"
 * even though the words aren't adjacent, and lets a single word like
 * "Men" or "shirt" match on its own.
 */
export function buildTextSearchClause(query, fields = ["title", "description", "category", "subcategory", "variants.value"]) {
    if (!query || !query.trim()) return {};
    const words = query.trim().split(/\s+/).filter(Boolean);

    const andClauses = words.map(word => ({
        $or: fields.map(field => ({ [field]: { $regex: word, $options: "i" } }))
    }));

    return { $and: andClauses };
}