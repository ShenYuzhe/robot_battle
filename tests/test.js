father = function() {

    this.a = 2;


}

father.prototype.callMethod = function() {
    this.actionList.method(this);
}

father.prototype.actionList = {
    
    'method': function(outside) {
        outside.a = 3;
    }


}

f = new father();
f.callMethod();
console.log(f.a);
