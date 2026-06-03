// MongoDB shell script to copy the 'posts-test' collection to 'posts'
// Run this in mongosh or MongoDB Compass

// Using the aggregation pipeline with $out will replace the target collection 
// ('posts') entirely with the contents of 'posts-test'.
db.getCollection("posts-test").aggregate([
  { $match: {} },
  { $out: "posts" }
]);

// Note: If you want to merge into an existing 'posts' collection without 
// replacing it entirely, use $merge instead:
/*
db.getCollection("posts-test").aggregate([
  { $match: {} },
  { $merge: { into: "posts", whenMatched: "replace", whenNotMatched: "insert" } }
]);
*/
