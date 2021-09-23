Vue.component("tab-settings", {
    data() {
        return {
            settings: game.settings,
            notations,
            styles:
                [
                    ["standard", "Standard"],
                    ["legacy", "Legacy"],
                    ["gradient", "Gradient"],
                    ["dark", "Dark"],
                    ["amoled", "AMOLED"],
                    ["plastic", "Plastic"]
                ],
            exportedGame: ""
        }
    },
    methods: {
        setNotation(index) {
            game.settings.currentNotation = notations[index];
            game.settings.currentNotationIdx = index;
        },
        setCustomNotation() {
            if (game.settings.customNotationSequence.length >= 2) {
                game.settings.currentNotation = new ADNotations.CustomNotation(game.settings.customNotationSequence);
                game.settings.currentNotationIdx = -1;
            } else {
                alert("The Sequence must be at least 2 characters long!");
            }
        },
        setStyle(name) {
            document.querySelector("#gamestyle").href = "css/style." + name + ".css";
            game.currentStyle = name;
        },
        exportGame() {
            this.exportedGame = SaveManager.getSaveCode();
        },
        importGame() {
            let code = prompt("Input save code", "...");
            if (code !== null) {
                SaveManager.loadGame(code);
            }
        },
        hardResetGame() {
            if (confirm("Do you REALLY want to reset absolutely everything you have reached so far")) {
                for (let i = 3; i > 0; i--) {
                    if (!confirm("Click " + i.toFixed(0) + " more times to confirm")) {
                        return;
                    }
                }

                SaveManager.loadGame(initialGame);
                SaveManager.saveGame();
            }
        }
    },
    mounted() {
        this.$refs.select_format.selectedIndex = game.settings.currentNotationIdx !== -1 ? game.settings.currentNotationIdx : 0;
        this.$refs.select_style.selectedIndex = this.styles.findIndex(s => s[0] === game.currentStyle);
    },
    watch: {
        "settings.uiScale": v => {
            document.querySelector(":root").style.setProperty("--ui-scale", v);
        }
    },
    template: `<div class="tab-settings center">
    <div class="settings-dropdowns flex-around margin-v-l">
        <div>
            <label class="title">Number Format
                <select ref="select_format" @change="setNotation($event.target.selectedIndex)">
                    <option v-for="n in notations">{{n.name}}</option>
                </select>
            </label>
        </div>
        <div>
            <label>Custom Notation: <input type="text" placeholder="Your custom sequence" v-model="settings.customNotationSequence"/></label>
            <button @click="setCustomNotation()">Apply</button><br/>
        </div>
        <div>
            <label class="title">Style
                <select ref="select_style" @change="setStyle(styles[$event.target.selectedIndex][0])">
                    <option v-for="s in styles">{{s[1]}}</option>
                </select>
            </label>
        </div>
    </div>
    <div class="flex-center-center flex-gap margin-l">
        <span class="title">Options</span>
        <label>Resource Overview in Canvas: <input type="checkbox" v-model="settings.topBarShown"/></label>
        <label>Animations in Mergepedia: <input type="checkbox" v-model="settings.mergepediaAnimations"/></label>
        <label>Click Particles: <input type="checkbox" v-model="settings.clickParticles"/></label>
        <label>Prestige Confirmation: <input type="checkbox" v-model="settings.prestigeConfirmation"/></label>
    </div>
    <label class="text-l ui-scale">UI Scale <input type="range" min="0.5" max="2" step="0.01" v-model.number="settings.uiScale"/></label>
    <span class="title" style="margin: 0.5rem;">Save Management</span><br/>
    <p class="text-l">Browser Storage isn't the most reliable thing on Earth and Cleaning Tools might intervene. Make sure to export frequently!</p>
    <textarea rows="4" cols="150" v-model="exportedGame"></textarea><br/><br/>
    <button @click="exportGame()">Export Game</button> <button @click="importGame()">Import Game</button><br/><br/>
    <button class="button-l hard-reset" @click="hardResetGame">WIPE ABSOLUTELY EVERYTHING</button>
</div>`
});