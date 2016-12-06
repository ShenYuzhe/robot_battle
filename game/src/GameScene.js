var PopBaseLayer = cc.LayerColor.extend({  
    listener:null,  
    ctor:function(width, height){ 
        var size = cc.winSize;

        this._super(cc.color(0,0,0,180),width, height);
        this.x = size.width / 4;
        this.y = size.height / 3;
        this.listener = cc.EventListener.create({  
            event: cc.EventListener.TOUCH_ONE_BY_ONE,  
            swallowTouches: true,  
            onTouchBegan: function (touch, event) {  
                return true;  
            },  
            onTouchEnded: function (touch, event) {  
            }  
        });  
  
        cc.eventManager.addListener(this.listener, this);  
  
    },  
  
    destory:function(){
        cc.eventManager.removeListener(this.listener);  
    }  
});

var PopupLayer = PopBaseLayer.extend({  
    listener:null,  
    btnListener:null,  
    play:null,  
    mainUI:null,
    desprition:null,

    initSprite: function(resource, position, degree, scale) {
        var sprite = new cc.Sprite(resource);
        sprite.setPosition(position.x, position.y);
        sprite.setRotation(degree);
        sprite.setScale(scale);
        return sprite;
    },

    initInputBar: function(position, defaultVal) {
        input = cc.EditBox.create(cc.size(150, 50), new cc.Scale9Sprite(res.input_bar));
        input.setName("input");
        input.setPosition(position.x, position.y);
        input.setDelegate(this);
        input.setMaxLength(20);
        input.setPlaceHolder(defaultVal);
        input.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
        input.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
        input.fontColor = new cc.Color(0, 0, 0, 0);
        return input;
    },

    ctor: function(mainUI){
        this._super(cc.winSize.width / 2, cc.winSize.height / 3);
        this.mainUI = mainUI;

        var size = cc.winSize;

        this.play = this.initSprite(res.play_png,
            {'x': 0.4 * size.width, 'y':  0.1 * size.height}, 0, 0.1);
        this.addChild(this.play); 

        this.leftInput = this.initInputBar({'x': 0.15 * cc.winSize.width, 'y': 0.3 * cc.winSize.height}, 'left robot');
        this.rightInput = this.initInputBar({'x': 0.15 * cc.winSize.width, 'y': 0.2 * cc.winSize.height}, 'left robot')
        this.addChild(this.leftInput);
        this.addChild(this.rightInput);
  
        var self = this;  
        this.btnListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,  
            swallowTouches: true,  
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();  
                var locationInNode = target.convertToNodeSpace(touch.getLocation());  
                var s = target.getContentSize();  
                var rect = cc.rect(0, 0, s.width, s.height);  
  
                if (cc.rectContainsPoint(rect, locationInNode)) {  
                    target.opacity = 180;  
                    return true;  
                }  
                return false;  
            },  
            onTouchEnded: function (touch, event) {
                self.destory();
                self.mainUI.startGame({'left_driver': self.leftInput.string, 'right_driver': self.rightInput.string});
            }  
        });  
  
        cc.eventManager.addListener(this.btnListener.clone(), this.play);  
    },

    destroy:function(){  
        BaseLayer.prototype.destory.apply(this,arguments);
        this.removeChild(this.play);
        cc.eventManager.removeListener(this.btnListener);
        //mainUI.removeChild(this);  
    }  
});

