class MouseManager {
    constructor() {
        this.x = 0;
        this.y = 0;

        for (let ev of ["mousemove", "mousedown"]) {
            window.addEventListener(ev, e => {
                this.x = ((e.clientX / H) - 0.25 * W / H) * 2;
                this.y = (-(e.clientY / H) + 0.25) * 2;
            });
        }
    }
}