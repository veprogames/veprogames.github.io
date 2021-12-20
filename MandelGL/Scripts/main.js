var gl = document.querySelector("#cnv").getContext("webgl");
var fragCode = document.querySelector("#fragmentshader").innerHTML;
var vertCode = document.querySelector("#vertexshader").innerHTML;

var vertices = [-1.0, 1.0,
    1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0];

var vertexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, null);

var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
var vertShader = gl.createShader(gl.VERTEX_SHADER);

gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);

gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);

console.log("---Vertex---\n" + gl.getShaderInfoLog(vertShader));
console.log("---Fragment---\n" + gl.getShaderInfoLog(fragShader));

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, fragShader);
gl.attachShader(shaderProgram, vertShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);


gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
var coord = gl.getAttribLocation(shaderProgram, "coordinates");
gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coord);

var appData =
    {
        deltaOld: Date.now(),
        deltaNew: Date.now(),
        sidebarFocused: false,
        resolution: [1920, 1080],
        dragMode: false,
        zoomSpeed: 5,
        smoothZoom: false,
        maxIterations: 64,
        camPos: [-0.5, 0],
        camTargetRange: 3,
        camRange: 3,
        mousePos: [0, 0],
        currentlyZooming: false,
        zoomDirection: 1,
        colorOffset: 0,
        colorSpeed: 20,
        colorScheme: 2,
        colorSchemeNames: ["Purple", "Neon Green", "Flames", "Stripes", "Custom"],
        fractalTypes: ["Mandelbrot", "Burning Ship"],
        colorCycling: false,
        colorCyclingSpeed: 0,
        smoothColors: true,
        bailout: true, //true - high bailout, false - low (4)
        innerColor: "#000000",
        startZ: [0, 0],
        power: 2,
        type: 0,
        vignette: false,
        saturation: 1,
        minRange: 1e-5,
        maxRange: 10,
        camBounds: [10, 10],
        gradientColors: undefined,
        gradients:
            [
                {name: "Rainbow", colors: ["#000000", "#ff0000", "#ffff00", "#00ff00", "#0000ff", "#ff00ff"]},
                {name: "Purple", colors: ["#e917d1", "#e45817", "#fbdef1", "#2a35be", "#5c0300"]},
                {name: "Sea", colors: ["#0eaa83", "#6a4982", "#c5e0e3", "#0f4bb7", "#15c8ae"]},
                {name: "Color Mix 1", colors: ["#61a3f4", "#0a93ae", "#842238", "#e48236"]}
            ],
        uniforms:
            {
                resolution: gl.getUniformLocation(shaderProgram, "resolution"),
                time: gl.getUniformLocation(shaderProgram, "time"),
                maxIterations: gl.getUniformLocation(shaderProgram, "maxIterations"),
                camPos: gl.getUniformLocation(shaderProgram, "camPos"),
                camRange: gl.getUniformLocation(shaderProgram, "camRange"),
                colorOffset: gl.getUniformLocation(shaderProgram, "colorOffset"),
                colorSpeed: gl.getUniformLocation(shaderProgram, "colorSpeed"),
                colorScheme: gl.getUniformLocation(shaderProgram, "colorScheme"),
                smoothColors: gl.getUniformLocation(shaderProgram, "smoothColors"),
                bailout: gl.getUniformLocation(shaderProgram, "highBailout"),
                innerColor: gl.getUniformLocation(shaderProgram, "innerColor"),
                vignette: gl.getUniformLocation(shaderProgram, "vignette"),
                saturation: gl.getUniformLocation(shaderProgram, "saturation"),
                gradientColors: gl.getUniformLocation(shaderProgram, "gradientColors"),
                gradientColorCount: gl.getUniformLocation(shaderProgram, "gradientColorCount"),
                startZ: gl.getUniformLocation(shaderProgram, "startZ"),
                power: gl.getUniformLocation(shaderProgram, "power"),
                type: gl.getUniformLocation(shaderProgram, "type")
            }
    };

