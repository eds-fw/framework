//@ts-ignore
const suite = require("benchmark").Suite;
const bench = new suite;
const dirlib = require("../../../dist/framework/Utils/Dirlib");
let test, test2;

bench.add("expandDirs()", async () => {
    test = await dirlib.expandDirs("./src/");
})
.add("_isDir()", async () => {
    test2 = await dirlib._isDir("./src/");
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
(27 files in dir)
_isDir() x 179,584 ops/sec ±14.53% (60 runs sampled)
expandDirs() x 152,873 ops/sec ±24.64% (12 runs sampled)
*/