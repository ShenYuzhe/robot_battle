var PopLayer = cc.LayerColor.extend({  
    listener:null,  
    ctor:function(width, height){ 
        var size = cc.winSize;

        this._super(cc.color(0,0,0,180),width,height);
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

var CodeLayer = PopLayer.extend({  
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
        input = cc.EditBox.create(cc.size(150.00,50.00), new cc.Scale9Sprite(res.input_bar));
        input.setName("input");
        input.setPosition(position.x, position.y);
        input.setDelegate(this);
        input.setMaxLength(20);
        input.setPlaceHolder(defaultVal);
        input.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);//修改为不使用密文
        input.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
        input.fontColor = new cc.Color(0, 0, 0, 0);
        return input;
    },

    ctor:function(mainUI){  
        this._super(450, 320);
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
                console.log(self.leftInput.string);
                self.mainUI.startGame(leftRobotName, rightRobotName);
                console.log('ended');
            }  
        });  
  
        cc.eventManager.addListener(this.btnListener.clone(), this.play);  
    },  
    destroy:function(){  
        BaseLayer.prototype.destory.apply(this,arguments);
        this.removeChild(this.play);
        cc.eventManager.removeListener(this.btnListener);  
        this.removeFromParent();  
    }  
});

var WindoLayer = cc.Layer.extend({

    _popWindow: null,

    initSprite: function(resource, position, degree, scale) {
        var sprite = cc.Sprite.create(resource);
        sprite.setPosition(position.x, position.y);
        sprite.setRotation(degree);
        sprite.setScale(scale);
        return sprite;
    },

    initButton: function(position) {
        
        var buttonSprite = this.initSprite(res.submit_button, position, 0, 1);

        return cc.MenuItemSprite(buttonSprite, buttonSprite, buttonSprite, this.onSubmit, this);
    },

    test: function() {
        this.removeChild(this.popWindow);
    },

    ctor:function () {
        this._super();

        var size = cc.winSize;

        var background = this.initSprite(res.background,
            {'x': 450, 'y': 450}, 0, 1);
        console.log(background);
        this.addChild(background, 0);

        this.popWindow = new CodeLayer(this);
        this.addChild(this.popWindow);
        //this.initInputBar({'x': size.width * 0.1, 'y': size.height * 0.9}, 'left robot driver name');
        //this.initInputBar({'x': size.width * 0.1, 'y': size.height * 0.8}, 'right robot driver name');
        return true;
    },

    initSprite: function(resource, position, degree, scale) {
        var sprite = cc.Sprite.create(resource);
        sprite.setPosition(position.x, position.y);
        sprite.setRotation(degree);
        sprite.setScale(scale);
        return sprite;
    },

    onSubmit:function (pSender) {
        this.onButtonEffect();
        //var scene = new cc.Scene(new GameLayer);
        //scene.addChild(new AboutLayer());
        cc.director.runScene(new cc.TransitionFade(1.2, new GameScene()));
    }


    
});

var CodeScene = cc.Scene.extend({
    ctor: function(msg) {
        this._super();
        this.msg = msg;
    },
    onEnter: function() {
        this._super();
        
        this.addChild(new WindoLayer(), 0);
    }
});