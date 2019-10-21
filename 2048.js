const KEY = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};

new Vue({
    el: 'main',
    data: {
    },
    methods: {
        handleKey(e) {
            let kc = e.keyCode;
            if (Object.values(KEY).includes(kc)) // arrow key
                this.step(kc);
        },
        step(dir) {
            switch (dir) {
                case KEY.LEFT: console.log('Links!'); break;
                default:
                    console.log(Object.keys(KEY).find(k => KEY[k] == dir));
            }
        }
    },
    created() {
        document.addEventListener('keyup', this.handleKey);
    }
});
