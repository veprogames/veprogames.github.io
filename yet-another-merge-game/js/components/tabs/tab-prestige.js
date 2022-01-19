Vue.component("tab-prestige", {
    data() {
        return {
            upgrades: game.prestige.upgrades
        }
    },
    methods: {
        prestigeGame() {
            if (game.settings.prestigeConfirmation) {
                windowManager.createWindow(PrestigeWindowComponent);
            }
            else {
                game.prestige.prestige();
            }
        }
    },
    computed: {
        pendingFoam() {
            return game.prestige.getQuantumFoam();
        },
        nextMilestone() {
            return game.prestige.getQFMilestoneInfo().nextMilestone;
        },
        nextMilestoneLevel() {
            return this.nextMilestone[0];
        },
        nextMilestoneBoost() {
            return this.nextMilestone[1];
        }
    },
    template: `<div class="center">
    <div>
        <div class="flex-evenly flex-wrap flex-center-v padding-h-xxl margin">
            <button class="text-l flex-center-center" :disabled="pendingFoam.lte(0)" @click="prestigeGame()">Prestige: 
                <span class="with-icon text-xl"><img src="images/currencies/quantumfoam.png" alt="Quantum Foam: " />+{{pendingFoam | fnum}}</span></button>
            <div v-if="nextMilestone !== undefined" class="flex-center-center">
                Reach <merger :level="nextMilestoneLevel"></merger>
                <span>to get <span class="title">{{nextMilestoneBoost | fnum(1, 1)}}x</span> more Quantum Foam!</span>
            </div>
        </div>
        <div class="upgrade-container">
            <upgrade-quantum-foam v-for="(upg, i) in upgrades" :key="i" :upgrade="upg"></upgrade-quantum-foam>
        </div>
    </div>
</div>`
});