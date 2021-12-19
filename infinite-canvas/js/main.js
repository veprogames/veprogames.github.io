var canvas, ctx;
var dto = Date.now(), dtn = Date.now();

var mousePressed = false, mouseX = 0, mouseY = 0, mouseButton = 0;
var LEFT = 0, MIDDLE = 1, RIGHT = 2;

var textCursorPosition = 0;
var selectedShapes = [];
var selectBoundingBox = [0, 0, 0, 0]; //x1, y2, x2, y2

var saveTimer = 0, fpstimer = 0;
var fpssum = 0, fpssumcount = 0, displayfps = 0;

var TOOL_CIRCLE = 0, TOOL_RECTANGLE = 1, TOOL_POLYGON = 2, TOOL_TEXT = 3, TOOL_IMAGE = 4, TOOL_GRADIENT = 5, TOOL_ERASER = 6,
    TOOL_SELECT = 7;

var toolBarFocused = false;

var world =
    {
        shapes: [],
        shapeCache: []
    };

var data =
    {
        cam: new Camera(Vec2.ZERO, 5),
        settings:
            {
                tool: 0,
                color: "#000000",
                strokeColor: "#000000",
                bgColor: "#ffffff",
                strokeSize: 0.005,
                alpha: 1,
                fill: true,
                stroke: false,
                zoomFactor: 1.5,
                circle:
                    {
                        radius: 0.1
                    },
                rectangle:
                    {
                        w: 0.1,
                        h: 0.1
                    },
                polygon:
                    {
                        isClosed: false,
                        isSmooth: false
                    },
                text:
                    {
                        size: 0.05,
                        halign: "left",
                        valign: "top",
                        font: "Montserrat"
                    },
                image:
                    {
                        id: 0,
                        w: 0.2,
                        h: 0.2,
                        rotation: 0,
                        blur: 0,
                        hue: 0,
                        brightness: 100,
                        contrast: 100,
                        saturation: 100
                    },
                select:
                    {
                        multiSelect: false
                    },
                gradient:
                    {
                        type: 0,
                        rotation: 0,
                        colors: []
                    },
                autoSave: true
            },
        lastUpdate:
            {
                range: new Decimal(5),
                pos: Vec2.ZERO
            }
    };

