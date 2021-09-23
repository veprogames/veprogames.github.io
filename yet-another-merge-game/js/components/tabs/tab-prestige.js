Vue.component("tab-prestige", {
    data() {
        return {
            upgrades: game.prestige.upgrades
        }
    },
    methods: {
        prestigeGame() {
            game.prestige.prestige();
        }
    },
    computed: {
        quantumFoam() {
            return game.prestige.quantumFoam;
        },
        bankedQuantumFoam() {
            return game.prestige.bankedQuantumFoam;
        },
        pendingFoam() {
            return game.prestige.getQuantumFoam();
        },
        foamBoost() {
            return game.prestige.getQuantumFoamBoost();
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
        <div class="flex-between flex-center-v padding-h-xxl">
            <button style="font-size: 125%;" :disabled="pendingFoam.lte(0)" @click="prestigeGame()">Prestige to get
                <span class="text-xl">{{pendingFoam | fnum}}</span> Quantum Foam<br/>
                Each Quantum Foam adds a 1% Boost to Matter produced</button>
            <div v-if="nextMilestone !== undefined" style="transform: translateY(-40%);">
                Reach <merger style="transform: translate(0, 40%);" :level="nextMilestoneLevel"></merger>
                to get <span class="title">{{nextMilestoneBoost | fnum(1, 1)}}x</span> more Quantum Foam!
            </div>
        </div>
        <p>You have <span class="title">{{quantumFoam | fnum}} [{{bankedQuantumFoam | fnum}}] <img alt="Quantum Foam" class="icon" src="images/currencies/quantumfoam.png"/></span> 
            → <span class="title">x{{foamBoost | fnum}} Matter Production</span></p>
        <table class="upgrades prestige">
            <upgrade-row v-for="(upg, i) in upgrades" :key="i" :upgrade="upg"></upgrade-row>
        </table>
    </div>
</div>`
});