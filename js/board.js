'use strict';

class Board {

    constructor(arg = 4) {
        if (arg instanceof Board) {    // Copy the other board
            this.copyFrom(arg);
        } else {                        // Start as empty board
            this.init(arg);
        }
    }

    init(size) {
        this.size = size;
        this.cols = this.range().map(c => this.range().fill(null));
        this.wasStatic = false;
        return this;
    }

    copyFrom(board) {
        this.size = board.size;
        this.cols = board.cols.map(col => [...col]);
        return this;
    }

    get(x, y) {
        return this.cols[y][x];
    }

    set(x, y, value) {
        this.cols[y][x] = value;
        return this;
    }

    // Access helper, returns a row array of value arrays
    getRows() {
        return this.range().reverse().map(y =>
            this.range().map(x => this.get(x, y)));
    }

    isEqual(board) {

        // Size must be equal
        if (this.size != board.size)
            return false;

        // Each spot must be equal
        for (let y in this.range()) {
            for (let x in this.range()) {
                if (this.get(x, y) != board.get(x, y)) {
                    return false;
                }
            }
        };

        // Else: equal!
        return true;
    }

    hasTile(value) {

        // Try to find the tile
        for (let y in this.range()) {
            for (let x in this.range()) {
                if (this.get(x, y) == value) {
                    return true;
                }
            }
        }

        // Nothing found
        return false;
    }

    isFull() {

        // Try to find a null
        for (let y in this.range()) {
            for (let x in this.range()) {
                if (this.get(x, y) == null) {
                    return false;
                }
            }
        }

        // Nothing found
        return true;
    }

    isCollapsible() {

        // Not full -> collapsible
        if (! this.isFull()) {
            return true;
        }

        // Check up-down pairs
        for (let y = 1; y < this.size; y++) {
            for (let x in this.range()) {
                if (this.get(x, y) == this.get(x, y-1)) {
                    return true;
                }
            }
        }

        // Check left-right pairs
        for (let y in this.range()) {
            for (let x = 1; x < this.size; x++) {
                if (this.get(x, y) == this.get(x-1, y)) {
                    return true;
                }
            }
        }

        // Nothing found
        return false;
    }

    // "Deep" map: maps functions on getRows() entries
    map(f) {
        return this.getRows()
            .map(row => row.map(entry => f(entry)));
    }

    // Helper method for an array of indices
    range() {
        return rangeTo(this.size - 1);
    }

    // Add one tile to the board at a random spot
    addTile(value) {

        // Collect free spots
        let free = this.range().flatMap(x =>
            this.range().map(y =>
                this.get(x, y) == null ?  {x: x, y: y} : null
        )).filter(d => d != null);

        // Insert into random free spot
        let p = free[ Math.floor(Math.random() * free.length) ];
        return this.set(p.x, p.y, value);
    }

    // Rotate the board n * 90 degrees
    rotate(n = 0) {
        if (n <= 0) return this;

        // Rotate one step
        let original = new Board(this);
        for (let x in this.range()) {
            for (let y in this.range()) {
                this.set(x, y, original.get(y, this.size - x - 1));
            }
        }

        // Rotate the rest
        return this.rotate(n - 1);
    }

    // Merge tiles together downwards
    merge() {
        let toMerge = [];

        // Search double values
        for (let x in this.range()) {
            for (let y in this.range()) {
                if (y == 0) continue; // not first row

                // Check
                let v1 = this.get(x, y), v2 = this.get(x, y-1);
                if (v1 != null && v1 == v2) {

                    // Collect
                    toMerge.push({x: x, y: y, value: v1});

                    // Remove temporarily
                    this.set(x, y, null);
                    this.set(x, y-1, null);
                }
            }
        }

        // Merge left
        toMerge.forEach(p => this.set(p.x, p.y, p.value * 2));
        return this;
    }

    // Drop tiles downwards
    drop() {

        // Collect tile columns
        let cols = this.range().map(x =>
            this.range().map(y => this.get(x, y))
                .filter(v => v != null)
        );

        // Fill with nulls
        cols = cols.map(col =>
            [...col, ...Array(this.size - col.length).fill(null)]
        );

        // Inject back
        for (let x in this.range()) {
            for (let y in this.range()) {
                this.set(x, y, cols[x][y]);
            }
        }
        return this;
    }

    // Collapse tiles downwards
    collapse() {
        let backup = new Board(this);

        // Collapse
        this.drop().merge().drop();

        // Done
        this.wasStatic = this.isEqual(backup);
        return this;
    }

    // Collapse tiles in all directions
    collapseLeft()  { return this.rotate(1).collapse().rotate(3) }
    collapseTop()   { return this.rotate(2).collapse().rotate(2) }
    collapseRight() { return this.rotate(3).collapse().rotate(1) }
    collapseBottom(){ return this.rotate(0).collapse().rotate(0) }

    // Utility stringification method
    toString() {
        return this.map(entry => spacePad(entry, 4))
            .map(row => row.join(" ")).join("\n");
    }
}
