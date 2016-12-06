cc.game.onStart = function(){
  cc.LoaderScene.preload(g_mainmenu, function() {
    cc.director.runScene(new GameScene());
  }, this);
};
cc.game.run();

