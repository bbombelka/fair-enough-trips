/**
 * MongoDB Shell / Atlas Script
 *
 * Purpose: Find all post documents in the 'posts-test' collection whose 'gear'
 * array contains elements matching "20l rucksack" or "RUCKSACK_20L" (either as
 * exact strings, case-insensitive regexes, or within structured gear objects)
 * and add their 'id's to the 'tripsUsed' array of the gear item with id: 1.
 *
 * Instructions for Mongo Atlas:
 * 1. Open the Atlas Database Triggers, Atlas Functions, or connect via mongosh.
 * 2. Paste and run this script in the Mongo Shell (mongosh) of your active database.
 */

// 1. Find all matching posts in 'posts-test' collection
const matchedPosts = db["posts"]
  .find(
    {
      $or: [
        { gear: "20l rucksack" },
        { gear: "RUCKSACK_20L" },
        { gear: { $regex: /20l rucksack/i } },
        { "gear.type": "RUCKSACK_20L" },
        { "gear.type": { $regex: /20l rucksack/i } },
      ],
    },
    { id: 1 },
  )
  .toArray();

// 2. Extract the post IDs
const postIds = matchedPosts.map((post) => post.id);

print("Matched post IDs to associate: " + JSON.stringify(postIds));

if (postIds.length > 0) {
  // 3. Update the gear item (matching id: 1, string "1", or slug "thule-stir-20l")
  // Using $addToSet to prevent any duplication
  const result = db.gear.updateOne({ $or: [{ id: 1 }, { id: "1" }, { slug: "thule-stir-20l" }] }, { $addToSet: { tripsUsed: { $each: postIds } } });
  print("Update result: " + JSON.stringify(result));
} else {
  print("No matching posts found. No updates performed.");
}
