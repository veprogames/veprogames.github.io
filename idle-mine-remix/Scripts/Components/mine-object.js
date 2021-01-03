Vue.component("mine-object",
    {
        props: ["level", "nodamage"],
        methods:
            {
                drawMineObject: function(level)
                {
                    let canvas = this.$refs.cnv;
                    if(canvas !== undefined)
                    {
                        let ctx = canvas.getContext("2d");
                        let w = ctx.canvas.width, h = ctx.canvas.height;
                        let mineObj = functions.getMineObject(level);
                        ctx.clearRect(0, 0, w, h);
                        for(let i = mineObj.colors.length - 1; i >= 0; i--)
                        {
                            if(mineObj.colors[i] !== "transparent")
                            {
                                drawStone(ctxCache, mineObj.colors[i], i, mineObj.skin);
                                ctx.drawImage(ctxCache.canvas, 0, 0,ctx.canvas.width, ctx.canvas.height);
                            }
                        }
                    }
                },
                damage: function()
                {
                    if(!this.nodamage)
                    {
                        functions.clickMineObject();
                    }
                },
                isDamageable: function()
                {
                    return functions.getActiveDamage().gt(0);
                }
            },
        watch:
            {
                "level": function()
                {
                    this.drawMineObject(this.level);
                }
            },
        mounted: function()
        {
            let intv = setInterval( () =>
            {
                if(imgLoaded)
                {
                    this.drawMineObject(this.level);
                    clearInterval(intv);
                }
            }, 10);
        },
        template: `
            <canvas @click="damage()" class="mine-object" :class="{nodmg: nodamage || !isDamageable()}" ref="cnv" width="256" height="224"></canvas>
        `
    });