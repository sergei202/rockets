export class Vector {
	x:number;
	y:number;

	constructor(x:number=0, y:number=0) {
		this.x = x;
		this.y = y;
	}


	add(vec:Vector) {
		this.x += vec.x;
		this.y += vec.y;
	}
	mult(s:number) {
		this.x *= s;
		this.y *= s;
	}

	copy() {
		return new Vector(this.x,this.y);
	}

	get length():number {
		return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
	}
	
	get angle():number {
		if(!this.x) return 0;
		var angle = Math.atan(this.y/this.x);
		if(this.x<0) angle -= Math.PI;
		return angle;
	}

	normalize() {
		this.x /= this.length;
		this.y /= this.length;
	}
	distance(vec:Vector) {
		var x = this.x-vec.x;
		var y = this.y-vec.y;
		return Math.sqrt(x*x + y*y);
	}

	setAngle(angle:number) {
		this.x = Math.cos(angle);
		this.y = Math.sin(angle);
	}

	setLength(len:number) {
		this.normalize();
		this.x *= len;
		this.y *= len;
	}
}
