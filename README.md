# robot_battle
Introduction
It's a robot game, where players are allowed to customized the behavior of their robots.
The Robot Battle Game is a platform providing apis for users to define their robots' behavior.
Users can write their own scripts to control their robots. Even with same attributes, robots can have different behavior.
So this game will be mostly the combat of player's intelligence instead of the powerful model of robots.

APIs
1. The first thing you want to do is creating a driver.

var sample_driver = new Driver('sampe_name');

2. Create an action function. This is the main functin for the Robot's behavior.

/*
attribute contains information for a robot model (e.g. attack, defense, speed)
context contains information for the whole battle (e.g. location of your enemy, the information of the battle board)
*/
sample_driver.act = function(attribute, context) {
  var behavior = [];
  
  // TODO: define the behavior from the basis of attribute and context information
  
  // the behavior which will be read, verificated by the playground
  return behavior;
}

3. Choices of actions
libs = require('../../libs').collect;

// Move to a target point
Move = libs.basic.Move;

sample_driver.act = function(attribute, context) {
  var behavior = [Move(target_location)];
    
  return behavior;
}

// Rotate by a incremental degree
Rotate = libs.basic.Rotate;

// attack enemy by a certain amount
Attack = libs.basic.Attack;

// defence
Defence = libs.basic.Defense;

In Summary, you will return a combination(an array) of all these actions to the playground.


4. sight
Your robot will only be able to see enemy in a certain range of sight ,which is defined by a robot model's attributes.
This means the better robot model you got the wider/farther eye sight you will got in context parameter.
Sight is defined by a sector(degree + vector)

TODO:
Current API is indicates a lot of math calculation for users. Thinking about simplify it.


