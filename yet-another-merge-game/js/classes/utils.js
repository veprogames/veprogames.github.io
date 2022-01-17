class Utils {
    static formatTime(s) {
        if (s >= 60) {
            s = Math.floor(s);
            let lim = [3600, 0, 0]; //when time segments should be shown
            let times = [(s / 3600) % 24, (s / 60) % 60, s % 60];
            return times.filter((v, i) => s => lim[i])
                .map(v => v.toString().padStart(2, "0")).join(":");
        }
        if (s >= 1) {
            return s.toFixed(2) + "s";
        }
        if (s >= 0.001) {
            return (s * 1000).toFixed(2) + "ms";
        }
        return (s * 1e6).toFixed(2) + "μs";
    }

    static distSquared(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;

        return dx * dx + dy * dy;
    }

    static dist(x1, y1, x2, y2) {
        return Math.sqrt(Utils.distSquared(x1, x2, y1, y2));
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

    static isIPad(){
        return /iPad|iPhone|iPod/.test(navigator.platform) || /Macintosh|Mac/.test(navigator.userAgent)
            && navigator.maxTouchPoints && navigator.maxTouchPoints > 2;
    }
}