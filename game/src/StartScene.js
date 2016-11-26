var GameLayer = cc.Layer.extend({

    left_robot: null,
    right_robot: null,

    token: null,

    sendRequest: function(url, method, callback) {
        var xhr = cc.loader.getXMLHttpRequest();  
        
        xhr.open(method, url);
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 207) {
                console.log(xhr.responseText);

                if (undefined != callback)
                    callback(JSON.parse(xhr.responseText));
            }
        };
        
        xhr.send();
    },

    startFight: function(ref) {
        var url = 'http://localhost:3000/fight?model1=strong&driver1=strong&model2=aggressive&driver2=aggressive';
        this.sendRequest(url, 'POST', (res) => {
            ref.token = res.battle_token;
        });
    },

    websocket: null,
    webstate: false,

    updateUI: function(data) {
        console.log(data);
        var leftRobotData = data.left_robot,
            rightRobotData = data.right_robot;
        this.left_robot.setPosition(leftRobotData.position.x, leftRobotData.position.y);
        this.left_robot.setRotation(leftRobotData.direction * 180 / Math.PI);
        this.right_robot.setPosition(rightRobotData.position.x, rightRobotData.position.y);
        this.right_robot.setRotation(rightRobotData.direction * 180 / Math.PI);
    },

    openChannel: function(ref) {

        var wsServer = 'ws://127.0.0.1:3000/watch';
        this.websocket  = new WebSocket(wsServer);
        this.websocket.onopen = function() {
            ref.webstate = true;
            console.log('socket created');
            
        };
        this.websocket.onmessage = function(evt) {
            var data = JSON.parse(evt.data);
            if (undefined != data.winner) {
                ref.websocket.close();
                ref.webstate = false;
            } else
                ref.updateUI(data);
        }

    },

    ctor:function () {
        this._super();

        this.startFight(this);
        this.openChannel(this);

        var size = cc.winSize;

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
       
        return true;
    },

    watchFight: function(ref) {
        if (this.webstate && null != this.token)
            this.websocket.send(JSON.stringify({'action': 'token', 'token': this.token}));
    },

    update: function(dt) {
        this.watchFight(this);
            
        this.left_robot.setPosition(this.left_robot.x + dt * 10, this.left_robot.y);
    }
});

var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        
        this.addChild(new GameLayer(), 0);
    }
});