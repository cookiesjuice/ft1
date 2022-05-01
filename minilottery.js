function calculate(grid) {
    const revealed = grid.filter(c => c !== 0).length;
    if (revealed >= 4) return calcPickAction(grid);
    return calcRevealAction(grid);
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
    if (cache[h]) {
        return cache[h];
    }
    const revealed = grid.filter(c => c !== 0).length;
    if (revealed >= 4) {
        return {tile: 0, outcome: calcPickAction(grid).outcome};
    }
    const unfilledNumbers = getUnfilledNumbers(grid);
    const unfilledPositions = [];
    for (const i in grid) {
        if (grid[i] === 0) {
            unfilledPositions.push(i);
        }
    }
    let maxTile = 0;
    let maxOutcome = -Infinity;
    for (const p of unfilledPositions) {
        const allPossibilities = unfilledNumbers.map((v) => {
            const g = [...grid];
            g[p] = v;
            return g;
        });
        const expected = allPossibilities.reduce((acc, curr) => {
            return acc + calcRevealAction(curr).outcome;
        }, 0) / allPossibilities.length;
        if (expected > maxOutcome) {
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
    if (cache[h]) {
        return cache[h];
    }
    const allPossibilities = getAllPossibilities(grid);
    let maxExpected = -Infinity;
    let maxVector = 0;
    for (let v = 0; v <= 7; v++) {
        const expected = allPossibilities.reduce((acc, curr) => {
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
    return getVectorGrids(vector).reduce((acc, curr) => acc + grid[curr], 0);
}

function getVectorGrids(v) {
    switch (v) {
        case 0:
            return [0, 1, 2];
        case 1:
            return [3, 4, 5];
        case 2:
            return [6, 7, 8];
        case 3:
            return [6, 4, 2];
        case 4:
            return [0, 3, 6];
        case 5:
            return [1, 4, 7];
        case 6:
            return [2, 5, 8];
        case 7:
            return [0, 4, 8];
        default:
            return [];
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

// test game

function makeGrid() {
    const grid = [];
    const allNums = [1,2,3,4,5,6,7,8,9];
    for(let i = 0; i < 9; i++) {
        const x = Math.floor(Math.random() * allNums.length)
        const n = allNums[x];
        allNums.splice(x, 1);
        grid.push(n);
    }
    return grid;
}

class Game {
    constructor() {
        this.reset();
    }

    reset() {
        this.grid = makeGrid();
        this.displayGrid = [0,0,0,0,0,0,0,0,0];
        const randomGrid = Math.floor(Math.random() * 9);
        this.display(randomGrid);
        return randomGrid;
    }

    display(pos) {
        this.displayGrid[pos] = this.grid[pos];
    }

    displayAllGrids() {
        this.displayGrid = this.grid;
    }

    isFinal() {
        return this.displayGrid.filter(e => e !== 0).length === 4;
    }

    payout(v) {
        return getPayout(getVector(v, this.grid));
    }
}

