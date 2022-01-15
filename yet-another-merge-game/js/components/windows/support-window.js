const SupportWindow = WindowComponent.extend({
    name: "SupportWindow",
    methods: {
        openYT() {
            window.open("https://www.youtube.com/channel/UCiQP-YPI3WYY241iJe9mgRQ?sub_confirmation=1", "_blank");
            globalEvents.dispatchSubscribe();
            localStorage.setItem("YetAnotherMergeGame_Support_YT", "true");
        }
    },
    computed: {
        socialBoost(){
            return game.prestige.upgrades.socialBoost.apply();
        }
    },
    template: `<window class="support-window" title="Support Me">
        <p class="text-xl padding-v">If you like what I am doing, you can Support me ♥ and get an extra Boost to help you out.</p>
        <div class="flex-evenly flex-center-v">
            <button class="flex-center-center button-xxl youtube" @click="openYT()">
                <i class="fab fa-youtube margin-h"></i> Subscribe <div class="with-icon"><img src="images/currencies/matter.png"/> x{{socialBoost | ftnum}}</div>
            </button>   
        </div>
    </window>`
});