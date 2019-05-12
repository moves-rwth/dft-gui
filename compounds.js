/*   ________________________________________________________________________________
 *  |Functions for creating and removing Compound nodes.                             |
 *  |Nesting of compounds. (ToDo: Still some bugs in multiple nested compounds)      |
 *  |________________________________________________________________________________|
 */  


   
/*  boolean compoundCheck(gate)
 *  @param gate - the gate to collapse 
 *   
 *  @return true, if gate can be collapsed
 *          false, otherwise
 *
 *  Check if the *gate* can be collapsed, i.e., check whether the gate has a child wich has an ancestor
 *  that is not child of the *gate*.
 */
function compoundCheck(gate) {
    var succ = gate.successors('node');
    // Save ids of succ
    var ids = [];
    ids.push(gate.id());
    for (var i = 0; i < succ.length; i++) {
        ids.push(succ[i].id());
    }

    // Check for other parents which are not in id
    for (var i = 0; i < succ.length; i++) {
        var inc = succ[i].incomers('node');
        for (var j = 0; j < inc.length; j++) {
            if (!contain(ids, inc[j].id())) {
                return false;
            }
        }
    }

    return true;
}


/*  void removeCompound(compound)
 *  @param compound - the compound to remove
 *
 *  Check if the *compound* is a nested one, i.e., if it has a parent. If so, move all children of *compound*
 *  to the parent of *compound*. Otherwise just set the parent of all children to null. Remove *compound* at the end.
 */
function removeCompound(compound) {

    var nested = false;
    var descendants = compound.descendants();
    var edges = descendants.outgoers('edge');

    // Check if nested
    var parent = compound.parents();
    if (parent.length > 0) {
        nested = true;
    }
    if (nested) {
        var comParent = cy.getElementById(parent.id());

        descendants.move({
            parent: parent[0].id()
        });
    } else {

        descendants.move({
            parent: null
        });
    }

    cy.remove(compound);
    
}

/*  void newCompoundMove(gate)
 *  @param gate - the gate to collapse 
 *   
 *  Expand all compounds before creating a new one to prevent losing information (Maybe not necessary with move()).
 *  Check if *gate* can be collapsed (see compoundCheck()). Check if the *gate* is already a compound node of a
 *  compound. If so, delete the old one and create a new one.
 */
function newCompoundMove(gate) {
    // Expand all before collapsing
    cy.expandAll();
    var nested = false;
    var gates = null;

    if (!compoundCheck(gate)) {
        alert("Not possible");
        return;
    }

    // Check if same compound already exists
    if (gate.parent().length > 0) {
        var parent = gate.parent();
        if (parent[0]._private.data.compound == gate.id()) {
            // Same compound exists. However, since new nodes could be attached, just delete the old one
            gates = gate.successors('node');
            removeCompound(parent[0]);
            gate = cy.getElementById(gate.id());
        }
    }
    
    // Check if nested
    var parent = gate.parents();
    if (parent.length > 0) {
        nested = true;
    }

    // Check if contain other compounds
    if (gates == null) gates = gate.successors('node[type != "be_exp"]');
    var comps = gates.parent();

    // Save nodes and edges
    var succNodes = gate.successors('node');
    var succEdges = gate.successors('edge');
    var incEdges = gate.incomers('edge');

    // Create new compound gate
    if (nested) {
        var compound = createNestedCompoundMove(gate);
    } else {
        var compound = createCompoundNodeMove(gate);
    }
    
    var col = cy.collection();
    col.merge(gate).merge(succNodes);

    // Move to compound
    col.move({
        parent: compound.id()
    });

    // Delete old compounds 
    cy.remove(comps);
}

/*

    Mutex and other Compounds

*/

$('#mutex-button').on('click', function() {
    createMutex(cy.width()/2, cy.height()/2);
});

// Create Mutexblock
function createMutex(posX, posY) {

    var seqEl = createGate(DftTypes.SEQ, '', posX, posY);
    var comp = createCompoundNode(seqEl);
    var seq = createNode(seqEl, comp);
    var bottom = createNode(createBot('', posX-85, posY+95), comp);
    var and = createNode(createGate(DftTypes.AND, '', posX+65, posY+100), comp);
    var be1 = createNode(createBe('', 0, 0, 1, posX+30, posY+225), comp);
    var be2 = createNode(createBe('', 0, 0, 1, posX+110, posY+225), comp);

    createEdge(seq, bottom);
    createEdge(seq, and);
    createEdge(and, be1);
    createEdge(and, be2);

}
