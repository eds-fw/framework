const { Database } = require("../../dist");
const db = new Database("benchmarks/db/data.json");

//add 1000 items
for (let i = 0; i < 1000; i++)
db.set(`key_${i}`, `value_${i}`);
db.save();