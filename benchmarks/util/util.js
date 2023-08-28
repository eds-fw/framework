const { equal, random, quickTextCompare } = require("../../dist/");
const Benchmark = require("benchmark");
const suite = new Benchmark.Suite;

const test_obj = { key1: "val", key2: "val", key3: "val", key4: "val", key5: "val" };
const test_arr = [ 'val1', 'val2', 'val3', 'var4', 'var5' ];
const test_txt10 = "hello world".repeat(10);
const test_txt100 = "hello world".repeat(100);
const test_txt1000 = "hello world".repeat(1000);
const test_txt4000 = "hello world".repeat(4000);
let buf;

suite
.add('random', function() {
    buf = random(1, 100);
})

.add('equal.obj', function() {
    buf = equal(test_obj, test_obj);
})
.add('equal.arr', function() {
    buf = equal(test_arr, test_arr);
})
.add('equal.prm', function() {
    buf = equal("val1", "val1");
})

.add('quickTextCompare(10 w)', function() {
    buf = quickTextCompare(test_txt10, test_txt10);
})
.add('quickTextCompare(100 w)', function() {
    buf = quickTextCompare(test_txt100, test_txt100);
})
.add('quickTextCompare(1k w)', function() {
    buf = quickTextCompare(test_txt1000, test_txt1000);
})
.add('quickTextCompare(4k w)', function() {
    buf = quickTextCompare(test_txt4000, test_txt4000);
})



.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });

/* RESULTS:
random x 95,376,603 ops/sec ±1.14% (88 runs sampled)
equal.obj x 185,886,489 ops/sec ±3.11% (91 runs sampled)
equal.arr x 184,177,650 ops/sec ±2.54% (87 runs sampled)
equal.prm x 189,824,096 ops/sec ±3.04% (92 runs sampled)
quickTextCompare(10 w) x 691,378 ops/sec ±1.65% (91 runs sampled)
quickTextCompare(100 w) x 112,768 ops/sec ±2.90% (90 runs sampled)
quickTextCompare(1k w) x 12,233 ops/sec ±1.45% (95 runs sampled)
quickTextCompare(4k w) x 2,977 ops/sec ±1.14% (92 runs sampled)
*/

/* (v1.2.1) OLD RESULTS:
random x 100,194,053 ops/sec ±0.85% (88 runs sampled)
equal.obj x 126,181,801 ops/sec ±0.49% (94 runs sampled)
equal.arr x 87,134,950 ops/sec ±0.58% (94 runs sampled)
equal.prm x 118,864,638 ops/sec ±2.10% (89 runs sampled)
quickTextCompare(10 w) x 693,959 ops/sec ±1.44% (91 runs sampled)
quickTextCompare(100 w) x 112,972 ops/sec ±2.55% (90 runs sampled)
quickTextCompare(1k w) x 12,584 ops/sec ±1.31% (93 runs sampled)
quickTextCompare(4k w) x 3,087 ops/sec ±0.19% (96 runs sampled)
*/