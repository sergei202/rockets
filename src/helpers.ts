export function random(min=0,max=1) {
	return Math.random()*(max-min)+min;
}

export function randomInt(min:number, max:number) {
	return Math.floor(random(min,max));
}
