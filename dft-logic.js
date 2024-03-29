// DFT logic.

// Available types of DFT gates.
var DftTypes = Object.freeze({
    BE:     'be_exp',
    AND:    'and',
    OR:     'or',
    VOT:    'vot',
    PAND:   'pand',
    POR:    'por',
    PDEP:   'pdep',
    FDEP:   'fdep',
    SPARE:  'spare',
    SEQ:    'seq',
    COMPOUND: 'compound',
    BOT:    'be_const',
});

// Currently highest used id.
var currentId = -1;
// Id of toplevel element.
var topLevelId = -1;
// Parameters
var parameters = {};

// Import DFT from JSON.
function importDftFromJson(json) {
    cy.load(json.nodes);

    // Set currentId as maximal id of all loaded nodes
    currentId = -1;

    parameters = json.parameters;

    cy.nodes().forEach(function( node ) {
        currentId = Math.max(currentId, node.id());
        setLabelNode(node);
        addName(node.data('name'));
        type = node.data('type');
        // Handle old BE type
        if (type == 'be') {
            type = DftTypes.BE;
            node.data('type', type);
        }
        node.addClass(type);

        if (type != DftTypes.BE && type != DftTypes.COMPOUND && type != DftTypes.BOT) {
            // Add edges for gates
            var sourceId = node.data('id');
            var children = node.data('children');
            for (var i = 0; i < children.length; ++i) {
                var targetId = children[i];
                var target = cy.getElementById(targetId);
                var edgeId = sourceId + 'e' + targetId;
                if (cy.edges("[id='" + edgeId + "']").length > 0) {
                    alert("Edge '" + edgeId + "' already exists");
                }

                var edge = cy.add({
                    group: 'edges',
                    data: {
                        id: edgeId,
                        source: sourceId,
                        target: targetId,
                        index: i,
                    },
                    classes: type,
                });
            }
        }
    });

    // Set toplevel
    setToplevel(cy.getElementById(json.toplevel));
}

// Export DFT to JSON.
function exportDftToJSON() {
    // Construct JSON
    var json = {};
    json.toplevel = parseInt(topLevelId);
    json.parameters = parameters;
    json.nodes = cy.nodes().jsons();
    var jsonString = JSON.stringify(json, null, 4);
    return jsonString;
}

// Create the general information of a new element.
function createGeneralElement(dftType, name, posX, posY) {
    currentId += 1;
    if (name == '') {
        name = dftType + '_' + currentId;
    }
    var newElement = {
        group: 'nodes',
        data: {
            "id": currentId,
            "name": name,
            "type": dftType,
            "repairable": false
        },
        classes: dftType,
        position: {
            "x": posX,
            "y": posY
        }
    };

    return newElement;
}

// Create the general information of an existing element.
function createGeneralElementSameId(dftType, name, posX, posY, currentId) {

    var newElement = {
        group: 'nodes',
        data: {
            id: currentId,
            name: name,
            type: dftType,
            repairable: false
        },
        classes: dftType,
        position: {
            x: posX,
            y: posY
        }
    };

    return newElement;
}

// Create a new gate.
function createGate(dftType, name, posX, posY) {
    var newElement = createGeneralElement(dftType, name, posX, posY);
    newElement.data.children = [];
    return newElement;
}

// Create a new voting gate.
function createVotingGate(name, votingThreshold, posX, posY) {
    var newElement = createGate(DftTypes.VOT, name, posX, posY);
    newElement.data.voting = votingThreshold;
    return newElement;
}

// Create a new PDEP Gate
function createPDEPGate(name, probability, posX, posY) {
    var newElement = createGate(DftTypes.PDEP, name, posX, posY);
    newElement.data.probability = probability;
    return newElement;
}

// Create a new BE.
function createBe(name, rate, repair, dorm, posX, posY) {
    var newElement = createGeneralElement(DftTypes.BE, name, posX, posY);
    newElement.data.rate = rate;
    newElement.data.repair = repair;
    if (repair > 0) {
        newElement.data.repairable = true;
    }
    newElement.data.dorm = dorm;
    return newElement;
}

// Create a new BOT.
function createBot(name, posX, posY) {
    var newElement = createGeneralElement(DftTypes.BOT, name, posX, posY);
    return newElement;
}

// Add element to graph.
function createNode(element, parent) {
    if (parent != null) {
        element.data.parent = parent.data("id");
    }
    var node = cy.add(element);
    setLabelNode(node);
    addName(element.data.name);
    return node;
}

// Create a new compound for a given gate.
function createCompoundNode(gate) {
    var element = createGeneralElement(DftTypes.COMPOUND, gate.data.name + '_comp', gate.position.x, gate.position.y);
    element.classes = DftTypes.COMPOUND + "-" + gate.data.type;
    element.data.compound = gate.data.id;
    element.data["expanded-collapsed"] = 'expanded';
    return createNode(element, null);
}

