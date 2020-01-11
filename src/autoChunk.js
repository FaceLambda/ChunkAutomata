
/**
 * Object that contains a group of cells
 */
class Chunk {
    constructor(size) {
        this.size = size;

        //board state, array of cells
        this.currentState = new Array(size * size).fill(null);
        this.nextState = new Array(size * size).fill(null);

        //boolean states for emptiness
        this.currEmpty = true;
        this.nextEmpty = true;
        
    }
    get isEmpty(){
        return this.currEmpty;
    }
    //preps for the next iteration of the automaton
    //for this chunk
    swap(){
        //swap arrays
        var tmp = this.currentState;
        this.currentState = this.nextState;
        this.nextState = tmp;

        //shift empty state
        this.currEmpty = this.nextEmpty;
        this.nextEmpty = true;
    }
    getState(x, y){
        var index = y * this.size + x;
        return this.currentState[y * this.size + x];
    }
    setCurrentState(x, y, state){
        this.currentState[y * this.size + x] = state;
    }
    setState(x, y, state){
        this.nextState[y * this.size + x] = state;
        if(state != null){
            this.nextEmpty = false;
        }
    }
    //checks to see if current state is empty, sets emptiness accordingly
    emptyCheck(){
        var i;
        var max = this.size * this.size;
        this.currEmpty = true;
        for(i = 0; i < max; i++){
            if(this.currentState[i] != null)
                this.currEmpty = false;
        }
    }

}