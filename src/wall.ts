import { Vector }	from './vector';
import { Rocket } from './rocket';

export class Wall {
	pos:Vector;
	size:Vector;

	constructor(x:number,y:number, w:number,h:number) {
		this.pos = new Vector(x,y);
		this.size = new Vector(w,h);
	}

	draw(ctx:CanvasRenderingContext2D) {
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = '#000';

		ctx.translate(this.pos.x + ctx.canvas.width/2, ctx.canvas.height/2-this.pos.y);
		ctx.fillRect(-this.size.x/2,-this.size.y/2, this.size.x,this.size.y);
		ctx.stroke();
		ctx.restore();
	}

	collision(rocket:Rocket) {
		var x1=this.pos.x,   y1=this.pos.y;
		var w1=this.size.x,  h1=this.size.y;
		var x2=rocket.pos.x, y2=rocket.pos.y;
		var w2=rocket.width, h2=rocket.height;
		if(y1>=(y2-h1/2) && y1<(y2+h1/2) && x1>=(x2-w1/2) && x1<=(x2+w1/2)) return true;
		return false;
	}
}
