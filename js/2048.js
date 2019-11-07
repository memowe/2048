const KEY   = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};
const size  = 4;

new Vue({
    el: 'main',
    data: {board: null},

    methods: {

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
