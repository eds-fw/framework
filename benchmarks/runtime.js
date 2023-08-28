//@ts-ignore
const Benchmark = require("benchmark");
const suite = new Benchmark.Suite;
const runtime = require("../dist/runtimeStorage").default;
let test, test2;
runtime.set(`test2`, 2);

suite
.add("set()", () => {
    runtime.set(`test`, 1);
})
.add("get() 1 key", () => {
    test = runtime.get("test");
})
.add("get() 2 keys", () => {
    test = runtime.get("test", "test2");
})
.add("getProp()", () => {
    test2 = runtime.getProp("test");
})

.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });

/*
Result:
set() x 988,648,480 ops/sec ±0.45% (92 runs sampled)
get() 1 key x 75,093,970 ops/sec ±0.44% (94 runs sampled)
get() 2 keys x 46,342,392 ops/sec ±0.77% (93 runs sampled)
getProp() x 202,454,325 ops/sec ±1.60% (91 runs sampled)
*/