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
        inAir:false,
        isJump:false,
        isOnWave:false,
        verticalSpeed:0,
        jumpCountDown:0,
        contactWave:null,
        goodFix:240,
        perfectFix:100,
        canDoubleJump:true,
    },
    onCollisionEnter:(other,self)=>{
        if(other.node.getComponent("wave_refresh")) {
            let n = self.node;
            let player = n.getComponent("player");
            player.contactWave = other.node;
            player.inAir = false;
            player.isOnWave = true;
            player.isJump = false;
            player.canDoubleJump = true;
            player.verticalSpeed = game.mainSpeed * 0.85;
        }
        else if(other.node.getComponent("birds")){
            let player = self.node.getComponent("player");
            if(player.isOnWave || player.verticalSpeed>=0){
                player.birdKiller(other.node)
            }else{
                console.log("hit bird");
                cc.director.getCollisionManager().enabled=false;
                player.die();
            }
        }
    }


    ,
    onCollisionExit:(other,self)=>{
        //console.log("Collision exit!");
        if(other.node.getComponent("wave_refresh")) {
            let n = self.node;
            let player = n.getComponent("player");
            player.inAir = true;
            player.isOnWave = false;
            //console.log(player.isJump);
            if (!player.isJump) {
                player.failJump();
            }
        }
    },
    goodJump(){
        game.flower("flower_up",true);
        game.goodHit();
    },
    perfectJump(){
        game.flower("flower_up",true);
        game.fullFlower();
        game.perfectHit();
    },
    failJump(){

        game.failHit();
    },
    playerJump(){
        //console.log("Jump!");
        if(!this.inAir && this.jumpCountDown===0){
            //console.log("Jump Done!");
            this.verticalSpeed+=1200;
            let seq=cc.sequence(cc.scaleTo(0.1,1.1,0.8),cc.scaleTo(0.4,0.9,1.2),cc.scaleTo(0.4,1,1));
            this.node.runAction(seq);
            this.inAir=true;
            this.isJump=true;
            this.jumpCountDown=36;


            //check hit
            if(this.isOnWave && this.contactWave){
                let height=380;
                if(this.contactWave.getComponent("wave_refresh").waveSize){
                    height=570;
                }
                let anchorFix=this.contactWave.y;
                height+=anchorFix; //anchor position
                console.log(this.goodFix+"||||"+this.perfectFix);
                let goodPos=height-this.goodFix;
                let perfectPos=height-this.perfectFix;
                console.log(goodPos+"||"+perfectPos);
                if(this.node.y>goodPos){
                    if(this.node.y>perfectPos){
                        this.perfectJump();
                        console.log("Perfect");
                    }else {
                        this.goodJump();
                        console.log("Good");
                    }
                }

            }
        }
        //double jump
        else if(this.inAir && this.canDoubleJump){
            console.log("Double Jump!");
            this.canDoubleJump=false;
            this.verticalSpeed=1800;
            this.node.stopAllActions();
            this.node.setScale(1);
            this.node.setRotation(0);
            this.node.runAction(cc.rotateBy(0.6,-360));
        }
    },
    die(){
        game.die();
    },
    birdKiller(birdNode){
        birdNode.x=-1400;
        // this.isJump=true;
        game.flower("flower_up",true);
        game.killBird();
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    start () {
        this.node.y=720;
        this.inAir=true;
        this.verticalSpeed=200;
    },
    onKeyDown:function(event){
        switch (event.keyCode){
            case cc.macro.KEY.space:
                //console.log("Space Input!");
                this.playerJump();
                break;
        }
    },

    update (dt) {
        let node=this.node;
        node.y+=this.verticalSpeed*dt;
        if(this.inAir){
            this.verticalSpeed-=game.gravity*dt;
        }




        if(node.y<=-480){
            node.y=-480;
            if(this.inAir && this.verticalSpeed<=-2000){
                game.flower("flower",true);

            }
            this.verticalSpeed=0;
            this.inAir=false;
            this.isJump=false;
            this.canDoubleJump=true;
        }
        if(this.jumpCountDown>0)this.jumpCountDown--;
    },
});
