var currentWidth = 40
var colorOnOver = "#b9e87c"
var colorEven = "#77cf07"
var colorOdd = "#6ab609"
var colorRevealedEven = "#f3efa5"
var colorRevealedOdd = "#dedb99"


class Case{
    constructor (grid, row, col){
        this.grid = grid
        this.isBomb = false
        this.row = row
        this.col = col
        this.color = colorOdd
        this.revealedColor = colorRevealedOdd
        this.isMined = false
        this.value = 0
        this.isFlaged = false
        if ((this.col + this.row)%2 === 1){
            this.color = colorEven
            this.revealedColor = colorRevealedEven
        }
    }

    getMined(){
        return this.isMined
    }

    setFlaged(){
        if (!this.isMined){
            this.isFlaged = !this.isFlaged
        }
    }

    getFlaged(){
        return this.isFlaged
    }
    
    setValue(){
        var indices = [[this.row-1, this.col-1], [this.row-1, this.col], [this.row-1, this.col+1], [this.row, this.col-1], [this.row, this.col+1], [this.row+1, this.col-1], [this.row+1, this.col], [this.row+1, this.col+1]]
        var current = indices.pop()
        while (current){
            if (current[0] >= 0 && current[1] >= 0 && current[0] < this.grid.length && current[1] < this.grid.length){
                this.value += this.grid.grid[current[0]][current[1]].getBomb()
            }
            current = indices.pop()
        }
    }

    setMined(){
        console.log(`x : ${this.row} ${this.col}`)
        this.isMined = true
    }

    setBomb(){
        this.isBomb = true
    }

    getBomb(){
        return this.isBomb
    }

    update(){
        // if 0 then reveal everything
        //console.log(`x:${this.row} y:${this.col}`)
        if (this.value == 0){
            var indices = [[this.row-1, this.col-1], [this.row-1, this.col], [this.row-1, this.col+1], [this.row, this.col-1], [this.row, this.col+1], [this.row+1, this.col-1], [this.row+1, this.col], [this.row+1, this.col+1]]
            console.log(indices.toString())
            var current = indices.pop()
            while (current){
                if (current[0] >= 0 && current[1] >= 0 && current[0] < this.grid.length && current[1] < this.grid.length){
                    if (!this.grid.grid[current[0]][current[1]].getMined()){
                        this.grid.grid[current[0]][current[1]].setMined()
                        this.grid.grid[current[0]][current[1]].update()
                    }
                }
                current = indices.pop()
            }
        }
    }
    draw(context, mousePos){
        var x = this.col * currentWidth
        var y = this.row * currentWidth
        if (!this.isMined && !this.isFlaged){
            context.fillStyle = this.color
            if (x < mousePos[0] && mousePos[0] < x + currentWidth && y < mousePos[1] && mousePos[1] < y + currentWidth){
                context.fillStyle = colorOnOver
            }
            context.fillRect(x, y, currentWidth, currentWidth)
        }
        else if(this.isFlaged){
            context.fillStyle = "red"
            context.fillRect(x, y, currentWidth, currentWidth)
        }
    
        else {
            context.fillStyle = this.revealedColor
            context.fillRect(x, y, currentWidth, currentWidth)
            context.fillStyle = "red"
            context.font = `${currentWidth*1.20}px serif`
            var val = `${this.value}`
            if (this.isBomb){
                val = 'B'
            }
            else if (this.value == 0){
                val = ""
            }
            context.fillText(val, x, y + currentWidth)
        }
    }
    
}

export class Grid{
    constructor (length, bombNumber, game){
        this.game = game
        this.length = length
        this.bombNumber = bombNumber
        this.grid = []
        this.hasStarted = false
    }

    gen_grid() {
        // create the grid
        var temp_arr = []
        for (var i=0;i<this.length;i++){
            var temp_arr = []
            for (var j=0;j<this.length;j++){
                temp_arr.push(new Case(this, i, j))
            }
            this.grid.push(temp_arr)
        }
    }

    gen_bombs(){
        // only after first dig
        var bombNumber = this.bombNumber
        while (bombNumber > 0){
            let row = Math.floor(Math.random() * (this.length - 1))
            let col = Math.floor(Math.random() * (this.length - 1))
            if (!(this.grid[row][col].getBomb() || this.grid[row][col].getMined())){
                this.grid[row][col].setBomb()
                bombNumber --
            }
        }
        // create all case values
        for (var i=0;i<this.length;i++){
            for (var j=0;j<this.length;j++){
                this.grid[i][j].setValue()
            }
        }
        console.log(this.grid)
    }

    update(click, isRight){
        console.log(isRight)
        if (click[0] >= 0 && click[1] >= 0){
            var row = Math.floor(click[0]/currentWidth)
            var col = Math.floor(click[1]/currentWidth)
            console.log(row, col)
            // verifie que c'est une case valide
            if (row >= 0 && row < this.length && col >= 0 && col < this.length){
                if (!isRight){
                    // is left click
                    if (!this.grid[col][row].getFlaged()){
                        // si c'est une bombre alors loose
                        if (this.grid[col][row].getBomb()){
                            this.game.loose()
                        }
                        this.grid[col][row].setMined()
                        // si la game n'a pas commence
                        if (!this.hasStarted){
                            this.hasStarted = true
                            this.gen_bombs()
                        }
                        this.grid[col][row].update() // destroy next if necessary
                    }
                }
                else{
                    // is right
                    this.grid[col][row].setFlaged()
                }
            }
        }
    }

    draw(context, mousePos){
        for (var i=0;i<this.length;i++){
            for (var j=0;j<this.length;j++){
                this.grid[i][j].draw(context, mousePos)
            }
        }
        context.fillStyle ="red"
    }
    
}