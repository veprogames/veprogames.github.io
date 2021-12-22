const SaveManagerWindow = WindowComponent.extend({
    name: "SaveManagerWindow",
    data() {
        return {
            exportString: ""
        }
    },
    computed: {
        visibleString() {
            return this.exportString.length > 50 ? this.exportString.substring(0, 48) + "..." : this.exportString;
        },
        fileSize() {
            const l = this.exportString.length;
            return l > 1000 ? (l / 1000).toFixed(2) + " kiloBytes" : l + " Bytes";
        }
    },
    methods: {
        exportGame() {
            this.exportString = SaveManager.getSaveCode();
        },
        downloadGame() {
            this.exportGame();
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.download = "yet-another-save-file.txt";
            a.href = `data:text/plain;charset=utf-8,${this.exportString}`;
            a.click();
            document.body.removeChild(a);
        },
        importGame() {
            const code = this.exportString;
            if (code.length > 0) {
                SaveManager.loadGame(code);
            }
        },
        openHardReset() {
            windowManager.createWindow(HardResetWindow);
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
    template: `<window title="Save Management">
        <div class="flex-vertical flex-center-v padding-l">
            <div class="flex-center flex-gap">
                <button class="button-xl" @click="exportGame()">Export Game</button>
                <button class="button-xl" @click="downloadGame()">Download</button>
                <button class="button-l hard-reset" @click="openHardReset()">WIPE ABSOLUTELY EVERYTHING</button>
            </div>
            <div class="flex-between flex-center-v padding-l">
                <input type="text" v-model="exportString"/>
                <p>{{fileSize}}</p>
                <button class="button-l" @click="importGame()">Import Game</button>
            </div>
        </div>
    </window>`
});