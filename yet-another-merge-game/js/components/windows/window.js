const WindowComponent = Vue.extend({
    props: {
        title: String,
        icon: String
    },
    emits: ["closed"],
    data() {
        return {
            x: 0,
            y: 0,
            offset: { x: 0, y: 0 },
            focus: false //movable
        };
    },
    mounted() {
        this.resetPosition();
        document.body.addEventListener("mousemove", this.move);
        document.body.addEventListener("touchmove", this.move);
        document.body.addEventListener("mouseup", this.mouseup);
        document.body.addEventListener("touchend", this.mouseup);
    },
    destroyed() {
        document.body.removeEventListener("mousemove", this.move);
        document.body.removeEventListener("touchmove", this.move);
        document.body.removeEventListener("mouseup", this.mouseup);
        document.body.removeEventListener("touchend", this.mouseup);
    },
    methods: {
        getInputPosition(event) {
            if (event instanceof MouseEvent) return { x: event.clientX, y: event.clientY };
            else if (event instanceof TouchEvent) return { x: event.touches[0].clientX, y: event.touches[0].clientY };
            return null;
        },
        resetPosition() {
            this.x = innerWidth / 4;
            this.y = innerHeight / 4;
        },
        mousedown(e) {
            this.focus = true;
            let { x, y } = this.getInputPosition(e);
            this.offset = { x: x - this.x, y: y - this.y };
        },
        move(e) {
            if (this.focus) {
                let { x, y } = this.getInputPosition(e);
                this.x = x - this.offset.x;
                this.y = y - this.offset.y;
            }
        },
        mouseup() {
            this.focus = false;
        },
        close() {
            this.$emit("closed");
            app.$emit("window-closed");
            VueUtils.destroyComponent(this);
        }
    },
    template: `<div ref="window" class="window" :style="{left: x + 'px', top: y + 'px'}">
        <div class="header" @mousedown="mousedown($event)" @touchstart="mousedown($event)">
            <div class="with-icon">
                <img v-if="icon" :src="icon"></img>
                <h3>{{title}}</h3>
            </div>
            <button @click="close()">X</button>
        </div>
        <div class="body">
            <slot></slot>
        </div>
    </div>`
});

Vue.component("window", WindowComponent);