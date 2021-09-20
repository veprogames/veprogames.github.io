Vue.component("tab-energy-cores", {
    data() {
        return {
            cores: game.energyCores.cores
        }
    },
    template: `<div class="center">
    <div class="flex-between flex-wrap padding-h-xxl">
        <energy-core v-for="(core, i) in cores" :key="i" :core="core"></energy-core>
    </div>
</div>`
});