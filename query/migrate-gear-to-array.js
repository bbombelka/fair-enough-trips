// MongoDB migration script to split the single gear string into an array of strings.
// Run this script in the mongosh shell connected to the database.

db["posts"].find({ gear: { $exists: true, $type: "array", $size: 1 } }).forEach(function(doc) {
  var gearStr = doc.gear[0];
  if (typeof gearStr === 'string' && gearStr.includes(',')) {
    var gearArray = gearStr.split(',').map(function(item) {
      return item.trim();
    }).filter(function(item) {
      return item.length > 0;
    });

    db["posts"].updateOne(
      { _id: doc._id },
      { $set: { gear: gearArray } }
    );
  }
});

// Run the same migration on the posts-test collection if it exists
db["posts-test"].find({ gear: { $exists: true, $type: "array", $size: 1 } }).forEach(function(doc) {
  var gearStr = doc.gear[0];
  if (typeof gearStr === 'string' && gearStr.includes(',')) {
    var gearArray = gearStr.split(',').map(function(item) {
      return item.trim();
    }).filter(function(item) {
      return item.length > 0;
    });

    db["posts-test"].updateOne(
      { _id: doc._id },
      { $set: { gear: gearArray } }
    );
  }
});
