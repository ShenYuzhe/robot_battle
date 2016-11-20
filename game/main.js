cc.game.onStart = function(){
  cc.LoaderScene.preload(g_mainmenu, function() {
    cc.director.runScene(new StartScene);
  }, this);
};
cc.game.run();

