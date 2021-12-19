CodeMirror.defineSimpleMode("glsl", 
{
    start: 
    [
        {regex: "\/\/.*", token:"comment"},
        {regex: "true|false|null|void", token: "atom"},
        {regex: "iTime|iResolution|gl_([a-zA-Z])+", token: "variable-3"},
        {regex: "#version|vec.|uniform|float|return", token: "keyword"}
    ]
});