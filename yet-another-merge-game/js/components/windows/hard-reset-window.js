const HardResetWindow = WindowComponent.extend({
    name: "HardResetWindow",
    data() {
        return {
            confirmation: "",
            idx: 1 + Math.floor(Math.random() * 20)
        }
    },
    methods: {
        hardResetGame() {
            if (this.confirmation === "I want to") {
                SaveManager.loadGame(initialGame);
                SaveManager.saveGame();
                this.close();
            }
        }
    },
    template: `<window title="Hard Reset">
        <p class="padding-v">Are you really sure that you wanna lose absolutely everything? Literally every Upgrade, every piece of Matter
            and all the other things? It's irreversible. You can't go back.<br/>
            <b>Just close this Window if you don't want to.</b></p>
        <p>Please sign with "I want to"...</p>
        <input v-model="confirmation" placeholder="I want to"/>
        <div class="flex-center-center flex-wrap">
            <p>...and click on the "YES" button:</p>
            <button class="button-xxl negative margin" v-for="i in 20" v-if="i !== idx">NO</button>
            <button class="button positive margin-l" @click="hardResetGame()" v-else>YES</button>
        </div>
    </window>`
});