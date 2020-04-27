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
		lineWidth:1,
		lineColor:"#000",
		init:function(){
			this.canvas = doc.getElementById("board");
			this.ctx = this.canvas.getContext("2d");
			this.canvas.width = 1200;
			this.canvas.height = 500;
			this.bg();
			this.event();
		},
		event:function(){
			this.canvas.addEventListener("mousedown",this.mousedown.bind(this));
			doc.addEventListener("mousemove",this.mousemove.bind(this));
			doc.addEventListener("mouseup",this.mouseup.bind(this));
		},
		mousedown:function(e){
			let pos = this.canvas.parentNode.position(e.pageX,e.pageY);
			this.drag=true;
			this.ctx.beginPath();
			this.ctx.lineWidth = this.lineWidth;
			this.ctx.moveTo(pos.x,pos.y);
			this.ctx.strokeStyle = this.lineColor;
		},
		mousemove:function(e){
			if( this.drag ){
				let pos = this.canvas.parentNode.position(e.pageX,e.pageY);
				this.ctx.lineTo(pos.x,pos.y);
				this.ctx.stroke();
			}
		},
		mouseup:function(){
			this.drag=false;
		},
		bg:function(){
			this.ctx.beginPath();
			this.ctx.fillStyle = "#fff";
			this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
		},
		change:function(element){
			let 
			copy = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height),
			parent =  this.canvas.parentNode;
			parent.style.width = element.style.width;
			parent.style.height = element.style.height;
			this.canvas.width = element.style.width.replace("px","");
			this.canvas.height = element.style.height.replace("px","");
			this.bg();
			this.ctx.putImageData(copy,0,0);
		},
		set setLineColor(color){
			this.lineColor = color;
		}
	},color={
		Color:null,
		ColorCtx:null,
		ColorBox:null,
		ColorPos:null,
		ColorWrap:null,
		ColorWrapDrag:false,
		ColorWrapDown:null,
		ColorClose:null,
		ColorBg:{ r : 255 , g : 0 , b : 0},
		ColorDrag:false,
		Bar:null,
		BarCtx:null,
		BarDrag:false,
		init:function(){
			this.Color = doc.getElementById("color");
			this.ColorCtx = this.Color.getContext("2d");
			this.ColorBox = doc.getElementById("colorBox");
			this.ColorWrap  = doc.getElementById("ColorWrap");
			this.ColorClose = doc.getElementById("ColorClose");
			this.Bar = doc.getElementById("bar");
			this.BarCtx = this.Bar.getContext("2d");
			this.Color.width = 255;
			this.Color.height = 255;
			this.Bar.width = 20;
			this.Bar.height = 255;
			this.colorInit(this.ColorBg.r,this.ColorBg.g,this.ColorBg.b);
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
		colorInit:function(r,g,b){
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
			this.ColorBox.addEventListener("click",this.ColorBoxClick.bind(this));
			this.ColorClose.addEventListener("click",this.ColorCloseClick.bind(this));
		},
		ColorCloseClick:function(e){
			this.ColorWrap.style.opacity = 0;
			setTimeout(function(){
				this.ColorWrap.style.visibility = "hidden";
			},500);
		},
		ColorBoxClick:function(){
			this.ColorWrap.style.visibility = "visible";
			this.ColorWrap.style.opacity = 1;
		},
		Mouseup:function(e){
			this.BarDrag=false;
			this.ColorDrag=false;
			this.ColorWrapDrag=false;
		},
		BarMousedown:function(e){
			let pos  = { x:e.offsetX,y:e.offsetY };
			this.BarDrag=true;
			if( pos.x < 0 || pos.y < 0 ) return false;
			this.BarPointer(pos);
		},
		BarMousemove:function(e){
			if( this.BarDrag ){
				let pos  = { x:e.offsetX,y:e.offsetY };
				if( pos.x < 0 || pos.y < 0 || pos.x > 20 || pos.y > 254) return false;
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
			let pos  = { x:e.offsetX,y:e.offsetY };
			if( pos.y < 0 ) return false;
			this.ColorPointer(pos);
		},
		ColorMousemove:function(e){
			if( this.ColorDrag ){
				let pos  = { x:e.offsetX,y:e.offsetY };
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
	},boardRect={
		RectW:null,
		RectH:null,
		RectC:null,
		RectBox:null,
		RectWDrag:false,
		RectHDrag:false,
		RectCDrag:false,
		DownPos : { x: null , y: null },
		init:function(){
			this.RectW = doc.getElementById("RectW");
			this.RectH = doc.getElementById("RectH");
			this.RectC = doc.getElementById("RectC");
			this.event();
		},
		event:function(){
			this.RectW.addEventListener("mousedown",this.RectWMousedown.bind(this));
			this.RectH.addEventListener("mousedown",this.RectHMousedown.bind(this));
			this.RectC.addEventListener("mousedown",this.RectCMousedown.bind(this));
			doc.addEventListener("mousemove",this.Mousemove.bind(this));
			doc.addEventListener("mouseup",this.Mouseup.bind(this));
		},
		RectWMousedown:function(e){
			this.RectWDrag = true;
			this.RectBox = new RectBox(board.canvas);
		},
		RectHMousedown:function(e){
			this.RectHDrag = true;
			this.RectBox = new RectBox(board.canvas);
		},
		RectCMousedown:function(e){
			this.RectCDrag = true;
			this.RectBox = new RectBox(board.canvas);
		},
		BoardPos:function(e){
			return board.canvas.parentNode.position(e.pageX,e.pageY);
		},
		Mousemove:function(e){
			if( this.RectWDrag || this.RectHDrag || this.RectCDrag ){
				let pos = this.BoardPos(e);
				if( this.RectWDrag || this.RectCDrag ) this.RectBox.RectX(pos.x);
				if( this.RectHDrag || this.RectCDrag ) this.RectBox.RectY(pos.y);
				board.canvas.parentNode.append(this.RectBox.element);
			}
		},
		Mouseup:function(){
			if( this.RectWDrag || this.RectHDrag || this.RectCDrag ){
				board.canvas.parentNode.removeChild(this.RectBox.element);
				board.change(this.RectBox.element);
				this.RectWDrag = false;
				this.RectHDrag = false;
				this.RectCDrag = false;
				this.RectBox = null;
			}
		}
	},menu={
		reset:null,
		download:null,
		lineW:null,
		clear:null,
		init:function(){
			this.reset = doc.getElementById("reset");
			this.download = doc.getElementById("download");
			this.lineW = doc.getElementById("lineW");
			this.clear = doc.getElementById("clear");
			this.event();
		},
		event:function(){
			this.reset.addEventListener("click",this.resetClick.bind(this));
			this.download.addEventListener("click",this.downloadClick.bind(this));
			this.lineW.addEventListener("change",this.LineChange.bind(this));
			this.clear.addEventListener("click",this.clearClick.bind(this));
		},
		clearClick:function(){
			board.lineColor = "#fff";
		},
		LineChange:function(e){
			board.lineWidth = e.target.value;
		},
		resetClick:function(){
			board.bg();
		},
		downloadClick:function(){
			let a = doc.createElement("a");
			a.href = board.canvas.toDataURL();
			a.download = prompt("제목을 입력해주세요.");
			a.click();
		}
	}
	function RectBox(canvas){
		this.element = doc.createElement("div");
		this.element.id = "RectBox";
		this.element.style.width = canvas.width+"px";
		this.element.style.height = canvas.height+"px";
	}
	RectBox.prototype = {
		RectX:function(x){
			this.element.style.width = x+"px";
		},
		RectY:function(y){
			this.element.style.height = y+"px";
		}
	}
	board.init();
	boardRect.init();
	color.init();
	menu.init();
}
window.onload = function(){
	App();
}