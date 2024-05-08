const GameDifficulty=[20,50,70];
class Game{
    difficulty;//grūtības pakāpe balstoties uz GameDifficulty array
    cols=3;//cik daudz kolonnu
    rows=3;//cik daudz līniju
    count;//līnijas*kolonas
    blocks;//html elementi kas atbilst className="puzzle_block"
    emptyBlockCoords=[2,2];//Koordinātes tukšajam kubikam
    indexes=[];//seko līdzi kubiciņu secībai

    constructor(difficultyLevel=1){
        this.difficulty=GameDifficulty[difficultyLevel-1];
        this.count=this.cols*this.rows;
        this.blocks=document.getElementsByClassName("puzzle_block");//tiek paņemti kubiciņi
        this.init();
    }

    init(){//novieto katru kubiciņu parreizajā vietā
        for(let y=0;y<this.rows;y++){
            for(let x=0;x<this.cols;x++){
                let blockIdx=x+y*this.cols;
                if(blockIdx+1>=this.count)break;
                let block=this.blocks[blockIdx];
                this.positionBlockAtCoord(blockIdx,x,y);
                block.addEventListener('click',(e)=>this.onClickOnBlock(blockIdx));
                this.indexes.push(blockIdx);
            }
        }
        this.indexes.push(this.count-1);
        this.randomize(this.difficulty);
    }

    randomize(iterationCount){//novieto randomā kubiciņus (x iterationCount)
        for(let i=0;i<iterationCount;i++){
            let randomBlockIdx=Math.floor(Math.random()*(this.count-1));
            let moved=this.moveBlock(randomBlockIdx);
            if(!moved)i--;
        }
    }

    moveBlock(blockIdx){//novieto kubiciņu un atgriež vērtību true ja kubiciņs var kustēties
        let block=this.blocks[blockIdx];
        let blockCoords=this.canMoveBlock(block);
        if(blockCoords!=null){
            this.positionBlockAtCoord(blockIdx,this.emptyBlockCoords[0],this.emptyBlockCoords[1]);
            this.indexes[this.emptyBlockCoords[0]+this.emptyBlockCoords[1]*this.cols]=this.indexes[blockCoords[0]+blockCoords[1]*this.cols];
            this.emptyBlockCoords[0]=blockCoords[0];
            this.emptyBlockCoords[1]=blockCoords[1];
            return true;
        }
        return false;
    }
    canMoveBlock(block){//atgriež kubiciņa koordinātes ja atļauts kubiciņam kustēties, ja nē, atgriež vērtību null
        let blockPos=[parseInt(block.style.left),parseInt(block.style.top)];
        let blockWidth=block.clientWidth;
        let blockCoords=[blockPos[0]/blockWidth,blockPos[1]/blockWidth];
        let diff=[Math.abs(blockCoords[0]-this.emptyBlockCoords[0]),Math.abs(blockCoords[1]-this.emptyBlockCoords[1])];
        let canMove=(diff[0]==1&&diff[1]==0)||(diff[0]==0&&diff[1]==1);
        if(canMove)return blockCoords;
        else return null;
    }

    positionBlockAtCoord(blockIdx,x,y){//novieto kubiciņu konkrētās koordinātēs
        let block=this.blocks[blockIdx];
        block.style.left=(x*block.clientWidth)+"px";
        block.style.top=(y*block.clientWidth)+"px";
    }

    onClickOnBlock(blockIdx){//pārbauda vai spēle ir uzvarēta
        if(this.moveBlock(blockIdx)){
            if(this.checkPuzzleSolved()){
                setTimeout(()=>alert("Apsveicam, tu uzvarēji!"),600);
            }
        }
    }

    checkPuzzleSolved(){//atgriež vērtību ja spēle ir uzvarēta
        for(let i=0;i<this.indexes.length;i++){
            if(i==this.emptyBlockCoords[0]+this.emptyBlockCoords[1]*this.cols)continue;
            if(this.indexes[i]!=i)return false;
        }
        return true;
    }

    setDifficulty(difficultyLevel){//iestata grūtības pakāpi
        this.difficulty=GameDifficulty[difficultyLevel-1];
        this.randomize(this.difficulty);
    }

}

var game=new Game(1);//tiek sākta jauna spēle


//grūtības pakāpju pogas
var difficulty_buttons=Array.from(document.getElementsByClassName("difficulty_button"));
difficulty_buttons.forEach((elem,idx)=>{
    elem.addEventListener('click',(e)=>{
        difficulty_buttons[GameDifficulty.indexOf(game.difficulty)].classList.remove("active");
        elem.classList.add("active");
        game.setDifficulty(idx+1);
    });
});