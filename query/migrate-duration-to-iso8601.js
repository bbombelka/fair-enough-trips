// MongoDB migration script to convert stats.duration from number to ISO 8601 string.
// 
// Logic for conversion:
// 1. If fraction < 0.6, treat as direct minutes (e.g., 9.3 -> PT9H30M, 9.45 -> PT9H45M)
// 2. If fraction >= 0.6, treat as decimal hours (e.g., 9.75 -> PT9H45M)

db["posts-test"].find({"stats.duration": {$exists: true, $type: "number"}}).forEach(function(doc) {
    var val = doc.stats.duration;
    var hours = Math.floor(val);
    var fraction = parseFloat((val - hours).toFixed(2));
    var minutes;
    
    if (fraction >= 0.6) {
        minutes = Math.round(fraction * 60);
    } else {
        minutes = Math.round(fraction * 100);
    }
    
    var isoDuration = "PT" + hours + "H";
    if (minutes > 0) {
        isoDuration += minutes + "M";
    }
    
    db["posts-test"].updateOne(
        { _id: doc._id },
        { $set: { "stats.duration": isoDuration } }
    );
});
