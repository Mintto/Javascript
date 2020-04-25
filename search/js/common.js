function App(){
	let  str = '"Hello World."',
	keyword = prompt(),
	reg = new RegExp(`[${keyword}]`,'gi');
	console.log(str.replace(reg,"<span>"+keyword+"</span>"));
}
window.onload = function(){
	App();
}

/*

대 소문자 상관없음


*/