let t = 0; //current time, t
let m = 1; //pendulum mass, kg
let M = 1; //cart mass, kg
let l = 2; //pendulum length, meters
let x = 0; //cart position, meters
let v = 0; //cart velocity, meters/s
let a = 0; //cart acceleration, meters/s^2
let theta = 0.0; //pendulum angle from vertical
let omega = 0; //pendulum angular velocity
let alpha = 0; //pendulum angular acceleration

//constants
let g = 9.8; //gravitational acceleration, m/s^2
let dt = 1 / 30; //TODO: use framerate

//purely for display
let cartwidth = 0.4;
let cartheight = 0.2;
let pendsize = 0.15;

let control = true;

let x_goal = 1.0;

let kp = 3,
    ki = 0,
    kd = 0,
    kc = 1,
    P = 0,
    I = 0,
    D = 0,
    last = 0;

reset = () => {
    x = v = a = theta = omega = alpha = 0;
}

getAlpha = (F) => {
    //kg*m terms
    var t1 = (M + m) * l / cos(theta);
    var t2 = -m * l * cos(theta);

    //force terms
    var f1 = (M + m) * g * sin(theta) / cos(theta);
    var f2 = -m * l * sq(omega) * sin(theta);

    var alpha = (F + f1 + f2) / (t1 + t2);
    return alpha;
}

getAcc = (alpha) => {
    return (l * alpha - g * sin(theta)) / cos(theta);
}

setAccelerations = (F) => {
    alpha = getAlpha(F);
    a = getAcc(alpha);
}

updateState = () => {
    t += dt;
    omega += dt * alpha;
    theta += dt * omega;
    v += dt * a;
    x += dt * v;
}

forceForAngularAcceleration = (alpha) => {
    var t1 = (M + m) * l / cos(theta);
    var t2 = -m * l * cos(theta);
    var f1 = -(M + m) * g * sin(theta) / cos(theta);
    var f2 = m * l * sq(omega) * sin(theta);

    var F = (t1 + t2) * alpha + f1 + f2;
    return F;
}

sign = (x) => {
    if (x < 0) return -1;
    else return 1;
}

setup = () => {
    var canvas = createCanvas(1000, 400);
    canvas.parent('canvas-holder');
}

draw = () => {
    background(255);

    var F = 0;
    var F_control = 0;
    var err = x - x_goal;
    if (mouseIsPressed) {
        F = (mouseX - width / 2) * 0.1;
        line(width / 2, mouseY, mouseX, mouseY);
    } else {
        if (control) {
            P = err * kp;
            I = I + (err * ki) * dt;
            D = (last - theta) * kd / dt;
            last = theta;
            var controller = kc * (P + I + D);
            F_control = controller;
            F_control = -theta * 100 - omega * 50 + v * 10 + controller;
        }
    }
    updateState();
    setAccelerations(F + F_control);

    //show control force
    stroke(255, 0, 0);
    strokeWeight(1.0);
    line(width / 2, 3 * height / 4, width / 2 + F_control * 10, 3 * height / 4);
    line(width / 2, 3 * height / 4 + 10, width / 2 + F_control * 100, 3 * height / 4 + 10);

    strokeWeight(0.01);
    stroke(0);

    fill(0);

    translate(width / 2, 2 * height / 3);
    scale(100, -100);

    line(x_goal, 0, x_goal, -0.3);

    noFill();
    rect(x - cartwidth / 2, -cartheight / 2, cartwidth, cartheight);

    var pendX = x - sin(theta) * l;
    var pendY = cos(theta) * l;
    line(x, 0, pendX, pendY);

    push();
    translate(pendX, pendY);
    rotate(theta);
    rect(0 - pendsize / 2, 0 - pendsize / 2, pendsize, pendsize);
    pop();
}

keyPressed = () => {
    if (key == 'c') {
        control = !control;
    }
    if (keyCode == LEFT_ARROW) {
        x_goal -= 0.1;
    }
    if (keyCode == RIGHT_ARROW) {
        x_goal += 0.1;
    }
}