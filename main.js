/** @type {HTMLCanvasElement} */
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = window.innerWidth*0.8;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9);
const N = 300;
const cars =generateCars(N);

let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i = 0; i <cars.length; i++){
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"))
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, 0.35)
        }
    }
    
}

const traffic =[
    new Car(road.getLaneCenter(1), -100, 25,50, "DUMMY",1),
    new Car(road.getLaneCenter(2), -300, 25,50, "DUMMY",1),
    new Car(road.getLaneCenter(0), -250, 25,50, "DUMMY",1),
    new Car(road.getLaneCenter(0), -400, 25,50, "DUMMY",1),
    new Car(road.getLaneCenter(1), -200, 25,50, "DUMMY",1),

    new Car(road.getLaneCenter(1), -450, 25,50, "DUMMY",1),
    new Car(road.getLaneCenter(2), -500, 25,50, "DUMMY",1),
    new Car(road.getLaneCenter(0), -600, 25,50, "DUMMY",1),
    new Car(road.getLaneCenter(0), -700, 25,50, "DUMMY",1),
    new Car(road.getLaneCenter(1), -750, 25,50, "DUMMY",1)];

function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}
function discard(){
    localStorage.removeItem("bestBrain")
}

    function generateCars(N){
        const cars =[];
        for (let i = 1; i < N; i++){
            cars.push(new Car(road.getLaneCenter(1), 100,30,50, "AI"))
        }
        return cars;
    }
function animate(time){
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders, []);
        traffic[i].draw(carCtx);
    }
    for(let i =0; i < cars.length; i++){
        cars[i].update(road.borders, traffic)
    }
    bestCar = cars.find(c =>
        c.y== Math.min(...cars.map(c => c.y)))

    carCanvas.height = window.innerHeight * 0.5;
    networkCanvas.height = window.innerHeight *0.5;

    carCtx.save();
    carCtx.translate(0, -bestCar.y+ carCanvas.height*0.7);
    road.draw(carCtx);

    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx, "purple");
    }
    carCtx.globalAlpha = 0.2
    for(let i =0; i < cars.length; i++){
        cars[i].draw(carCtx, "Blue")
    }
    carCtx.globalAlpha =1;
    bestCar.draw(carCtx, "Blue", true)
    
    carCtx.restore();
    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}
animate(0)