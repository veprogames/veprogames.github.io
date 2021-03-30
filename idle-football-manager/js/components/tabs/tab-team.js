app.component("tab-team",{
    computed: {
        team(){
            return this.$root.team;
        }
    },
    template: `<div class="tab-team">
<team-management :team="team"></team-management>
</div>`
});