Vue.component("tab-abilities", {
    methods: {
        selectClickAbility(ability) {
            game.clickAbility = ability;
        }
    },
    computed: {
        ability() {
            return game.clickAbility;
        }
    },
    template: `<div class="padding-h-l">
        <div class="text-l padding">
            <h3>Select your Click ability</h3>
            <p>Switching is free!</p>
        </div>
        <div class="flex-between">
            <div class="card margin">
                <button :disabled="ability === 0" @click="selectClickAbility(0)" class="button-l">Spawn Speed</button>
                <p class="padding-v">Decrease the wait time for the next Merger by 75 ms (0.075s) with each click.</p>
            </div>
            <div class="card margin">
                <button :disabled="ability === 1" @click="selectClickAbility(1)" class="button-l">Merger Move Speed</button>
                <p class="padding-v">Add 50 % to the move speed of all Mergers. It will cap out at 60 % and decrease over time.</p>
            </div>
        </div>
    </div>`
});