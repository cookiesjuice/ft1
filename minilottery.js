function revealAction(grid, pos) {
    const unfilledNumbers = getUnfilledNumbers(grid);
    return unfilledNumbers.map(n => {
        const g = [...grid];
        g[pos] = n;
    });
}

let ops = 0;

async function calculate(grid) {
    ops = 0;
    const revealed = grid.filter(c => c !== 0).length;
    if (revealed >= 4) return calcPickAction(grid);
    const result = calcRevealAction(grid);
    console.log(ops);
    return result;
}

function hash(grid) {
    let h = "";
    for (const i in grid) {
        h += grid[i];
    }
    return h;
}


/**
 *
 * @param grid {number[]}
 * @return {{tile: number, outcome: number}}
 */
function calcRevealAction(grid) {
    const h = hash(grid);
    if(cache[h]) {
        return cache[h];
    }
    const revealed = grid.filter(c => c !== 0).length;
    if (revealed >= 4) {
        return {tile: 0, outcome: calcPickAction(grid).outcome};
    }
    const unfilledNumbers = getUnfilledNumbers(grid);
    const unfilledPositions = [];
    for (const i in grid) {
        if(grid[i] === 0) {
            unfilledPositions.push(i);
        }
    }
    let maxTile = 0;
    let maxOutcome = -Infinity;
    for(const p of unfilledPositions) {
        const allPossibilities = unfilledNumbers.map((v) => {
            const g = [...grid];
            g[p] = v;
            return g;
        });
        const expected = allPossibilities.reduce((acc, curr) => {
            ops++;
            return acc + calcRevealAction(curr).outcome;
        }, 0) / allPossibilities.length;
        if(expected > maxOutcome) {
            maxOutcome = expected;
            maxTile = p;
        }
    }
    const result = {tile: maxTile, outcome: maxOutcome}
    cache[h] = result;
    return result;
}


/**
 *
 * @param grid {number[]}
 * @return {{vector: number, outcome: number}}
 */
function calcPickAction(grid) {
    const h = hash(grid);
    if(cache[h]) {
        return cache[h];
    }
    const allPossibilities = getAllPossibilities(grid);
    let maxExpected = -Infinity;
    let maxVector = 0;
    for (let v = 0; v <= 7; v++) {
        const expected = allPossibilities.reduce((acc, curr) => {
            ops++;
            return acc + getPayout(getVector(v, curr));
        }, 0) / allPossibilities.length;
        if (expected > maxExpected) {
            maxExpected = expected;
            maxVector = v;
        }
    }

    const result = {vector: maxVector, outcome: maxExpected}
    cache[h] = result;
    return result;
}


function createGrid() {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function getAllPossibilities(grid) {
    // get unfilledNumbers
    const unfilledNumbers = getUnfilledNumbers(grid)


    const permutations = permute(unfilledNumbers);
    return permutations.map(p => {
        const g = [...grid];
        for (const i in g) {
            if (g[i] === 0) {
                g[i] = p.shift();
            }
        }
        return g;
    });
}

function getUnfilledNumbers(grid) {
    const filledNumbers = [];
    for (const i in grid) {
        const n = grid[i];
        if (n !== 0) {
            filledNumbers.push(n);
        }
    }
    const unfilledNumbers = [];
    for (let i = 1; i <= 9; i++) {
        if (!filledNumbers.includes(i)) {
            unfilledNumbers.push(i);
        }
    }
    return unfilledNumbers;
}

function getVector(vector, grid) {
    /*

         3↘    4↓  5↓  6↓  7↙
         2→    x6  x7  x8
         1→    x3  x4  x5
         0→    x0  x1  x2
     */
    switch (vector) {
        case 0:
            return grid[0] + grid[1] + grid[2];
        case 1:
            return grid[3] + grid[4] + grid[5];
        case 2:
            return grid[6] + grid[7] + grid[8];
        case 3:
            return grid[6] + grid[4] + grid[2];
        case 4:
            return grid[0] + grid[3] + grid[6];
        case 5:
            return grid[1] + grid[4] + grid[7];
        case 6:
            return grid[2] + grid[5] + grid[8];
        case 7:
            return grid[0] + grid[4] + grid[8];
        default:
            return 0;
    }

}


function getPayout(value) {
    switch (value) {
        case 6:
            return 10000;
        case 7:
            return 36;
        case 8:
            return 720;
        case 9:
            return 360;
        case 10:
            return 80;
        case 11:
            return 252;
        case 12:
            return 108;
        case 13:
            return 72;
        case 14:
            return 54;
        case 15:
            return 180;
        case 16:
            return 72;
        case 17:
            return 180;
        case 18:
            return 119;
        case 19:
            return 36;
        case 20:
            return 306;
        case 21:
            return 1080;
        case 22:
            return 144;
        case 23:
            return 1800;
        case 24:
            return 3600;
        default:
            return 0;
    }
}

function permute(permutation) {
    let length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}
