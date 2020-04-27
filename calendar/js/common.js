const doc = document, win = window;
HTMLElement.prototype.one = function(e){
	return this.querySelector(e);
}
HTMLElement.prototype.all = function(e){
	return Array.from(this.querySelectorAll(e));
}
HTMLElement.prototype.addClass = function(e){
	return this.classList.add(e);
}
HTMLElement.prototype.removeClass = function(e){
	return this.classList.remove(e);
}
HTMLElement.prototype.index = function(){
	let parent = this.parentNode,
	children = parent.children;
	for(let i=0; i<parent.children.length; i++){
		if( children[i] == this ){
			return i;
		}
	}
	return null;
}
function App(){
	let 
	today = new Date(),	
	date = today,
	table = doc.getElementById("date"),
	menu = doc.getElementById("menuBox"),
	menuli = menu.all("li"),
	Monthprev = doc.getElementById("Monthprev"),
	Monthnext = doc.getElementById("Monthnext"),
	Yearprev = doc.getElementById("Yearprev"),
	Yearnext = doc.getElementById("Yearnext"),
	month = ['January','February','March','April','May','June','July','Auguest','September','October','November','December'],
	week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	function evnet(){
		Monthprev.addEventListener("click",Mprev);
		Monthnext.addEventListener("click",Mnext);
		Yearprev.addEventListener("click",Yprev);
		Yearnext.addEventListener("click",Ynext);
		menuli.forEach(function(v){
			v.addEventListener("click",menuClick);
		});
	}
	function menuClick(){
		menuli.forEach(function(v){
			v.removeClass("active");
		})
		menuli[this.index()].addClass("active");
		date = new Date(date.getFullYear(),this.index(),1);
		BuildCalendar();
	}
	function Yprev(){
		date = new Date(date.getFullYear()-1,date.getMonth(),1);
		BuildCalendar();
	}
	function Ynext(){
		date = new Date(date.getFullYear()+1,date.getMonth(),1);
		BuildCalendar();
	}
	function Mprev(){
		date = new Date(date.getFullYear(),date.getMonth()-1,1);
		BuildCalendar();
	}
	function Mnext(){
		date = new Date(date.getFullYear(),date.getMonth()+1,1);
		BuildCalendar();
	}
	function theadSetting(){
		let thead = table.one("thead"),
		row = thead.insertRow();
		week.forEach(function(v,idx){ 
			let td = row.insertCell();
			td.textContent = v;
		});
	}
	function BuildCalendar(){
		let
		caption = table.one("caption"),
		tbody = table.one("tbody"),
		menuYear = menu.one(".year>h2"),
		first = new Date(date.getFullYear(),date.getMonth(),1),
		last = new Date(date.getFullYear(),date.getMonth()+1,0),
		prevLast = new Date(date.getFullYear(),date.getMonth(),0),
		row = null,
		cnt = 0;
		tbody.innerHTML = "";
		row = tbody.insertRow();
		menuli.forEach(function(v){
			v.removeClass("active");
		})
		menuYear.textContent = date.getFullYear();
		menuli[date.getMonth()].addClass("active");
		caption.textContent = month[date.getMonth()];
		for(let i=first.getDay(); i>0; i--,cnt++){
			console.log(prevLast.getDate()+1-i);
			let td = row.insertCell();
			td.addClass("prev");
			td.textContent = prevLast.getDate()+1-i;
		}
		for(let i=1; i<=last.getDate(); i++){
			let td = row.insertCell();
			td.textContent = i;
			if( today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDate() === i ){
				td.addClass("today");
			}
			if( ++cnt%7 == 0  ){
				row = tbody.insertRow();
			}
		}
		for(let i=1; cnt<42; i++){
			let td = row.insertCell();
			td.addClass("next");
			td.textContent = i;
			if(++cnt%7 == 0 ){
				row = tbody.insertRow();
			}
		}
 	}
	theadSetting();
	BuildCalendar();
	evnet();
}
window.onload = function(){
	App();	
}