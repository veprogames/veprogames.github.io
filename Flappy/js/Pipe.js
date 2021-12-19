function Pipe(x, y, height, width, type)
{
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.type = type;

    this.tick = function (delta)
    {
        this.x -= player.xSpeed * delta;
    };
}
