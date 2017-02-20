// Cytoscape graph visualization.

// Possible types of DFT gates.
var DftTypes = Object.freeze({
    BE:     'be',
    AND:    'and',
    OR:     'or',
    PAND:   'pand',
    POR:    'por',
    PDEP:   'pdep',
    FDEP:   'fdep',
    SPARE:  'spare',
    SEQ:    'seq',
});

// Currently highest used id.
var currentId = -1;

var topLevelId = -1;

// Load graph.
$("#load-graph").click(function() {
    if (typeof window.FileReader !== 'function') {
        alert("The file API isn't supported on this browser yet.");
        return;
    }

    var input = document.getElementById('input-file');
    if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
        return;
    }
    if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
        return;
    }

    var file = input.files[0];
    var filereader = new FileReader();
    filereader.onload = loadFile;
    filereader.readAsText(file);


    function loadFile(file) {
        var lines = file.target.result;
        var json = JSON.parse(lines);

        cy.load(json.nodes);

        // Set currentId as maximal id of all loaded nodes
        currentId = -1;

        cy.nodes().forEach(function( node ) {
            currentId = Math.max(currentId, node.id());
            setLabel(node);
            node.addClass(node.data('type'));

            if (node.data('type') != DftTypes.BE) {
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

                    cy.add({
                        group: 'edges',
                        data: {
                            id: edgeId,
                            source: sourceId,
                            target: targetId,
                        },
                    });
                }
            }
        });

        // Set toplevel
        setToplevel(cy.getElementById(json.toplevel));
    }
});

// Save graph.
$("#save-graph").click(function() {
    // Construct JSON
    var json = {};
    json.toplevel = topLevelId;
    json.nodes = cy.nodes().jsons();
    var jsonString = JSON.stringify(json, null, 4);
    var textFileAsBlob = new Blob([jsonString], {type:'text/plain'});

    // Create link to download
    var fileNameToSaveAs = "dft-graph.json";
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        //downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
});

// Export graph as image.
$("#export-image").click(function() {
    var image = cy.png({
        full: true
    });

    // Create link to download
    var fileNameToSaveAs = "dft-graph.png";
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked without actually adding it to the DOM.
        downloadLink.href = image;
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = image;
        //downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
});

// Add a node.
function addNode(event, dftType) {
    currentId += 1;

    var elemName = prompt("Element name", dftType+currentId);
    if (elemName != null) {
        var newNode = {
            group: 'nodes',
            data: {
                id: currentId,
                name: elemName,
                type: dftType,
                rate: rate,
                dorm: dorm
            },
            classes: dftType,
            position: {
                x: event.cyPosition.x,
                y: event.cyPosition.y
            }
        };

        if (dftType == DftTypes.BE) {
            // Get rate and dormancy factor
            var rate = prompt("Failure rate", 0.0);
            var dorm = prompt("Dormancy factor", 1.0);
            newNode.data.rate = rate;
            newNode.data.dorm = dorm;
        } else {
            newNode.data.children = [];
        }

        var node = cy.add(newNode);
        setLabel(node);
    }
}

// Remove a node and all connected edges.
function removeNode(node) {
    var edges = node.connectedEdges();
    edges.forEach(function( edge ){
        removeEdge(edge);
    });
    node.remove();
}

// Add edge. If there already exists an edge with the same source
// and target nodes the edge id is marked as 'idInvalid'.
function addEdge(sourceNode, targetNode) {
    var sourceId = sourceNode.data('id');
    var targetId = targetNode.data('id');
    var edgeId = sourceId + 'e' + targetId;
    if (cy.edges("[id='" + edgeId + "']").length > 0) {
        console.log("Already exists");
        edgeId = 'idInvalid';
    }

    return {
        data: {
            id: edgeId,
            source: sourceId,
            target: targetId,
        }
    };
}

