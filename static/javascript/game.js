let canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const N_input = document.getElementById("N");

const intra_input = document.getElementById("force_inter");
const attraction_input = document.getElementById("force_attraction");
const unattraction_input = document.getElementById("force_repulsion");

const run_button = document.getElementById("run_game")
const insert_table = document.getElementById("insert_to_table")

var start_time;
var end_time;
var curr_time;
var win_time;
var winner;

var intra = -0.33
var attraction = 1
var unattraction = -1

let has_won;

var W = 500
var H = 500

let request;

// var W = window.innerWidth;
// var H = window.innerHeight;

let scissor_color = "gray"
let rock_color = "green"
let paper_color = "red"


const rock_img = document.getElementById("rock_img")
const paper_img = document.getElementById("paper_img")
const scissor_img = document.getElementById("scissor_img")

draw=(x,y,c,s,type)=>{
    let scaler = 2
    const sprite_size = scaler * Math.sqrt(2)*s
    if(type == 1){
        ctx.drawImage(rock_img,x-sprite_size/2,y-sprite_size/2,sprite_size,sprite_size);
    }
    if(type == 2){
        ctx.drawImage(paper_img,x-sprite_size/2,y-sprite_size/2,sprite_size,sprite_size);
    }
    if(type == 3){
        ctx.drawImage(scissor_img,x-sprite_size/2,y-sprite_size/2,sprite_size,sprite_size);
    }
    let circle = new Path2D();
    ctx.beginPath();
    circle.arc(x,y,s, 0, 2 * Math.PI, false);
    ctx.fillStyle = c;
    ctx.fill();
    ctx.strokeStyle = c;
    ctx.stroke();

}

particle=(x,y,c, mass, size, type)=>{ 
    return {"x":x, "y":y, "vx":0, "vy":0, "color":c, "mass":mass, "size":size, "type": type};
}

random=()=>{
    return Math.random()*400 + 50;
}

create=(number, color, mass,size, type)=>{
    group = [];
    for(let i = 0; i < number; i++){
        group.push(particle(random(),random(),color,mass,size, type));
        particles.push(group[i]);
    }
    return group
}
// 1: Rock: green, 2: Paper: Red, 3: Scissor: Gray
type_effect=(a,b)=>{
    if(a == 1){
        if(b == 1){
            return intra;
        }
        else if(b == 2){
            return unattraction;
        }
        else{return attraction}
    }
    else if (a==2){
        if(b == 2){
            return intra;
        }
        else if(b == 3){
            return unattraction;
        }
        else{return attraction}
    }
    else{
        if(b == 3){
            return intra;
        }
        else if(b == 1){
            return unattraction;
        }
        else{return attraction}
    }
}

custom_create=()=>{
    group = [];
    group.push(particle(230,250,rock_color,1,5));
    group[0].vx = 1;
    group[0].vy = 0;
    group.push(particle(270,250,rock_color,1,5));
    group[1].vx = -1;
    group[1].vy = 0;
    particles.push(group[0]);
    particles.push(group[1]);
    return group;
}

// test_points = custom_create();

// small_points_1 = create(500, "blue", 1,4);
// small_points_2 = create(150, paper_color, 25,8);
// large_points = create(10,rock_color,100,15);

var N;

var particles;
    
var N_rocks;
var N_scissors;
var N_papers;

var nrocks
var npapers
var nscissors

function initialize_game(input){
    particles = [];
    N = input
    
    N_rocks = N
    N_scissors = N
    N_papers = N
    
    rocks = create(N_rocks, rock_color, 400, 9, 1)
    nrocks = N_rocks
    papers = create(N_papers, paper_color, 50, 9, 2)
    npapers = N_papers
    scissors = create(N_scissors, scissor_color, 10, 9, 3)
    nscissors = N_scissors
}


