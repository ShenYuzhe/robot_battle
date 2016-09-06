basic = require('./basic')
DIRECTIONS = basic.DIRECTIONS;
ACTIONS = basic.ACTIONS;

// definition for action
exports.Action = function(name) {
    
    this.name = name;

    this.onAttack = function(hurt) {
        console.log(this.name + ": I am hurt by " + hurt);
    }

    this.act = function(attribute) {
        return [];
    }

}

   

// Basic robot definition
exports.Robot = function(attribute, action) {

    this.attribute = attribute;
    this.action = action;
    this.loc = {x: 0, y: 0};

    this.onAttack = function(hurt) {
        if ('onAttack' in action)
            action.onAttack(hurt);    
        this.attribute.health -= hurt;
    }
    
    this.onAct = function() {
        return this.action.act(this.attribute);
    }

    this.getName = function() {
        return this.action.name;
    }

    this.isAlive = function() {
        return this.attribute.health > 0;
    }
    
    this.move = function(vector) {
        this.loc.x += vector.x;
        this.loc.y += vector.y;
    }
}

