// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Game= cc.Class({
    extends: cc.Component,

    properties: {
        mainSpeed:0,
        farSpeed:0,
        bgSpeed:0,
        nearSpeed:0,
        gravity:6400,
        level:0,
        score:0,
        hit:-1,
        speedPoints:12,
        combo:0,

        uiGroup:{
            default:null,
            type:cc.Node
        },

        camera:{
            default:null,
            type:cc.Node
        },
        wave:{
            default:null,
            type:cc.Node
        },
        player:{
            default:null,
            type:cc.Node
        },
        bird:{
            default:null,
            type:cc.Node
        },
        fly:{
            default:null,
            type:cc.Node
        }

    },
    getSpeedLevel(){
        return this.level;
    },
    init(){
        this.hit=-1;
        this.speedPoints=12;
        this.combo=0;
        this.score=0;
    },
    flower(fl,isPlayer){
        let target=this.fly.getChildByName(fl).getComponent("flay");
        target.node.stopAllActions();
        if(isPlayer){
            target.node.setPosition(this.player.x,this.player.y);
        }else{
            target.node.setPosition(0,0);
        }

        target.node.opacity=255;
        target.isShow=true;
        target.node.setScale(0.5);
        target.node.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2,1),cc.fadeTo(1.5,0),cc.moveBy(2,0,-600)),cc.callFunc(()=>{
            target.isShow=false;
        })))

    },
    fullFlower(){
        if(!this.fly.getChildByName("fly").getComponent("flay").isShow){
            this.flower("fly",true);
        }else if (!this.fly.getChildByName("fly_2").getComponent("flay").isShow){
            this.flower("fly_2",true);
        }
    },
    goodHit(){
        this.speedPoints+=2;
        this.score+=this.level*10;
        this.hit=1;
        this.combo=0;
        this.speedUpdate();
        this.updateUI();
    },
    perfectHit(){
        this.speedPoints+=4;
        this.combo++;
        this.score+=this.level*20*(1+((this.combo-1)/10));        //combo bonus!
        this.hit=0;
        this.speedUpdate();
        this.updateUI();
    },
    failHit(){
        this.combo=0;
        this.hit=2;
        this.speedDown();
        this.updateUI();
    },
    killBird(){
        let kill=this.uiGroup.getChildByName("hit_display_kill");
        kill.stopAllActions();
        kill.opacity=255;
        kill.scale=1.4;
        kill.runAction(cc.spawn(cc.scaleTo(0.6,1),cc.fadeTo(3,0)));

    },
    updateUI(){
        //console.log(this.uiGroup.getChildByName("score_text"));
        let scoreUI=this.uiGroup.getChildByName("score_text").getComponent(cc.RichText);
        let comboUI=this.uiGroup.getChildByName("combo_text").getComponent(cc.RichText);
        let levelUI=this.uiGroup.getChildByName("level_text").getComponent(cc.RichText);
        scoreUI.string=this.score.toString();
        comboUI.string=this.combo.toString();
        levelUI.string=this.level.toString();
        let boardUI=this.uiGroup.getChildByName("board");
        boardUI.stopAllActions();
        boardUI.setScale(1.05);
        boardUI.runAction(cc.scaleTo(0.6,1));
        this.uiGroup.getChildByName("hit_display_perfect").stopAllActions();
        this.uiGroup.getChildByName("hit_display_good").stopAllActions();
        this.uiGroup.getChildByName("hit_display_miss").stopAllActions();
        this.uiGroup.getChildByName("hit_display_perfect").x=-1400;
        this.uiGroup.getChildByName("hit_display_good").x=-1400;
        this.uiGroup.getChildByName("hit_display_miss").x=-1400;
        if(this.hit===0){//perfect
            this.uiGroup.getChildByName("hit_display_perfect").x=-820;
            this.uiGroup.getChildByName("hit_display_perfect").scale=1.4;
            this.uiGroup.getChildByName("hit_display_perfect").opacity=255;
            this.uiGroup.getChildByName("hit_display_perfect").runAction(cc.spawn(cc.scaleTo(0.6,1),cc.fadeTo(4,0)));
        }else if (this.hit===1){
            this.uiGroup.getChildByName("hit_display_good").x=-820;
            this.uiGroup.getChildByName("hit_display_good").scale=1.4;
            this.uiGroup.getChildByName("hit_display_good").opacity=255;
            this.uiGroup.getChildByName("hit_display_good").runAction(cc.spawn(cc.scaleTo(0.6,1),cc.fadeTo(4,0)));
        }else if (this.hit===2){
            this.uiGroup.getChildByName("hit_display_miss").x=-820;
            this.uiGroup.getChildByName("hit_display_miss").scale=1.4;
            this.uiGroup.getChildByName("hit_display_miss").opacity=255;
            this.uiGroup.getChildByName("hit_display_miss").runAction(cc.spawn(cc.scaleTo(0.6,1),cc.fadeTo(4,0)));
        }
    },
    speedUpdate(){
        if(this.speedPoints>this.level*this.level*2){
            this.setSpeed(this.level+1);
            console.log("Level Up!  -"+this.level);

            let seq = cc.sequence(cc.moveBy(0.8, -120, -10), cc.moveBy(2, 120, 10));
            this.camera.runAction(seq);
        }
    },
    speedDown(){     //one hit can bring player back to the speed before
        if(this.level>3) {
            if (true) {
                let temp = this.level - 1;
                this.speedPoints = (temp - 1) * (temp - 1) + 1;
                this.setSpeed(this.level - 1);

            }
        }

    },

    setSpeed(level){
        if(level<=6){
            this.mainSpeed=320*level;
            this.farSpeed=80*level;
            this.bgSpeed=40*level;
            this.nearSpeed=400*level;
            this.level=level;
        }else{
            let l =level-6;
            this.mainSpeed=1920+160*l;
            this.farSpeed=480+160*l;
            this.bgSpeed=240+160*l;
            this.nearSpeed=2400+160*l;
            this.level=level;
        }

    },
    die(){
        this.pauseGame();
        let endBG=this.uiGroup.getChildByName("end_bg");
        this.camera.stopAllActions();
        this.camera.setPosition(0,0);
        endBG.x=-2600;
        endBG.active=true;
        endBG.runAction(cc.sequence(cc.moveTo(0.8,0,0),cc.spawn(cc.fadeTo(1.2,255),cc.scaleTo(1.5,1,110)),cc.callFunc(this.showEndScreen,this)));



    },
    showEndScreen(){
        console.log(this.uiGroup.getChildByName("end_bg").x);
        let endScreen=this.uiGroup.getChildByName("end_screen");
        const that=this;
        endScreen.getChildByName("end_score").getComponent(cc.Label).string="Score  "+this.score;
        endScreen.getChildByName("restart_button").on('click',()=>{
            endScreen.getChildByName("restart_button").runAction(cc.sequence(cc.spawn(cc.scaleTo(1,18),cc.moveTo(1,0,0)),cc.callFunc(()=>{
                that.init();
                cc.director.loadScene("mainScene")
            })));
        });
        endScreen.active=true;
        endScreen.opacity=0;
        endScreen.runAction(cc.fadeTo(3,255));

    },
    pauseGame(){
        this.player.getComponent("player").enabled=false;
        this.bird.getChildByName("birds").getComponent("birds").enabled=false;
        this.wave.getChildByName("big_wave_sprite0").getComponent("wave_refresh").enabled=false;
        this.wave.getChildByName("big_wave_sprite1").getComponent("wave_refresh").enabled=false;
    },
    startGame(){
        this.player.getComponent("player").enabled=true;
        this.bird.getChildByName("birds").getComponent("birds").enabled=true;
        this.wave.getChildByName("big_wave_sprite0").getComponent("wave_refresh").enabled=true;
        this.wave.getChildByName("big_wave_sprite1").getComponent("wave_refresh").enabled=true;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    // update (dt) {},
});

let game=new Game();

module.exports = game;