// Remove edge from graph and update indices.
function removeEdge(edge) {
    var sourceId = edge.data('source');
    var targetId = edge.data('target');
    var edgeIndex = edge.data('index');
    var sourceNode = cy.getElementById(sourceId);
    var children = sourceNode.data('children');
    if (children.length <= edgeIndex || children[edgeIndex] != targetId) {
        throw new Error('Indices do not match');
    }
    // Remove index entry in node
    children.splice(edgeIndex, 1);
    sourceNode.data('children', children);
    // Update indices of all other edges
    var edges = sourceNode.connectedEdges();
    edges.forEach(function( edgeUpdate ){
        var index = edgeUpdate.data('index');
        if (index > edgeIndex) {
            edgeUpdate.data('index', index-1);
        }
    });
    edge.remove();
}

// Set label for a node.
function setLabel(node) {
    var elemName = node.data('name');
    if (node.data('type') == DftTypes.BE) {
        var rate = node.data('rate');
        node.data('label', elemName + ' (' + rate + ')');
    } else {
        node.data('label', elemName);
    }
}

// Set element as toplevel element
function setToplevel(node) {
    if (topLevelId >= 0) {
        // Remove class for old toplevel element
        cy.getElementById(topLevelId).removeClass('toplevel');
    }
    // Set new toplevel element
    topLevelId = node.data('id');
    node.addClass('toplevel');
}


// Initialize cytoscape
var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: [],
    layout: {
        name: 'preset',
        padding: 10,
    },
    // Initialize DFT gate styles for nodes.
    style: [
        {
        selector: 'node',
        css: {
            label: 'data(label)',
            'height': 59,
            'width': 48,
            'shape': 'rectangle',
            'background-fit': 'cover',
        }
        },
        {
        selector: 'node.toplevel',
        css: {
            'border-color': 'black',
            'border-width': '4'
        }
        },
        {
        selector: 'node.be',
        css: {
            'height': 42,
            'width': 42,
            'background-image': 'images/be.jpg'
        }
        },
        {
        selector: 'node.and',
        css: {
            'height': 59,
            'width': 48,
            'background-image': 'images/and.jpg'
        }
        },
        {
        selector: 'node.or',
        css: {
            'height': 59,
            'width': 44,
            'background-image': 'images/or.jpg'
        }
        },
        {
        selector: 'node.pand',
        css: {
            'height': 59,
            'width': 48,
            'background-image': 'images/pand.jpg'
        }
        },
        {
        selector: 'node.por',
        css: {
            'height': 59,
            'width': 44,
            'background-image': 'images/por.jpg'
        }
        },
        {
        selector: 'node.pdep',
        css: {
            'height': 59,
            'width': 89,
            'background-image': 'images/fdep.jpg'
        }
        },
        {
        selector: 'node.fdep',
        css: {
            'height': 59,
            'width': 89,
            'background-image': 'images/fdep.jpg'
        }
        },
        {
        selector: 'node.spare',
        css: {
            'height': 59,
            'width': 89,
            'background-image': 'images/spare.jpg'
        }
        },
        {
        selector: 'node.seq',
        css: {
            'height': 26,
            'width': 49,
            'background-image': 'images/seq.jpg'
        }
        },
        {
        selector: 'edge',
        css: {
            label: 'data(index)',
            'width': 2,
            'target-arrow-shape': 'triangle',
            'line-color': '#808080',
            'target-arrow-color': '#808080',
            'curve-style': 'bezier'
        }
        },
        {
        selector: "[expanded-collapsed='collapsed']",
            style: {
                label: 'data(name)',
                'height': 59,
                'width': 89,
                'background-color': 'gray',
                'shape': 'rectangle'
            }
        },
        {
        selector: "[expanded-collapsed='expanded']",
            style: {
                label: '',
                'background-color': 'ligthgray',
                'shape': 'rectangle'
            }
        },
    ]
});

