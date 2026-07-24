/**
 * MongoDB Atlas / Shell Migration Script
 * 
 * Purpose: Scan the 'posts' collection, find any string matching "20l rucksack"
 * (case-insensitive, handling various spaces, hyphens, underscores, or word orders)
 * in the 'gear' array, and replace it with the object { id: 1 }.
 * 
 * Edge cases handled:
 * - "20l rucksack", "20L rucksack", "20l Rucksack", "20L RUCKSACK" (case-insensitive)
 * - "rucksack 20l", "Rucksack 20L" (word order variations)
 * - "20l-rucksack", "20l_rucksack", "rucksack_20l", "rucksack-20l" (separators)
 * - "20lrucksack", "rucksack20l" (no separator)
 * - Leading/trailing whitespaces (e.g., " 20l rucksack ")
 */

db.posts.find({ gear: { $exists: true } }).forEach(function(doc) {
    var gear = doc.gear;
    if (Array.isArray(gear)) {
        var needsUpdate = false;
        var updatedGear = gear.map(function(item) {
            if (typeof item === "string") {
                var cleaned = item.trim().toLowerCase();
                
                // Regex matches for "20l rucksack" or "rucksack 20l" with optional spaces, hyphens, or underscores
                var matches = /20l[ -_]?rucksack/i.test(cleaned) || /rucksack[ -_]?20l/i.test(cleaned);
                
                if (matches) {
                    needsUpdate = true;
                    return { id: 1 };
                }
            }
            return item;
        });

        if (needsUpdate) {
            db.posts.updateOne(
                { _id: doc._id },
                { $set: { gear: updatedGear } }
            );
            print("Updated document ID " + doc.id + " (_id: " + doc._id + ") - Replaced rucksack string with { id: 1 } in gear array.");
        }
    }
});