// Create a new compound with existing gate
function createCompoundNodeMove(gate) {
    var element = createGeneralElement(DftTypes.COMPOUND, gate._private.data.name + '_comp', gate._private.position.x, gate._private.position.y);
    element.classes = DftTypes.COMPOUND + "-" + gate._private.data.type;
    element.data.compound = gate._private.data.id;
    element.data["expanded-collapsed"] = 'expanded';
    return createNode(element, null);
}

// Create nested compound for a given gate.
function createNestedCompound(gate, parent) {
    var element = createGeneralElement(DftTypes.COMPOUND, gate.data.name + '_comp', gate.position.x, gate.position.y);
    element.classes = DftTypes.COMPOUND + "-" + gate.data.type;
    element.data.compound = gate.data.id;
    element.data["expanded-collapsed"] = 'expanded';
    return createNode(element, cy.getElementById(parent));
}

// Create nested compound with existing gate
function createNestedCompoundMove(gate) {
    var element = createGeneralElement(DftTypes.COMPOUND, gate._private.data.name, gate._private.position.x, gate._private.position.y);
    element.classes = DftTypes.COMPOUND + "-" + gate._private.data.type;
    element.data.compound = gate._private.data.id;
    element.data["expanded-collapsed"] = 'expanded';
    var parent = gate._private.data.parent;
    return createNode(element, cy.getElementById(parent));
}

// Remove a node and all connected edges.
function removeNode(node) {
    if (node.data("id") == topLevelId) {
        topNodeSet = false;
    }
    var edges = node.connectedEdges();
    edges.forEach(function( edge ){
        removeEdge(edge);
    });
    // Delete name from usedNames.
    usedNames.delete(node.data('name'));
    node.remove();
}


// Get a new edge. If there already exists an edge with the same source
// and target nodes the edge id is marked as 'idInvalid'.
function getNewEdge(sourceNode, targetNode) {
    var sourceId = sourceNode.data('id');
    var targetId = targetNode.data('id');
    var edgeId = sourceId + 'e' + targetId;
    if (cy.edges("[id='" + edgeId + "']").length > 0) {
        edgeId = 'idInvalid';
    } // Check for target source edges
    else {
        var changedId = targetId + 'e' + sourceId;
        if (cy. edges("[id='" + changedId + "']").length > 0) {
            edgeId = 'idInvalid';
        } else {
            // Check if creating the edge causes the DFT to be cyclic
            var containsCycle = sourceNode.predecessors('node').some(function (ele) {
                return ele.data('id') == targetNode.data('id');
            });
            if (containsCycle) {
                edgeId = 'cycle';
            }
        }
    }

    return {
        data: {
            id: edgeId,
            source: sourceId,
            target: targetId,
        }
    };
}

// Add the newly created edge and update the child relation.
function addEdge(edge, source, target) {
    var children = source.data('children');
    children.push(target.data('id'));
    source.data('children', children);
    edge.data('index', children.length-1);
    edge.addClass(source.data('type'));

    // Update repairable
    if (target.data('repairable')) {
        source.data('repairable', true);
        propagateUp(source, checkRepairable);
    } else checkRepairable(source);
}

function createEdge(source, target) {
    var edge = getNewEdge(source, target);
    // Check if edge is valid
    if (edge.data['id'] == 'idInvalid') {
        $('#edge-info').text('The edge already exists!');
        $('#edge-info').addClass('red');
        console.log("Already exists");
    } else if (edge.data['id'] == 'cycle') {
        $('#edge-info').text('The edge causes a cycle!');
        $('#edge-info').addClass('red');
        console.log("Cycle caused");
    } else {
        $('#edge-info').removeClass('red');
        $('#edge-info').text('Add edges by clicking on source and target node.');

        var newEdge = cy.add(edge);
        addEdge(newEdge, source, target);
        // Update labels
        if (source.data('type') == DftTypes.VOT) {
            setLabelNode(sourceNode);
        }
        return newEdge;
    }
}

// Remove edge from graph and update indices.
function removeEdge(edge) {
    var sourceId = edge.data('source');
    var targetId = edge.data('target');
    var edgeIndex = edge.data('index');
    var sourceNode = cy.getElementById(sourceId);
    var children = sourceNode.data('children');
    if (children.length <= edgeIndex || children[edgeIndex] != targetId) {
        //throw new Error('Indices do not match');
    }
    // Remove index entry in node
    children.splice(edgeIndex, 1);
    sourceNode.data('children', children);
    // Update labels
    if (sourceNode.data('type') == DftTypes.VOT) {
        setLabelNode(sourceNode);
    }
    // Update indices of all other edges
    var edges = sourceNode.connectedEdges();
    edges.forEach(function( edgeUpdate ){
        var index = edgeUpdate.data('index');
        if (index > edgeIndex) {
            edgeUpdate.data('index', index-1);
        }
    });

    // Update repairable
    checkRepairable(sourceNode);
    propagateUp(sourceNode, checkRepairable);

    edge.remove();
}

