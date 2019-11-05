const KEY = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};
const size  = 4;

new Vue({
    el: 'main',
    data: {board: new Array(size)},

    methods: {

        // Empty the board
        initBoard() {
            for (let x = 0; x < size; x++) {
                this.board[x] = new Array(size);
            }
        },

        // Add one tile to the board at a random position
        addTile(value) {

            // Collect free positions
            let free = [];
            for (let x = 0; x < size; x++) {
                for (let y = 0; y < size; y++) {
                    if (this.board[x][y] == null) {
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
            this.board[pos.x][pos.y] = value;
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

    created() {
        document.addEventListener('keyup', event => {
            let kc = event.keyCode;
            if (Object.values(KEY).includes(kc)) // act on arrow keys
                this.step(kc);
        });

        this.initBoard();
        this.addTile(2);
        this.addTile(4);
        console.log(this.board);
    }
});