function setup()
{
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    GradientManager.addColor("#000000", 0);
    GradientManager.addColor("#ffffff", 1);

    canvas.onclick = e =>
    {
        if (!toolBarFocused)
        {
            handleShapeCreation();
        }
    };

    canvas.onmousedown = e =>
    {
        mousePressed = true;
        mouseButton = e.button;

        if (data.settings.tool === TOOL_SELECT && mouseButton === LEFT)
        {
            if (!data.settings.select.multiSelect)
            {
                let foundShape = false;
                for (let i = world.shapes.length - 1; i >= 0; i--)
                {
                    if (world.shapes[i] !== undefined && world.shapes[i].intersectsWithScreen(mouseX, mouseY))
                    {
                        selectedShapes = [world.shapes[i]];
                        foundShape = true;
                        break;
                    }
                }
                if (!foundShape)
                {
                    selectedShapes = [];
                }
            }
            else if (selectedShapes.length === 0)
            {
                selectBoundingBox = [mouseX, mouseY, mouseX, mouseY];
            }
        }
        if (mousePressed && data.settings.tool === TOOL_ERASER)
        {
            handleEraser();
        }

        if(data.settings.tool === TOOL_GRADIENT)
        {
            for(let i = world.shapes.length - 1; i >= 0; i--)
            {
                let shape = world.shapes[i];
                if(shape !== undefined && shape.intersectsWithScreen(mouseX, mouseY))
                {
                    let obj = JSON.parse(JSON.stringify(data.settings.gradient)); //clone the object
                    if(mouseButton === LEFT)
                    {
                        shape.color = obj;
                        break;
                    }
                    else if(mouseButton === RIGHT)
                    {
                        shape.strokeColor = obj;
                        break;
                    }
                }
            }
        }
    };

    canvas.onmousemove = e =>
    {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (mousePressed && mouseButton === RIGHT)
        {
            data.cam.translate(data.cam.range.mul(-e.movementX / innerHeight), data.cam.range.mul(-e.movementY / innerHeight));
        }

        if (data.settings.tool === TOOL_SELECT && mousePressed && !toolBarFocused && mouseButton === LEFT)
        {
            let amplitude = data.cam.range.div(innerHeight);
            if (selectedShapes.length === 0 && data.settings.select.multiSelect)
            {
                selectBoundingBox[2] = mouseX;
                selectBoundingBox[3] = mouseY;
            }
            else
            {
                for (let shape of selectedShapes)
                {
                    shape.move(amplitude.mul(e.movementX), amplitude.mul(e.movementY));
                }
            }
        }

        if(data.settings.tool === TOOL_TEXT && selectedShapes.length > 0 && mousePressed && mouseButton === LEFT)
        {
            let amplitude = data.cam.range.div(innerHeight);
            currentShape().move(amplitude.mul(e.movementX), amplitude.mul(e.movementY));
        }

        if (currentShape() !== undefined && currentShape().shapeType === 2 && data.settings.tool === TOOL_POLYGON)
        {
            currentShape().points[currentShape().points.length - 1] = !toolBarFocused ? data.cam.screenToWorldPoint(mouseX, mouseY) : currentShape().points[currentShape().points.length - 2];
        }

        if (mousePressed && data.settings.tool === TOOL_ERASER)
        {
            handleEraser();
        }
    };

    canvas.onmouseup = e =>
    {
        mousePressed = false;

        if (data.settings.tool === TOOL_SELECT && data.settings.select.multiSelect)
        {
            if (selectedShapes.length === 0)
            {
                selectedShapes = [];
                for (let shape of world.shapes)
                {
                    let br = false;
                    let xmin = Math.min(selectBoundingBox[0], selectBoundingBox[2]),
                        xmax = Math.max(selectBoundingBox[0], selectBoundingBox[2]),
                        ymin = Math.min(selectBoundingBox[1], selectBoundingBox[3]),
                        ymax = Math.max(selectBoundingBox[1], selectBoundingBox[3]),
                        stepx = (xmax - xmin) / 50, stepy = (ymax - ymin) / 50;
                    for (let x = xmin; x < xmax; x += stepx)
                    {
                        for (let y = ymin; y < ymax; y += stepy)
                        {
                            if (shape !== undefined && shape.intersectsWithScreen(x, y))
                            {
                                selectedShapes.push(shape);
                                br = true;
                                break;
                            }
                        }
                        if (br)
                        {
                            break;
                        }
                    }
                }

                selectBoundingBox = [0, 0, 0, 0];
            }
        }
    };

    canvas.oncontextmenu = e => false;

    initializeUI();

    autoLoad();

    requestAnimationFrame(update);
}

function update()
{
    dtn = Date.now();

    let delta = (dtn - dto) / 1000;
    let w = canvas.width, h = canvas.height;

    dto = Date.now();

    data.cam.tick(delta);

    if (data.cam.pos.sub(data.lastUpdate.pos).mag().gte(data.cam.range.mul(10)) || Math.abs(Decimal.log10(data.cam.range) - Decimal.log10(data.lastUpdate.range)) > 1.5)
    {
        data.lastUpdate.range = data.cam.range;
        data.lastUpdate.pos = data.cam.pos;
        filterShapes();
    }

    if (displayfps === 0)
    {
        displayfps = 1 / delta;
    }
    fpstimer += delta;
    fpssum += 1 / delta;
    fpssumcount++;
    if (fpstimer >= 1)
    {
        displayfps = fpssum / fpssumcount;
        fpssumcount = 0;
        fpssum = 0;
        fpstimer = 0;
    }

    saveTimer += data.settings.autoSave ? delta : 0;
    if (saveTimer >= 10)
    {
        autoSave();
        saveTimer = 0;
    }

    ctx.fillStyle = data.settings.bgColor;
    ctx.fillRect(0, 0, w, h);
    for (let s of world.shapes)
    {
        if (s !== undefined)
        {
            if (selectedShapes.includes(s) && data.settings.tool === TOOL_SELECT)
            {
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = innerHeight * 0.02 * (0.6 + 0.4 * Math.sin(Date.now() / 1000 * Math.PI));
                ctx.shadowColor = "#000000";
            }
            s.render(ctx);
            if (selectedShapes.includes(s))
            {
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;
            }
        }
    }

    if (!toolBarFocused)
    {
        drawPreview(ctx);
    }

    ctx.fillStyle = "#00000000";
    ctx.strokeStyle = "#00a0ff";
    ctx.fillStyle = "#00a0ff30";
    ctx.lineWidth = 1;
    ctx.setLineDash([10, 10]);
    ctx.lineDashOffset = (Date.now() / 50) % 10000;

    if (selectBoundingBox !== [0, 0, 0, 0])
    {
        ctx.fillRect(selectBoundingBox[0], selectBoundingBox[1], selectBoundingBox[2] - selectBoundingBox[0], selectBoundingBox[3] - selectBoundingBox[1]);
        ctx.strokeRect(selectBoundingBox[0], selectBoundingBox[1], selectBoundingBox[2] - selectBoundingBox[0], selectBoundingBox[3] - selectBoundingBox[1]);
    }

    ctx.setLineDash([]);

    ctx.textBaseline = "top";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.font = Utils.setFont(0.02, ["Montserrat", "Arial"]);
    ctx.fillText((displayfps).toFixed(1) + " FPS", 10, 32);

    ctx.textAlign = "center";
    if (selectedShapes.length > 0)
    {
        ctx.fillText("Press Enter to Finish, Del to Delete", w / 2, 32);
    }

    ctx.font = Utils.setFont(0.03, ["Work Sans", "Arial"]);
    ctx.strokeStyle = "white";
    ctx.lineWidth = vmax() * 0.002;
    ctx.textBaseline = "bottom";
    let widthDist = data.cam.range.mul(innerWidth / innerHeight);
    ctx.strokeText("<-  " + formatDistance(widthDist) + "  ->", w / 2, h);
    ctx.fillText("<-  " + formatDistance(widthDist) + "  ->", w / 2, h);

    requestAnimationFrame(update);
}

