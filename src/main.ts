import { Rocket, Dna } from './rocket';
import { Target } from './target';
import { Wall } from './wall';
import { random } from './helpers';


var ctx:CanvasRenderingContext2D;
var pop:Population;
var target:Target;
var wall:Wall;

function setup() {
	const canvas:any = document.getElementById('canvas');
	canvas.height = 800;
	canvas.width = 1000;
	ctx = canvas.getContext('2d');

	target = new Target(0,200);
	pop = new Population(100, 200);
	wall = new Wall(0,50, 400,10);

	requestAnimationFrame(draw);
}

var count = 0;
function draw() {
	ctx.clearRect(0,0, ctx.canvas.width,ctx.canvas.height);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, ctx.canvas.height/2);
	ctx.lineTo(ctx.canvas.width,ctx.canvas.height/2);
	ctx.moveTo(ctx.canvas.width/2,0);
	ctx.lineTo(ctx.canvas.width/2,ctx.canvas.height);
	ctx.closePath();
	ctx.strokeStyle = '#ddd';
	ctx.stroke();

	pop.draw(ctx);
	target.draw(ctx);
	wall.draw(ctx);

	var bestFitness = pop.rockets.sort((a,b) => b.fitness-a.fitness)[0].fitness;
	var goalCount = pop.rockets.filter(r => r.hitGoal).length;

	ctx.fillText(`gen:  ${pop.genCount}`, 10, ctx.canvas.height-30);
	ctx.fillText(`step: ${pop.stepCount}`, 10, ctx.canvas.height-15);
	ctx.fillText(`best:  ${bestFitness.toFixed(6)}`, ctx.canvas.width-100, ctx.canvas.height-30);
	ctx.fillText(`goal:  ${goalCount}`, ctx.canvas.width-100, ctx.canvas.height-15);

	count++;
	requestAnimationFrame(draw);
}


class Population {
	rockets:Rocket[] = [];
	genCount = 0;
	stepCount = 0;
	count = 0;
	best:Rocket = null;

	constructor(public size:number, public steps=100) {
		for(var i=0;i<size;i++) {
			this.rockets[i] = new Rocket(0,-220, this.steps);
		}
		this.calcFitness();
	}

	draw(ctx:CanvasRenderingContext2D) {
		this.calcFitness();
		
		this.rockets.forEach(rocket => {
			rocket.draw(ctx);
			rocket.update();
			if(wall.collision(rocket)) rocket.hitWall = true;
		});



		var best = this.rockets.find(r => r.best);
		if(best) best.draw(ctx, true);
		this.count++;
		this.stepCount++;
		if(this.stepCount>=this.steps) this.nextGen();
	}

	nextGen() {
		this.stepCount = 0;
		this.genCount++;

		this.calcNormFitness();
		this.rockets = this.rockets.map(oldRocket => {
			var a = this.randomWeighted();
			var b = this.randomWeighted();
			var rocket = new Rocket(0,-250, this.steps);
			rocket.dna = Dna.crossover(a.dna,b.dna);
			rocket.dna.mutate(0.005);
			return rocket;
		});
	}

	calcFitness() {
		this.rockets.forEach(rocket => {
			rocket.calcFitness(target);
			// console.log('rocket:%o\t distance:%o,\t fitness:%o', rocket, rocket.distance, rocket.fitness);
		});
		this.rockets.sort((a,b) => b.fitness-a.fitness)[0].best = true;
	}
	calcNormFitness() {
		var total = this.rockets.map(r => r.fitness).reduce((a,b) => a+b, 0);
		this.rockets.forEach(r => r.normFitness = r.fitness/total);
	}

	randomWeighted() {
		var r = random(0,1);
		for(var i=0;i<this.rockets.length;i++) {
			if(r<this.rockets[i].normFitness) return this.rockets[i];
			r -= this.rockets[i].normFitness;
		}
	}
}



window.onload = setup;


