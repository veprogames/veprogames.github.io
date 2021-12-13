class WindowManager {
    constructor() {
        this.window = null;
    }

    createWindow(component) {
        if (this.window === null) {
            const window = VueUtils.createComponent(component);
            this.window = window;
            window.$on("closed", () => {
                this.window = null;
                console.log("closed");
            });
        }
    }
}