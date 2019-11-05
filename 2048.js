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

        // Collapse all tiles of the given board towards the bottom
        col(board) {
            console.log(board);
            return board;
        },
        collapseLeft() {
            this.board = this.rot(this.col(this.rot(this.board, 1)), 3);
        },
        collapseTop() {
            this.board = this.rot(this.col(this.rot(this.board, 2)), 2);
        },
        collapseRight() {
            this.board = this.rot(this.col(this.rot(this.board, 3)), 1);
        },
        collapseBottom() {
            this.board = this.col(this.board);
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

        // ...
        step(dir) {
            switch (dir) {
                case KEY.LEFT: console.log('Links!'); break;
                default:
                    console.log(Object.keys(KEY).find(k => KEY[k] == dir));
            }
        }
    },

    // Initialize the game
    created() {

        // Apply step method for arrow key actions
        document.addEventListener('keyup', event => {
            let kc = event.keyCode;
            if (Object.values(KEY).includes(kc))
                this.step(kc);
        });

        // Initialize
        // TODO
        this.initBoard();
        this.addTile(2);
        this.addTile(4);
        this.addTile(8);
        this.addTile(16);
        this.addTile(32);
        this.addTile(64);
        this.addTile(128);
        this.addTile(256);
        this.addTile(1024);
        this.addTile(2048);

        // TODO
        console.log(this.board);
    }
});
