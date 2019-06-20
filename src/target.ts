import { Vector }	from './vector';

export class Target {
	pos:Vector;
	radius = 10;

	constructor(x:number,y:number) {
		this.pos = new Vector(x,y);
	}

	draw(ctx:CanvasRenderingContext2D) {
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = '#00f';

		ctx.translate(this.pos.x + ctx.canvas.width/2, ctx.canvas.height/2-this.pos.y);
		ctx.arc(0,0, this.radius, 0, Math.PI*2);
		ctx.stroke();
		ctx.restore();

	}
}
