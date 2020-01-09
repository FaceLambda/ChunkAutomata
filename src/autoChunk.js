
/**
 * Object that contains a group of cells
 */
class Chunk {
    constructor(size) {
        this.size = size;

        //board state, array of cells
        this.currentState = [];
        this.nextState = [];

        //boolean states for emptiness
        this.currEmpty;
        this.nextEmpty;
        
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
        return this.currentState[y * size + x];
    }
    setState(x, y, state){
        this.nextState[y * size + x] = state;
        if(state != null){
            this.nextEmpty = false;
        }
    }

}