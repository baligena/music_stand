function printObj(obj) //reads the objects properties
{
    var object ="";// sets the variable 
    for(var type in obj) 
    {object += type +"=> " + obj[type] + "<br />";}//loops throught all the object variables
    document.write(object)
} 

window.onerror = function(a,b,c){
	alert(a+"\n"+b+"\n"+c);
}
