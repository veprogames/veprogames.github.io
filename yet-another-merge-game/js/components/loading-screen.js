Vue.component("loading-screen", {
    props: {
        loading: Boolean
    },
    data() {
        return {
            dt: Date.now(),
            t: 0,
            opacity: 1,
            ctx: null,
            bg: "black",
            mergerLevel: Math.floor(Math.random() * 100)
        }
    },
    methods: {
        getBackgroundColor() {
            return getComputedStyle(document.body).getPropertyValue("--color-bg-top");
        },
        update() {
            let dt = (Date.now() - this.dt) / 1000;
            this.dt = Date.now();

            this.t += dt;

            if (!this.loading) {
                this.opacity = Math.max(0, this.opacity - 2 * dt);
            }

            let ctx = this.ctx;
            let w = ctx.canvas.width;
            let h = ctx.canvas.height;

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = "#ffffff05";
            let r = new Random(1);
            for (let i = 0; i < 50; i++) {
                let y = r.nextDouble() * h;
                let x = (-0.5 + (r.nextDouble() * 2 + this.t * r.nextDouble() * 0.2) % 2) * w;
                ctx.beginPath();
                ctx.arc(x, y, h * 0.5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }

            CanvasUtils.drawText(ctx, "Yet another Merge Game", w / 2, h * 0.1, h * 0.1, "white");
            CanvasUtils.drawText(ctx, "Loading...", w / 2, h * 0.9, h * 0.07, "white");
            CanvasUtils.drawText(ctx, "v1.0", w - 8, h - 8, h * 0.03, "white", "right", "bottom");

            MergeObject.renderMerger(ctx, w / 2, h / 2, h * 0.2, this.mergerLevel, this.t + 10);

            requestAnimationFrame(this.update);
        }
    },
    mounted() {
        let canvas = this.$refs.cnv;
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        this.ctx = canvas.getContext("2d");
        this.background = this.getBackgroundColor();
        requestAnimationFrame(this.update);
    },
    template: `<canvas :style={opacity} class="overlay" ref="cnv"></canvas>`
});