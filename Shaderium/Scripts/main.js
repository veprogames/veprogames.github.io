var shaderContainer = []; //containing all webgl contexts
var overlay = document.querySelector("div.overlay");
var fullScreenInfo = document.querySelector("p.fullscreeninfo");
var ide = document.querySelector(".ide");

var standardResolution = [500, 300];
var refreshInterval;
var intervalEnabled = false;
var showEpilepsyWarning = true;

function addShader(gl, code, author, name)
{
    let fragCode = code.innerHTML || code;
    let vertCode = document.querySelector("#vertexshader").innerHTML;

    let vertices = 
    [
        -1.0, 1.0,
        1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0
    ];

    let vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    let log = gl.getShaderInfoLog(fragShader);
    if(log.length > 0) //on error
    {
        gl.errored = true;
        gl.errorMessage = "Error: " + log;
    }
    else
    {
        gl.errored = false;
    }

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

    gl.shaderProgram = shaderProgram;
    gl.meta = 
    {
        sourcecode: fragCode,
        author: author,
        name: name
    };
    gl.name = name + "<br/>by: " + author + (gl.errored ? " [ERROR]" : "");
}

function selectShaderContainer(div)
{
    div.classList.add("selected");
    div.classList.remove("col-sm-4");
    div.selected = true;
    overlay.style.display = "block";
    div.childNodes[0].width = innerWidth * 0.9;
    div.childNodes[0].height = innerHeight * 0.9;
    div.childNodes[1].style.display = "none"; //info text
    div.childNodes[2].style.display = "none"; //delete text
    div.childNodes[3].style.display = "none"; //edit text
    fullScreenInfo.innerHTML = div.childNodes[1].innerHTML;
}

function unselectShaderContainer(div)
{
    if(div.classList.contains("selected"))
    {
        div.classList.remove("selected");
    }
    div.classList.add("col-sm-4");
    div.selected = false;
    overlay.style.display = "none";
    div.childNodes[0].width = standardResolution[0];
    div.childNodes[0].height = standardResolution[1];
    div.childNodes[1].style.display = "block"; //info text
    div.childNodes[2].style.display = "block"; //delete text
    div.childNodes[3].style.display = "block"; //edit text
    fullScreenInfo.innerHTML = "";
}

function addShaderContainer(code, author, name)
{
    for(let gl of shaderContainer)
    {
        if(gl.meta.author === author && gl.meta.name === name) //prevent duplicates
        {
            return;
        }
    }

    let container = document.createElement("div");
    container.classList.add("shadercontainer");
    container.classList.add("col-sm-4");
    let canvas = document.createElement("canvas");
    canvas.width = standardResolution[0];
    canvas.height = standardResolution[1];
    canvas.selected = false;
    canvas.onclick = e => 
    {
        let c = container;
        if(!c.selected && document.querySelectorAll("canvas.selected").length === 0)
        {
            selectShaderContainer(c);
        }
        else
        {
            unselectShaderContainer(c);
        }
    };
    canvas.oncontextmenu = e => e.preventDefault();
    let info = document.createElement("p");
    let textDelete = document.createElement("button");
    let textEdit = document.createElement("button");
    textDelete.classList.add("clickable");
    textDelete.classList.add("delete");
    textEdit.classList.add("clickable");
    textEdit.classList.add("edit");
    textDelete.innerHTML = "&#x1f5d1;";
    textEdit.innerHTML = "&#x1F589;";
    container.appendChild(canvas);
    container.appendChild(info);
    container.appendChild(textDelete);
    container.appendChild(textEdit);
    document.querySelector("#canvascontainer").appendChild(container);

    let ctx = canvas.getContext("webgl");
    shaderContainer.push(ctx);
    addShader(ctx, code, author, name);
    ctx.viewport(0, 0, standardResolution[0], standardResolution[1]);
    info.innerHTML = ctx.name;
    textDelete.onclick = e => deleteShader(ctx);
    textEdit.onclick = e => loadShaderToIde(ctx);

    return ctx;
}

function loadShaderToIde(gl)
{
    ide.style.display = "block";
    document.querySelector("#ide_input_author").value = gl.meta.author;
    document.querySelector("#ide_input_name").value = gl.meta.name;
    shaderEditor.setValue(gl.meta.sourcecode);
    shaderEditor.refresh();
}

function deleteShader(gl)
{
    document.querySelector("#canvascontainer").removeChild(gl.canvas.parentNode); //remove container div
    shaderContainer = shaderContainer.filter(ctx => ctx !== gl);
    saveShaders();
}

function saveShaders()
{
    localStorage.setItem("Shaderium", btoa(JSON.stringify(shaderContainer)));
}

function loadShaders()
{
    if(localStorage.getItem("Shaderium") !== null)
    {
        importShaders(localStorage.getItem("Shaderium"));
    }
}

