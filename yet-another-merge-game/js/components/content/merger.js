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
                const lifeTime = game.settings.mergepediaAnimations ? Date.now() / 1000 : 10 + new Random(this.level).nextDouble() * 100;
                if(game.settings.lowPerformanceMode){
                    MergeObject.renderMergerSimple(this.ctx, 128, 128, 100, this.level, lifeTime);
                }
                else{
                    MergeObject.renderMerger(this.ctx, 128, 128, 100, this.level, lifeTime);
                }
            }
        },
        mounted: function () {
            this.ctx = this.$refs.cnv.getContext("2d");
            this.render();
            if(game.settings.mergepediaAnimations){
                globalEvents.addEventListener("gameupdate", this.render);
            }
        },
        destroyed(){
            globalEvents.removeEventListener("gameupdate", this.render);
        },
        props: ["level"],
        template: `<canvas class="merger" width="256" height="256" ref="cnv"></canvas>`
    }
);