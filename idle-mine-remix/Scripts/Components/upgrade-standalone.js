
Vue.component("upgrade-standalone", {
    methods: {
        getBuyAmount: function()
        {
            if(Utils.keyPressed("Control"))
            {
                return 100;
            }
            else if(Utils.keyPressed("Shift"))
            {
                return 10;
            }
            else
            {
                return 1;
            }
        },
        buy: function()
        {
            this.upg.buyN(this.getBuyAmount(), true);
        }
    },
    props: ["upg"],
    template: `<button class="upgrade-standalone" @click="buy()">
    <h4>{{upg.name}} <span v-if="getBuyAmount() > 1">{{getBuyAmount()}}</span> <span v-if="upg.maxLevel !== Infinity">{{upg.level}} / {{upg.maxLevel}}</span></h4>
    <p class="description">{{upg.desc}}</p>
    <p>{{upg.getEffectDisplay()}}</p>
    <p><img class="inline" :src="upg.icon"/> {{upg.getPriceDisplay()}}</p>
</button>
    `
});