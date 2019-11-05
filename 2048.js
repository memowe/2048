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

        // React to one arrow key action
        step(dir) {

            // TODO
            console.log(this.board);

            // Collapse in the right direction
            switch (dir) {
                case KEY.LEFT:  this.collapseLeft();    break;
                case KEY.UP:    this.collapseTop();     break;
                case KEY.RIGHT: this.collapseRight();   break;
                default:        this.collapseBottom();
            }

            // Add a tile
            this.addTile(2);
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