function changeTool(t)
{
    data.settings.tool = t;
    for (let div of document.querySelectorAll(".toolbar > div"))
    {
        if (div.dataset.toolview !== undefined)
        {
            div.style.display = t === parseInt(div.dataset.toolview) ? "block" : "none";
        }
    }
}

function initializeUI()
{
    document.querySelector(".toolbar").onmouseenter = e => toolBarFocused = true;
    document.querySelector(".toolbar").onmouseleave = e => toolBarFocused = false;

    document.querySelector(".toolbar").querySelectorAll("input, button").forEach(input =>
    {
        if (input.dataset.prop !== undefined)
        {
            input.oninput = e =>
            {
                let prop = data.settings;
                let props = input.dataset.prop.split(".");
                for (let i = 0; i < props.length - 1; i++)
                {
                    prop = prop[props[i]];
                }

                let lastProp = props[props.length - 1];
                prop[lastProp] = input.type === "checkbox" ? e.target.checked : e.target.value;

                for (let shape of selectedShapes)
                {
                    if (shape[lastProp] !== undefined)
                    {
                        if (input.type === "checkbox")
                        {
                            shape[lastProp] = input.checked;
                        }
                        else if (input.type === "number")
                        {
                            if (!isNaN(parseFloat(input.value)))
                            {
                                if (["w", "h", "radius", "size", "strokeSize"].includes(lastProp)) //properties that are a Decimal
                                {
                                    shape[lastProp] = new Decimal(input.value).mul(data.cam.range);
                                }
                                else
                                {
                                    shape[lastProp] = parseFloat(input.value);
                                }
                            }
                        }
                        else
                        {
                            shape[lastProp] = input.value;
                        }
                    }
                }
            }
        }
        else if (input.dataset.tool !== undefined)
        {
            input.onclick = e => changeTool(parseInt(input.dataset.tool));
        }
        else if (input.dataset.textalign !== undefined)
        {
            input.onclick = e =>
            {
                let halign = input.dataset.textalign[0].replace("l", "left").replace("r", "right").replace("c", "center");
                let valign = input.dataset.textalign[1].replace("t", "top").replace("m", "middle").replace("b", "bottom");
                data.settings.text.halign = halign;
                data.settings.text.valign = valign;
                for (let shape of selectedShapes)
                {
                    if (shape.shapeType === 3)
                    {
                        shape.halign = halign;
                        shape.valign = valign;
                    }
                }
            }
        }
        else if (input.dataset.palettecolor !== undefined)
        {
            input.style.backgroundColor = input.dataset.palettecolor;
            input.oncontextmenu = e => false;
            input.onmouseup = e =>
            {
                if (e.button === LEFT)
                {
                    data.settings.color = input.dataset.palettecolor;
                    document.querySelector("input[data-prop=color]").value = input.dataset.palettecolor;
                    for (let shape of selectedShapes)
                    {
                        shape.color = input.dataset.palettecolor;
                    }
                }
                if (e.button === RIGHT)
                {
                    data.settings.strokeColor = input.dataset.palettecolor;
                    document.querySelector("input[data-prop=strokeColor]").value = input.dataset.palettecolor;
                    for (let shape of selectedShapes)
                    {
                        shape.strokeColor = input.dataset.palettecolor;
                    }
                }
            }
        }
    });

    for (let i = 0; i < shapeImages.length; i++)
    {
        let b = document.querySelector(".image-select").appendChild(document.createElement("button"));
        b.innerHTML = "<img src='" + shapeImages[i].src + "' alt='image select'/>";
        b.onclick = e =>
        {
            data.settings.image.id = i;
            for (let shape of selectedShapes)
            {
                shape.imageIndex = i;
                shape.image = shapeImages[i];
            }
        }
    }

    document.querySelector("button#clear_canvas").onclick = e => clearCanvas();
    document.querySelector("button#reset_cam").onclick = e => data.cam.reset();
    document.querySelector("button#move_center").onclick = e => data.cam.pos = Vec2.ZERO;
    document.querySelector("button#move_shape_top").onclick = e =>
    {
        for (let shape of selectedShapes)
        {
            moveShapeToTop(shape);
        }
    };
    document.querySelector("button#minimize").onclick = e =>
    {
        let toolbar = document.querySelector(".toolbar");
        toolbar.classList.toggle("hidden");
    };
    document.querySelector("button#download").onclick = downloadCanvas;
    document.querySelector("button#import").onclick = e =>
    {
        importCanvas(document.querySelector("textarea#import_text").value);
        console.log(document.querySelector("textarea#import_text").value);
    };
    document.querySelector("input#setting_font").oninput = e =>
    {
        data.settings.text.font = e.target.value;
        e.target.style.fontFamily = e.target.value + ", Montserrat, Arial, sans-serif";
    };
    document.querySelector("button#add_gradient_color").onclick = e => GradientManager.addColor();
    for(let g of gradientTemplates)
    {
        let btn = document.createElement("button");
        btn.innerHTML = g.name;
        btn.onclick = e => GradientManager.setGradient(g.gradient);
        document.querySelector("div#gradient_templates").appendChild(btn);
    }
    document.querySelector("button#random_gradient").onclick = e =>
    {
        GradientManager.createRandomGradient(data.settings.gradient.colors.length);
    };
    changeTool(0);
}

