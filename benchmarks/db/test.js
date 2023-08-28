//@ts-ignore
const { Database } = require("../../dist");
const { Database: OldDatabase } = require("./v1.2.1-Database");
const db = new Database("benchmarks/db/data.json");
const old_db = new OldDatabase("benchmarks/db/data.json");
const Benchmark = require("benchmark");
const suite = new Benchmark.Suite;
let test;

suite
.add("(v1.2.1) Old Database#set", function() {
    old_db.set(`key_999`, `value_999`)
})
.add("(v1.2.1) Old Database#get", function() {
    test = old_db.get(`key_999`)
})
.add("(v1.2.1) Old Database#setConst", function() {
    old_db.set_const(`key_999`, `value_999`, {}, true)
})
.add("(v1.2.1) Old Database#getKey", function() {
    test = old_db.getKey(`value_999`)
})
.add("(v1.2.1) Old Database#has", function() {
    test = old_db.has(`key_999`)
})
.add("(v1.2.1) Old Database#hasValue", function() {
    test = old_db.hasValue(`value_999`)
})

.add("(v1.3.0) Database#set", function() {
    db.set(`key_999`, `value_999`)
})
.add("(v1.3.0) Database#get", function() {
    test = db.get(`key_999`)
})
.add("(v1.3.0) Database#setConst", function() {
    db.setConst(`key_999ref`, `value_999`, {}, true)
})
.add("(v1.3.0) Database#getKey", function() {
    test = db.getKey(`value_999`)
})
.add("(v1.3.0) Database#has", function() {
    test = db.has(`key_999`)
})
.add("(v1.3.0) Database#hasValue", function() {
    test = db.hasValue(`value_999`)
})

.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });

old_db.save();
db.save();

/* RESULTS:
(v1.2.1) Old Database#set x 55,082,187 ops/sec ±1.75% (86 runs sampled)
(v1.2.1) Old Database#get x 93,997,208 ops/sec ±0.90% (92 runs sampled)
(v1.2.1) Old Database#setConst x 79,638 ops/sec ±0.70% (92 runs sampled)
(v1.2.1) Old Database#getKey x 104,128 ops/sec ±0.42% (97 runs sampled)
(v1.2.1) Old Database#has x 127,618,995 ops/sec ±0.50% (94 runs sampled)
(v1.2.1) Old Database#hasValue x 163,463 ops/sec ±0.44% (97 runs sampled)

(v1.3.0) Database#set x 59,203,472 ops/sec ±0.17% (97 runs sampled)
(v1.3.0) Database#get x 96,614,424 ops/sec ±0.21% (96 runs sampled)
(v1.3.0) Database#setConst x 53,127 ops/sec ±0.68% (97 runs sampled)
(v1.3.0) Database#getKey x 142,187 ops/sec ±0.57% (93 runs sampled)
(v1.3.0) Database#has x 128,002,801 ops/sec ±0.26% (93 runs sampled)
(v1.3.0) Database#hasValue x 148,376 ops/sec ±0.52% (93 runs sampled)
*/