let gradientDiv = document.querySelector("div#gradient_div");

var GradientManager =
    {
        addColor: function (col = data.settings.color, pos = 1)
        {
            let id = data.settings.gradient.colors.length;
            data.settings.gradient.colors.push({pos: pos, color: col});
            let div = document.createElement("div");

            div.innerHTML = '<label>Color: <input type="color" value="' + col + '"/></label> <label>at <input type="number" min="0" max="1" step="0.05" value="' + pos + '"/>' +
                '<button>-</button></label>';

            div.querySelector("input[type=color]").onchange = e => data.settings.gradient.colors[div.dataset.id].color = e.target.value;
            div.querySelector("input[type=number]").onchange = e => data.settings.gradient.colors[div.dataset.id].pos = e.target.value;
            div.querySelector("button").onclick = e => GradientManager.removeColor(div.dataset.id);

            div.dataset.id = id.toString();
            gradientDiv.appendChild(div);
        },
        removeColor: function (idx)
        {
            let div = document.querySelector("div#gradient_div div[data-id='" + idx + "']");
            let parent = div.parentElement;
            parent.removeChild(div);
            data.settings.gradient.colors.splice(idx, 1);
            for (let i = 0; i < parent.childNodes.length; i++)
            {
                parent.childNodes[i].dataset.id = i.toString();
            }
        },
        setGradient: function (g)
        {
            gradientDiv.innerHTML = "";
            data.settings.gradient.colors = [];

            for (let col of g.colors)
            {
                GradientManager.addColor(col.color, col.pos);
            }
            data.settings.gradient.type = g.type;
            data.settings.gradient.rotation = g.rotation;
        },
        createRandomGradient: function (len)
        {
            gradientDiv.innerHTML = "";
            data.settings.gradient.colors = [];

            for (let i = 0; i < len; i++)
            {
                let col = "#" + [Math.random() * 256, Math.random() * 256,
                    Math.random() * 256].map(n => Math.floor(n).toString(16).padStart(2, "0")).join("");
                GradientManager.addColor(col, i / Math.max(1, len - 1));
            }
        }
    };

var gradientTemplates =
    [
        {
            name: "Rainbow",
            gradient:
                {
                    type: 0,
                    rotation: 0,
                    colors: [{pos: 0, color: "#ff0000"}, {pos: 1 / 5, color: "#ffff00"}, {pos: 2 / 5, color: "#00ff00"},
                        {pos: 3 / 5, color: "#00ffff"},
                        {pos: 4 / 5, color: "#0000ff"}, {pos: 1, color: "#ff00ff"}]
                }
        },
        {
            name: "Purple",
            gradient:
                {
                    type: 0,
                    rotation: 0,
                    colors: [{pos: 0, color: "#e917d1"}, {pos: 1 / 4, color: "#e45817"}, {pos: 2 / 4, color: "#fbdef1"},
                        {pos: 3 / 4, color: "#2a35be"},
                        {pos: 1, color: "#5c0300"}]
                }
        },
        {
            name: "Sea",
            gradient:
                {
                    type: 0,
                    rotation: 0,
                    colors: [{pos: 0, color: "#0eaa83"}, {pos: 1 / 4, color: "#6a4982"}, {pos: 2 / 4, color: "#c5e0e3"},
                        {pos: 3 / 4, color: "#0f4bb7"},
                        {pos: 1, color: "#15c8ae"}]
                },
        }
    ]
;