const confirm = document.getElementById('confirm');
const restart = document.getElementById('restart');
const bombNum = document.getElementById('bomb').value;
const width = document.getElementById('width').value;
const height = document.getElementById('height').value;
const mineNum = document.getElementById('mineNum');
const timer = document.getElementById('timer');

let timerNum = 0;

function Game () {
    function makeGame(width, height, bombNum) {

        //지뢰 갯수
        let remainingMine = bombNum;
        mineNum.textContent = 'Remaining Mines : ' + remainingMine;

        const makeRandomNum = () => {
            //지뢰 랜덤 리스트 생성
            numArray = [];
            for (let i=1; i <= bombNum; i++) {
                numArray.push(1);
            }
            for (let i=1; i <= width*height-bombNum; i++) {
                numArray.push(0);
            }
            numArray.sort(() => Math.random() - 0.5)
            //console.log(numArray);
        }

        makeRandomNum();
        
        function chunkArray(numArray, dividingLength){
            let index = 0;
            let arrayLength = numArray.length;
            bombArray = [];

            dividingLength *= 1;
            arrayLength *= 1;
            for (index = 0; index < arrayLength; index += dividingLength) {
                tempArray = numArray.slice(index, index+dividingLength);
                bombArray.push(tempArray);
            }
            //console.log(bombArray);
        }
        chunkArray(numArray, width);

        rowArray = [];
        //열을 하나씩 만들면서 안에 블럭 생성
        for (let i = 0; i < height; i++) {
            const row = [];
            const rowDiv = document.createElement('div');
            gameBoard.appendChild(rowDiv);
            rowDiv.className = 'row';
            rowArray.push(row);
            
            for(let j=0; j < width; j++) {
                const block = document.createElement('div');
                block.className = 'block';
                rowDiv.appendChild(block);

                const cell = {
                    block,
                    x: j,
                    y: i,
                    clicked: false,
                    marked: false,
                    isMine: bombArray[i][j]
                }

                row.push(cell);

                block.addEventListener('click', function() {

                    let classCheck = block.classList.contains('marked');
                    if (classCheck !== true) {
                        cell['clicked'] = true;
                        block.classList.add('clicked');

                        if (cell['isMine'] === 1) {
                            allMineOpen();
                            const gameisOver = setTimeout (function () {
                                gameOver(1);
                            }, 100);
                        } else {
                            neighborOpen(cell);
                        }
                    }

                    mineClickedCheck(mineArray);
                });
                
                //우클릭 깃발
                block.addEventListener('contextmenu', function(e) {
                    e.preventDefault();

                    let classCheck = block.classList.contains('clicked');
                    let classFlag = block.classList.contains('marked');

                    if (classFlag) {
                        cell['marked'] = false;
                            block.classList.remove('marked');
                            remainingMine++;
                            mineNum.textContent = 'Remaining Mines : ' + remainingMine;
                    } else if (!classCheck) {
                            cell['marked'] = true;
                            block.classList.add('marked');
                            remainingMine--;
                            mineNum.textContent = 'Remaining Mines : ' + remainingMine;
                        }
                    mineClickedCheck(mineArray);
                });
            }
        }

        let mineArray = [];
        const finish = (rowArray) => {
            //console.log('게임끝함수');

            for (let i=0; i<rowArray.length; i++) {
                for(let j=0; j < rowArray[0].length; j++) {
                    if(rowArray[i][j]['isMine']) {
                        mineArray.push(rowArray[i][j]);
                    }
                }
            }
        }
        finish(rowArray);
        //console.log('지뢰목록 : ', mineArray);
    }
        

makeGame(5, 5, 3);


    confirm.addEventListener('click', function() {
        deleteGame();
        makeNewGame();

    });

    restart.addEventListener('click', function() {
        restartGame();
    })

    //기존 게임 제거
    const deleteGame = () => {
        const existingBlock = document.querySelector('.block');
        const existingRow = document.querySelectorAll('.row');
        if(existingBlock !== null){
            for (let i = 0; i < existingRow.length; i++) {
                existingRow[i].remove();
            }
        }
    }

    //새 게임판 생성
    const makeNewGame = () => {
        timerNum = 0;
        const bombNum2 = document.getElementById('bomb').value;
        const width2 = document.getElementById('width').value;
        const height2 = document.getElementById('height').value;

        if(width2>=5 && width2<=30 && height2>=5 && height2<=30 && bombNum2>0 && bombNum2<=width2*height2 && bombNum2 !== ""){
            //console.log('makeGame 실행');
            makeGame(width2, height2, bombNum2);
        } else if (width2<5 || width2>30 || height2<5 || height2>30){
            alert('판의 크기는 높이와 넓이 각 5이상 30이하입니다.');
            makeGame(5,5,3);
        } else {
            alert('지뢰의 개수를 다시 입력해주세요.');
            makeGame(5,5,3);
        }
    }

    //리스타트
    const restartGame = () => {
        deleteGame();
        timerNum = 0;

        const bombNum2 = document.getElementById('bomb').value;
        const width2 = document.getElementById('width').value;
        const height2 = document.getElementById('height').value;

        if(bombNum2 !== "" && width2 !== "" && height2!==""){
            makeGame(width2, height2, bombNum2);
        } else {
            makeGame(5,5,3);
        }
    }
        
    //지뢰 발견
    const gameOver = (bomb) => {
        if (bomb ===1) {
            alert('It is Bomb 💣 !!')
            timerNum = 0;
            deleteGame();
            
            const bombNum2 = document.getElementById('bomb').value;
            const width2 = document.getElementById('width').value;
            const height2 = document.getElementById('height').value;

            if(bombNum2 !== "" && width2 !== "" && height2!==""){
                makeGame(width2, height2, bombNum2);
            } else {
                makeGame(5,5,3);
            }
        };
    }

    //이웃 cell
    const getNeighbors = (cell) => {
        const x = cell.x;
        const y = cell.y;
        const board = document.getElementById('gameBoard');
        const row = document.querySelector('.row');
        let height = board.childElementCount;
        let width = row.childElementCount;
        height *= 1;
        width *= 1;

        const neighbors = [];

        for (let i = Math.max(0, y - 1); i <= Math.min(height - 1, y + 1); i++) {   
            for (let j = Math.max(0, x - 1); j <= Math.min(width -1, x + 1); j++) {
                if (x === j && y === i) continue;
                neighbors.push(rowArray[i][j]);
            }
        }
        return neighbors;
    }

    //타이머
    const timerFun = setInterval(function(){
        timerNum++;
        timer.textContent = 'Timer : ' + timerNum + '초';
    }, 1000)

    //게임 성공
    const mineClickedCheck = (mineArray) => {
        let mineNotClicked = 0;
        let justCellClicked = 0;

        for(let i=0; i < mineArray.length; i++) {
            if(mineArray[i]['clicked']===false) {
                mineNotClicked++;
            }
        }

        for (let i=0; i<rowArray.length; i++) {
            for(let j=0; j < rowArray[0].length; j++) {
                if(rowArray[i][j]['isMine']===0) {
                    if(rowArray[i][j]['clicked'] ) {
                        justCellClicked++;
                    }
                }
            }
        }

        if(mineNotClicked + justCellClicked === rowArray.length*rowArray[0].length) {
            allMineOpen();
            const finishedGame = setTimeout(function() {
                alert('지뢰찾기에 성공하셨습니다!');
                restartGame();
            }, 300)
        }
        //console.log('남은지뢰:', mineNotClicked, '클릭한셀:', justCellClicked);
    }


    //셀 열기
    const neighborOpen = (cell) => {
        const neighbors = getNeighbors(cell);
        mineCount = neighbors.filter(neighbor => neighbor.isMine === 1).length;
        
        if(mineCount > 0) {
            cell.block.textContent = mineCount;
        } else {
            for (let i=0; i < neighbors.length; i++) {
                cell.block.textContent = " ";
                neighbors[i]['clicked'] =true;
                neighbors[i]['block'].classList.add('clicked');
                
                if(neighbors[i]['block'].classList.contains('marked')) {
                    neighbors[i]['block'].classList.remove('marked');
                }

                if(neighbors[i]['block'].innerHTML=="" ) {
                    neighborOpen(neighbors[i]);
                }
            }
        }
    }

    //지뢰 오픈
    const allMineOpen = () => {
        for (let i=0; i<rowArray.length; i++) {
            for(let j=0; j<rowArray[0].length; j++) {
                if(rowArray[i][j]['isMine']===1) {
                    rowArray[i][j]['block'].classList.add('bomb');
                }
            }
        }
    }

}

Game();
