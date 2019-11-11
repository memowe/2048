'use strict';

// Create [0, ..., n]
function rangeTo(n) {
    let i = 0;
    return Array(n + 1).fill(0).map(x => x + i++);
}

// 17, 3 -> " 17"
function spacePad(a, len) {
    let str = a != null ? a : "";
    return String(str).padStart(len);
}
