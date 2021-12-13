Vue.component("molecule", {
    props: ["molecule"],
    computed: {
        power() {
            return this.molecule.getPower();
        },
        levelColor() {
            return `hsl(${this.molecule.level * 10}deg, 100%, 80%)`;
        },
        powerColor() {
            return this.power < 10 ? `hsl(120deg, 100%, ${100 - this.power * 2.5}%)` : "hsl(120deg, 100%, 50%)";
        }
    },
    template: `<div class="molecule flex-evenly flex-center-v padding gap">
    <img class="molecule-image" :src="molecule.image" alt="Molecule"/>
    <div class="molecule-name">
        <p class="text-l">{{molecule.name}}</p>
        <p class="text-xl" :style="{color: levelColor}">v{{molecule.level + 1 | ftnum}}</p>
    </div>
    <progress-bar class="margin" :value="molecule.merges / molecule.getMergesNeeded()">{{molecule.merges | ftnum}} / {{molecule.getMergesNeeded() | ftnum}}</progress-bar>
    <p class="margin-xs">Power<br/><img class="icon" src="images/currencies/molecules.png"/>
        <sup :style="{color: powerColor}" class="text-xl">{{power | fnum(4, 4)}}</sup></p>
    <p>Value<br/><img class="icon" alt="M" src="images/currencies/molecules.png"/> <span class="text-xl">{{molecule.getValue() | fnum}}</span></p>
</div>`
});