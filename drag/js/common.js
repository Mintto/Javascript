const 
doc = document,
one = e => doc.querySelector(e),
all = e => Array.from(doc.querySelectorAll(e)),
HTMLP = {
	addClass : function(value){
		this.classList.add(value);
	}
}
Object.assign(HTMLElement.prototype,HTMLP);
console.log(HTMLElement.prototype);
function App(){

	one(".item").addEventListener("dragstart",function(e){
		e.dataTransfer.setData("Text","select");
		e.currentTarget.addClass('select')
	})
	all(".dropbox").forEach( v =>{
		v.addEventListener("dragover",function(e){
			e.preventDefault();
			console.log(e);
		});
		v.addEventListener("drop",function(e){
			e.target.append(one(`.${e.dataTransfer.getData("Text")}`));
		})
	} );
}
window.onload = function(){
	App();
}