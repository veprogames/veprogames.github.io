class Utils {
    static dist(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;

        return Math.sqrt(dx * dx + dy * dy);
    }

    static clamp(val, min, max) {
        return Math.min(max, Math.max(min, val));
    }

    static rgbToColor(r, g, b) {
        return "#" + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
    }

    static reverseString(str) {
        return str.split("").reverse().join("");
    }
}