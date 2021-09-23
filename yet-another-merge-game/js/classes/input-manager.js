class InputManager {
    constructor() {
        this.keyMap = [];
        this.actions = {};

        onkeydown = e => {
            if (!this.keyMap.includes(e.key)) {
                this.keyMap.push(e.key);
                for (let action of this.getActions(true)) {
                    action.f();
                    this.keyMap = this.keyMap.filter(k => k !== action.key); //fix funky stuff with alerts
                }
            }
        }

        onkeyup = e => {
            this.keyMap = this.keyMap.filter(k => k !== e.key);
        }
    }

    addAction(key, f, onPressOnly = false) {
        if (typeof f !== "function") {
            console.error("callback is not a function");
            return;
        }
        this.actions[key] = { key, f, onPressOnly };
    }

    getActions(onPressOnly) {
        return Object.keys(this.actions).filter(k => this.keyMap.includes(k)).map(k => this.actions[k]).filter(action => action.onPressOnly === onPressOnly);
    }

    tick() {
        for (let action of this.getActions(false)) {
            action.f();
        }
        /*for (let k of Object.keys(this.actions)) {
            if (this.keyMap.includes(k) && !this.actions[k].onPressOnly) {
                this.actions[k].f();
            }
        }*/
    }
}