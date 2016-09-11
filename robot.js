basic = require('./basic')
DIRECTIONS = basic.DIRECTIONS;
ACTIONS = basic.ACTIONS;

// definition for action
Driver = function(name) {
    
    this.name = name;

}

Driver.prototype.onAttack = function(hurt) {
    console.log(this.name + ": I am hurt by " + hurt);
}

Driver.prototype.act = function(attribute) {
    return [];
}

exports.Driver = Driver;

   

// Basic robot definition
Robot = function(attribute, driver) {

    this.attribute = attribute;
    this.driver = driver;
    this.loc = {x: 0, y: 0};
    this.charge = 0;
}

Robot.prototype.onAttack = function(hurt) {
    if ('onAttack' in this.driver)
        this.driver.onAttack(hurt);    
        this.attribute.health -= hurt;
}

Robot.prototype.onAct = function() {
    return this.driver.act(this.attribute);
}

Robot.prototype.getName = function() {
    return this.driver.name;
}

Robot.prototype.isAlive = function() {
    return this.attribute.health > 0;
}

Robot.prototype.move = function(vector) {
    this.loc.x += vector.x;
    this.loc.y += vector.y;
}

Robot.prototype.consume = function(cost) {
    this.charge -= cost;
    return (this.charge >= 0);
}

Robot.prototype.recharge = function() {
    this.charge = this.attribute.energy;
}

exports.Robot = Robot;

