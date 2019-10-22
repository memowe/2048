const KEY = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};

new Vue({
    el: 'main',
    data: {
    },
    methods: {
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
    }
});
