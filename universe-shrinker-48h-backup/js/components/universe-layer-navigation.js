Vue.component("universe-layer-navigation",{
    props:["layers"],
    data: function()
    {
        return {
            layer: game.universeLayers["Universe"] || this.layers[Object.keys(layers)[0]]
        };
    },
    template: `<div class="universe-layer-navigation">
<div class="tabs"><button v-for="l in layers" @click="layer = l">{{l.name}}</button></div>
<universe-layer :layer="layer"></universe-layer>
</div>`
});