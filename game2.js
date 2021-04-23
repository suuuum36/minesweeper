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
        mineNum.textContent = '남은 지뢰의 갯수 : ' + remainingMine;

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
            console.log(numArray);
        }

        makeRandomNum();
        
        function chunkArray(numArray, chunk_size){
            let index = 0;
            let arrayLength = numArray.length;
            bombArray = [];

            chunk_size *= 1;
            arrayLength *= 1;
            for (index = 0; index < arrayLength; index += chunk_size) {
                console.log(index);
                myChunk = numArray.slice(index, index+chunk_size);
                bombArray.push(myChunk);
            }

            console.log(bombArray);
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
                    cell['clicked'] = true;
                    block.classList.add('clicked');

                    if (cell['isMine'] === 1) {
                        return gameOver(1);
                    }
                    
                    const neighbors = getNeighbors(cell);
                    console.log(neighbors);
                    cell.block.textContent = neighbors.filter(neighbor => neighbor.isMine === 1).length;
                    mineCount = neighbors.filter(neighbor => neighbor.isMine === 1).length;

                    if (mineCount === 0) {
                        for (i=0; i<neighbors.length; i++) {
                            neighbors[i]['clicked'] =true;
                            neighbors[i]['block'].classList.add('clicked');
                        }
                    }
                    
                });
                
                //우클릭 깃발
                block.addEventListener('contextmenu', function(e) {
                    e.preventDefault();

                    let classCheck = block.classList.contains('clicked');
                    if (classCheck !== true) {
                        cell['marked'] = true;
                        block.classList.add('marked');
                        remainingMine--;
                        mineNum.textContent = '남은 지뢰의 갯수 : ' + remainingMine;
                    };

                });
            }
        }
    }
        

makeGame(5, 5, 3);


    confirm.addEventListener('click', function() {
        deleteGame();
        makeNewGame();

    });

    restart.addEventListener('click', function() {
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

        if(width2>=5 && width2<=30 && height2>=5 && height2<=30 && bombNum2>=0 && bombNum2<=width2*height2 && bombNum2 !== ""){
            console.log('makeGame 실행');
            makeGame(width2, height2, bombNum2);
        } else {
            alert('다시 입력해주세요');
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
        timer.textContent = '지속시간 : ' + timerNum + '초';
    }, 1000)


}

Game();