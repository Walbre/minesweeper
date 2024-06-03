import {Grid} from "./grid.js"
import { InputHandler } from "./inputHandler.js";

window.addEventListener("load", function(){
    const fps = 25
    const canvas = this.document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 1000;

    class Game{
        constructor (width, height){
            this.width = width;
            this.height = height
            this.grid = new Grid(25, 100, this)
            this.grid.gen_grid()
            this.InputHandler = new InputHandler(canvas, ctx)
            this.lost = false
        }
        update(){
            var click = this.InputHandler.getClicks()
            while (click){
                this.grid.update(click, this.InputHandler.getFPressed())
                var click = this.InputHandler.getClicks()
            }
        }

        draw(context){
            this.grid.draw(context, this.InputHandler.mousePos)
            if (this.lost){
                context.fillStyle = "red"
                context.fillRect(0, 0, canvas.height, canvas.width)
            }
        }

        reset(){
            this.grid = new Grid(25, 100, this)
            this.grid.gen_grid()
            this.InputHandler = new InputHandler(canvas)
            this.lost = false
        }

        loose(){
            this.lost = true
        }
    }

    const game = new Game(canvas.width, canvas.height)

    document.getElementById('restart').onclick = function(){game.reset()}

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update()
        game.draw(ctx)
        setTimeout(() => {
            requestAnimationFrame(animate)
        }, 1000/fps)
        
    }
    animate()

});

/*
https://www.google.com/logos/fnbx/minesweeper/win_screen.png
https://www.google.com/logos/fnbx/minesweeper/lose_screen.png
https://www.google.com/logos/fnbx/minesweeper/flag_plant.png
https://www.google.com/logos/fnbx/minesweeper/incorrect_flag.png



https://www.google.com/logos/fnbx/minesweeper/cta.png
https://www.google.com/logos/fnbx/minesweeper/clock_icon.png
https://www.gstatic.com/images/icons/material/system/2x/volume_up_white_24dp.png
https://www.google.com/logos/fnbx/minesweeper/trophy_icon.png
*/