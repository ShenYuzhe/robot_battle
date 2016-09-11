basic = require('./basic')
DIRECTIONS = basic.DIRECTIONS;
ACTIONS = basic.ACTIONS;

// definition for action
exports.Driver = function(name) {
    
    this.name = name;

    this.onAttack = function(hurt) {
        console.log(this.name + ": I am hurt by " + hurt);
    }

    this.act = function(attribute) {
        return [];
    }

}

   

// Basic robot definition
exports.Robot = function(attribute, driver) {

    this.attribute = attribute;
    this.driver = driver;
    this.loc = {x: 0, y: 0};

    this.onAttack = function(hurt) {
        if ('onAttack' in driver)
            driver.onAttack(hurt);    
        this.attribute.health -= hurt;
    }
    
    this.onAct = function() {
        return this.driver.act(this.attribute);
    }

    this.getName = function() {
        return this.driver.name;
    }

    this.isAlive = function() {
        return this.attribute.health > 0;
    }
    
    this.move = function(vector) {
        this.loc.x += vector.x;
        this.loc.y += vector.y;
    }
}

