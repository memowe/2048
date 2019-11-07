'use strict';

// Create [0, ..., n]
function rangeTo(n) {
    let i = 0;
    return Array(n + 1).fill(0).map(x => x + i++);
}
