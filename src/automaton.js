/**
 * Instance of a Cellular Automaton
 */
class Automaton {
    //initialize automaton with rule
    constructor(rule, size) {
        this.rule = rule;
        this.size = size;

        this.loadedChunks = [];

        if(!rule instanceof Function){
            console.error("Rule is not a function!");
        }
        if((!Number.isInteger(size)) || size < 1){
            console.error("Invalid chunk size: "+size);
        }
        

        
    }
    //increments the automaton by the number of steps
    step(steps = 1) {
        if((!Number.isInteger(steps)) || steps < 1){
            return;
        }

    }


}