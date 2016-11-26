var GameLayer = cc.Layer.extend({

    left_robot: null,
    right_robot: null,

    startFight: function(callback) {

        var xhr = cc.loader.getXMLHttpRequest();  
        
        xhr.open("POST", "http://localhost:3000/fight?model1=strong&driver1=strong&model2=aggressive&driver2=aggressive");
        //xhr.open("GET", "www.google.com");
        var that = this;

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 207) {
                console.log(xhr.responseText);

                callback(JSON.parse(xhr.responseText));
            }
        };
        
        xhr.send();
    },

    websocket: null,
    webstate: false,

    watchFight: function(token) {

        var wsServer = 'ws://127.0.0.1:3000/watch';
        this.websocket  = new WebSocket(wsServer);
        that = this;
        this.websocket.onopen = function() {
            that.webstate = true;
            console.log('socket created');
            
        };
        this.websocket.onmessage = function(evt) {
            console.log(evt.data);
        }

    },

    token: null,

    ctor:function () {
        this._super();

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

        that = this;
        this.startFight( (res) => {

            console.log(res.battle_token);
            
            that.token = res.battle_token;
            this.watchFight(res.battle_token);
            //}, 10000);
            
        });        
        return true;
    },

    update: function(dt) {
        if (this.webstate && null != this.token)
            this.websocket.send(JSON.stringify({'action': 'token', 'token': this.token}));
            
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