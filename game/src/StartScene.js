var GameLayer = cc.Layer.extend({

    left_robot: null,
    right_robot: null,

    testWs: function() {

        var wsServer = 'ws://127.0.0.1:3000/echo';
        var websocket = new WebSocket(wsServer);
        websocket.onopen = function() {
            console.log('socket created');
            websocket.send(JSON.stringify({'name': 'tom'}));
        };
        websocket.onmessage = function(evt) {
            console.log(evt.data);
        }

    },

    ctor:function () {
        this._super();

        var size = cc.winSize;

          /*var helloLabel = new cc.LabelTTF("Hello World", "", 38);
          helloLabel.x = size.width / 2;
          helloLabel.y = size.height / 2;
          this.addChild(helloLabel);*/

        var sprite = cc.Sprite.create(res.background);
        sprite.setPosition(size.width / 2, size.height / 2);
        sprite.setScale(0.6);
        this.addChild(sprite, 0);

        this.left_robot = cc.Sprite.create(res.yellow_robot);
        this.left_robot.setPosition(size.width / 3, size.height / 2);
        this.left_robot.setRotation(90);
        this.left_robot.setScale(0.6);
        this.addChild(this.left_robot, 1);

        this.right_robot = cc.Sprite.create(res.blue_robot);
        this.right_robot.setPosition(size.width * 2 / 3, size.height / 2);
        this.right_robot.setRotation(270);
        this.right_robot.setScale(0.6);
        this.addChild(this.right_robot, 1);

        this.scheduleUpdate();
        this.testWs();
        return true;
    },

    update: function(dt) {
        this.left_robot.setPosition(this.left_robot.x + dt * 10, this.left_robot.y);
        //console.log(this.left_robot.x);
    }
});

var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        
        this.addChild(new GameLayer(), 0);
    }
});