var GameLayer = cc.Layer.extend({

    left_robot: null,
    left_health: null,
    right_robot: null,
    right_health: null,

    token: null,

    robots: [],
    bullets: [],

    popWindow: null,

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
        var leftDriver = this._drivernames.left_driver,
            rightDriver = this._drivernames.right_driver;
        var url = 'http://localhost:3000/fight?model1=strong&driver1='
                    + leftDriver
                    + '&model2=aggressive&driver2='
                    + rightDriver;
        this.sendRequest(url, 'POST', (res) => {
            ref.token = res.battle_token;
        });
    },

    websocket: null,
    webstate: false,

    zoomPoint: function(point, scale) {
        point.x *= scale;
        point.y *= scale;
    },

    explode: function(robot) {
        /*cc.spriteFrameCache.addSpriteFrames(res.explosion_plist);
        console.log(res.explosion_png);
        var explosionTexture = cc.textureCache.addImage(res.explosion_png);
        this._explosions = new cc.SpriteBatchNode(explosionTexture);
        this._explosions.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.addChild(this._explosions);

        var animFrames = [];
        var str = "";
        for (var i = 1; i < 35; i++) {
            str = "explosion_" + (i < 10 ? ("0" + i) : i) + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            console.log(frame);
            animFrames.push(frame);
        }
        console.log(animFrames);
        var animation = new cc.Animation(animFrames, 0.04);
        robot.runAction(new cc.Animate(animation));*/
        this.removeChild(robot);
    },

    updateCraft: function(ref, data) {
        var zoomScale = 9;
        var leftRobotData = data.left_robot,
            rightRobotData = data.right_robot;

        this.zoomPoint(leftRobotData.position, zoomScale);
        this.zoomPoint(rightRobotData.position, zoomScale);

        var leftDestoryCb, rightDestoryCb;
        if (leftRobotData.health == 0)
            leftDestoryCb = function() {
                ref.explode(ref.left_robot);
            }

        if (rightRobotData.health == 0)
            rightDestoryCb = function() {
                ref.explode(ref.right_robot);
            }

        var leftBullet, rightBullet;
        if (leftRobotData.attack > 0)
            this.bullets.push(this.Bullet(this, leftRobotData.position, rightRobotData.position, rightDestoryCb));
        if (rightRobotData.attack > 0)
            this.bullets.push(this.Bullet(this, rightRobotData.position, leftRobotData.position, leftDestoryCb));
        this.robots.push(this.FlyObj(this.left_robot, this.left_robot.getPosition(), leftRobotData.position, 5,
            leftRobotData.rotation, undefined, function() {
                ref.left_health.setString('left health: ' + leftRobotData.health);
            }));

        this.robots.push(this.FlyObj(this.right_robot, this.right_robot.getPosition(), rightRobotData.position, 5,
            rightRobotData.rotation, undefined, function() {
                ref.right_health.setString('right health: ' + rightRobotData.health);
            }));

        /*this.left_robot.setPosition(leftRobotData.position.x, leftRobotData.position.y);
        this.left_robot.setRotation(leftRobotData.direction * (-180) / Math.PI);

        this.right_robot.setPosition(rightRobotData.position.x, rightRobotData.position.y);
        this.right_robot.setRotation(rightRobotData.direction * (-180) / Math.PI);

        this.left_health.setString('left health: ' + leftRobotData.health);
        this.right_health.setString('right health: ' + rightRobotData.health);

        var leftDestoryCb = null, rightDestoryCb = null;

        

        if (leftRobotData.attack > 0)
            this.bullets.push(this.Bullet(leftRobotData.position, rightRobotData.position, rightDestoryCb));
        if (rightRobotData.attack > 0)
            this.bullets.push(this.Bullet(rightRobotData.position, leftRobotData.position, leftDestoryCb));*/
    },

    calDegree: function(fromPoint, toPoint) {
        var dy = toPoint.y - fromPoint.y,
            dx = toPoint.x - fromPoint.x;
        return Math.atan2(dy, dx) * 180 / Math.PI;
    },

    calDistance: function(fromPoint, toPoint) {
        return Math.sqrt(
            Math.pow(toPoint.x - fromPoint.x, 2)
            + Math.pow(toPoint.y - fromPoint.y, 2)
        );
    },

    FlyObj: function(sprite, srcPt, tarPt, velocity, rotate, startCbk, endCbk) {
        var distance = this.calDistance(srcPt, tarPt),
            anglVelo = 10,
            dx = distance == 0 ? 0 : velocity * (tarPt.x - srcPt.x) / distance,
            dy = distance == 0 ? 0 : velocity * (tarPt.y - srcPt.y) / distance;
        
        /*if (undefined != rotate && rotate.degree < 0) {
            console.log(rotate.degree);
            rotate.degree = -rotate.degree
            rotate.isClockwise = !rotate.isClockwise;
        }*/

        return {
            'dx': dx,
            'dy': dy,
            'target': tarPt,

            'anglVelo': anglVelo,
            'rotate': rotate,
            
            'sprite': sprite,

            'started': false, 
            'startCbk': startCbk,
            'endCbk': endCbk
        }; 
    },

    Bullet: function(ref, fromPoint, toPoint, callback) {
        var velocity = 10,
            degree = this.calDegree(fromPoint, toPoint);

        var bullet = this.initSprite(res.bullet, fromPoint, degree, 0.6);
        
        
        return this.FlyObj(bullet, fromPoint, toPoint, velocity, undefined, function() {
                console.log('bullet created');
                ref.addChild(bullet, 1);
                cc.audioEngine.playEffect(cc.sys.os == cc.sys.OS_WP8 || cc.sys.os == cc.sys.OS_WINRT ? res.fireEffect_wav : res.fireEffect_mp3);
            }, function() {
                if (undefined != callback)
                    callback();
                ref.removeChild(bullet);
            });
    },

    updateFlyObj: function(flyObj) {
        
        var sprite = flyObj.sprite;
        var target = flyObj.target, rotate = flyObj.rotate,
            reached = false;

        if (!flyObj.started && undefined != flyObj.startCbk) {
            flyObj.startCbk();
            flyObj.started = true;
        }

        if (undefined != rotate && rotate.degree != 0) {
            console.log(rotate.degree);
            var currRotate = sprite.getRotationX(),
                clockCoef = rotate.isClockwise ? 1 : -1;
            var dAngl = Math.abs(rotate.degree) <= Math.abs(flyObj.anglVelo) ? rotate.degree : flyObj.anglVelo;
            rotate.degree -= (clockCoef * dAngl);
            sprite.setRotation(currRotate + clockCoef * dAngl);
        }

        if (Math.abs(flyObj.target.x - flyObj.sprite.x) <= Math.abs(flyObj.dx)) {
            sprite.setPosition(flyObj.target.x, flyObj.target.y);
            reached = true;
        } else
            sprite.setPosition(sprite.x + flyObj.dx, sprite.y + flyObj.dy);

        if (reached && (undefined == rotate || rotate.degree == 0)
            && undefined != flyObj.endCbk)
            flyObj.endCbk();
        else
            return flyObj;

    },

    /*updateBullet: function(bullet) {
        var sprite = bullet.sprite;
        sprite.setPosition(sprite.x + bullet.dx, sprite.y + bullet.dy);
        if (this.calDistance(sprite, bullet.target) <= 20 ) {
            this.removeChild(sprite, true);
            if (undefined != bullet.callback)
                bullet.callback();
        } else
            return bullet;
    },*/

    openChannel: function(ref) {

        var wsServer = 'ws://127.0.0.1:3000/watch';
        this.websocket  = new WebSocket(wsServer);
        this.websocket.onopen = function() {
            ref.webstate = true;
            console.log('socket created');
            
        };
        this.websocket.onmessage = function(evt) {
            var data = JSON.parse(evt.data);
            console.log(data);
            if (undefined != data.winner) {
                ref.websocket.close();
                ref.webstate = false;
                ref.destroy();
                ref.openPopWindow();
            } else
                ref.updateCraft(ref, data);
        }

    },

    destroy: function() {

        this.removeChild(this.left_robot);
        this.removeChild(this.right_robot);
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
        
        return healthBar;
    },

    /*initExplosion: function() {
        cc.spriteFrameCache.addSpriteFrames(res.explosion_plist);
        var animFrames = [];
        var str = "";
        for (var i = 1; i < 35; i++) {
            str = "explosion_" + (i < 10 ? ("0" + i) : i) + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 0.04);
        cc.animationCache.addAnimation(animation, "Explosion");
    },*/

    startGame: function(drivernames) {
        this.removeChild(this.popWindow);
        this.initBattleUI();
        this._drivernames = drivernames;
        this.startFight(this);
        this.openChannel(this);
    },

    initBattleUI: function() {
        var size = cc.winSize;

        this.left_robot = this.initSprite(res.yellow_robot,
            {'x': size.width / 3, 'y': size.height / 2}, 0, 0.6);
        this.addChild(this.left_robot, 1);

        this.right_robot = this.initSprite(res.blue_robot,
            {'x': size.width * 2 / 3, 'y': size.height / 2}, 180, 0.6);
        this.addChild(this.right_robot, 1);

        this.left_health = this.initHealth('left robot',
            {'x': size.width * 0.1, 'y': size.height * 0.9 });
        this.addChild(this.left_health, 1);

        this.right_health = this.initHealth('right robot',
            {'x': size.width * 0.8, 'y': size.height * 0.9});
        this.addChild(this.right_health, 1);
    },

    openPopWindow: function() {
        this.popWindow = new PopupLayer(this);
        this.addChild(this.popWindow);
    },

    ctor:function () {
        this._super();

        var size = cc.winSize;

        var background = this.initSprite(res.background,
            {'x': size.width / 2, 'y': size.height / 2}, 0, 1);
        this.addChild(background, 0);
        this.openPopWindow();

        this.scheduleUpdate();
       
        return true;
    },

    watchFight: function(ref) {
        if (this.webstate && null != this.token)
            this.websocket.send(JSON.stringify({'action': 'token', 'token': this.token}));
    },

    updateFlys: function(flys) {
        var len = flys.length;
        for (i = 0; i < len; i++) {
            var fly = this.updateFlyObj(flys.shift());
            if (undefined != fly)
                flys.push(fly);
        }
        
        return flys.length == 0;
    },

    update: function(dt) {
        if (this.updateFlys(this.robots))
            if (this.updateFlys(this.bullets))
                this.watchFight(this);
    }
});

var GameScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        this.addChild(new GameLayer(), 0);
    }
});