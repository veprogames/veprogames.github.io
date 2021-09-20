Vue.component("molecule", {
    props: ["molecule"],
    computed: {
        power() {
            return this.molecule.getPower();
        }
    },
    template: `<div class="molecule flex-start flex-vertical flex-center-v padding">
    <h3>{{molecule.name}} v{{molecule.level + 1 | ftnum}}</h3>
    <p class="margin-xs">{{molecule.merges | ftnum}} / {{molecule.getMergesNeeded() | ftnum}}</p>
    <p class="margin-xs">^{{power | fnum(4, 4)}} / ^10</p>
    <img :src="molecule.image" alt="Molecule"/>
    <p>Value: <span class="text-xl">{{molecule.getValue() | fnum}} <img class="icon" alt="M" src="images/tabs/molecules.png"/></span></p>
</div>`
});