basic = require('./basic')
DIRECTIONS = basic.DIRECTIONS;

// definition for action
exports.Action = function(name) {
    
    this.name = name;

    this.onAttack = function(hurt) {
        console.log(this.name + ": I am hurt by " + hurt);
    }

    this.act = function(attribute) {
        return attribute.attack;
    }

}

   

// Basic robot definition
exports.Robot = function(attribute, action) {
    
    this.attribute = attribute;
    this.action = action;

    this.onAttack = function(hurt) {
        if ('onAttack' in action)
            action.onAttack(hurt);    
        this.attribute.health -= hurt;
    }
    
    this.onAct = function() {
        return action.act(this.attribute);
    }

    this.getName = function() {
        return this.action.name;
    }

    this.isAlive = function() {
        return this.attribute.health > 0;
    }
}

