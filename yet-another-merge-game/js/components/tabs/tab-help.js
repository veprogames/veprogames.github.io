Vue.component("tab-help", {
    data() {
        return {
            tab: 0,
            helpTabs:
                [
                    ["Introduction", "true"],
                    ["Mergepedia", "true"],
                    ["Prestige", "game.prestige.isUnlocked()"],
                    ["Prestige Upgrades", "game.matter.amountThisPrestige.gt(1e15) || game.prestige.highestQuantumFoam.gt(0)"],
                    ["Energy Cores", "game.prestige.highestQuantumFoam.gte(50000)"],
                    ["Quantum Processor", "game.quantumProcessor.isUnlocked()"],
                    ["Isotopes", "game.isotopes.isUnlocked()"],
                    ["Molecules", "game.molecules.isUnlocked()"]
                ]
        }
    },
    methods: {
        prestigeUnlocked() {
            return game.prestige.count > 0;
        },
        processorCoresBought() {
            return game.quantumProcessor.cores.length > 0;
        },
        tabUnlocked(tab) {
            return eval(tab[1]);
        }
    },
    template: `<div class="tab-help">
    <div class="center">
        <button class="number-format" v-for="(t, i) in helpTabs" v-if="tabUnlocked(t)" @click="tab = i;">{{t[0]}}</button>
    </div>
    <div class="padding-h-xxl">
        <div v-if="tab === 0">
            <h2>Introduction</h2>
            <p>
                Your goal in this game is to combine Objects "Mergers" to produce as much
                <span class="text-xl"><img class="icon" src="images/currencies/matter.png"/> Matter</span> as possible. Each Merger produces <span class="text-xl">5x</span> 
                more matter per second than the previous.
                Matter can be used on <span class="text-xl">Upgrades</span> that can increase the initial tier Mergers spawn on,
                how fast they spawn and how many can be on the screen at once.
            </p>
        </div>
        <div v-if="tab === 1">
            <h2>Mergepedia</h2>
            The <span class="text-xl"><img class="icon" src="images/tabs/mergepedia.png"/> Mergepedia</span> gives you an overview over what Mergers you have seen so far.
            <span v-if="prestigeUnlocked()">
                Mergers reached in the current
                Prestige run are highlighted.
            </span>
        </div>
        <div v-if="tab === 2">
            <h2>Prestige</h2>
            After a certain point, it is harder and harder to Progress and unlock new Mergers.
            To solve that Problem, you can Prestige to get <span class="text-xl"><img class="icon" src="images/currencies/quantumfoam.png"/> Quantum Foam</span>. In that process, you lose
            all Progress made so far, but in exchange, each Quantum Foam increases you Matter Production by <span class="text-xl">1%</span>.
            About <span class="text-xl">100-150</span> Quantum Foam Are recommended for the first Reset.
        </div>
        <div v-if="tab === 3">
            <h2>Prestige Upgrades</h2>
            <p>
                <span class="text-xl"><img class="icon" src="images/currencies/quantumfoam.png"/> Quantum Foam</span> can be used on <span class="text-xl">Prestige Upgrades</span>. Buying them will not decrease the matter boost, since
                the boost is determined based on <span class="text-xl"><img class="icon" src="images/currencies/quantumfoam.png"/> [Banked Quantum Foam]</span>.These can further boost
                your matter production, make Mergers move faster, increase the Quantum Foam yield
                or give you a headstart.
            </p>
        </div>
        <div v-if="tab === 4">
            <h2>Energy Cores</h2>
            <p>
                <span class="text-xl"><img class="icon" src="images/tabs/energycores.png"/> Energy Cores</span> are another way to boost your matter production. After buying them with
                <span class="text-xl"><img class="icon" src="images/currencies/quantumfoam.png"/> Quantum Foam</span>, you can level them up by selecting them. They gain <span class="text-xl">1</span> xp per merge. When they Level up,
                their boost to <span class="text-xl"><img class="icon" src="images/currencies/matter.png"/> Matter</span> production rises.
            </p>
        </div>
        <div v-if="tab === 5">
            <h2>Quantum Processor</h2>
            <p>
                The <span class="text-xl"><img class="icon" src="images/tabs/quantumprocessor.png"/> Quantum Processor</span> is a powerful technology that can increase matter production dramatically.
                Each Processor Core multiplies matter production by <span class="text-xl">x25</span>.
            </p>
            <p v-if="processorCoresBought()">
                You can spend Isotopes to increase the Boost of each individual core. The Boost
                increases by <span class="text-xl">+x25</span> each level (x25, x50, x75, ...).
            </p>
        </div>
        <div v-if="tab === 6">
            <h2>Isotopes</h2>
            <p>
                When two Mergers collide, there's a chance that they create an <span class="text-xl"><img class="icon" src="images/currencies/isotopes.png">Isotope</span>.
                These can be used to Upgrade the Chance that you get Isotopes and that 2 Mergers
                spawn at once. You can also use them to upgrade <span class="text-xl"><img class="icon" src="images/tabs/quantumprocessor.png"/> Quantum Processors</span>.
            </p>
        </div>
        <div v-if="tab == 7">
            <h2>Molecules</h2>
            <p>
                <span class="text-xl"><img class="icon" src="images/tabs/molecules.png"/> Molecules</span> are a very powerful way to progress in the Game.
                Each Molecule can be leveled up by merging. Do not be intimidated by low base values of later Molecules, their production is going
                to rise much faster and easily catch up. You can spend <span class="text-xl"><img class="icon" src="images/tabs/molecules.png"/> Molecules</span>
                on Upgrades that boost various aspects of the Game and reduce the merges needed to level up Molecules.
            </p>
            <p>
                Each Molecule Level adds +^0.0001 to its power, affecting all Molecules. Individual power values can't be greater than 10. Those Powers are multiplied together to calculate the final molecule power.
                For example, if you had 5 Molecules on Level 10000 each, each Molecules Value would be raised by (2^5 = 32), e. g. 1e10 -> 1e320.
            </p>
        </div>
    </div>
</div>`
});