// Initialize context menu
cy.contextMenus({
    menuItems: [
        {
            id: 'removeNode',
            title: 'remove',
            selector: 'node',
            onClickFunction: function (event) {
                removeNode(event.cyTarget);
            },
            hasTrailingDivider: true
        },
        {
            id: 'removeEdge',
            title: 'remove',
            selector: 'edge',
            onClickFunction: function (event) {
                removeEdge(event.cyTarget);
            },
            hasTrailingDivider: true
        },
        {
            id: 'rename',
            title: 'rename',
            selector: 'node',
            onClickFunction: function (event) {
                var elemName = prompt("Element name", event.cyTarget.data('name'));
                if (elemName != null) {
                    event.cyTarget.data('name', elemName);
                    setLabel(event.cyTarget);
                }
            },
            hasTrailingDivider: true
        },
        {
            id: 'changerate',
            title: 'change rate',
            selector: 'node.be',
            onClickFunction: function (event) {
                var rate = prompt("Failure rate", event.cyTarget.data('rate'));
                if (rate != null) {
                    event.cyTarget.data('rate', rate);
                    setLabel(event.cyTarget);
                }
            },
            hasTrailingDivider: true
        },
        {
            id: 'changedorm',
            title: 'change dormancy factor',
            selector: 'node.be',
            onClickFunction: function (event) {
                var dorm = prompt("Dormancy factor", event.cyTarget.data('dorm'));
                if (dorm != null) {
                    event.cyTarget.data('dorm', dorm);
                }
            },
            hasTrailingDivider: true
        },
        {
            id: 'toplevel',
            title: 'set as toplevel',
            selector: 'node',
            onClickFunction: function (event) {
                setToplevel(event.cyTarget);
            },
            hasTrailingDivider: true
        },
        {
            id: 'add-be',
            title: 'add BE',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, DftTypes.BE);
            }
        },
        {
            id: 'add-and',
            title: 'add AND',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, DftTypes.AND);
            }
        },
        {
            id: 'add-or',
            title: 'add OR',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, DftTypes.OR);
            }
        },
        {
            id: 'add-pand',
            title: 'add PAND',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, DftTypes.PAND);
            }
        },
        {
            id: 'add-por',
            title: 'add POR',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, DftTypes.POR);
            }
        },
        {
            id: 'add-fdep',
            title: 'add FDEP',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, DftTypes.FDEP);
            }
        },
        {
            id: 'add-pdep',
            title: 'add PDEP',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, DftTypes.PDEP);
            }
        },
        {
            id: 'add-spare',
            title: 'add SPARE',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, DftTypes.SPARE);
            }
        },
         {
            id: 'add-seq',
            title: 'add SEQ',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, DftTypes.SEQ);
            }
        },
        {
            id: 'layout-bfs',
            title: 'layout via BFS',
            coreAsWell: true,
            onClickFunction: function (event) {
                var root = undefined;
                if (topLevelId >= 0) {
                    root = cy.getElementById(topLevelId);
                }
                cy.layout({
                    name: 'breadthfirst',
                    directed: true,
                    padding: 10,
                    roots: root,
                    avoidOverlap: true,
                    fit: true,
                });
            }
        }
    ]
});

// Initialize edgehandles.
cy.edgehandles({
    toggleOffOnLeave: true,
    handleNodes: "node",
    handleSize: 10,
    loopAllowed: function(node) {
        return false;
    },
    edgeType: function() {
        return 'flat';
    },
    edgeParams: function(sourceNode, targetNode, i) {
        return addEdge(sourceNode, targetNode);
    },
    complete: function(sourceNode, targetNode, addedEdge) {
        var sourceId = sourceNode.data('id');
        var targetId = targetNode.data('id');

        if (addedEdge.data('source') != sourceId) {
            throw new Error("Source id does not match.");
        }
        if (addedEdge.data('target') != targetId) {
            throw new Error("Target id does not match.");
        }

        // Check if edge is valid
        if (addedEdge.data('id') == 'idInvalid') {
            cy.remove(addedEdge);
        } else {
            var children = sourceNode.data('children');
            children.push(targetId);
            sourceNode.data('children', children);
            addedEdge.data('index', children.length-1);
        }
    }
});

// Initialize collapsing
cy.expandCollapse({
    layoutBy: null,
    animate: false,
    fisheye: true,
    undoable: false
});