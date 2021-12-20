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

var canvas = document.querySelector("#cnv");

var appData = 
{
    dTimeOld: Date.now(),
    dTimeNew: Date.now(),
    fps: 0,
    fpsUpdateTime: 0,
    time: 0,
    timeScale: 1,
    resolution: [1024, 576],
    camPos: [0, 0],
    camRange: 10,
    camTargetRange: 10, //for animation
    dragging: false,
    colorSpeed: 1,
    colorScheme: 0,
    colorSchemes: ["Purple", "Red", "Neon Green", "RGB", "Flames", "Color Mix", "Stripes", "Complementary", "Landscape"],
    formulaType: 0,
    formulaTypes: ["Standard", "Increase over Time", "8 Octaves", "SineCosine + Noise", "Cubed Noise", "Noise Islands", "Force Fields"],
    uniforms:
    {
        time: gl.getUniformLocation(shaderProgram, "time"),
        camPos: gl.getUniformLocation(shaderProgram, "camPos"),
        camRange: gl.getUniformLocation(shaderProgram, "camRange"),
        resolution: gl.getUniformLocation(shaderProgram, "resolution"),
        colorSpeed: gl.getUniformLocation(shaderProgram, "colorSpeed"),
        colorScheme: gl.getUniformLocation(shaderProgram, "colorScheme"),
        formulaType: gl.getUniformLocation(shaderProgram, "formulaType")
    }
}

var appFunctions = 
{
    clamp(x, min, max)
    {
        return Math.max(min, Math.min(max, x));
    },
    formatNumber(n)
    {
        let num = Number.parseFloat(n);
        return num > 100 ? num.toFixed(0) : num.toFixed(2);
    },
    formatTime(s)
    {
        let absTime = Math.abs(s);
        let times = [];
        
        if(absTime > 86400)
        {
            times.push(Math.floor(absTime / 86400) + "d");
        }
        if(absTime > 3600)
        {
            times.push((Math.floor(absTime / 3600) % 24) + "h");
        }
        if(absTime > 60)
        {
            times.push((Math.floor(absTime / 60) % 60) + "m");
        }
        if(absTime < 3600)
        {
            times.push((Math.floor(absTime) % 60) + "s");
        }
        if(absTime < 60)
        {
            times.push((Math.floor(absTime * 1e3) % 1000) + "ms");
        }
        if(absTime < 1)
        {
            times.push((Math.floor(absTime * 1e6) % 1000) + "µs");
        }
        
        return (s < 0 ? "-" : "") + times.join(" ");
    },
    moveCamera(t)
    {
        appData.camPos[0] += t[0];
        appData.camPos[1] += t[1];
    },
    setResolution(size)
    {
        appData.resolution = size;
        gl.uniform2fv(appData.uniforms.resolution, appData.resolution);
        gl.viewport(0, 0, size[0], size[1]);
        canvas.width = size[0];
        canvas.height = size[1];
    },
    setColorSpeed(x)
    {
        gl.uniform1f(appData.uniforms.colorSpeed, x);
    },
    setColorScheme(x)
    {
        gl.uniform1i(appData.uniforms.colorScheme, x);
    },
    setFormulaType(x)
    {
        gl.uniform1i(appData.uniforms.formulaType, x);
    }
}

function onCreate()
{
    gl.clear(gl.COLOR_BUFFER_BIT);

    appFunctions.setResolution([window.innerWidth, window.innerHeight]);
    appData.timeScale = 1;
    appFunctions.setColorSpeed(appData.colorSpeed);
    appFunctions.setColorScheme(appData.colorScheme);
    appFunctions.setFormulaType(appData.formulaType);
}

function update()
{
    appData.dTimeNew = Date.now();
    
    let delta = (appData.dTimeNew - appData.dTimeOld) / 1000;
    if(Date.now() - appData.fpsUpdateTime > 500)
    {
        appData.fps = 1 / delta;
        appData.fpsUpdateTime = Date.now();
    }
    
    
    appData.time += appData.timeScale * delta;
    
    appData.camTargetRange = appFunctions.clamp(appData.camTargetRange, 0.1, 500);
    appData.camPos[0] = appFunctions.clamp(appData.camPos[0], -1e5, 1e5);
    appData.camPos[1] = appFunctions.clamp(appData.camPos[1], -1e5, 1e5);
    
    appData.camRange *= Math.pow(appData.camTargetRange / appData.camRange, delta * 5);
    
    gl.uniform1f(appData.uniforms.time, appData.time);
    gl.uniform2fv(appData.uniforms.camPos, appData.camPos);
    gl.uniform1f(appData.uniforms.camRange, appData.camRange);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    appData.dTimeOld = Date.now();
    
    requestAnimationFrame(update);
}

requestAnimationFrame(update);

var app = new Vue(
{
    el: "#app",
    data: appData,
    methods: appFunctions,
    created: onCreate
});

canvas.onmousedown = function(e)
{
    appData.dragging = true;
}

canvas.onmouseup = function(e)
{
    appData.dragging = false;
}

canvas.onmousemove = function(e)
{
    if(appData.dragging)
    {
        if(e.movementX !== undefined && e.movementY !== undefined)
        {
            appFunctions.moveCamera([
                    -e.movementX / appData.resolution[1] * appData.camRange * 2,
                    e.movementY / appData.resolution[0] * appData.camRange * 2]);
        }
    }
}

canvas.onmouseout = function(e)
{
    appData.dragging = false;
}

document.onwheel = function(e)
{
    if(e.deltaY < 0)
    {
        appData.camTargetRange *= 0.9;
    }
    if(e.deltaY > 0)
    {
        appData.camTargetRange /= 0.9;
    }
}

window.onresize = function(e)
{
    appFunctions.setResolution([window.innerWidth, window.innerHeight]);
}

window.onblur = function(e)
{
    appData.camRange = appData.camTargetRange;
}