var appFunctions =
    {
        formatNumber(n)
        {
            return (n < 100 ? n.toFixed(2) : n.toFixed(0));
        },
        stringToColor(str)
        {
            str = str.substr(1, str.length - 1);
            return Number.parseInt(str, 16);
        },
        stringToColorArray(str)
        {
            let int = appFunctions.stringToColor(str);
            return [Math.floor(int / (256 ** 2)) % 256, Math.floor(int / (256)) % 256, Math.floor(int) % 256];
        },
        colorToString(col)
        {
            return "#" + ("0" + col[0].toString(16)).slice(-2) +
                ("0" + col[1].toString(16)).slice(-2) +
                ("0" + col[2].toString(16)).slice(-2);
        },
        setResolution(x, y)
        {
            gl.viewport(0, 0, x, y);
            gl.uniform2fv(appData.uniforms.resolution, [x, y]);
            appData.resolution = [x, y];
            document.querySelector("#cnv").width = x;
            document.querySelector("#cnv").height = y;
            appFunctions.refresh();
        },
        detectResolution()
        {
            appFunctions.setResolution(innerWidth, innerHeight);
        },
        multiplyResolution(f)
        {
            appFunctions.setResolution(appData.resolution[0] * f, appData.resolution[1] * f);
        },
        setIterations(x)
        {
            gl.uniform1i(appData.uniforms.maxIterations, x);
            appFunctions.refresh();
        },
        setCamPos(x, y)
        {
            gl.uniform2fv(appData.uniforms.camPos, [x, y]);
            appFunctions.refresh();
        },
        setCamRange(x)
        {
            gl.uniform1f(appData.uniforms.camRange, x);
            appFunctions.refresh();
        },
        setColorOffset(x)
        {
            gl.uniform1f(appData.uniforms.colorOffset, x);
            appFunctions.refresh();
        },
        setColorSpeed(x)
        {
            gl.uniform1f(appData.uniforms.colorSpeed, x);
            appFunctions.refresh();
        },
        setColorScheme(x)
        {
            gl.uniform1i(appData.uniforms.colorScheme, x);
            appFunctions.refresh();
        },
        setSmoothColors(x)
        {
            gl.uniform1i(appData.uniforms.smoothColors, x);
            appFunctions.refresh();
        },
        setBailout(x)
        {
            gl.uniform1i(appData.uniforms.bailout, x);
            appFunctions.refresh();
        },
        setVignette(x)
        {
            gl.uniform1i(appData.uniforms.vignette, x);
            appFunctions.refresh();
        },
        setSaturation(x)
        {
            gl.uniform1f(appData.uniforms.saturation, x);
            appFunctions.refresh();
        },
        setStartZ(x, y)
        {
            gl.uniform2f(appData.uniforms.startZ, x, y);
            appFunctions.refresh();
        },
        setPower(x)
        {
            gl.uniform1i(appData.uniforms.power, appFunctions.clamp(x, 2, 4));
            appFunctions.refresh();
        },
        setType(x)
        {
            gl.uniform1i(appData.uniforms.type, appFunctions.clamp(x, 0, 1));
            appFunctions.refresh();
        },
        setInnerColor(r, g, b)
        {
            if (arguments.length === 1)
            {
                gl.uniform3fv(appData.uniforms.innerColor, [Math.floor(r / 256 / 256) % 256 / 256,
                    Math.floor(r / 256) % 256 / 256,
                    r % 256 / 256]);
            }
            if (arguments.length === 3)
            {
                gl.uniform3fv(appData.uniforms.innerColor, [r, g, b]);
            }
            appFunctions.refresh();
        },
        generateRandomColor: function()
        {
            return appFunctions.colorToString([Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]);
        },
        addGradientColor: function()
        {
            if(appData.gradientColors.length < 16)
            {
                appData.gradientColors.push("#000000");
                appFunctions.setGradient(appData.gradientColors);
            }
        },
        removeGradientColor: function()
        {
            if(appData.gradientColors.length > 1)
            {
                appData.gradientColors = appData.gradientColors.slice(0, appData.gradientColors.length - 1);
                appFunctions.setGradient(appData.gradientColors);
            }
        },
        generateRandomGradient: function()
        {
            for(let i = 0; i < appData.gradientColors.length; i++)
            {
                Vue.set(appData.gradientColors, i, appFunctions.generateRandomColor());
            }
            appFunctions.setGradient(appData.gradientColors);
        },
        loadGradient: function(gradient)
        {
            appData.gradientColors = Array.from(gradient.colors);
            appFunctions.setColorScheme(4);
            appFunctions.setGradient(appData.gradientColors);
        },
        setGradient(colors)
        {
            let arr = [];
            for (let colorString of colors)
            {
                let col = appFunctions.stringToColorArray(colorString);
                for (let comp of col)
                {
                    arr.push(comp / 256);
                }
            }
            gl.uniform1i(appData.uniforms.gradientColorCount, colors.length);
            gl.uniform3fv(appData.uniforms.gradientColors, new Float32Array(arr));
        },
        refreshCamera()
        {
            appFunctions.setCamPos(appData.camPos[0], appData.camPos[1]);
            appFunctions.setCamRange(appData.camRange);
        },
        clampCamera: function()
        {
            appData.camTargetRange = appFunctions.clamp(appData.camTargetRange, appData.minRange, appData.maxRange);
            appData.camRange = appFunctions.clamp(appData.camRange, appData.minRange, appData.maxRange);
            appData.camPos[0] = appFunctions.clamp(appData.camPos[0], -appData.camBounds[0], appData.camBounds[0]);
            appData.camPos[1] = appFunctions.clamp(appData.camPos[1], -appData.camBounds[1], appData.camBounds[1]);
        },
        refresh()
        {
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        },
        screenToCoordPoint(c)
        {
            let nx = c[0] / appData.resolution[0];
            let ny = c[1] / appData.resolution[1];

            return [-appData.camRange + 2 * appData.camRange * nx + appData.camPos[0],
                appData.camRange - 2 * appData.camRange * ny + appData.camPos[1]
            ];
        },
        clamp(n, min, max)
        {
            return Math.min(max, Math.max(min, n));
        }
    };