// Check for repairable child
function checkRepairable(node) {
    var children = node.data('children');
    var check = false;
    for (var i = 0; i < children.length; i++) {
        if (cy.getElementById(children[i]).data('repairable')) {
            check = true;
            break;
        }
    }
    if (!check) {
        node.data('repairable', false);
    } else node.data('repairable', true);
}

/*
 *  Propagate through top of node
 *  @param node. Startnode.
 *  @param func. Function in which each upper node is inserted as input.
 */

function propagateUp(node, func) {
    var parents = node.incomers('node');
    if (parents.length > 0) {
        for (var i = 0; i < parents.length; i++) {
            if (node.data('id') != parents[i].data('id')) {
                func(parents[i]);
            }
            propagateUp(parents[i], func);
        }
    }
}

function propagateDown(node, func) {
    var children = node.outgoers('node');
    if (children.length > 0) {
        for (var i = 0; i < children.length; i++) {
            if (node.data('id') != children[i].data('id')) {
                func(children[i]);
            }
            propagateDown(children[i], func);
        }
    }
}

// Set element as toplevel element.
function setToplevelId(node) {
    topLevelId = node.data('id');
}

// Lock position of specific node
function lockNode(node) {
    node.lock();
}

// Unlock position of specific node
function unlockNode(node) {
    node.unlock();
}

function lockAll() {
    cy.nodes().forEach(function(node) {
        lockNode(node);
    });
}

function unlockAll() {
    cy.nodes().forEach(function(node) {
        unlockNode(node);
    });
}

// Create subtree for block.
function createBlock2(name, posX, posY) {
    // Create nodes
    var orBlockElement = createGate(DftTypes.OR, name, posX, posY);
    var compoundNode = createCompoundNode(orBlockElement);
    var orBlock = createNode(orBlockElement, compoundNode);
    var nodeInternal = createNode(createBe(name + " internal", "r" + name + "Int", 0.0, 1.0, posX-150, posY+100), compoundNode);
    var orWrongNominal = createNode(createGate(DftTypes.OR, name + " wrong Nominal Value", posX, posY+100), compoundNode);
    var orWrongPotential = createNode(createGate(DftTypes.OR, name + " wrong Potential", posX+150, posY+100), compoundNode);
    var orHW = createNode(createGate(DftTypes.OR, "HW-"+ name, posX, posY+600))
    var dep = createNode(createGate(DftTypes.FDEP, "dep " + name, posX+100, posY+200));

    // Create edges.
   createEdge(orBlock, nodeInternal);
   createEdge(orBlock, orWrongNominal);
   createEdge(orBlock, orWrongPotential);
   createEdge(orBlock, orHW);
   createEdge(dep, orBlock);
}

// Create subtree for (partly) covered failures.
function createCoveredFailure(faultName, rate, coverage, safetyRate, posX, posY) {
    // Create nodes
    var orFaultElement = createGate(DftTypes.OR, faultName, posX, posY);
    var compoundNode = createCompoundNode(orFaultElement);
    var orFault = createNode(orFaultElement, compoundNode);
    var nodeFaultNotCovered = createNode(createBe(faultName + "NotCov", rate * (1-coverage), 0.0, 1.0, posX-75, posY+100), compoundNode);
    var andNotDetected = createNode(createGate(DftTypes.AND, faultName + "NotDet", posX+75, posY+100), compoundNode);
    var seqCovered = createNode(createGate(DftTypes.SEQ, "seq" + faultName, posX+150, posY+100), compoundNode);
    var nodeSafety = createNode(createBe(faultName + "SafeMech", safetyRate, 0.0, 1.0, posX+50, posY+200), compoundNode);
    var nodeFaultCovered = createNode(createBe(faultName + "Cov", rate * coverage, 0.0, 1.0, posX+150, posY+200), compoundNode);

    // Create edges.
   createEdge(orFault, nodeFaultNotCovered);
   createEdge(orFault, andNotDetected);
   createEdge(andNotDetected, nodeSafety);
   createEdge(andNotDetected, nodeFaultCovered);
   createEdge(seqCovered, nodeSafety);
   createEdge(seqCovered, nodeFaultCovered);
}

// Create subtree for block.
function createBlock(name, posX, posY) {
    // Create nodes
    var A_el = createGate(DftTypes.AND, name, posX, posY);
    var AA = createCompoundNode(A_el);
    var A = createNode(A_el, AA);
    var c = createNode(createBe('c', 1.0, 0.0, 1.0, posX-150, posY+150), AA);

    var B_el = createGate(DftTypes.AND, 'B', posX+150,posY+150);
    var BB = createNestedCompound(B_el, AA);
    var B = createNode(B_el, BB);
    var d = createNode(createBe('d', 1, 1, 1, posX+50, posY+350), BB);
    var e = createNode(createBe('e', 1, 1, 1, posX+250, posY+350), BB);

    // Create Edges
    createEdge(A, c);
    createEdge(A, B);
    createEdge(B, d);
    createEdge(B, e);
}
