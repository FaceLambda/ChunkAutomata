/**
 * Instance of a Cellular Automaton
 */
class Automaton {
    //initialize automaton with rule
    constructor(rule, size) {
        this.rule = rule;
        this.size = size;
        
        /*
          contains all the loaded chunks.
          the implementation of this compels my soul to
          escape my body to achieve some degree of inner
          peace that I lost while typing this simple
          initialization.
        */
        this.loadedChunks = {};
        //store newly born chunks here instead of above. (logic for step())
        this.bufferedChunks = {};


        /*
          simple checks - here really only to help me
          pretend I care about other people's screw-ups.
        */
        if(!rule instanceof Function){
            console.error("Rule is not a function!");
        }
        if((!Number.isInteger(size)) || size < 1){
            console.error("Invalid chunk size: "+size);
        }
        

        
    }
    //increments the automaton by the number of steps
    step(steps = 1) {
        if(!Number.isInteger(steps)){
            return;
        }
        while(steps > 0){
            steps--;
            /*
              each property of loadedChunks is keyed with a 2 element
              int array for location
            */
            for(var key in this.loadedChunks){
                var coord = key.split(",");
                var chunk = this.loadedChunks[coord];
                if(chunk.isEmpty){
                    updateChunkEmpty(coord, chunk, this);
                }else{
                    updateChunkFilled(coord, chunk, this);
                }

            }
            /*
              handle newly created chunks: update and then add to
              loadedChunks.
             */
            for(var key in this.bufferedChunks){
                var coord = key.split(",");
                var chunk = this.bufferedChunks[coord];
                updateChunkEmpty(coord, chunk, this);
                this.loadedChunks[coord] = chunk;
            }
            this.bufferedChunks = {};
            /*
              set each chunk's current buffer to the next one
            */
            for(var key in this.loadedChunks){
                var coord = key.split(",");
                this.loadedChunks[coord].swap();

            }
        }
    }

    /*
      gets the chunk at the specified location. if the chunk
      is unloaded, returns undefined. x and y are expected
      to be integers, but no type checking is done.
    */
    getChunk(x, y){
        var coords = [x,y];
        return this.loadedChunks[coords];
    }

    /*
      gets the cell state of the cell at the given position.
      x and y are expected to be integers, but no type checking
      is done. If the chunk is unloaded, then null is returned.
    */
    getCell(x, y){
        var coords = [Math.floor(x/this.size),Math.floor(y/this.size)];
        var chunk = this.loadedChunks[coords];
        if(chunk == null){
            return null;
        }
        x -= coords[0] * this.size;
        y -= coords[1] * this.size;
        return chunk.getState(x,y);
    }
    
    /*
      sets the cell state of the cell at the given position.
      x and y are expected to be integers, but no type checking
      is done. If the chunk is unloaded, then the chunk is loaded.
    */
    setCell(x, y, state){
        var coords = [Math.floor(x/this.size),Math.floor(y/this.size)];
        x -= coords[0] * this.size;
        y -= coords[1] * this.size;
        if(this.loadedChunks[coords] == null){
            this.loadedChunks[coords] = new Chunk(this.size);
        }
        this.loadedChunks[coords].setCurrentState(x,y,state);
        this.loadedChunks[coords].emptyCheck();
        return;
    }


}

