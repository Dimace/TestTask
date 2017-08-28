var CellEl = (function () {
    function CellEl(_number, Xind, Yind, _cell) {
        this.num = _number;
        this.x = Xind;
        this.y = Yind;
        this.cell = _cell;
        this.active = true;
        this.bomb = false;
        this.check = false;
    }
    return CellEl;
}());
var MyMineSweeper = {
    init: function () {
        var H = 16;
        var bombs = Math.floor(H * H / 4);
        var placedBombs = bombs;
        this.generateGUI(H, placedBombs);
    },
    generateGUI: function (H, placedBombs) {
        var game = null;
        game = this.writeMainContainer();
        var gameCont = document.createElement('table');
        gameCont.className = 'game-cont';
        gameCont.insertRow(0);
        var gameField = gameCont.rows[0].insertCell(0);
        gameField.className = 'game-field';
        if (game != null)
            game.appendChild(gameCont);
        var board = this.generateField(H, placedBombs);
        board.cellSpacing = '0';
        board.className = 'game-board';
        gameField.appendChild(board);
    },
    generateField: function (H, left) {
        var self = this;
        var table = document.createElement('table');
        var t = [];
        var cell = [];
        for (var y = 0; y < H; y++) {
            var r = table.insertRow(y); //row
            var _loop_1 = function (x) {
                console.log(x + "-" + x % H);
                t.push(new CellEl(0, x % H, y, r.insertCell(x % H)));
                t[x].cell.onclick = function () {
                    if (t[x].active == true)
                        self.showInfo(t[x], x, t, H);
                };
            };
            for (var x = y * H; x < (y + 1) * H; x++) {
                _loop_1(x);
            }
        }
        do {
            var num = this.rand(0, Math.round(H * H - 1));
            if (!t[num].bomb) {
                t[num].num = 0;
                t[num].bomb = true;
                left--;
            }
        } while (left > 0);
        for (var y = 0; y < H; y++) {
            for (var x = 0; x < H; x++) {
                if (t[x + y * H].bomb) {
                    this.placeNumbers(t, x, y, H);
                }
            }
        }
        return table;
    },
    placeNumbers: function (t, x, y, H) {
        if (x > 0) {
            this.getElem(t, x - 1, y, 16).num++;
        }
        if (x < H - 1) {
            this.getElem(t, x + 1, y, 16).num++;
        }
        if (x > 0 && y > 0) {
            this.getElem(t, x - 1, y - 1, 16).num++;
        }
        if (y > 0) {
            this.getElem(t, x, y - 1, 16).num++;
        }
        if (y > 0 && x < H - 1) {
            this.getElem(t, x + 1, y - 1, 16).num++;
        }
        if (x > 0 && y < H - 1) {
            this.getElem(t, x - 1, y + 1, 16).num++;
        }
        if (y < H - 1) {
            this.getElem(t, x, y + 1, 16).num++;
        }
        if (x < H - 1 && y < H - 1) {
            this.getElem(t, x + 1, y + 1, 16).num++;
        }
    },
    showInfo: function (elem, x, t, H) {
        console.log("showInfo " + x);
        console.log("give x " + elem.x + "y " + elem.y + "n- " + (elem.y * H + elem.x));
        if (!elem.bomb) {
            if (elem.num > 0) {
                this.openCell(elem);
            }
            else {
                this.roll(elem, t, H);
            }
        }
        else {
            this.openCell(elem);
            this.gameOver(t);
        }
    },
    openCell: function (elem) {
        console.log("openCell");
        if (!elem.bomb) {
            if (elem.num > 0) {
                elem.cell.innerHTML = '<b>' + elem.num + '</b>';
            }
            else {
                elem.cell.innerHTML = ' ';
            }
            switch (elem.num) {
                case 1:
                    elem.cell.style.color = 'blue';
                    break;
                case 2:
                    elem.cell.style.color = 'green';
                    break;
                case 3:
                    elem.cell.style.color = 'red';
                    break;
                case 4:
                    elem.cell.style.color = 'dakrblue';
                    break;
                case 5:
                    elem.cell.style.color = 'pink';
                    break;
                case 6:
                    elem.cell.style.color = 'navy';
                    break;
                case 7:
                    elem.cell.style.color = 'brown';
                    break;
                case 8:
                    elem.cell.style.color = 'grey';
                    break;
                default:
                    elem.cell.style.color = 'black';
            }
        }
        else {
            elem.cell.innerHTML = '<b>M</b>';
        }
        elem.cell.style.background = '#d8e0ec';
    },
    writeMainContainer: function () {
        var html = '<div id="game" class="game"></div>';
        document.writeln(html);
        return document.getElementById('game');
    },
    rand: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    gameOver: function (t) {
        for (var i = 0; i < t.length; i++) {
            if (t[i].bomb) {
                this.openCell(t[i]);
                t[i].cell.style.background = 'red';
            }
            t[i].active = false;
        }
    },
    getElem: function (t, x, y, H) {
        console.log("give x " + x + "y " + y + "n-" + (y * H + x));
        return t[y * H + x];
    },
    roll: function (elem, t, H) {
        console.log("rolling");
        if (elem == undefined || elem.x < 0 || elem.y < 0 || elem.x >= 16 || elem.y >= 16) {
            return;
        }
        this.openCell(elem);
        if (elem.num > 0 && elem.bomb == false) {
            elem.cell.innerHTML = '<b>' + elem.num + '</b>';
            return;
        }
        if (elem.check) {
            return;
        }
        elem.check = true;
        if (elem.x - 1 >= 0)
            this.roll(this.getElem(t, elem.x - 1, elem.y, 16), t, H);
        if (elem.y + 1 < H)
            this.roll(this.getElem(t, elem.x, elem.y + 1, 16), t, H);
        if (elem.y - 1 >= 0)
            this.roll(this.getElem(t, elem.x, elem.y - 1, 16), t, H);
        if (elem.x + 1 < H)
            this.roll(this.getElem(t, elem.x + 1, elem.y, 16), t, H);
        if (elem.y - 1 >= 0 && elem.x - 1 >= 0)
            this.roll(this.getElem(t, elem.x - 1, elem.y - 1, 16), t, H);
        if (elem.y - 1 >= 0 && elem.x + 1 < H)
            this.roll(this.getElem(t, elem.x + 1, elem.y - 1, 16), t, H);
        if (elem.y + 1 < H && elem.x - 1 >= 0)
            this.roll(this.getElem(t, elem.x - 1, elem.y + 1, 16), t, H);
        if (elem.y + 1 < H && elem.x + 1 < H)
            this.roll(this.getElem(t, elem.x + 1, elem.y + 1, 16), t, H);
    }
};
