/**
 * MongoDB Atlas / Shell Migration Script
 * 
 * Purpose: Split comma-separated gear strings in the 'posts' collection
 * into individual array elements.
 * 
 * Logic:
 * 1. If 'gear' is a single string (e.g., "helmet, harness, rope"), split it by ',' and trim whitespace.
 * 2. If 'gear' is an array of exactly 1 string (e.g., ["helmet, harness, rope"]), split it by ',' and trim whitespace.
 * 3. If 'gear' is already an array of more than 1 string, do not modify it.
 */

db.posts.find({ gear: { $exists: true } }).forEach(function(doc) {
    var gear = doc.gear;
    var needsUpdate = false;
    var updatedGear = [];

    if (typeof gear === "string") {
        // If gear is a single string, split and trim
        updatedGear = gear.split(",").map(function(item) {
            return item.trim();
        }).filter(function(item) {
            return item !== "";
        });
        needsUpdate = true;
    } else if (Array.isArray(gear)) {
        // If gear is an array of exactly 1 string, split and trim
        if (gear.length === 1 && typeof gear[0] === "string") {
            var singleStr = gear[0];
            if (singleStr.indexOf(",") !== -1) {
                updatedGear = singleStr.split(",").map(function(item) {
                    return item.trim();
                }).filter(function(item) {
                    return item !== "";
                });
                needsUpdate = true;
            }
        }
    }

    if (needsUpdate) {
        db.posts.updateOne(
            { _id: doc._id },
            { $set: { gear: updatedGear } }
        );
        print("Updated document ID " + doc.id + " (_id: " + doc._id + ") - Split gear into: " + JSON.stringify(updatedGear));
    }
});
