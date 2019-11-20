let clrsA = ["#CD88AF", "#AA5585", "#882D61", "#661141", "#440027"];
let clrsB = ["#F8A6AC", "#CF676F", "#A6373F", "#7C151C", "#530006",];
let clrsC = ["#FFD1AA", "#D49A6A", "#AA6C39", "#804515", "#552600",];
let clrsD = ["#7BB992", "#4D9A6A", "#297B48", "#0F5D2C", "#003E17",];
let clrsE = ["#7F81B1", "#545894", "#333676", "#191C59", "#080B3B",];
let clrs = clrsB;


let canvas: HTMLCanvasElement = document.querySelector("canvas") as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 1;
let friction = .80;

export let mouse = {
    x: 0,
    y: 0
}

window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
})

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();

})

window.addEventListener("mousemove", () => {

})

// canvas.onmousedown = function(e) {
//     circle2.x = mouse.x;
//     circle2.y = mouse.y;
// };

function getRandomInRange(min, max) : number {
    return Math.random() * (max - min) + min;
}


function getDistancePythag(x1: number, y1: number, x2: number, y2: number) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
}

function getRandomColor(colorArray: string[]) {
    return colorArray[Math.floor(Math.random() * colorArray.length)]
}

interface velocityI {
    dx : number,
    dy : number
}


function rotate(velocity : velocityI, angle : number) {
    const rotatedVelocities = {
        x: velocity.dx * Math.cos(angle) - velocity.dy * Math.sin(angle),
        y: velocity.dx * Math.sin(angle) + velocity.dy * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 */

function resolveCollision(particle : Circle, otherParticle : Circle) {
    const xVelocityDiff = particle.velocity.dx - otherParticle.velocity.dx;
    const yVelocityDiff = particle.velocity.dy - otherParticle.velocity.dy;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { dx: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), dy: u1.y };
        const v2 = { dx: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), dy: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.dx = vFinal1.x;
        particle.velocity.dy = vFinal1.y;

        otherParticle.velocity.dx = vFinal2.x;
        otherParticle.velocity.dy = vFinal2.y;
    }
}

class Circle {


    public velocity = {
        dx: getRandomInRange(-2.5, 2.5),
        dy: getRandomInRange(-2.5, 2.5),
    };

    public canvas: HTMLCanvasElement
    public context: CanvasRenderingContext2D

    public x: number;
    public y: number;

    public clamp : number = 2;

    public radius: number;
    public originalRadius: number = this.radius;
    public begin: number = 0;
    public end: number = Math.PI * 2;

    public mouseRangeInteract: number = 100;
    public growthRate: number = 4;

    public maxGrowth: number = (Math.random() * 100) + 10;

    public mass : number = this.radius;


    constructor(x: number, y: number, radius: number = 50, dx: number = 0, dy: number = 0,
        public color: string) {

        this.canvas = canvas;
        this.context = context;

        this.radius = radius
        this.originalRadius = this.radius;

        this.x = x;
        this.y = y;

        this.velocity.dx = dx;
        this.velocity.dy = dy;

        this.mass = this.radius;
    }

    public draw = () => {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fillStyle = this.color;
        this.context.fill();
        this.context.stroke();
        this.context.closePath();
    }


    public update = (particles : Circle[]) => {

     for (let i = 0; i < particles.length; i ++) {
        if (this === particles[i]){continue};

        let hypotonuse = getDistancePythag(this.x, this.y, particles[i].x, particles[i].y);
                let bothCombinedRadius = this.radius + particles[i].radius;
                let spaceBetween = hypotonuse - bothCombinedRadius;
                if (spaceBetween <= 0) {
                    resolveCollision(this, particles[i])
                }
     }

     if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
        this.velocity.dx = - this.velocity.dx;
     }

     if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
        this.velocity.dy = - this.velocity.dy;
     }

     if (this.velocity.dx || this.velocity.dy < this.clamp){
         this.x += this.velocity.dx;
         this.y += this.velocity.dy;
     }

     else{
        this.x += this.velocity.dx * .1;
        this.y += this.velocity.dy * .1;
     }

        this.draw();
    }
}


let allCircles: Circle[] = [];




function init() {
    let cushion = 10;
    for (let i = 0; i < 80; i++) {
        let radius = getRandomInRange(10,40);
        let circle = new Circle(
            getRandomInRange(radius, window.innerWidth - radius),
            getRandomInRange(radius, window.innerHeight - radius),
            radius, getRandomInRange(2,4), getRandomInRange(2,4), getRandomColor(clrsC));
        if (i != 0) {
            for (let j = 0; j < allCircles.length; j++) {

                let hypotonuse = getDistancePythag(circle.x, circle.y, allCircles[j].x, allCircles[j].y);
                let bothCombinedRadius = circle.radius + allCircles[j].radius;
                let spaceBetween = hypotonuse - bothCombinedRadius - cushion;
                if (spaceBetween <= 0) {
                    let stop = true;
                    circle = new Circle(getRandomInRange(radius, window.innerWidth - radius),
                    getRandomInRange(radius, window.innerHeight - radius),
                        radius, getRandomInRange(2,4), getRandomInRange(2,4), getRandomColor(clrsC));
                    j = 0;
                }
                // if (getDistancePythag(circle.x, circle.y, allCircles[j].x, allCircles[j].y)
                //  - (allCircles[j].radius + circle.radius) <= 0) {
                //     console.log("they overlapped!");
                //     circle = new Circle(Math.random() * window.innerWidth,
                //         Math.random() * window.innerHeight,
                //         Math.random() * 200, null, null, getRandomColor(clrsC));

                //     j = 0;
                // }
            }
        }
        allCircles.push(circle);

    }
}
function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let c of allCircles) {
        c.update(allCircles);
    }
}

init();
animate(); 