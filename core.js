let origin = []
let bob = []
let len;

let angle = Math.PI / 4;
let aVel = 0.0;
let aAcc = 0.0;

const X = 0,
    Y = 1;

setup = () => {
    var canvas = createCanvas(640, 360);
    canvas.parent('canvas-holder');
    len = 180;
    origin = [width / 2, 0];
    bob = [width / 2, len];
}

draw = () => {
    background(255);

    bob[0] = origin[0] + len * sin(angle);
    bob[1] = origin[1] + len * cos(angle);

    line(origin[X], origin[Y], bob[X], bob[Y]);
    ellipse(bob[X], bob[Y], 32, 32);

    aAcc = -0.01 * sin(angle)

    angle += aVel;
    aVel += aAcc;

    aVel *= 0.99;
}