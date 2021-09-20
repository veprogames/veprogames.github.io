Vue.component("merger",
    {
        data(){
            return {
                ctx: null,
                destroyed: false
            }
        },
        methods: {
            render(){
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                MergeObject.renderMerger(this.ctx, 128, 128, this.radius, this.level, game.settings.mergepediaAnimations ? Date.now() / 1000 : 10 + new Random(this.level).nextDouble() * 100);
                if(!this.destroyed && game.settings.mergepediaAnimations){
                    requestAnimationFrame(this.render);
                }
            }
        },
        computed:{
            radius(){
                return this.level < 250 ? 100 : 75;
            }
        },
        mounted: function () {
            this.ctx = this.$refs.cnv.getContext("2d");
            requestAnimationFrame(this.render);
        },
        destroyed(){
            this.destroyed = true;
        },
        props: ["level"],
        template: `<canvas class="merger" width="256" height="256" ref="cnv"></canvas>`
    }
);