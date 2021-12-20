var canvas = document.querySelector("canvas");
var gl = canvas.getContext("webgl");

var vertices = [
    -1, -1,
    -1, 1,
    1, -1,
    1, 1
];

var vertCode = document.querySelector("#vertcode").innerHTML;
var fragCode = document.querySelector("#fragcode").innerHTML;

var vShader = gl.createShader(gl.VERTEX_SHADER);
var fShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vShader, vertCode);
gl.compileShader(vShader);
gl.shaderSource(fShader, fragCode);
gl.compileShader(fShader);

console.log("---Vertex---\n" + gl.getShaderInfoLog(vShader));
console.log("---Fragment---\n" + gl.getShaderInfoLog(fShader));

var program = gl.createProgram();
gl.attachShader(program, vShader);
gl.attachShader(program, fShader);
gl.linkProgram(program);
gl.useProgram(program);

var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

var coord = gl.getAttribLocation(program, "a_position");
gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coord);

var texBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

var texCoord = gl.getAttribLocation(program, "a_texcoord");
gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(texCoord);

var texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

function readTexture(image)
{
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if(Math.log2(image.width) % 1 === 0 && Math.log2(image.height) % 1 === 0)
    {
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    gl.uniform2f(gl.getUniformLocation(program, "tSize"), image.width, image.height);
}