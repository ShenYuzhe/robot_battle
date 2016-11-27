var GameLayer = cc.Layer.extend({

    left_robot: null,
    left_health: null,
    right_robot: null,
    right_health: null,

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
        var zoomScale = 9;
        console.log(data);
        var leftRobotData = data.left_robot,
            rightRobotData = data.right_robot;
        this.left_robot.setPosition(leftRobotData.position.x * zoomScale,
            leftRobotData.position.y * zoomScale);
        this.left_robot.setRotation(leftRobotData.direction * 180 / Math.PI);
        this.right_robot.setPosition(rightRobotData.position.x * zoomScale,
            rightRobotData.position.y * zoomScale);
        this.right_robot.setRotation(rightRobotData.direction * 180 / Math.PI);
        this.left_health.setString('left health: ' + leftRobotData.health);
        this.right_health.setString('right health: ' + rightRobotData.health);
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

    initSprite: function(resource, position, degree, scale) {
        var sprite = cc.Sprite.create(resource);
        sprite.setPosition(position.x, position.y);
        sprite.setRotation(degree);
        sprite.setScale(scale);
        return sprite;
    },

    initHealth: function(robot, position) {

        var healthBar = cc.LabelTTF.create(robot + ' health ', 'Arial', 20);
        healthBar.setPosition(position.x, position.y);
        /*var healthBar =
            cc.ProgressTimer.create(this.initSprite(res.health_bar, position, 0, 0.4));
        healthBar.setType(cc.PROGRESS_TIMER_TYPE_BAR);
        healthBar.setBarChangeRate(cc.p(1, 0));
        healthBar.setMidpoint(cc.p(0, 0));
        
        healthBar.setPosition(cc.p(position.x, position.y)); 

        
        return healthBar;*/
        return healthBar;
    },

    ctor:function () {
        this._super();

        this.startFight(this);
        this.openChannel(this);

        var size = cc.winSize;

        var background = this.initSprite(res.background,
            {'x': size.width / 2, 'y': size.height / 2}, 0, 1);
        this.addChild(background, 0);

        this.left_robot = this.initSprite(res.yellow_robot,
            {'x': size.width / 3, 'y': size.height / 2}, 0, 0.6);
        this.addChild(this.left_robot, 1);

        this.right_robot = this.initSprite(res.blue_robot,
            {'x': size.width * 2 / 3, 'y': size.height / 2}, 0, 0.6);
        this.addChild(this.right_robot, 1);

        this.left_health = this.initHealth('left robot',
            {'x': size.width * 0.1, 'y': size.height * 0.9 });
        this.addChild(this.left_health, 1);

        this.right_health = this.initHealth('right robot',
            {'x': size.width * 0.8, 'y': size.height * 0.9});
        this.addChild(this.right_health, 1);

        this.scheduleUpdate();


       
        return true;
    },

    watchFight: function(ref) {
        if (this.webstate && null != this.token)
            this.websocket.send(JSON.stringify({'action': 'token', 'token': this.token}));
    },

    lastUpdateTime: null,

    update: function(dt) {
        var currTime = new Date().getTime();
        if (null == this.lastUpdateTime || currTime - this.lastUpdateTime >= 1000) {
            this.watchFight(this);
            this.lastUpdateTime = currTime;
        }
    }
});

var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        
        this.addChild(new GameLayer(), 0);
    }
});