const KEY   = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};
const size  = 4;

new Vue({
    el: 'main',
    data() {return {board: new Board(size)}},

    methods: {

        // React to one arrow key action
        step(dir) {

            // Collapse in the right direction
            switch (dir) {
                case KEY.LEFT:  this.board.collapseLeft();    break;
                case KEY.UP:    this.board.collapseTop();     break;
                case KEY.RIGHT: this.board.collapseRight();   break;
                default:        this.board.collapseBottom();
            }

            // Nothing happened?
            if (this.board.wasStatic) {
                if (this.board.isFull() && ! this.board.isCollapsible()) {
                    alert("Game over!");
                }
                return;
            }

            // Add a 2 tile, sometimes a 4 tile
            this.board.addTile(Math.random() > 0.1 ? 2 : 4);

            // Update, as Vue can't detect all array updates
            this.$forceUpdate();
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
        this.board.addTile(2);
        this.board.addTile(4);
    }
});
