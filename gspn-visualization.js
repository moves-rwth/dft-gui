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
        var lines = file.target.result;
        var json = JSON.parse(lines);
        cy.load(json);
        // Set currentId as maximal id of all loaded nodes
        cy.nodes().forEach(function( node ){
            currentId = Math.max(currentId, node.id());
        });
    }
});

// Save graph.
$("#save-graph").click(function() {
    // Construct JSON
    var json = {};
    json = cy.elements().jsons();
    var jsonString = JSON.stringify(json, null, 4);
    var textFileAsBlob = new Blob([jsonString], {type:'text/plain'});

    // Create link to download
    var fileNameToSaveAs = "gspn-graph.json";
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
    var fileNameToSaveAs = "gspn-graph.png";
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
            selector: 'node.place',
            css: {
                'height': 118,
                'width': 126,
                'background-image': 'images/place.png'
            }
        },
        {
            selector: 'node.trans_im',
            css: {
                'height': 32,
                'width': 154,
                'background-image': 'images/trans_im.png'
            }
        },
        {
            selector: 'node.trans_time',
            css: {
                'height': 34,
                'width': 168,
                'background-image': 'images/trans_time.png'
            }
        },
        {
            selector: 'edge',
            css: {
                label: 'data(index)',
                'width': 2,
                'line-color': '#808080',
                'target-arrow-color': '#808080',
                'curve-style': 'bezier',
            }
        },
        {
            selector: 'edge.input',
            css: {
                label: 'data(index)',
                'source-arrow-shape': 'none',
                'target-arrow-shape': 'triangle',
                'line-color': 'green',
            }
        },
        {
            selector: 'edge.inhibit',
            css: {
                'source-arrow-shape': 'none',
                'target-arrow-shape': 'circle',
                'line-color': 'red',
            }
        },
        {
            selector: 'edge.output',
            css: {
                'source-arrow-shape': 'triangle',
                'target-arrow-shape': 'none',
                'line-color': 'blue',
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
