# ChunkAutomata
Cellular Automata implementation featuring a chunk-based loading system in a (potentially) infinite world in Javascript.

## Implementation
An instance is created with `new Automaton(rule, chunksize)` where
- `rule` is a function that determines a given cell's next state
- `chunksize` is the side-length of a single chunk.

The automation is incremented with the `step()` function, which has an optional count parameter.
Individual cells can be modified with `getCell(x,y)` and `setCell(x,y)`.
### Chunks
Each chunk holds the states of each local cell in an array for the current and next iteration. Each chunk is either
- ***unloaded***, where the automaton doesn't consider it to exist, and it is not in memory.
- ***empty***, where the chunk is loaded, but is not normally iterated (only the boundary cells are considered in the step). Every cell of an empty chunk has a null state.
- ***loaded***, where the chunk is treated as normal.

Every loaded chunk *either is empty or has all of its neighbors loaded*. This means that stepping through iterations can go as follows in broken ~~engli~~ pseudocode:
```
foreach chunk in loadedChunks:
    if(chunk.isEmpty)
        foreach direction:
            if(chunkInDirection.isLoadedAndNonempty())
                foreach cell in chunk.border(direction):
                    cellNextState = rule(cellAndNeighborsCurrentState);
    else
        foreach cell in chunk:
            cellNextState = rule(cellAndNeighborsCurrentState);
```
