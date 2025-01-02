const fs = require('fs');

function decodeY(base, value) {
    return parseInt(value, base);
}

function extractRoots(data) {
    const keys = data.keys;
    const roots = [];
    for (const [x, obj] of Object.entries(data)) {
        if (x !== "keys") {
            roots.push({
                x: parseInt(x),
                y: decodeY(parseInt(obj.base), obj.value)
            });
        }
    }
    return { roots, k: keys.k };
}

function lagrangeInterpolation(roots, k) {
    let constant = 0;
    for (let j = 0; j < k; j++) {
        let term = roots[j].y;
        for (let i = 0; i < k; i++) {
            if (i !== j) {
                term *= roots[i].x / (roots[i].x - roots[j].x);
            }
        }
        constant += term;
    }
    return Math.round(constant);
}

const data1 = JSON.parse(fs.readFileSync('testcase1.json'));
const data2 = JSON.parse(fs.readFileSync('testcase2.json'));

const testCase1 = extractRoots(data1);
const testCase2 = extractRoots(data2);

const secret1 = lagrangeInterpolation(testCase1.roots, testCase1.k);
const secret2 = lagrangeInterpolation(testCase2.roots, testCase2.k);

console.log("Secret for Test Case 1:", secret1);
console.log("Secret for Test Case 2:", secret2);
