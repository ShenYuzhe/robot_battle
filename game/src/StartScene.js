/*var StartLayer = cc.Layer.extend({
    ctor: function() {
        var size = cc.director.getWinSize();
        var sprite = cc.Sprite.create(res.background);
        sprite.setPosition(size.width / 2, size.height / 2);
        sprite.setScale(0.8);
        this.addChild(sprite);

        var label = cc.LabelTTF.create("Hello World", "Arial", 40);
        label.setPosition(size.width / 2, size.height / 2);
        this.addChild(label);

        return true;
    }
});*/

var StartLayer = cc.Layer.extend({
      ctor:function () {
          this._super();

          var size = cc.winSize;

          /*var helloLabel = new cc.LabelTTF("Hello World", "", 38);
          helloLabel.x = size.width / 2;
          helloLabel.y = size.height / 2;
          this.addChild(helloLabel);*/

          var sprite = cc.Sprite.create(res.background);
        sprite.setPosition(size.width / 2, size.height / 2);
        sprite.setScale(0.8);
        this.addChild(sprite, 0);

        var label = cc.LabelTTF.create("Hello World", "Arial", 40);
        label.setPosition(size.width / 2, size.height / 2);
        this.addChild(label, 1);

        return true;

          return true;
      }
  });

var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        
        this.addChild(new StartLayer(), 0);
    }
});