function drawPreview(ctx)
{
    ctx.globalAlpha = Math.min(0.5, data.settings.alpha / 2);
    ctx.fillStyle = data.settings.color; //add alpha component
    ctx.strokeStyle = data.settings.strokeColor;
    ctx.lineWidth = data.settings.strokeSize * innerHeight;
    if (data.settings.tool === TOOL_CIRCLE)
    {
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, innerHeight * data.settings.circle.radius, 0, 2 * Math.PI);
        ctx.closePath();
        if (data.settings.fill)
        {
            ctx.fill();
        }
        if (data.settings.stroke)
        {
            ctx.stroke();
        }
    }
    if (data.settings.tool === TOOL_RECTANGLE)
    {
        let w = innerHeight * data.settings.rectangle.w, h = innerHeight * data.settings.rectangle.h;
        if (data.settings.fill)
        {
            ctx.fillRect(mouseX - w / 2, mouseY - h / 2, w, h);
        }
        if (data.settings.stroke)
        {
            ctx.strokeRect(mouseX - w / 2, mouseY - h / 2, w, h);
        }
    }
    if (data.settings.tool === TOOL_POLYGON)
    {
        if (currentShape() !== undefined && currentShape().shapeType === 2)
        {
            //currentShape().render(ctx);
            ctx.strokeStyle = "red";
            ctx.lineWidth = innerHeight * 0.003;
            for (let point of currentShape().points)
            {
                let p = data.cam.worldToScreenPoint(point.x, point.y);
                let x = p.x.toNumber(), y = p.y.toNumber();
                let size = innerHeight * 0.005;

                ctx.beginPath();
                ctx.moveTo(x - size, y - size);
                ctx.lineTo(x + size, y + size);
                ctx.closePath();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(x - size, y + size);
                ctx.lineTo(x + size, y - size);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
    if (data.settings.tool === TOOL_TEXT)
    {
        if (currentShape() === undefined || (currentShape().shapeType === 3 && currentShape().text.length === 0))
        {
            let s = innerHeight * data.settings.text.size;
            ctx.font = s + "px " + data.settings.text.font + ",Montserrat";
            ctx.fillStyle = data.settings.color;
            ctx.strokeStyle = data.settings.strokeColor;
            ctx.lineWidth = innerHeight * data.settings.strokeSize;
            ctx.textAlign = data.settings.text.halign;
            ctx.textBaseline = data.settings.text.valign;
            if (data.settings.fill)
            {
                ctx.fillText("A", mouseX, mouseY);
            }
            if (data.settings.stroke)
            {
                ctx.strokeText("A", mouseX, mouseY);
            }
        }
    }
    if (data.settings.tool === TOOL_IMAGE)
    {
        let blur = Math.max(data.settings.image.w, data.settings.image.h) * data.settings.image.blur * 100;
        ctx.filter = "blur(" + blur + "px) hue-rotate(" + data.settings.image.hue + "deg) brightness(" + data.settings.image.brightness + "%)" +
            " contrast(" + data.settings.image.contrast + "%) saturate(" + data.settings.image.saturation + "%)";
        //ctx.filter = "blur(" + blur + "px) hue-rotate(" + data.settings.image.hue + "deg)";
        Utils.drawRotatedImage(data.settings.image.rotation, shapeImages[data.settings.image.id], mouseX - innerHeight * data.settings.image.w * 0.5, mouseY - innerHeight * data.settings.image.h * 0.5,
            data.settings.image.w * innerHeight, data.settings.image.h * innerHeight);
        ctx.filter = "none";
    }

    if (currentShape() !== undefined && currentShape().shapeType === 3) //draw cursor for text editing
    {
        let alignMulti = {"left": 1, "center": 0.5, "right": 0};
        let yOff = {"top": 0, "middle": -0.5, "bottom": -1};

        ctx.fillStyle = "#000000";
        let oldFont = ctx.font;
        let fSize = currentShape().size.div(data.cam.range).mul(innerHeight).toNumber();
        ctx.font = (fSize) + "px " + data.settings.text.font + ",Montserrat";
        let screen = currentShape().getScreenPos(currentShape().pos);
        let x = screen.x + ctx.measureText(currentShape().text.substring(0, textCursorPosition)).width
            - (ctx.measureText(currentShape().text).width * (1 - alignMulti[currentShape().halign]));
        let y = screen.y + fSize * yOff[currentShape().valign];
        let cHeight = fSize;
        if (Date.now() % 1000 > 500)
        {
            ctx.fillRect(x + cHeight / 20, y, 2, cHeight);
        }
        ctx.font = oldFont;
    }

    ctx.globalAlpha = 1;
}

function handleShapeCreation()
{
    let pos = data.cam.screenToWorldPoint(mouseX, mouseY);
    let stroke = data.cam.range.mul(data.settings.strokeSize);
    let textSize = data.cam.range.mul(data.settings.text.size);
    let index = world.shapes.filter(s => s !== undefined).length + world.shapeCache.filter(s => s !== undefined).length;
    if (selectedShapes.length === 0)
    {
        switch (data.settings.tool)
        {
            case TOOL_CIRCLE:
                world.shapes[index] = new ShapeCircle(pos, data.settings.color, data.cam.range.mul(data.settings.circle.radius),
                    data.settings.fill, data.settings.stroke, data.settings.strokeColor, stroke, data.settings.alpha);
                break;
            case TOOL_RECTANGLE:
                world.shapes[index] = new ShapeRect(pos, data.settings.color, data.cam.range.mul(data.settings.rectangle.w), data.cam.range.mul(data.settings.rectangle.h),
                    data.settings.fill, data.settings.stroke, data.settings.strokeColor, stroke, data.settings.alpha);
                break;
            case TOOL_POLYGON:
                world.shapes[index] = new ShapePolygon([pos,
                    pos], data.settings.color, data.settings.fill, data.settings.stroke, data.settings.strokeColor, stroke, data.settings.polygon.isClosed, data.settings.polygon.isSmooth, data.settings.alpha);
                selectedShapes = [world.shapes[index]];
                break;
            case TOOL_TEXT:
                world.shapes[index] = new ShapeText(pos, data.settings.color, data.settings.fill, data.settings.stroke, data.settings.strokeColor, stroke, "", textSize,
                    data.settings.text.font, data.settings.text.halign, data.settings.text.valign, data.settings.alpha);
                selectedShapes = [world.shapes[index]];
                break;
            case TOOL_IMAGE:
                world.shapes[index] = new ShapeImage(pos, data.settings.image.id, data.cam.range.mul(data.settings.image.w), data.cam.range.mul(data.settings.image.h),
                    data.settings.image.rotation, {
                        blur: data.settings.image.blur,
                        hue: data.settings.image.hue,
                        brightness: data.settings.image.brightness,
                        contrast: data.settings.image.contrast,
                        saturation: data.settings.image.saturation
                    }, data.settings.alpha);
                break;
            default:
                break;
        }
    }
    else
    {
        if (currentShape().shapeType === 2 && data.settings.tool === TOOL_POLYGON)
        {
            currentShape().points.push(pos);
        }
    }
}

function handleEraser()
{
    for (let i = 0; i < world.shapes.length; i++)
    {
        if (world.shapes[i] !== undefined && world.shapes[i].intersectsWithScreen(mouseX, mouseY))
        {
            removeShape(world.shapes[i]);
        }
    }
}

function removeShape(shape)
{
    for (let i = 0; i < Math.max(world.shapes.length, world.shapeCache.length); i++)
    {
        if (world.shapes[i] === shape || world.shapeCache[i] === shape)
        {
            world.shapes.splice(i, 1);
            world.shapeCache.splice(i, 1);
            break;
        }
    }
}

function currentShape()
{
    return selectedShapes[0];
}

function moveShapeToTop(shape)
{
    let idx = world.shapes.findIndex(s => s === shape);
    let len = Math.max(world.shapes.length, world.shapeCache.length);
    world.shapes[len] = world.shapes[idx];
    world.shapeCache[len] = world.shapeCache[idx];

    world.shapes.splice(idx, 1);
    world.shapeCache.splice(idx, 1);
}

onresize = e =>
{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
};

document.onwheel = e =>
{
    if (!toolBarFocused)
    {
        let f = parseFloat(data.settings.zoomFactor);
        data.cam.targetRange = data.cam.targetRange.mul(Math.pow(f, e.deltaY / 100));
    }
};

onkeydown = e =>
{
    if (!toolBarFocused)
    {
        if (e.key === "Enter")
        {
            if (currentShape() !== undefined)
            {
                if (currentShape().shapeType === 2 && data.settings.tool === TOOL_POLYGON)
                {
                    currentShape().points = currentShape().points.slice(0, currentShape().points.length - 1);
                    currentShape().cacheGeometryData();
                    selectedShapes = [];
                }
                else if (currentShape().shapeType === 3 && currentShape().text.length > 0)
                {
                    textCursorPosition = 0;
                    selectedShapes = [];
                }
                else
                {
                    selectedShapes = [];
                }
            }
            if (data.settings.tool === TOOL_SELECT && selectedShapes.length !== 0)
            {
                selectedShapes = [];
            }
        }
        if (e.key === "Delete")
        {
            for (let shape of selectedShapes)
            {
                removeShape(world.shapes.find(sh => sh === shape));
            }
            selectedShapes = [];
        }
        if (currentShape() !== undefined && currentShape().shapeType === 3)
        {
            if (e.key === "ArrowLeft")
            {
                textCursorPosition = Math.max(0, textCursorPosition - 1);
            }
            if (e.key === "ArrowRight")
            {
                textCursorPosition = Math.min(currentShape().text.length, textCursorPosition + 1);
            }
            if (e.key === "Backspace")
            {
                currentShape().text = currentShape().text.substring(0, textCursorPosition - 1) + currentShape().text.substring(textCursorPosition, currentShape().text.length);
                textCursorPosition = Math.max(0, textCursorPosition - 1);
            }
            else
            {
                if (e.key.length === 1)
                {
                    currentShape().text = currentShape().text.substring(0, textCursorPosition) + e.key + currentShape().text.substring(textCursorPosition, currentShape().text.length);
                    textCursorPosition = Math.min(currentShape().text.length, textCursorPosition + 1);
                }
            }
        }
    }
};

function exportCanvas()
{
    let obj = [];
    for (let i = 0; i < world.shapes.length; i++)
    {
        if (world.shapes[i] !== undefined)
        {
            obj[i] = world.shapes[i];
        }
        if (world.shapeCache[i] !== undefined)
        {
            obj[i] = world.shapeCache[i];
        }
    }
    return JSON.stringify({canvas: obj, camera: data.cam, background: data.settings.bgColor});
}

function importCanvas(str)
{
    let decoded;
    try
    {
        decoded = JSON.parse(str);
    }
    catch (e)
    {
        console.log("Could not decode: " + e);
    }

    if (decoded !== undefined && decoded.canvas !== undefined)
    {
        world.shapes = [];
        world.shapeCache = [];

        for (let i = 0; i < decoded.canvas.length; i++)
        {
            let shape = decoded.canvas[i];
            if (shape !== undefined && shape !== null)
            {
                let type = shape.shapeType;
                let newShape;
                let pos = new Vec2(new Decimal(shape.pos.x), new Decimal(shape.pos.y));

                if (type === 0)
                {
                    newShape = new ShapeCircle(pos, shape.color, new Decimal(shape.radius),
                        shape.fill, shape.stroke, shape.strokeColor, parseFloat(shape.strokeSize), shape.alpha);
                }
                else if (type === 1)
                {
                    newShape = new ShapeRect(pos, shape.color, new Decimal(shape.w), new Decimal(shape.h),
                        shape.fill, shape.stroke, shape.strokeColor, parseFloat(shape.strokeSize), shape.alpha);
                }
                else if (type === 2)
                {
                    let points = [];
                    for (let p of shape.points)
                    {
                        points.push(new Vec2(new Decimal(p.x), new Decimal(p.y)));
                    }
                    newShape = new ShapePolygon(points, shape.color,
                        shape.fill, shape.stroke, shape.strokeColor, parseFloat(shape.strokeSize), shape.isClosed, shape.isSmooth, shape.alpha);
                    if (Object.keys(shape.geometryData).length !== 0)
                    {
                        newShape.geometryData.center = new Vec2(new Decimal(shape.geometryData.center.x), new Decimal(shape.geometryData.center.y));
                        newShape.geometryData.size = new Decimal(shape.geometryData.size);
                        newShape.geometryData.sizeMin = new Decimal(shape.geometryData.sizeMin);
                    }
                }
                else if (type === 3)
                {
                    newShape = new ShapeText(pos, shape.color, shape.fill, shape.stroke, shape.strokeColor, shape.strokeSize, shape.text, new Decimal(shape.size),
                        shape.font, shape.halign, shape.valign, shape.alpha);
                }
                else if (type === 4)
                {
                    newShape = new ShapeImage(pos, shape.imageIndex, new Decimal(shape.w), new Decimal(shape.h), shape.rotation, {
                        blur: shape.blur,
                        hue: shape.hue,
                        brightness: shape.brightness,
                        contrast: shape.contrast,
                        saturation: shape.saturation
                    }, shape.alpha);
                }

                world.shapeCache[i] = newShape;
            }
        }

        filterShapes();
        data.lastUpdate.pos = data.cam.pos;
        data.lastUpdate.range = data.cam.range;
    }
    if (decoded !== undefined && decoded.camera !== undefined)
    {
        data.cam.pos = new Vec2(new Decimal(decoded.camera.pos.x), new Decimal(decoded.camera.pos.y));
        data.cam.targetRange = new Decimal(decoded.camera.targetRange);
        data.cam.range = data.cam.targetRange;
    }
    if (decoded !== undefined && decoded.background !== undefined)
    {
        data.settings.bgColor = decoded.background;
        document.querySelector("input[data-prop=bgColor]").value = decoded.background;
    }
}

function downloadCanvas()
{
    let a = document.createElement("a");
    a.href = "data:text/plain;base64," + btoa(exportCanvas());
    a.download = "canvas_export.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function autoSave()
{
    localStorage.setItem("InfiniteCanvas", exportCanvas());
}

function autoLoad()
{
    if (localStorage.getItem("InfiniteCanvas") !== null)
    {
        importCanvas(localStorage.getItem("InfiniteCanvas"));
    }
}

function clearCanvas()
{
    localStorage.removeItem("InfiniteCanvas");
    selectedShapes = [];
    world.shapes = [];
    world.shapeCache = [];
}

setup();