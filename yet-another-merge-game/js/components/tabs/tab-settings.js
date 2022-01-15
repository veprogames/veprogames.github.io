Vue.component("tab-settings", {
    data() {
        return {
            settings: game.settings,
            notations,
            styles:
                [
                    ["standard", "Standard"],
                    ["dark", "Dark"],
                    ["amoled", "AMOLED"]
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
            functions.setStyle(name);
        },
        openWindow() {
            windowManager.createWindow(SaveManagerWindow);
        },
        openSupport() {
            windowManager.createWindow(SupportWindow);
        },
        openCredits() {
            windowManager.createWindow(CreditsWindowComponent);
        },
        exportGame() {
            this.exportedGame = SaveManager.getSaveCode();
        },
        importGame() {
            let code = prompt("Input save code", "...");
            if (code !== null) {
                SaveManager.loadGame(code);
            }
        }
    },
    mounted() {
        this.$refs.select_format.selectedIndex = game.settings.currentNotationIdx !== -1 ? game.settings.currentNotationIdx : 0;
    },
    template: `<div class="tab-settings">
    <div class="flex-around margin-v-l flex-wrap">
        <div class="flex-vertical flex-gap">
            <label class="title">Number Format
                <select ref="select_format" @change="setNotation($event.target.selectedIndex)">
                    <option v-for="n in notations">{{n.name}}</option>
                </select>
            </label>
            <div>
                <label>Custom Notation: <input type="text" placeholder="Your custom sequence" v-model="settings.customNotationSequence"/></label>
                <button @click="setCustomNotation()">Apply</button><br/>
            </div>
        </div>
        <div class="flex-center-center flex-vertical">
            <p class="title">Style</p>
            <div class="flex-center flex-wrap">
                <button class="button-l margin" v-for="s in styles" @click="setStyle(s[0])">{{s[1]}}</button>
            </div>
        </div>
    </div>
    <div class="flex-center-center">
        <label>Max FPS: <input type="range" v-model="settings.maxFps" min="5" max="120" step="5"/> {{settings.maxFps}}</label>
    </div>
    <div class="flex-center-center flex-wrap flex-gap margin-l">
        <ui-toggle v-model="settings.topBarShown">Resource Overview in Canvas</ui-toggle>
        <ui-toggle v-model="settings.mergepediaAnimations">Mergepedia Animations</ui-toggle>
        <ui-toggle v-model="settings.clickParticles">Click Particles</ui-toggle>
        <ui-toggle v-model="settings.prestigeConfirmation">Prestige Confirmation</ui-toggle>
        <ui-toggle v-model="settings.lowPerformanceMode">Low Performance Mode</ui-toggle>
    </div>
    <div class="flex-center-center">
        <button @click="openWindow()" class="button-l" style="margin: 0.5rem;">Save Management</button>
        <p class="text-l">The Game auto-saves.<br/>Browser Storage isn't the most reliable thing on Earth and Cleaning Tools might intervene. Make sure to export frequently!</p>
    </div>
    <div class="footer flex-between padding-h-xl">
        <button class="support" @click="openSupport()">Support Me ♥</button>
        <button @click="openCredits()">Credits</button>
    </div>
</div>`
});