var updateChunkEmpty = function(coords, chunk, automaton){
    //get neighbors
    coords[0]++;//>
    var right = automaton.loadedChunks[coords];
    coords[1]++;//^
    var topright = automaton.loadedChunks[coords];
    coords[0]--;//<
    var top = automaton.loadedChunks[coords];
    coords[0]--;//<
    var topleft = automaton.loadedChunks[coords];
    coords[1]--;//V
    var left = automaton.loadedChunks[coords];
    coords[1]--;//V
    var botleft = automaton.loadedChunks[coords];
    coords[0]++;//>
    var bot = automaton.loadedChunks[coords];
    coords[0]++;//>
    var botright = automaton.loadedChunks[coords];
    coords[1]++;//^
    coords[0]--;//<
    //check to ensure at least one neighbor is nonempty and loaded
    var persist = false;
    //if not null and if not empty, the corresponding var should be true
    var rNul = right !== undefined && (!right.isEmpty),
        trNul = topright !== undefined && (!topright.isEmpty),
        tNul = top !== undefined && (!top.isEmpty),
        tlNul = topleft !== undefined && (!topleft.isEmpty),
        lNul = left !== undefined && (!left.isEmpty),
        blNul = botleft !== undefined && (!botleft.isEmpty),
        bNul = bot !== undefined && (!bot.isEmpty),
        brNul = botright !== undefined && (!botright.isEmpty),

    x, y, sm1 = automaton.size - 1, neighbors = [];
    //define any chunks that are undefined as empty chunks
    if(right === undefined) right = new Chunk(automaton.size);
    if(topright === undefined) topright = new Chunk(automaton.size);
    if(top === undefined) top = new Chunk(automaton.size);
    if(topleft === undefined) topleft = new Chunk(automaton.size);
    if(left === undefined) left = new Chunk(automaton.size);
    if(botleft === undefined) botleft = new Chunk(automaton.size);
    if(bot === undefined) bot = new Chunk(automaton.size);
    if(botright === undefined) botright = new Chunk(automaton.size);

    if(rNul){
        persist = true;    
        //right column
        for(y = 1; y < sm1; y++){
            neighbors[0] = chunk.getState(sm1-1,y-1);
            neighbors[1] = chunk.getState(sm1,y-1);
            neighbors[2] = right.getState(0,y-1);
            neighbors[3] = chunk.getState(sm1-1,y);
            neighbors[4] = chunk.getState(sm1,y);
            neighbors[5] = right.getState(0,y);
            neighbors[6] = chunk.getState(sm1-1,y+1);
            neighbors[7] = chunk.getState(sm1,y+1);
            neighbors[8] = right.getState(0,y+1);
            chunk.setState(sm1, y, automaton.rule(neighbors));
        }
    }
    if(rNul || trNul || tNul){
        persist = true;
        //corners: top right
        neighbors[0] = chunk.getState(sm1-1,sm1-1);
        neighbors[1] = chunk.getState(sm1,sm1-1);
        neighbors[2] = right.getState(0,sm1-1);
        neighbors[3] = chunk.getState(sm1-1,sm1);
        neighbors[4] = chunk.getState(sm1,sm1);
        neighbors[5] = right.getState(0,sm1);
        neighbors[6] = top.getState(sm1-1,0);
        neighbors[7] = top.getState(sm1,0);
        neighbors[8] = topright.getState(0,0);
        chunk.setState(sm1, sm1, automaton.rule(neighbors));
    }
    if(tNul){
        persist = true;
        //top row
        for(x = 1; x < sm1; x++){
            neighbors[0] = chunk.getState(x-1,sm1-1);
            neighbors[1] = chunk.getState(x,sm1-1);
            neighbors[2] = chunk.getState(x+1,sm1-1);
            neighbors[3] = chunk.getState(x-1,sm1);
            neighbors[4] = chunk.getState(x,sm1);
            neighbors[5] = chunk.getState(x+1,sm1);
            neighbors[6] = top.getState(x-1,0);
            neighbors[7] = top.getState(x,0);
            neighbors[8] = top.getState(x+1,0);
            chunk.setState(x, sm1, automaton.rule(neighbors));
        }
    }
    if(tNul || tlNul || tlNul){
        persist = true;
            //corners: top left
            neighbors[0] = left.getState(sm1,sm1-1);
            neighbors[1] = chunk.getState(0,sm1-1);
            neighbors[2] = chunk.getState(1,sm1-1);
            neighbors[3] = left.getState(sm1,sm1);
            neighbors[4] = chunk.getState(0,sm1);
            neighbors[5] = chunk.getState(1,sm1);
            neighbors[6] = topleft.getState(sm1,0);
            neighbors[7] = top.getState(0,0);
            neighbors[8] = top.getState(1,0);
            chunk.setState(0, sm1, automaton.rule(neighbors));
    }
    if(lNul){
        persist = true;
        //left column
        for(y = 1; y < sm1; y++){
            neighbors[0] = left.getState(sm1,y-1);
            neighbors[1] = chunk.getState(0,y-1);
            neighbors[2] = chunk.getState(1,y-1);
            neighbors[3] = left.getState(sm1,y);
            neighbors[4] = chunk.getState(0,y);
            neighbors[5] = chunk.getState(1,y);
            neighbors[6] = left.getState(sm1,y+1);
            neighbors[7] = chunk.getState(0,y+1);
            neighbors[8] = chunk.getState(1,y+1);
            chunk.setState(0, y, automaton.rule(neighbors));
        }
    }
    if(lNul || blNul || bNul){
        persist = true;
        //corners: bottom left
        neighbors[0] = botleft.getState(sm1,sm1);
        neighbors[1] = bot.getState(0,sm1);
        neighbors[2] = bot.getState(1,sm1);
        neighbors[3] = left.getState(sm1,0);
        neighbors[4] = chunk.getState(0,0);
        neighbors[5] = chunk.getState(1,0);
        neighbors[6] = left.getState(sm1,1);
        neighbors[7] = chunk.getState(0,1);
        neighbors[8] = chunk.getState(1,1);
        chunk.setState(0, 0, automaton.rule(neighbors));
    }
    if(bNul){
        persist = true;
        //bottom row
        for(x = 1; x < sm1; x++){
            neighbors[0] = bot.getState(x-1,sm1);
            neighbors[1] = bot.getState(x,sm1);
            neighbors[2] = bot.getState(x+1,sm1);
            neighbors[3] = chunk.getState(x-1,0);
            neighbors[4] = chunk.getState(x,0);
            neighbors[5] = chunk.getState(x+1,0);
            neighbors[6] = chunk.getState(x-1,1);
            neighbors[7] = chunk.getState(x,1);
            neighbors[8] = chunk.getState(x+1,1);
            chunk.setState(x, 0, automaton.rule(neighbors));
        }
    }
    if(bNul || brNul || rNul){
        persist = true;
        //corners: bottom right
        neighbors[0] = bot.getState(sm1-1,sm1);
        neighbors[1] = bot.getState(sm1,sm1);
        neighbors[2] = botright.getState(0,sm1);
        neighbors[3] = chunk.getState(sm1-1,0);
        neighbors[4] = chunk.getState(sm1,0);
        neighbors[5] = right.getState(0,0);
        neighbors[6] = chunk.getState(sm1-1,1);
        neighbors[7] = chunk.getState(sm1,1);
        neighbors[8] = right.getState(0,1);
        chunk.setState(sm1, 0, automaton.rule(neighbors));
    }
    //if not persist, delete
    if(!persist){
        delete automaton.loadedChunks[coords];
    }
}

