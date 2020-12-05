Vue.component("upgrade-container", {
    props: ["upgrades"],
    template: `<div class="upgrade-container">
<upgrade v-for="(u, i) in upgrades" :upgrade="u" :key="i"></upgrade>
</div>`
})