function saveSettings()
{
    let saveObj = 
    {
        epilepsy: showEpilepsyWarning,
        slowUpdate: document.querySelector("#opt_slowupdate").checked
    };

    localStorage.setItem("Shaderium_Settings", JSON.stringify(saveObj));
}

function loadSettings()
{
    if(localStorage.getItem("Shaderium_Settings") !== null)
    {
        return JSON.parse(localStorage.getItem("Shaderium_Settings"));
    }
}

function exportShaders()
{
    let exportstring = btoa(JSON.stringify(shaderContainer));
    let element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(exportstring));
    element.setAttribute("download", "shaderium_export.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function importShaders(str)
{
    let code = str;
    let decoded;
    try
    {
        decoded = atob(code);
    }
    catch(e)
    {
        alert("Decoding failed!");
        return;
    }

    let newShaders;
    try
    {
        newShaders = JSON.parse(decoded);
    }
    catch(e)
    {
        alert("Decoding failed!");
        return;
    }

    for(let gl of shaderContainer)
    {
        deleteShader(gl);
    }

    for(let info of newShaders)
    {
        addShaderContainer(info.meta.sourcecode, info.meta.author, info.meta.name);
    }
}


loadShaders();

var loadedSettings = loadSettings();
var confirmedEpilepsyWarning = false;
if(loadedSettings !== undefined)
{
    document.querySelector("#opt_slowupdate").checked = loadedSettings.slowUpdate;
    showEpilepsyWarning = loadedSettings.epilepsy;
    confirmedEpilepsyWarning = loadedSettings.epilepsy; 
}

if(!confirmedEpilepsyWarning)
{
    confirmedEpilepsyWarning = confirm("EPILEPSY WARNING!\n\nThese following shaders contain flashing lights. Continue at you own risk");
    showEpilepsyWarning = confirm("Press OK to not show the warning again");
}

if(document.querySelector("#opt_slowupdate").checked)
{
    enableSlowUpdate();
}

if(confirmedEpilepsyWarning)
{
    for(let el of document.querySelectorAll("script.fragshader"))
    {
        addShaderContainer(el, el.dataset.author, el.dataset.name);
    }

    requestAnimationFrame(update);
}

var shaderEditor = CodeMirror.fromTextArea(document.querySelector("#textarea_code"),
{
    lineNumbers: true
});

function render(gl)
{
    if(!gl.errored)
    {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(gl.getUniformLocation(gl.shaderProgram, "iTime"), (Date.now() / 1000) % 1e5);
        gl.uniform2fv(gl.getUniformLocation(gl.shaderProgram, "iResolution"), [gl.canvas.width, gl.canvas.height]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

function enableSlowUpdate()
{
    refreshInterval = setInterval(() => 
    {
        for(let gl of shaderContainer) render(gl);
    }, 1000);
    intervalEnabled = true;
}

function disableSlowUpdate()
{
    clearInterval(refreshInterval);
    intervalEnabled = false;
}

function update()
{
    for(let gl of shaderContainer)
    {
        if(!intervalEnabled || gl.canvas.parentNode.selected)
        {
            render(gl);
        }
    }
    
    requestAnimationFrame(update);
}

document.querySelector("#opt_slowupdate").onchange = e => 
{
    if(e.target.checked)
    {
        enableSlowUpdate();
    }
    else
    {
        disableSlowUpdate();
    }
};

document.querySelector("#btn_createshader").onclick = e => 
{
    document.querySelector(".ide").style.display = "block";
    shaderEditor.refresh();
};

document.querySelector("#btn_compile").onclick = e => 
{
    let author = document.querySelector("#ide_input_author").value;
    let name = document.querySelector("#ide_input_name").value;
    for(let gl of shaderContainer)
    {
        if(gl.meta.author === author && gl.meta.name === name)
        {
            deleteShader(gl);
        }
    }
    let gl = addShaderContainer(shaderEditor.getValue(), author, name);
    if(!gl.errored)
    {
        document.querySelector(".ide").style.display = "none";
        saveShaders();
    }
    else
    {
        document.querySelector("#ide_compile_info").innerHTML = gl.errorMessage;
    }
};

document.querySelector("#btn_exit").onclick = e => 
{
    document.querySelector(".ide").style.display = "none";
};

document.querySelector("#btn_exportshaders").onclick = exportShaders;
document.querySelector("#btn_importshaders").onclick = e => 
{
    importShaders(prompt("Input your code here", "<code>"));
};

onresize = e => 
{
    let div = document.querySelector("div.shadercontainer.selected");

    if(div !== null)
    {
        let canvas = div.childNodes[0];
        canvas.width = innerWidth * 0.9;
        canvas.height = innerHeight * 0.9;
    }
};

onclick = saveSettings;