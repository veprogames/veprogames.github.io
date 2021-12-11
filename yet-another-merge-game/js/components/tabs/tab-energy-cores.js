Vue.component("tab-energy-cores", {
    data() {
        return {
            cores: game.energyCores.cores
        }
    },
    template: `<div class="center">
    <div class="flex-evenly flex-wrap padding-h-xxl">
        <energy-core v-for="(core, i) in cores" :selected="core.isActive" :key="i" :core="core"></energy-core>
    </div>
</div>`
});