rule=(particles1,particles2,g)=>{
    const alpha = 0.5
    // for(let i = 0; i < particles1.length; i++){
    //     particles1[i].x+=1;
    // }
    F_x = []
    F_y = []
    for(let i = 0; i < particles1.length; i++){
        fx = 0;
        fy = 0;


        for(let j = 0; j < particles2.length; j++){
            let dx = particles1[i].x-particles2[j].x;
            let dy = particles1[i].y-particles2[j].y;
            // console.log(i,j,dx,particles1[i].x,particles2[j].x,dy,particles1[i].y,particles2[j].y);
            // console.log(dy);
            let d = Math.sqrt(dx*dx + dy*dy);
            // console.log(d);

            // Collision Detection
            if(d>0 && d < (particles1[i].size + particles2[j].size) * 1.00){
                let vel_scaler = 1;

                let m1 = particles1[i].mass;
                let m2 = particles2[j].mass;

                let v1x = particles1[i].vx;
                let v1y = particles1[i].vy;

                let v2x = particles2[j].vx;
                let v2y = particles2[j].vy;

                let c1x = particles1[i].x;
                let c1y = particles1[i].y;

                let c2x = particles2[j].x;
                let c2y = particles2[j].y;
                

                let dot_prod = (v2x-v1x) * (c2x-c1x) + (v2y-v1y) * (c2y-c1y);
                let other_const_1 = 2 * m2 / (m1+m2);
                let other_const_2 = 2 * m1 / (m1+m2);

                let v1x_new = v1x - dot_prod * other_const_1/(d*d) * (c1x-c2x);
                let v1y_new = v1y - dot_prod * other_const_1/(d*d) * (c1y-c2y);
                
                let v2x_new = v2x + dot_prod * other_const_2/(d*d) * (c1x-c2x);
                let v2y_new = v2y + dot_prod * other_const_2/(d*d) * (c1y-c2y); 

                particles1[i].vx = vel_scaler * v1x_new;
                particles1[i].vy = vel_scaler * v1y_new;
                particles2[j].vx = vel_scaler * v2x_new;
                particles2[j].vy = vel_scaler * v2y_new;

                type_i = particles1[i].type;
                type_j = particles2[j].type;
                // 1: Rock: green, 2: Paper: Red, 3: Scissor: Gray
                if(type_i == 1){
                    if(type_j == 2){
                        particles1[i].type = 2
                        particles1[i].color = paper_color
                        npapers++
                        nrocks--
                    }
                    else if(type_j == 3){
                        particles2[j].type = 1
                        particles2[j].color = rock_color
                        nrocks++
                        nscissors--
                    }
                }
                if(type_i == 2){
                    if(type_j == 3){
                        particles1[i].type = 3
                        particles1[i].color = scissor_color
                        nscissors++
                        npapers--
                    }
                    else if(type_j == 1){
                        particles2[j].type = 2
                        particles2[j].color = paper_color
                        npapers++
                        nrocks--
                    }
                }
                if(type_i == 3){
                    if(type_j == 1){
                        particles1[i].type = 1
                        particles1[i].color = rock_color
                        nrocks++
                        nscissors--
                    }
                    else if(type_j == 2){
                        particles2[j].type = 3
                        particles2[j].color = scissor_color
                        npapers--
                        nscissors++
                    }
                }



                // console.log("collision")
            }

            if(d>0 && d < 500){
                F = type_effect(particles1[i].type, particles2[j].type)*alpha * g * particles1[i].mass * particles2[j].mass/(d*d);
                fx += F * dx/d;
                fy += F * dy/d;
            }
        }
        
        // Viscosity Factor
        
        // const beta = 0.1
        // let v = Math.sqrt(particles1[i].vx*particles1[i].vx* + particles1[i].vy*particles1[i].vy);
        // F_2 = beta * v*v;
        // // console.log(F_2);
        // if(v!= 0){
            //     f_air_x = -Math.sign(particles1[i].vx) * F_2 * particles1[i].vx/v;
            //     // fx = Math.max(0,fx-);
            //     fx += f_air_x;
            
            //     f_air_y = -Math.sign(particles1[i].vy) * F_2 * particles1[i].vy/v;
            //     // fy = Math.abs(0,fy);
            //     fy += f_air_y;
            // }
            
        F_x.push(fx)
        F_y.push(fy)
    }


    //Update position and its derivatives
    for(i = 0; i < particles1.length; i++){

        // Change velocity
        fx = F_x[i]
        fy = F_y[i]
        particles1[i].vx += fx/particles1[i].mass;
        particles1[i].vy += fy/particles1[i].mass;

        // Set max velocity
        let max_speed = 3

        particles1[i].vx = Math.min(max_speed,particles1[i].vx);
        particles1[i].vx = Math.max(-max_speed,particles1[i].vx);

        particles1[i].vy = Math.min(max_speed,particles1[i].vy);
        particles1[i].vy = Math.max(-max_speed,particles1[i].vy);

        // particles1[i].vx = 1;
        // particles1[i].vy = 1;
        // console.log(particles1[i].x,particles1[i].y);
        particles1[i].x += particles1[i].vx;
        particles1[i].y += particles1[i].vy;
        // console.log(particles1[i].x,particles1[i].y);


        // Edge Detection 
        let vel = 0.01;
        if(particles1[i].x + particles1[i].size >=W){
            particles1[i].x = 2 * W - particles1[i].x - 2 * particles1[i].size;
            particles1[i].vx*=-1
            // if(Math.abs(particles1[i].vx) < 0.01){
            //     particles1[i].vx=-vel;
            // }

        }
        if(particles1[i].x - particles1[i].size <= 0){
            particles1[i].vx*=-1
            particles1[i].x = -1 * particles1[i].x + 2 * particles1[i].size;
            // if(Math.abs(particles1[i].vx) < 0.01){
            //     particles1[i].vx=vel;
            // }
        }
        if(particles1[i].y - particles1[i].size <= 0){
            particles1[i].y = -1 * particles1[i].y + 2 * particles1[i].size;
            particles1[i].vy*=-1
            if(Math.abs(particles1[i].vy) < 0.01){
                particles1[i].vy=vel;
            }
        }
        if(particles1[i].y + particles1[i].size >=H){
            particles1[i].y = 2 * H - particles1[i].y - 2 * particles1[i].size;
            particles1[i].vy*=-1
            if(Math.abs(particles1[i].vy) < 0.01){
                particles1[i].vy=-vel;
            }
        }
    }
}

