Vue.component("help-button", {
    data() {
        return {
            menus: {
                upgrades: HelpMatterComponent,
                prestige: HelpPrestigeComponent,
                energycores: HelpEnergyCoresComponent,
                quantumprocessor: HelpQuantumProcessorComponent,
                isotopes: HelpIsotopesComponent,
                molecules: HelpMoleculesComponent,
                mergepedia: HelpMergepediaComponent
            }
        };
    },
    methods: {
        openHelp() {
            if (this.hasHelp) {
                windowManager.createWindow(this.menus[game.settings.currentTab]);
            }
        }
    },
    computed: {
        hasHelp() {
            return this.menus[game.settings.currentTab];
        }
    },
    template: `<button v-show="hasHelp" @click="openHelp()" class="button-xl with-icon"><img src="images/tabs/help.png"/></button>`
});