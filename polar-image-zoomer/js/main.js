var image = null, canvas, gl;

var zoom = 0,
    targetZoom = 0,
    deltaTimeOld = Date.now(),
    deltaTimeNew = Date.now();

function refresh()
{
    gl.uniform2f(gl.getUniformLocation(program, "iResolution"), canvas.width, canvas.height);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function resizeCanvas(aspect)
{
    canvas.width = innerWidth;
    canvas.height = Math.min(innerHeight * 0.8, canvas.width / aspect);
}

function getMaxZoom()
{
    return image.width / image.height;
}

function getZoom()
{
    let log = zoom * Math.PI * 0.75;
    let e = Math.floor(log);
    let m = Math.pow(10, log % 1);

    if (e < 12)
    {
        return (m * Math.pow(10, e)).toLocaleString("en-us");
    }
    return m.toFixed(2) + "e+" + e.toLocaleString("en-us");
}

function zoomIn(amount)
{
    targetZoom += Math.log10(amount);
    targetZoom = Math.max(0, targetZoom);
    targetZoom = Math.min(getMaxZoom(), targetZoom);
    document.querySelector("input#sl_zoom").value = targetZoom;
}

function handleFileInput(e)
{
    let fr = new FileReader();
    fr.onloadend = file =>
    {
        let img = new Image();
        img.src = file.target.result;
        img.onload = e =>
        {
            image = img;
            zoom = 0;
            targetZoom = 0;
            readTexture(img);
            document.querySelector("input#sl_zoom").value = 0;
        };
    };
    if (e.target.files[0] !== undefined)
    {
        fr.readAsDataURL(e.target.files[0]);
    }
}


function update()
{
    deltaTimeNew = Date.now();

    let delta = (deltaTimeNew - deltaTimeOld) / 1000;

    deltaTimeOld = Date.now();

    document.querySelector("span#mag").innerHTML = getZoom();
    if (image != null)
    {
        zoom += (targetZoom - zoom) * delta * 4;
        if (Math.abs(targetZoom - zoom) < 0.002)
        {
            zoom = targetZoom;
        }
        document.querySelector("input#sl_zoom").max = getMaxZoom();
        refresh();
        gl.uniform1f(gl.getUniformLocation(program, "zoom"), zoom);
    }
    requestAnimationFrame(update);
}

onmousewheel = e =>
{
    if (image !== null)
    {
        zoomIn(e.deltaY < 0 ? 1.25 : 1 / 1.25);
    }
};

onresize = e =>
{
    resizeCanvas(16 / 9);
};

document.querySelector("input[type='file']").oninput = e =>
{
    handleFileInput(e);
};

document.querySelector("input#sl_zoom").oninput = e =>
{
    targetZoom = parseFloat(e.target.value);
};

document.querySelector("a#togglescroll").onclick = e => document.body.style.overflowY = document.body.style.overflowY === "hidden" ? "scroll" : "hidden";

gl.uniform1f(gl.getUniformLocation(program, "zoom"), zoom);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
resizeCanvas(16 / 9);

requestAnimationFrame(update);