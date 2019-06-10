// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


const game=require("game");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        game.setSpeed(2);
        let manager=cc.director.getCollisionManager();
        manager.enabled=true;
        game.uiGroup=this.node.getChildByName("UI");
        game.camera=this.node.getChildByName("Main Camera");
        game.bird=this.node.getChildByName("Killer");
        game.player=this.node.getChildByName("toto");
        game.wave=this.node.getChildByName("main_wave");
        game.fly=this.node.getChildByName("fly");
        game.uiGroup.getChildByName("start_btn").getComponent(cc.Button).node.on('click',(button)=>{
            game.startGame();
            button.enabled=false;
            button.node.runAction(cc.spawn(cc.scaleTo(0.6,20),cc.fadeOut(0.6),cc.callFunc(()=>{
                this.active=false;
            },button.node)))
        },game);
        game.uiGroup.getChildByName("end_bg").active=false;
        game.uiGroup.getChildByName("end_screen").active=false;
        game.pauseGame();

    },

    // update (dt) {},
});