update=()=>{
    ctx.clearRect(0,0,W,H);
    // ctx.fillRect(0,0,rock_color,500);

    // rule(test_points,test_points,-1);
    // rule(small_points_1,small_points_2,-1);
    // rule(small_points_2,small_points_1,-1);

    // rule(large_points,small_points_2,-1);
    // rule(small_points_2,large_points,-1);

    // rule(small_points_1,large_points,-1);
    // rule(large_points,small_points_1,-1);
    
    // rule(large_points,large_points,1);
    // rule(small_points_1,small_points_1,1);
    // rule(small_points_2,small_points_2,1);
    rule(particles, particles, -1);
    // rule(rocks,scissors,-10);
    // rule(scissors,rocks,1);
    // rule(scissors,papers,-1);
    // rule(papers,scissors,1);
    // rule(papers,rocks,-1);
    // rule(rocks,papers,1);
    


    for(i = 0; i< particles.length; i++){
        draw(particles[i].x,particles[i].y, particles[i].color,particles[i].size,particles[i].type);
    }
    curr_time = Date.now()-start_time
    ctx.font = '12px serif';
    ctx.fillStyle = rock_color;
    ctx.fillText("Rocks: " + nrocks, 10, 20);
    ctx.fillStyle = paper_color;
    ctx.fillText("Papers: " + npapers, 10, 30);
    ctx.fillStyle = scissor_color;
    ctx.fillText("Scissors: " + nscissors, 10, 40);
    ctx.fillStyle = "black";
    ctx.fillText("Time: " + curr_time/1000 + "s", 10, 50);

    ctx.font = '30px serif';
    ctx.fillStyle = "black";
    if(npapers == 0 && nscissors == 0){
        ctx.fillText("Rock Wins", W/2-70, H/2);
        if(!has_won){
            win_time=(Date.now()-start_time) / 1000;
            winner = 1;
            has_won=true;
            console.log(winner)
        }
        else{
            ctx.fillText("Time to win: " + win_time + "s", W/2-70, H/2+30);
        }
    }
    if(npapers == 0 && nrocks == 0){
        ctx.fillText("Scissor Wins", W/2-70, H/2);
        if(!has_won){
            win_time=(Date.now()-start_time) / 1000;
            winner = 2;
            has_won=true;
            console.log(winner)
        }
        else{
            ctx.fillText("Time to win: " + win_time + "s", W/2-70, H/2+30);
        }
    }
    if(nrocks == 0 && nscissors == 0){
        ctx.fillText("Paper Wins", W/2-70, H/2);
        if(!has_won){
            win_time=(Date.now()-start_time) / 1000;
            winner = 3;
            has_won=true;
            console.log(winner)
        }
        else{
            ctx.fillText("Time to win: " + win_time + "s", W/2-70, H/2+30);
        }
    }

    request = requestAnimationFrame(update);
}
// console.log(rock_img);
// rock_img.onload = update;
// rock_img.onload = update;
// update();

async function postData() {
    if(!has_won) return
    formData = {
        N: N,
        repel: unattraction,  
        attract: attraction,
        inter: intra,
        winner: winner,
        time_to_win: win_time
    }
    console.log(formData)
    try {
        const response = await fetch('http://0.0.0.0/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',  // Specify the expected response type
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

        // Handle success, update UI, or perform other actions as needed
    } catch (error) {
        console.error('Error:', error);
        // Handle error, show error message, or perform other actions as needed
    }
}

function start_game(){
    cancelAnimationFrame(request);

    has_won = false;
    winner = undefined;
    start_time=Date.now();
    var input = N_input.value
    initialize_game(input);
    intra = intra_input.value
    attraction = attraction_input.value
    unattraction = unattraction_input.value
    rock_img.onload = update;
    update();
}

run_button.onclick = start_game;
insert_table.onclick = postData;