/**
  helper method: retrieves chunk- if loaded, returns it,
  otherwise creates a new one and buffers it.
*/
var loadOrGenChunk = function(automaton, coords){
    if(automaton.loadedChunks[coords] === undefined){
        automaton.bufferedChunks[coords] = new Chunk(automaton.size);
        return automaton.bufferedChunks[coords];
    }
    return automaton.loadedChunks[coords];
}

/**
  iterates over each cell in chunk and loads the next state
  this function is not meant to be called by people who
  don't know what this does.
*/
var updateChunkFilled = function(coords, chunk, automaton){
    //get neighbors
    var loc = [coords[0],coords[1]];
    loc[0]++;//>
    var right = loadOrGenChunk(automaton, loc);
    loc[1]++;//^
    var topright = loadOrGenChunk(automaton, loc);
    loc[0]--;//<
    var top = loadOrGenChunk(automaton, loc);
    loc[0]--;//<
    var topleft = loadOrGenChunk(automaton, loc);
    loc[1]--;//V
    var left = loadOrGenChunk(automaton, loc);
    loc[1]--;//V
    var botleft = loadOrGenChunk(automaton, loc);
    loc[0]++;//>
    var bot = loadOrGenChunk(automaton, loc);
    loc[0]++;//>
    var botright = loadOrGenChunk(automaton, loc);
    
    //this will hold all adjacent
    var neighbors = [];

    //iterate over every cell
    var x;
    var y;
    //chunksize minus one
    var sm1 = automaton.size - 1;
    //do the main bulk of the center
    for(y = 1; y < sm1; y++){
        for(x = 1; x < sm1; x++){
            neighbors[0] = chunk.getState(x-1,y-1);
            neighbors[1] = chunk.getState(x  ,y-1);
            neighbors[2] = chunk.getState(x+1,y-1);
            neighbors[3] = chunk.getState(x-1,y  );
            neighbors[4] = chunk.getState(x  ,y  );
            neighbors[5] = chunk.getState(x+1,y  );
            neighbors[6] = chunk.getState(x-1,y+1);
            neighbors[7] = chunk.getState(x  ,y+1);
            neighbors[8] = chunk.getState(x+1,y+1);
            chunk.setState(x, y, automaton.rule(neighbors));
        }
    }
    //corners: bottom left
    neighbors[0] = botleft.getState(sm1,sm1);
    neighbors[1] = bot.getState(0,sm1);
    neighbors[2] = bot.getState(1,sm1);
    neighbors[3] = left.getState(sm1,0);
    neighbors[4] = chunk.getState(0,0);
    neighbors[5] = chunk.getState(1,0);
    neighbors[6] = left.getState(sm1,1);
    neighbors[7] = chunk.getState(0,1);
    neighbors[8] = chunk.getState(1,1);
    chunk.setState(0, 0, automaton.rule(neighbors));
    
    //corners: bottom right
    neighbors[0] = bot.getState(sm1-1,sm1);
    neighbors[1] = bot.getState(sm1,sm1);
    neighbors[2] = botright.getState(0,sm1);
    neighbors[3] = chunk.getState(sm1-1,0);
    neighbors[4] = chunk.getState(sm1,0);
    neighbors[5] = right.getState(0,0);
    neighbors[6] = chunk.getState(sm1-1,1);
    neighbors[7] = chunk.getState(sm1,1);
    neighbors[8] = right.getState(0,1);
    chunk.setState(sm1, 0, automaton.rule(neighbors));

    //corners: top left
    neighbors[0] = left.getState(sm1,sm1-1);
    neighbors[1] = chunk.getState(0,sm1-1);
    neighbors[2] = chunk.getState(1,sm1-1);
    neighbors[3] = left.getState(sm1,sm1);
    neighbors[4] = chunk.getState(0,sm1);
    neighbors[5] = chunk.getState(1,sm1);
    neighbors[6] = topleft.getState(sm1,0);
    neighbors[7] = top.getState(0,0);
    neighbors[8] = top.getState(1,0);
    chunk.setState(0, sm1, automaton.rule(neighbors));
    
    
    //corners: top right
    neighbors[0] = chunk.getState(sm1-1,sm1-1);
    neighbors[1] = chunk.getState(sm1,sm1-1);
    neighbors[2] = right.getState(0,sm1-1);
    neighbors[3] = chunk.getState(sm1-1,sm1);
    neighbors[4] = chunk.getState(sm1,sm1);
    neighbors[5] = right.getState(0,sm1);
    neighbors[6] = top.getState(sm1-1,0);
    neighbors[7] = top.getState(sm1,0);
    neighbors[8] = topright.getState(0,0);
    chunk.setState(sm1, sm1, automaton.rule(neighbors));

    //bottom row
    for(x = 1; x < sm1; x++){
        neighbors[0] = bot.getState(x-1,sm1);
        neighbors[1] = bot.getState(x,sm1);
        neighbors[2] = bot.getState(x+1,sm1);
        neighbors[3] = chunk.getState(x-1,0);
        neighbors[4] = chunk.getState(x,0);
        neighbors[5] = chunk.getState(x+1,0);
        neighbors[6] = chunk.getState(x-1,1);
        neighbors[7] = chunk.getState(x,1);
        neighbors[8] = chunk.getState(x+1,1);
        chunk.setState(x, 0, automaton.rule(neighbors));
    }

    //top row
    for(x = 1; x < sm1; x++){
        neighbors[0] = chunk.getState(x-1,sm1-1);
        neighbors[1] = chunk.getState(x,sm1-1);
        neighbors[2] = chunk.getState(x+1,sm1-1);
        neighbors[3] = chunk.getState(x-1,sm1);
        neighbors[4] = chunk.getState(x,sm1);
        neighbors[5] = chunk.getState(x+1,sm1);
        neighbors[6] = top.getState(x-1,0);
        neighbors[7] = top.getState(x,0);
        neighbors[8] = top.getState(x+1,0);
        chunk.setState(x, sm1, automaton.rule(neighbors));
    }

    //left column
    for(y = 1; y < sm1; y++){
        neighbors[0] = left.getState(sm1,y-1);
        neighbors[1] = chunk.getState(0,y-1);
        neighbors[2] = chunk.getState(1,y-1);
        neighbors[3] = left.getState(sm1,y);
        neighbors[4] = chunk.getState(0,y);
        neighbors[5] = chunk.getState(1,y);
        neighbors[6] = left.getState(sm1,y+1);
        neighbors[7] = chunk.getState(0,y+1);
        neighbors[8] = chunk.getState(1,y+1);
        chunk.setState(0, y, automaton.rule(neighbors));
    }

    //right column
    for(y = 1; y < sm1; y++){
        neighbors[0] = chunk.getState(sm1-1,y-1);
        neighbors[1] = chunk.getState(sm1,y-1);
        neighbors[2] = right.getState(0,y-1);
        neighbors[3] = chunk.getState(sm1-1,y);
        neighbors[4] = chunk.getState(sm1,y);
        neighbors[5] = right.getState(0,y);
        neighbors[6] = chunk.getState(sm1-1,y+1);
        neighbors[7] = chunk.getState(sm1,y+1);
        neighbors[8] = right.getState(0,y+1);
        chunk.setState(sm1, y, automaton.rule(neighbors));
    }
}


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