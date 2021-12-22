const PrestigeWindowComponent = WindowComponent.extend({
    name: "PrestigeWindowComponent",
    methods: {
        prestige() {
            game.prestige.prestige();
            this.close();
        }
    },
    computed: {
        pendingFoam() {
            return game.prestige.getQuantumFoam();
        },
    },
    template: `<window icon="images/currencies/quantumfoam.png" title="Are you sure?">
        <div class="flex-vertical flex-between">
            <div>
                <p>Prestiging will reset your normal Matter Upgrades and your on screen Mergers. This will give you</p>
                <p class="title text-outline with-icon">+ {{pendingFoam | fnum}} <img src="images/currencies/quantumfoam.png" alt="Quantum Foam"/></p>
                <p class="margin-v-l">Each banked Quantum Foam adds a 1% Boost to Matter produced. That means that if you spend Quantum Foam on Upgrades, you won't lose any boost on matter.
                    Feel free to spend all your Quantum Foam.
                </p>
            </div>
            <div class="footer-buttons">
                <button class="button-xl" @click="prestige()">Yes</button>
                <button class="button-xl" @click="close()">No</button>
            </div>
        </div>
    </window>`
});