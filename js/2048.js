const KEY   = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};
const size  = 4;

new Vue({
    el: 'main',
    data: {board: null},

    methods: {

        // Create empty board
        createNewBoard() {
            let board = new Array(size);
            for (let y = 0; y < size; y++) {
                board[y] = new Array(size);
            }
            return board;
        },
        initBoard() { this.board = this.createNewBoard() },

        // Rotate the given board left n * 90 degrees
        rot(board, n) {
            if (n == 0) return board;

            // Rotate one step
            let clone = this.createNewBoard();
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    clone[size - (x+1)][y] = board[y][x];
                }
            }

            // Rotate the rest
            return this.rot(clone, n - 1);
        },

        // Merge tiles together towards the left hand side
        merge(board) {

            // Collect merge candidates and remove them temporarily
            let toMerge = [];
            for (let y = 0; y < size; y++) {
                for (let x = 1; x < size; x++) { // Not from the first col
                    if (board[y][x] != null && board[y][x] == board[y][x-1]) {
                        toMerge.push({x: x, y: y, val: board[y][x]});
                        board[y][x] = board[y][x-1] = null;
                    }
                }
            }

            // Merge left
            toMerge.forEach(pos => {board[pos.y][pos.x] = pos.val * 2});
            return board;
        },

        // Drop tiles towards the left hand side
        drop(board) {
            return board.map(col => {
                let tiles = col.filter(p => p != null);     // Collect != null
                for (let i = tiles.length; i < size; i++) { // Fill with null
                    tiles[i] = null;
                }
                return tiles;
            });
        },

        // Collapse all tiles of the given board towards the left hand side
        col(board) {
            return this.drop(this.merge(this.drop(board)));
        },
        collapseLeft() {
            this.board = this.col(this.board);
        },
        collapseTop() {
            this.board = this.rot(this.col(this.rot(this.board, 1)), 3);
        },
        collapseRight() {
            this.board = this.rot(this.col(this.rot(this.board, 2)), 2);
        },
        collapseBottom() {
            this.board = this.rot(this.col(this.rot(this.board, 3)), 1);
        },

        // Add one tile to the board at a random position
        addTile(value) {

            // Collect free positions
            let free = [];
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    if (this.board[y][x] == null) {
                        free.push({x: x, y: y});
                    }
                }
            }

            // Free spots?
            if (free.length == 0) {
                throw 'No empty spot for a new tile!';
            }

            // Place tile at a random position
            let pos = free[ Math.floor(Math.random() * free.length) ];
            this.board[pos.y][pos.x] = value;
        },

        // React to one arrow key action
        step(dir) {

            // Collapse in the right direction
            switch (dir) {
                case KEY.LEFT:  this.collapseLeft();    break;
                case KEY.UP:    this.collapseTop();     break;
                case KEY.RIGHT: this.collapseRight();   break;
                default:        this.collapseBottom();
            }

            // Add a 2 tile, sometimes a 4 tile
            this.addTile(Math.random() > 0.1 ? 2 : 4);
        }
    },

    // Initialize the game
    created() {

        // Apply step method for arrow key actions
        document.addEventListener('keyup', event => {
            let kc = event.keyCode;
            if (Object.values(KEY).includes(kc)) this.step(kc);
        });

        // Initialize
        this.initBoard();
        this.addTile(2);
        this.addTile(4);
    }
});
