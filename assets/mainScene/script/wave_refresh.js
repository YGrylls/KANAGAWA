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
        anotherWave: {
            default: null,
            type: cc.Node
        },
        waveSize:true,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update (dt) {
        let node=this.node;
        let speed=game.mainSpeed;
        node.setPosition(node.getPosition().x-speed*dt,node.getPosition().y);
        if(node.getPosition().x+(node.width/2)<-1020){
            node.setPosition((this.anotherWave.getPosition().x+1600+Math.round(Math.random()*1600)),node.getPosition().y);
            if(Math.random()<0.5){
                this.waveSize=false;
                node.setScale(0.5,0.5);
            }else{
                this.waveSize=true;
                node.setScale(0.75,0.75);
            }

        }

    },
});
