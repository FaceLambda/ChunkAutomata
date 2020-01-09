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
            for(var coord in this.loadedChunks){
                var chunk = this.loadedChunks[coord];
                if(chunk.isEmpty()){
                    //TODO GET EMPTY CASE HERE, CONSULT README FOR WTF TO DO
                }else{
                    updateChunk(coord, chunk, this);
                }

            }
        }
    }


}

/**
  iterates over each cell in chunk and loads the next state
  this function is not meant to be called by people who
  don't know what this does.
*/
var updateChunk = function(coords, chunk, automaton){
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
    
    //this will hold all adjacent
    var neighbors = [];

    //iterate over every cell
    var x = 1;
    var y = 1;
    //chunksize minus one
    var sm1 = automaton.size - 1;
    //do the main bulk of the center
    for(; y < sm1; y++){
        for(; x < sm1; x++){
            neighbors[0] = chunk.getState(x-1,y-1);
            neighbors[1] = chunk.getState(x  ,y-1);
            neighbors[2] = chunk.getState(x+1,y-1);
            neighbors[3] = chunk.getState(x-1,y  );
            neighbors[4] = chunk.getState(x  ,y  );
            neighbors[5] = chunk.getState(x+1,y  );
            neighbors[6] = chunk.getState(x-1,y+1);
            neighbors[7] = chunk.getState(x  ,y+1);
            neighbors[8] = chunk.getState(x+1,y+1);
            chunk.setState(x, y, automaton);
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
    chunk.setState(0, 0, automaton);
    
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
    chunk.setState(sm1, 0, automaton);

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
    chunk.setState(0, sm1, automaton);
    
    
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
    chunk.setState(sm1, sm1, automaton);

    //bottom row
    for(x = 1; x < sm1; x++){
        neighbors[0] = bot.getState(x-1,sm1);
        neighbors[1] = bot.getState(x,sm1);
        neighbors[2] = bot.getState(x+1,sm1);
        neighbors[3] = chunk.getState(x-1,0);
        neighbors[4] = chunk.getState(x,0);
        neighbors[5] = chunk.getState(x+1,0);
        neighbors[6] = chunk.getState(x-1,1);
        neighbors[7] = chunk.getState(0,1);
        neighbors[8] = chunk.getState(x+1,1);
        chunk.setState(x, 0, automaton);
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
        neighbors[7] = top.getState(0,0);
        neighbors[8] = top.getState(x+1,0);
        chunk.setState(x, sm1, automaton);
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
        chunk.setState(0, y, automaton);
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
        chunk.setState(sm1, y, automaton);
    }

}