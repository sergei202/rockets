import { Vector }	from './vector';
import { random, randomInt }	from './helpers';
import { Target } from './target';

export class Dna {
	genes:Vector[] = [];

	constructor(public size:number) {
		for(var i=0;i<size;i++) {
			this.genes[i] = new Vector();
			this.genes[i].x = random(-1,1);
			this.genes[i].y = random(-1,1);
			// this.genes[i].setLength(0.1);
		}
	}

	static crossover(a:Dna, b:Dna):Dna {
		var child = new Dna(a.size);
		var mid = randomInt(0,a.size);
		child.genes = child.genes.map((gene,i) => {
			return i>=mid ? a.genes[i].copy() : b.genes[i].copy();
		});
		return child;
	}

	mutate(rate=0.01, size=0.25) {
		this.genes.forEach(gene => {
			if(random()<rate) {
				gene.x += random(-size,+size);
				gene.y += random(-size,+size);
			}
		});
	}
}

export class Rocket {
	pos:Vector;
	vel:Vector;
	acc:Vector;
	maxSpeed = 10;
	width = 50;
	height = 10;
	count = 0;

	dna:Dna;
	distance = 0;
	fitness = 0;
	normFitness = 0;
	best = false;
	hitGoal = false;
	hitWall = false;

	constructor(x:number, y:number, public dnaSize:number) {
		this.pos = new Vector(x,y);
		this.vel = new Vector(0,0);
		this.acc = new Vector(0,0);
		this.dna = new Dna(this.dnaSize);
	}

	draw(ctx:CanvasRenderingContext2D, best=false) {
		ctx.save();
		var color = 'rgba(192,0,0,0.5)';
		if(best) color = '#f00';

		if(this.hitWall) color = '#aaa';
		if(this.hitGoal) color = '#0c0';

		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.translate(this.pos.x + ctx.canvas.width/2, ctx.canvas.height/2-this.pos.y);
		var angle = this.vel.angle;
		ctx.rotate(Math.PI/2-angle);

		ctx.beginPath();
		ctx.moveTo(0, -this.width/2);
		ctx.lineTo(-this.height/2, this.width/2);
		ctx.lineTo( this.height/2, this.width/2);
		ctx.lineTo(0, -this.width/2);
		// if(best) ctx.fill();
		// else
		ctx.stroke();

		ctx.restore();
	}

	update() {
		if(this.hitGoal || this.hitWall) return;
		this.applyDna();
		this.vel.add(this.acc);
		if(this.vel.length>this.maxSpeed) this.vel.setLength(this.maxSpeed);
		this.pos.add(this.vel);
		this.acc.mult(0.1);
		this.count++;
	}

	applyDna() {
		var gene = this.dna.genes[Math.floor(this.count)];
		if(gene) this.acc.add(gene);
	}

	calcFitness(target:Target) {
		this.distance = this.pos.distance(target.pos);
		this.fitness = 1/(this.distance+this.count);

		if(this.distance<10) {
			this.fitness *= 10;
			this.hitGoal = true;
		}
		if(this.hitWall) this.fitness /= 10;

		this.fitness = Math.pow(this.fitness,4);
	}
}
