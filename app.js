/*
    Created by: Mahdi Nazari
    E_mail: mahdinazari75@gmail.com
    ECMA Script 2015 (ES6)
*/

document.componentRegistery = {}
document.nextId = 0;

class Component {
    constructor() {
        this._id = ++document.nextId;
        document.componentRegistery[this._id] = this;
    }
}

class Cell extends Component {
    constructor(cellData, turn) {
        super(cellData, turn);
        this.cellData = cellData;
        this.turn = turn;
    }

    render() {
        return (`
            <div 
                class="cell ${this.cellData[0].split("-").join(" ")} ${this.cellData[1]}"
                onClick="document.componentRegistery['1'].fillCell('${[this.cellData[0],this.turn]}')"
            >
            </div>
        `)
    }

}

class Grid extends Component {
    constructor(props, turn) {
        super(props, turn);
        this.cells = props;
        this.turn = turn;
    }
    render() {
        let cells = this.cells;
        return (`
            <div class="grid">
                ${Object.entries(cells).map(item=>new Cell(item,this.turn).render()).join('')}
            </div>
        `)
    }
}

class Score extends Component {
    constructor(props) {
        super(props);
        this.score = props;
    }
    render() {
        return (`
            <div class="score">
                <div class="player1-score">Player 1<br/>${this.score.player1}</div>
                <div> = <br/>${this.score.equal}</div>
                <div class="player2-score">Player 2<br/>${this.score.player2}</div>
            </div>
        `)
    }
}


class App extends Component {
    constructor(props) {
        super(props);
        this.rootId = props;
        this.state = {
            score: {
                player1: 0,
                player2: 0,
                equal: 0
            },
            cells: {
                "left-top": "free",
                "center-top": "free",
                "right-top": "free",
                "left-middle": "free",
                "center-middle": "free",
                "right-middle": "free",
                "left-bottom": "free",
                "center-bottom": "free",
                "right-bottom": "free"
            },
            turn: 'player1',
            cellfilledCount: 0
        }
    }
    render() {
        const rootData = `
            <div>
                ${new Grid(this.state.cells,this.state.turn).render()}
                ${new Score(this.state.score).render()}
            </div>
        `;
        document.getElementById(this.rootId).innerHTML = rootData;
    }

    run() {
        this.render();
    }

    getRoundWinner() {
        const cells = this.state.cells;
        const players = {}
        const winSenarios = [
            ["left-top", "center-top", "right-top"],
            ["left-middle", "center-middle", "right-middle"],
            ["left-bottom", "center-bottom", "right-bottom"],

            ["left-top", "left-middle", "left-bottom"],
            ["center-top", "center-middle", "center-bottom"],
            ["right-top", "right-middle", "right-bottom"],

            ["left-top", "center-middle", "right-bottom"],
            ["right-top", "center-middle", "left-bottom"]
        ]
        let winner = null;
        var findOne = function(haystack, arr) {
            return arr.every(function(v) {
                return haystack.indexOf(v) >= 0;
            });
        };

        for (const cell of Object.entries(cells)) {
            if (cell[1] !== "free") {
                if (players[cell[1]] === undefined) {
                    players[cell[1]] = [cell[0]];
                } else {
                    players[cell[1]].push(cell[0]);
                }
            }
        }
        for (const player of Object.entries(players)) {
            let checkPlayer = winSenarios.some(item => findOne(player[1], item));
            if (checkPlayer) {
                winner = player[0];
                break;
            }
        }
        this.state.cellfilledCount += 1;
        if (winner === null && this.state.cellfilledCount === 9) {
            winner = "equal";
        }

        return winner;
    }

    resetGrid() {
        window.setTimeout(() => {
            this.state.cells = {
                "left-top": "free",
                "center-top": "free",
                "right-top": "free",
                "left-middle": "free",
                "center-middle": "free",
                "right-middle": "free",
                "left-bottom": "free",
                "center-bottom": "free",
                "right-bottom": "free"
            };
            this.state.cellfilledCount = 0;
            this.render();
        }, 1000)

    }

    fillCell(cellData) {
        let cellDataArray = cellData.split(',');
        if (this.state.cells[cellDataArray[0]] === "free") {
            this.state.cells[cellDataArray[0]] = cellDataArray[1];
            this.state.turn === "player1" ? this.state.turn = "player2" : this.state.turn = "player1";
            this.render();
            let winner = this.getRoundWinner();
            if (winner === "player1") {
                this.resetGrid();
                this.state.score.player1 = this.state.score.player1 + 1;
            } else if (winner === "player2") {
                this.resetGrid();
                this.state.score.player2 = this.state.score.player2 + 1;
            } else if (winner === "equal") {
                this.resetGrid();
                this.state.score.equal = this.state.score.equal + 1;
            }
        }

    }
}


const myApp = new App('root');

myApp.run();