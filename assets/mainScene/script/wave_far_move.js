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
        fix:1

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {


    },

    update (dt) {
        let node=this.node;
        let speed=game.farSpeed*this.fix;
        node.setPosition(node.getPosition().x-speed*dt,node.getPosition().y);
        if(node.getPosition().x+node.width<-1100){
            node.setPosition(node.getPosition().x+2*(node.width)-10,node.getPosition().y);
        }
    },
});
