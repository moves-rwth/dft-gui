// Cytoscape graph visualization
var dftTypes = {
    BE:     'be',
    AND:    'and',
    OR:     'or',
    PAND:   'pand',
    POR:    'por',
    PDEP:   'pdep',
    SPARE:  'spare',
    SEQ:    'seq',
};

var currentId = 0;

// Load graph
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
        lines = file.target.result;
        var json = JSON.parse(lines);
        console.log(json)

        cy.load(json);
        // Set currentId as maximal id of all loaded nodes
        currentId = 0;
        cy.nodes().forEach(function( node ){
            currentId = Math.max(currentId, node.id());
        });
    }
});

// Save graph
$("#save-graph").click(function() {
    var textToWrite = JSON.stringify(cy.elements().jsons(), null, 4);
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
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

// Export graph as image
$("#export-image").click(function() {
    var image = cy.png({
        full: true
    });
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


function addNode(event, dftType) {
    currentId += 1;

    var elemName = prompt("Element name", dftType+currentId);
    if (elemName != null) {
        cy.add({
            group: 'nodes',
            data: {
                id: currentId,
                name: elemName,
                children: [],
            },
            classes: dftType,
            position: {
                x: event.cyPosition.x,
                y: event.cyPosition.y
            }
        });
    }
}

function removeNode(node) {
    //TODO remove all corresponding edges
    node.remove();
}

function addEdge(sourceNode, targetNode) {
    sourceId = sourceNode.data('id');
    targetId = targetNode.data('id');
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

function removeEdge(edge) {
    sourceId = edge.data('source');
    sourceNode = cy.getElementById(sourceId);
    children = sourceNode.data('children');
    // TODO remove child
    var index = edge.data('index');
    //children.remove(index);
    sourceNode.data('children', children);
    // TODO update indices of all edges
    edge.remove();
}


// Initialize cytoscape
var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: [],
    layout: {
        name: 'preset',
        padding: 10,
    },
    style: [
        {
        selector: 'node',
        css: {
            label: 'data(name)',
            'height': 59,
            'width': 48,
            'shape': 'rectangle',
            'background-fit': 'cover',
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
                }
            },
            hasTrailingDivider: true
        },
        {
            id: 'add-be',
            title: 'add BE',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, dftTypes.BE);
            }
        },
        {
            id: 'add-and',
            title: 'add AND',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, dftTypes.AND);
            }
        },
        {
            id: 'add-or',
            title: 'add OR',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, dftTypes.OR);
            }
        },
        {
            id: 'add-pand',
            title: 'add PAND',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, dftTypes.PAND);
            }
        },
        {
            id: 'add-por',
            title: 'add POR',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, dftTypes.POR);
            }
        },
        {
            id: 'add-pdep',
            title: 'add PDEP',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, dftTypes.PDEP);
            }
        },
        {
            id: 'add-fdep',
            title: 'add FDEP',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, dftTypes.FDEP);
            }
        },
        {
            id: 'add-spare',
            title: 'add SPARE',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, dftTypes.SPARE);
            }
        },
         {
            id: 'add-seq',
            title: 'add SEQ',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, dftTypes.SEQ);
            }
        },
        {
            id: 'layout-bfs',
            title: 'layout via BFS',
            coreAsWell: true,
            onClickFunction: function (event) {
                cy.layout({
                    name: 'breadthfirst',
                    directed: true,
                    padding: 10,
                });
            }
        }
    ]
});

// Initialize edgehandles
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
        sourceId = sourceNode.data('id');
        targetId = targetNode.data('id');

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
            children = sourceNode.data('children');
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