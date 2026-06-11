// RBMK-1000 Simulator v0.4

// ====================
// Variáveis
// ====================

let sandbox = false;

let power = 3200;
let temp = 680;
let pressure = 7.2;
let water = 70;

let rods = 45;

let rpm = 1500;
let energy = 1000;

// Som do alarme
let alarmSound = new Audio("assets/alarm.mp3");

// Histórico da potência
let powerHistory=[];

// Canvas
let canvas=
document.getElementById("powerGraph");

let ctx=
canvas.getContext("2d");
// ====================
// Atualização principal
// ====================

function update(){

    rpm = Math.floor(power/2);

    energy = Math.floor(power/3.2);

    temp = (power/4) - (water*2);

    pressure = temp/100;

    // Barras
    document.getElementById("powerBar").style.width =
    (power/40) + "%";

    document.getElementById("tempBar").style.width =
    (temp/10) + "%";

    document.getElementById("pressureBar").style.width =
    (pressure*10) + "%";

    document.getElementById("waterBar").style.width =
    water + "%";

    // Textos
    document.getElementById("rodDisplay").innerHTML =
    rods + "%";

    document.getElementById("rpmDisplay").innerHTML =
    rpm;

    document.getElementById("energyDisplay").innerHTML =
    energy + " MWe";

    document.getElementById("waterDisplay").innerHTML =
    water + "%";

    checkSafety();

}

// ====================
// Barras de controle
// ====================

function insertRods(){

    if(rods < 100){

        rods += 5;

        power -= 100;

    }

    update();

}

function removeRods(){

    if(rods > 0){

        rods -= 5;

        power += 100;

    }

    update();

}

// ====================
// Bombas
// ====================

function increaseWater(){

    if(water < 100){

        water += 5;

    }

    update();

}

function decreaseWater(){

    if(water > 0){

        water -= 5;

    }

    update();

}

// ====================
// SCRAM
// ====================

function scram(){

    power = 0;

    rods = 100;

    temp = 100;

    document.getElementById("alarmBox").innerHTML =
    "SCRAM ATIVADO";

    document.getElementById("alarmBox").style.color =
    "red";

    update();

}

// ====================
// Segurança
// ====================

powerHistory.push(power);

if(powerHistory.length>60){

powerHistory.shift();

}

drawGraph();

function checkSafety(){

    if(temp > 850){

        document.getElementById("alarmBox").innerHTML =
        "TEMPERATURA ALTA";

        document.getElementById("alarmBox").style.color =
        "yellow";

    }

    if(temp > 1000){

        document.getElementById("alarmBox").innerHTML =
        "PERIGO CRÍTICO";

        document.getElementById("alarmBox").style.color =
        "red";

        document.body.classList.add("danger");

        alarmSound.play();

    }
    else{

        document.body.classList.remove("danger");

    }

}

// ====================
// Sandbox
// ====================

function toggleSandbox(){

    sandbox = !sandbox;

    if(sandbox){

        document.getElementById("modeBox").innerHTML =
        "SANDBOX";

    }

    else{

        document.getElementById("modeBox").innerHTML =
        "NORMAL";

    }

}

// ====================
// Eventos aleatórios
// ====================

function randomEvent(){

    if(sandbox){

        return;

    }

    let n = Math.floor(Math.random()*4);

    if(n == 0){

        water -= 20;

        document.getElementById("eventBox").innerHTML =
        "FALHA NA BOMBA";

    }

    if(n == 1){

        power += 200;

        document.getElementById("eventBox").innerHTML =
        "OSCILAÇÃO DE POTÊNCIA";

    }

    if(n == 2){

        temp += 100;

        document.getElementById("eventBox").innerHTML =
        "PICO DE TEMPERATURA";

    }

    if(n == 3){

        pressure += 2;

        document.getElementById("eventBox").innerHTML =
        "AUMENTO DE PRESSÃO";

    }

    update();

}

// ====================
// Temporizadores
// ====================

setInterval(update,1000);

setInterval(randomEvent,30000);

update();

function drawGraph(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

ctx.strokeStyle="lime";

ctx.beginPath();

for(let i=0;i<powerHistory.length;i++){

let x=i*10;

let y=
canvas.height-
(powerHistory[i]/20);

if(i==0){

ctx.moveTo(x,y);

}

else{

ctx.lineTo(x,y);

}

}

ctx.stroke();

}