// Load graph
$("#load-graph").click(function() {
    var filePath = "examples/" + $('#input-file').val();
    $.getJSON(filePath, function(json) {
        cy.load(json);
        // Set currentId as maximal id of all loaded nodes
        cy.nodes().forEach(function( node ){
            currentId = Math.max(currentId, node.id());
        });
    });
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


// Cytoscape graph visualization
var dftTypes = {
    BE:     'be',
    AND:    'and',
    OR:     'or',
    PAND:   'pand',
    POR:    'por',
    PDEP:   'pdep',
    FDEP:   'fdep',
    SPARE:  'spare',
    SEQ:    'seq',
};

var currentId = 0;

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

function addEdge(source, target) {
    sourceId = source.data('id');
    targetId = target.data('id');
    children = source.data('children');
    children.push(targetId);
    source.data('children', children);
    return {
        data: {
            id: sourceId + 'e' + targetId,
            source: sourceId,
            target: targetId,
            index:  children.length-1,
        }
    };
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
            id: 'remove',
            title: 'remove',
            selector: 'node, edge',
            onClickFunction: function (event) {
                event.cyTarget.remove();
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
            id: 'remove-selected',
            title: 'remove selected',
            coreAsWell: true,
            onClickFunction: function (event) {
              cy.$(':selected').remove();
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
    edgeType: function() {
        return 'flat';
    },
    edgeParams: function(sourceNode, targetNode, i) {
        return addEdge(sourceNode, targetNode);
    },
});

// Initialize collapsing
cy.expandCollapse({
    layoutBy: null,
    animate: false,
    fisheye: true,
    undoable: false
});