const doc = document, win = window;
function App(){
	let 
	canvas = doc.getElementById("Mycanvas"),
	ctx = canvas.getContext("2d"),
	move = { x : win.innerWidth/2 , h : win.innerHeight/2 },
	array = [];
	canvas.width = win.innerWidth;
	canvas.height = win.innerHeight;
	function ball(){
		this.rect = random(5,7);
		this.x = random(this.rect,canvas.width-this.rect);
		this.y = random(this.rect,canvas.height-this.rect);
		this.l = random(3,8);
		this.t = random(3,9);
		this.color = "rgb(0,0,0)";
	}
	ball.prototype.draw = function(idx){
		array.forEach( (v,vidx) =>{
			if( idx != vidx ){
				let line = Math.sqrt(Math.pow(Math.abs(this.x-v.x),2)+Math.pow(Math.abs(this.y-v.y),2));
				if( this.rect*35 >= line ){
					ctx.beginPath();
					ctx.moveTo(this.x,this.y);
					ctx.strokeStyle = "red";
					ctx.lineWidth = 1;
					ctx.lineTo(v.x,v.y);
					ctx.stroke();
				}
			}
		} );

		if(  this.rect*40 >= (Math.sqrt(Math.pow(Math.abs(this.x-move.x),2)+Math.pow(Math.abs(this.y-move.y),2))) ){
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(move.x,move.y);
			ctx.lineWidth = 5;
			ctx.strokeStyle = "rgb(255,255,255,0.3)";
			ctx.stroke();
		}
	}
	ball.prototype.update = function(){
		if( this.x+this.l > canvas.width || this.x+this.l < 0 ){
			this.l = -this.l;
		};
		if( this.y+this.t > canvas.height || this.y+this.t < 0 ){
			this.t = -this.t;
		};
		this.x += this.l;
		this.y += this.t;
	}
	function random(min,max){
		return Math.floor(Math.random()*max)+min;
	}
	for(let i=0; i<100; i++){
		array[i] = new ball(i);
	}
	function loop(){
		ctx.fillStyle = "rgb(0,0,0,0.1)";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		for(let i in array){
			array[i].draw();
			array[i].update();
		}
		requestAnimationFrame(loop);
	}
	doc.addEventListener("mousemove",function(e){
		move.x = e.pageX;
		move.y = e.pageY;
	})
	requestAnimationFrame(loop);
}
win.onload = function(){
	App();
}