function onCreate()
{
    appData.colorScheme = Math.floor(Math.random() * 5);

    appFunctions.detectResolution();
    gl.clear(gl.COLOR_BUFFER_BIT);
    appFunctions.setResolution(appData.resolution[0], appData.resolution[1]);
    appFunctions.setIterations(appData.maxIterations);
    appFunctions.setCamPos(appData.camPos[0], appData.camPos[1]);
    appFunctions.setCamRange(appData.camRange);
    appFunctions.setColorOffset(appData.colorOffset);
    appFunctions.setColorSpeed(appData.colorSpeed);
    appFunctions.setColorScheme(appData.colorScheme);
    appFunctions.setSmoothColors(appData.smoothColors);
    appFunctions.setBailout(appData.bailout);
    appFunctions.setStartZ(appData.startZ[0], appData.startZ[1]);
    appFunctions.setInnerColor(appFunctions.stringToColor(appData.innerColor));
    appFunctions.setVignette(appData.vignette);
    appFunctions.setSaturation(appData.saturation);
    appFunctions.setPower(appData.power);
    appFunctions.setType(appData.type);
    appData.gradientColors = new Array(6).fill("#ffffff").map(c => appFunctions.colorToString([Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]));
    appFunctions.setGradient(appData.gradientColors);
}

var app = new Vue(
    {
        el: "#app",
        data: appData,
        methods: appFunctions,
        created: onCreate
    });

document.querySelector("#cnv").onmousedown = function (e)
{
    appData.zoomDirection = e.button === 0 ? 1 : -1;
    appData.currentlyZooming = true;
};

document.querySelector("#cnv").onmouseup = function (e)
{
    appData.currentlyZooming = false;
};

document.querySelector("#cnv").onmouseout = function (e)
{
    appData.currentlyZooming = false;
};

document.querySelector("#cnv").onmousemove = function (e)
{
    appData.mousePos = [e.clientX, e.clientY];

    if (appData.dragMode && appData.currentlyZooming)
    {
        if (e.movementX !== undefined && e.movementY !== undefined)
        {
            appData.camPos[0] -= e.movementX * appData.camRange / 1000;
            appData.camPos[1] += e.movementY * appData.camRange / 1000;
            appFunctions.refreshCamera();
        }
    }
};

document.querySelector("#cnv").oncontextmenu = function (e)
{
    e.preventDefault();
    return false;
};

document.onwheel = function (e)
{
    if (appData.dragMode)
    {
        let zoomFactor = Math.pow(1 / appData.zoomSpeed, 0.1);
        if (e.deltaY < 0) //scroll down
        {
            appData.camTargetRange *= zoomFactor;
        }
        if (e.deltaY > 0) //scroll up
        {
            appData.camTargetRange /= zoomFactor;
        }

        appFunctions.refreshCamera();
        appFunctions.clampCamera();
    }
    else
    {
        if (!appData.sidebarFocused)
        {
            if (e.deltaY < 0) //scroll down
            {
                appData.maxIterations = appData.maxIterations * 1.025 + 1;
            }
            if (e.deltaY > 0) //scroll up
            {
                appData.maxIterations = appData.maxIterations / 1.025 - 1;
            }
            appData.maxIterations = Math.round(appFunctions.clamp(appData.maxIterations, 4, 4096));
            appFunctions.setIterations(appData.maxIterations);
        }
    }
};

window.onblur = function (e)
{
    appData.camRange = appData.camTargetRange;
};

onresize = e => appFunctions.detectResolution();

function updateLoop()
{
    appData.deltaNew = Date.now();

    let delta = (appData.deltaNew - appData.deltaOld) / 1000;

    appData.deltaOld = Date.now();

    if (appData.currentlyZooming && !appData.dragMode)
    {
        if (appData.zoomDirection === 1) //if zooming in
        {
            let mDelta = [appData.mousePos[0] / innerWidth - 0.5,
                -(appData.mousePos[1] / innerHeight - 0.5)];

            appData.camPos[0] += mDelta[0] * appData.camRange * 5 * delta * appData.resolution[0] / appData.resolution[1];
            appData.camPos[1] += mDelta[1] * appData.camRange * 5 * delta;
        }

        appData.camTargetRange *= Math.pow(appData.zoomSpeed, delta * -appData.zoomDirection);
        appFunctions.refreshCamera();
    }

    appData.colorOffset += -appData.colorCyclingSpeed * appData.colorSpeed * delta;
    appFunctions.setColorOffset(appData.colorOffset);

    gl.uniform1f(appData.uniforms.time, Date.now() / 1000 % 1000);
    if (appData.vignette)
    {
        appFunctions.refresh();
    }

    if (appData.smoothZoom)
    {
        appData.camRange *= Math.pow(appData.camTargetRange / appData.camRange, delta * 6);
    }
    else
    {
        appData.camRange = appData.camTargetRange;
    }

    appFunctions.refreshCamera();
    appFunctions.clampCamera();


    requestAnimationFrame(updateLoop);
}

requestAnimationFrame(updateLoop);