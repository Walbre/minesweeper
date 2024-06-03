export class InputHandler{
    constructor (canvas, context){
        this.canvas = canvas
        this.mousePos = [0, 0]
        window.addEventListener("mousemove", evt => {
            var rect = canvas.getBoundingClientRect();
            this.mousePos = [evt.clientX - rect.left, evt.clientY - rect.top]
        })
        this.Leftclicks = []
        window.addEventListener("click", evt=>{
            var rect = canvas.getBoundingClientRect();
            this.Leftclicks.push([evt.clientX - rect.left, evt.clientY - rect.top])
        })
        this.FPressed = false
        window.addEventListener("keypress", evt=>{
            if (evt.key === "f" || evt.key === " "){
                this.FPressed = !this.FPressed
                // temp
                if (this.FPressed){
                    document.getElementById("flag-aid").innerHTML = "Flag : active"
                }
                else{
                    document.getElementById("flag-aid").innerHTML = "Flag : unactive"
                }
                // end temp

            }
        })
    }

    getClicks(){
        return this.Leftclicks.shift()
    }


    getFPressed(){
        return this.FPressed
    }

}