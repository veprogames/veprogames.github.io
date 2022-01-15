const HelpMatterComponent = WindowComponent.extend({
    name: "HelpMatterComponent",
    template: `<window icon="images/tabs/help.png" title="Introduction">
        <p>
            Your goal in this game is to combine Objects "Mergers" to produce as much
            <span class="text-xl"><img class="icon" src="images/currencies/matter.png"/> Matter</span> as possible. Each Merger produces <span class="text-xl">5x</span>
            more matter per second than the previous.
            Matter can be used on <span class="text-xl">Upgrades</span> that can increase the initial tier Mergers spawn on,
            how fast they spawn and how many can be on the screen at once.
        </p>
    </window>`
});

const HelpPrestigeComponent = WindowComponent.extend({
    name: "HelpPrestigeComponent",
    template: `<window icon="images/tabs/help.png" title="Prestige">
        <p>
            After a certain point, it is harder and harder to Progress and unlock new Mergers.
            To solve that Problem, you can Prestige to get <span class="text-xl"><img class="icon" src="images/currencies/quantumfoam.png"/> Quantum Foam</span>. In that process, you lose
            all Progress made so far, but in exchange, each Quantum Foam increases you Matter Production by <span class="text-xl">1%</span>.
            About <span class="text-xl">100-150</span> Quantum Foam Are recommended for the first Reset.
        </p>
        <p>
            <span class="text-xl"><img class="icon" src="images/currencies/quantumfoam.png"/> Quantum Foam</span> can be used on <span class="text-xl">Prestige Upgrades</span>. Buying them will not decrease the matter boost, since
            the boost is determined based on <span class="text-xl"><img class="icon" src="images/currencies/quantumfoam.png"/> [Banked Quantum Foam]</span>.These can further boost
            your matter production, make Mergers move faster, increase the Quantum Foam yield
            or give you a headstart.
        </p>
    </window>`
});

const HelpMergepediaComponent = WindowComponent.extend({
    name: "HelpMergepediaComponent",
    computed: {
        prestigeUnlocked() {
            return game.prestige.count > 0;
        }
    },
    template: `<window icon="images/tabs/help.png" title="Mergepedia">
        <p>
            The <span class="text-xl"><img class="icon" src="images/tabs/mergepedia.png"/> Mergepedia</span> gives you an overview over what Mergers you have seen so far.
            <span v-if="prestigeUnlocked">
                Mergers reached in the current
                Prestige run are highlighted.
            </span>
        </p>
    </window>`
});

const HelpEnergyCoresComponent = WindowComponent.extend({
    name: "HelpEnergyCoresComponent",
    template: `<window icon="images/tabs/help.png" title="Energy Cores">
        <p>
            <span class="text-xl"><img class="icon" src="images/tabs/energycores.png"/> Energy Cores</span> are another way to boost your matter production. After buying them with
            <span class="text-xl"><img class="icon" src="images/currencies/quantumfoam.png"/> Quantum Foam</span>, you can level them up by selecting them. They gain <span class="text-xl">1</span> xp per merge. When they Level up,
            their boost to <span class="text-xl"><img class="icon" src="images/currencies/matter.png"/> Matter</span> production rises.
        </p>
    </window>`
});

const HelpQuantumProcessorComponent = WindowComponent.extend({
    name: "HelpQuantumProcessorComponent",
    computed: {
        processorCoresBought() {
            return game.quantumProcessor.cores.length > 0;
        }
    },
    template: `<window icon="images/tabs/help.png" title="Quantum Processors">
        <p>
            The <span class="text-xl"><img class="icon" src="images/tabs/quantumprocessor.png"/> Quantum Processor</span> is a powerful technology that can increase matter production dramatically.
            Each Processor Core multiplies matter production by <span class="text-xl">x25</span>.
        </p>
        <p v-if="processorCoresBought">
            You can spend Isotopes to increase the Boost of each individual core. The Boost
            increases by <span class="text-xl">+x25</span> each level (x25, x50, x75, ...).
        </p>
    </window>`
});

const HelpIsotopesComponent = WindowComponent.extend({
    name: "HelpIsotopesComponent",
    template: `<window icon="images/tabs/help.png" title="Isotopes">
        <p>
            When two Mergers collide, there's a chance that they create an <span class="text-xl"><img class="icon" src="images/currencies/isotopes.png">Isotope</span>.
            These can be used to Upgrade the Chance that you get Isotopes and that 2 Mergers
            spawn at once. You can also use them to upgrade <span class="text-xl"><img class="icon" src="images/tabs/quantumprocessor.png"/> Quantum Processors</span>.
        </p>
    </window>`
});

const HelpMoleculesComponent = WindowComponent.extend({
    name: "HelpMoleculesComponent",
    template: `<window icon="images/tabs/help.png" title="Molecules">
        <p>
            <span class="text-xl"><img class="icon" src="images/currencies/molecules.png"/> Molecules</span> are a very powerful way to progress in the Game.
            Each Molecule can be leveled up by merging. Do not be intimidated by low base values of later Molecules, their production is going
            to rise much faster and easily catch up. You can spend <span class="text-xl"><img class="icon" src="images/currencies/molecules.png"/> Molecules</span>
            on Upgrades that boost various aspects of the Game and reduce the merges needed to level up Molecules.
        </p>
        <p>
            Each Molecule Upgrade bought will decrease the Merges needed by 1% (stacking) for any Molecule to Level Up. This will softcap at 100 Upgrades bought, 
            but will continue to decrease very slowly without any limit (about 0.01 %, not stacking).
        </p>
        <p>
            Each Molecule Level adds +^0.0001 to its power, affecting all Molecules. Individual power values can't be greater than 10. Those Powers are multiplied together to calculate the final molecule power.
            For example, if you had 5 Molecules on Level 10000 each, each Molecules Value would be raised by (2^5 = 32), e. g. 1e10 -> 1e320.
        </p>
        <p>
            Each click on the Merge Area will give you (Molecule Value) Molecules.
        </p>
    </window>`
});