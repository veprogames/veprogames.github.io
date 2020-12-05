Vue.component("upgrade", {
    props: ["upgrade"],
    methods: {
        getResourceLayer: function()
        {
            if(this.upgrade instanceof DynamicLayerUpgrade)
            {
                return this.upgrade.getCostLayer(this.upgrade.level.toNumber());
            }
            return this.upgrade.layerCost.layer;
        }
    },
    computed: {
        canAfford: function ()
        {
            if(this.upgrade.level.eq(this.upgrade.maxLevel)) return true;
            if(this.upgrade instanceof DynamicLayerUpgrade)
            {
                if(!this.upgrade.currentCostLayer()) return false;
                return this.upgrade.currentPrice().lt(this.upgrade.currentCostLayer().resource);
            }
            return this.upgrade.currentPrice().lt(this.upgrade.layerCost.resource);
        },
        isUnlocked: function()
        {
            return !this.upgrade.isBuyable || (this.upgrade.isBuyable());
        },
        maxed: function()
        {
            return this.upgrade.level.eq(this.upgrade.maxLevel);
        }
    },
    template: `<button :disabled="!canAfford || !isUnlocked" @click="upgrade.buy()" class="upgrade" :class="{maxed: maxed}">
<p v-html="upgrade.description"></p>
<p v-html="upgrade.getEffectDisplay()"></p>
<p class="price">{{upgrade.getPriceDisplay()}} <resource-name v-if="upgrade.level < upgrade.maxLevel" :layerid='getResourceLayer()'></resource-name></p>
</button>`
});