var person = {};
person.name = "jack";
person.age = 29;

console.log(person.name);
console.log(person["age"])

Hero = {
	a : 1,
	b : 2,
	f : function(s) {
		console.log(s);
	}
}

Hero.f("ddddd")

var Car = {
	
    createNew: function() {
        var cat = {};
        cat.name = "yellow pillow";
        cat.makeSound = function() {
            console.log("miew");
        }
        return cat;
    }

};

car = Car.createNew();
car.makeSound();

var Animal = {

    createNew: function() {
        
        var animal = {};
        animal.sleep = function() {
            console.log("sleep late");
        };        
        
        return animal;
    }
};

var Dog = {

    changeName: function(dog) {
        dog.name = "changed";
    },

    createNew: function() {
        var dog = Animal.createNew();
        dog.name = "white cloud";
        this.changeName(dog);
        
        dog.makeSound = function() {
            console.log("wang");
        }

        dog.sayName = function()  {
            console.log(dog.name);
        }

         return dog;    
    }
    

}

dog = Dog.createNew();
dog.makeSound();
dog.sayName();

var basic = require("./basic");
console.log(basic.DIRECTIONS);

function Gadget(name, color, price) {
    this.name = name;
    this.color = color;
    Gadget.prototype.price = price;
}


var newToy = new Gadget("tom", "red", 100);
console.log(newToy.price);

var modernToy = new Gadget("jack", "blue", 200);
console.log(newToy.price);

function Shape() {
    this.size = 10;
    Shape.prototype.name = "shape";
    Shape.prototype.toString = function() { return this.name; };
}

function TwoDShape() {
    TwoDShape.prototype.name = "2D Shape";

}
TwoDShape.prototype = new Shape();
TwoDShape.prototype.constructor = TwoDShape;
var shape = new TwoDShape();
console.log(shape.size);

person = {
    "name": "Tom"
};
console.log(person.hasOwnProperty('name'));






