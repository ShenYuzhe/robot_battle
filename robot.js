basic = require('./basic')
DIRECTIONS = basic.DIRECTIONS;

// definition for action
Action = function(name) {
    
    this.name = name;

    this.onAttack = function(hurt) {
        console.log(this.name + ": I am hurt by " + hurt);
    }

    this.act = function(attribute) {
        return attribute.attack;
    }

}

// instance for agressive user
attributeAgressive = {
    'health': 300,
    'attack': 100
}

agressiveAction = new Action('tom');
agressiveAction.onAttack = function(hurt) {
    console.log('holy shit');
}    

attributeStrong = {
    'health': 500,
    'attack': 80
}

// instance for strong but gentle user
strongAction = new Action('Jerry');

// Basic robot definition
Robot = function(attribute, action) {
    
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

exports.aggressiveRobot = new Robot(attributeAgressive, agressiveAction);
exports.strongRobot = new Robot(attributeStrong, strongAction);
