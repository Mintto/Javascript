const 
doc = document;
HTMLElement.prototype.position = function(x,y){
	return {
		x:x-this.offsetLeft,
		y:y-this.offsetTop
	};
};
function App(){
	let board={
		canvas:null,
		ctx:null,
		drag:false,
		lineColor:"#000",
		init:function(){
			this.canvas = doc.getElementById("board");
			this.ctx = this.canvas.getContext("2d");
			this.canvas.width = 1200;
			this.canvas.height = 500;
			this.ctx.fillStyle = "#fff";
			this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
			this.event();
		},
		event:function(){
			this.canvas.addEventListener("mousedown",this.mousedown.bind(this));
			doc.addEventListener("mousemove",this.mousemove.bind(this));
			doc.addEventListener("mouseup",this.mouseup.bind(this));
		},
		mousedown:function(e){
			let pos = this.canvas.position(e.pageX,e.pageY);
			this.drag=true;
			this.ctx.beginPath();
			this.ctx.moveTo(pos.x,pos.y);
			this.ctx.strokeStyle = this.lineColor;
		},
		mousemove:function(e){
			if( this.drag ){
				let pos = this.canvas.position(e.pageX,e.pageY);
				this.ctx.lineTo(pos.x,pos.y);
				this.ctx.stroke();
			}
		},
		mouseup:function(){
			this.drag=false;
		},
		set setLineColor(color){
			this.lineColor = color;
		}
	},color={
		Color:null,
		ColorCtx:null,
		ColorBox:null,
		ColorPos:null,
		ColorBg:{ r : 255 , g : 0 , b : 0},
		ColorDrag:false,
		Bar:null,
		BarCtx:null,
		BarDrag:false,
		init:function(){
			this.Color = doc.getElementById("color");
			this.ColorCtx = this.Color.getContext("2d");
			this.ColorBox = doc.getElementById("colorBox");
			this.Bar = doc.getElementById("bar");
			this.BarCtx = this.Bar.getContext("2d");
			this.Color.width = 255;
			this.Color.height = 255;
			this.Bar.width = 20;
			this.Bar.height = 255;
			this.colorInit();
			this.barInit();
			this.event();
		},
		barInit:function(){
			this.BarCtx.clearRect(0,0,this.Bar.width,this.Bar.height);
			let linear = this.BarCtx.createLinearGradient(0,0,0,this.Color.height);
			linear.addColorStop(0,'#ff0000'); 
			linear.addColorStop(0.166,'#ff00ff');
			linear.addColorStop(0.333,'#0000ff');
			linear.addColorStop(0.5,'#00ffff');
			linear.addColorStop(0.666,'#00ff00');
			linear.addColorStop(0.834,'#ffff00');
			linear.addColorStop(1,'#ff0000');
			this.BarCtx.fillStyle = linear;
			this.BarCtx.fillRect(0,0,this.Bar.width,this.Bar.height);
		},
		colorInit:function(r=255,g=0,b=0){
			this.ColorCtx.clearRect(0,0,this.Color.width,this.Color.height);
			for(let i=0; i<256; i++){
				let 
				linear = this.ColorCtx.createLinearGradient(0,0,256,1),
				rgb =  255-i;
				linear.addColorStop(0,`rgb(${rgb},${rgb},${rgb})`);
				linear.addColorStop(1,`rgb(${r},${g},${b})`);
				this.ColorCtx.fillStyle = linear;
				this.ColorCtx.fillRect(0,i,this.Color.width,1);
				r--;
				g--;
				b--;
			}
		},
		event:function(){
			this.Bar.addEventListener("mousedown",this.BarMousedown.bind(this));
			this.Bar.addEventListener("mousemove",this.BarMousemove.bind(this));
			doc.addEventListener("mouseup",this.Mouseup.bind(this));
			this.Color.addEventListener("mousedown",this.ColorMousedown.bind(this));
			this.Color.addEventListener("mousemove",this.ColorMousemove.bind(this));
		},
		Mouseup:function(e){
			this.BarDrag=false;
			this.ColorDrag=false;
		},
		BarMousedown:function(e){
			let pos = this.Bar.position(e.pageX,e.pageY);
			this.BarDrag=true;
			if( pos.x < 0 || pos.y < 0 ) return false;
			this.BarPointer(pos);
		},
		BarMousemove:function(e){
			if( this.BarDrag ){
				let pos = this.Bar.position(e.pageX,e.pageY);
				if( pos.x < 0 || pos.y < 0) return false;
				this.BarPointer(pos);
			}
		},
		BarPointer:function(pos){
			this.barInit();
			let color = this.BarCtx.getImageData(this.Bar.width/2,pos.y,1,1).data;
			this.ColorBg = { r: color[0], g:color[1], b:color[2] };
			this.ColorPointer();
			this.BarCtx.beginPath();
			this.BarCtx.fillStyle = "#fff";
			this.BarCtx.arc(this.Bar.width/2,pos.y,this.Bar.width/2,0,Math.PI*2);
			this.BarCtx.fill();
		},
		ColorMousedown:function(e){
			this.ColorDrag = true;
			let  pos = this.Color.position(e.pageX,e.pageY);
			if( pos.y < 0 ) return false;
			this.ColorPointer(pos);
		},
		ColorMousemove:function(e){
			if( this.ColorDrag ){
				let pos = this.Color.position(e.pageX,e.pageY);
				if( pos.x < 0 || pos.y < 0 ) return false;
				this.ColorPos = pos;
				this.ColorPointer(pos);
			}
		},
		ColorPointer:function(pos=this.ColorPos){
			this.colorInit(this.ColorBg.r,this.ColorBg.g,this.ColorBg.b);
			if( !pos ) return false;
			color = this.ColorCtx.getImageData(pos.x,pos.y,1,1).data;
			board.setLineColor = `rgb(${color[0]},${color[1]},${color[2]})`;
			this.ColorBox.style.background = board.lineColor;
			this.ColorCtx.beginPath();
			if( pos.y > this.Color.height/2 ){
				this.ColorCtx.strokeStyle = "#fff";
			}else{
				this.ColorCtx.strokeStyle = "#000";
			}
			this.ColorCtx.arc(pos.x,pos.y,5,0,Math.PI*2);
			this.ColorCtx.stroke();
		}
	}
	board.init();
	color.init();
}
window.onload = function(){
	App();
}