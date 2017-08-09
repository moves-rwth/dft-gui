// Cytoscape graph visualization.

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
        importDftFromJson(json);
    }
});

// Save graph.
$("#save-graph").click(function() {
    var json = exportDftToJSON();
    var textFileAsBlob = new Blob([json], {type:'text/plain'});

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
    var elemName = prompt("Element name", dftType + (currentId+1));
    var posX = event.cyPosition.x;
    var posY = event.cyPosition.y;
    if (elemName != null) {
        if (dftType == DftTypes.BE) {
            // Get rate and dormancy factor
            var rate = prompt("Failure rate", 0.0);
            var repair = prompt("Repair rate", 0.0);
            var dorm = prompt("Dormancy factor", 1.0);
            var newElement = createBe(elemName, rate, repair, dorm, posX, posY);
            createNode(newElement);
        } else if (dftType == DftTypes.VOT) {
            // Get voting number
            var voting = prompt("Voting threshold", 1);
            var newElement = createVotingGate(elemName, voting, posX, posY);
            createNode(newElement);
        } else {
            var newElement = createGate(dftType, elemName, posX, posY);
            createNode(newElement);
        }
    }
}

// Set label for a node.
function setLabelNode(node) {
    var elemName = node.data('name');
    if (node.data('type') == DftTypes.BE) {
        var rate = node.data('rate');
        var repair = node.data('repair');
        node.data('label', elemName + ' (\u03BB: ' + rate + ', r: ' + repair + ')');
    } else if (node.data('type') == DftTypes.COMPOUND) {
        node.data('label', elemName);
    } else if (node.data('type') == DftTypes.VOT) {
        var voting = node.data('voting') + "/" + node.data('children').length;
        node.data('label', elemName + ' (' + voting + ')');
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
    node.addClass('toplevel');
    // Set new toplevel element
    setToplevelId(node);
}

// Add subtree for block
function addBlock(event) {
    var blockName = prompt("Block name", currentId+1);
    // Create subtree
    createBlock(blockName, event.cyPosition.x, event.cyPosition.y);
}

// Add subtree for (partly) covered failures
function addCoveredFailure(event) {
    var faultName = prompt("Element name", "fault" + (currentId+1));
    var rate = prompt("Failure rate of fault", 0.0);
    var coverage = -1;
    while (coverage < 0.0 || coverage > 1.0) {
        coverage = prompt("Fault coverage", 0.0);
    }
    var safetyRate = prompt("Failure rate of safety mechanism", 0.0);
    // Create subtree
    createCoveredFailure(faultName, rate, coverage, safetyRate, event.cyPosition.x, event.cyPosition.y);
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
                'background-image': 'images/be.png'
            }
        },
        {
            selector: 'node.and, node.compound-and[expanded-collapsed="collapsed"]',
            css: {
                'height': 66.65,
                'width': 50,
                'background-image': 'images/and.png'
            }
        },
        {
            selector: 'node.or, node.compound-or[expanded-collapsed="collapsed"]',
            css: {
                'height': 66.65,
                'width': 50,
                'background-image': 'images/or.png'
        }
        },
        {
            selector: 'node.vot, node.compound-vot[expanded-collapsed="collapsed"]',
            css: {
                'height': 66.65,
                'width': 50,
                'background-image': 'images/and.png'
            }
        },
        {
            selector: 'node.pand, node.compound-pand[expanded-collapsed="collapsed"]',
            css: {
                'height': 66.65,
                'width': 50,
                'background-image': 'images/pand.png'
        }
        },
        {
            selector: 'node.por, node.compound-por[expanded-collapsed="collapsed"]',
            css: {
                'height': 66.65,
                'width': 50,
                'background-image': 'images/por.png'
        }
        },
        {
            selector: 'node.pdep, node.compound-pdep[expanded-collapsed="collapsed"]',
            css: {
                'height': 50,
                'width': 100,
                'background-image': 'images/fdep.png'
            }
        },
        {
            selector: 'node.fdep, node.compound-fdep[expanded-collapsed="collapsed"]',
            css: {
                'height': 50,
                'width': 100,
                'background-image': 'images/fdep.png'
            }
        },
        {
            selector: 'node.spare, node.compound-spare[expanded-collapsed="collapsed"]',
            css: {
                'height': 50,
                'width': 100,
                'background-image': 'images/spare.png'
            }
        },
        {
            selector: 'node.seq, node.compound-seq[expanded-collapsed="collapsed"]',
            css: {
                'height': 26,
                'width': 49,
                'background-image': 'images/seq.png'
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
        {
            selector: 'edge',
            css: {
                label: '',
                'width': 2,
                'target-arrow-shape': 'triangle',
                'line-style': 'solid',
                'line-color': '#808080',
                'target-arrow-color': '#808080',
                'curve-style': 'bezier',
            }
        },
        {
            selector: 'edge.pand, edge.por, edge.spare, edge.seq',
            css: {
                label: 'data(index)',
            }
        },
        {
            selector: 'edge.pdep, edge.fdep',
            css: {
                label: 'data(index)',
                'line-style': 'dashed',
            }
        },

    ]
});

// Initialize context menu
cy.contextMenus({
    menuItems: [
        {
            id: 'rename',
            title: 'rename',
            selector: 'node[type != "compound"]',
            onClickFunction: function (event) {
                var elemName = prompt("Element name", event.cyTarget.data('name'));
                if (elemName != null) {
                    event.cyTarget.data('name', elemName);
                    setLabelNode(event.cyTarget);
                }
            },
        },
        {
            id: 'changerate',
            title: 'change rate',
            selector: 'node.be',
            onClickFunction: function (event) {
                var rate = prompt("Failure rate", event.cyTarget.data('rate'));
                if (rate != null) {
                    event.cyTarget.data('rate', rate);
                    setLabelNode(event.cyTarget);
                }
            },
        },
        {
            id: 'changerepair',
            title: 'change repair',
            selector: 'node.be',
            onClickFunction: function (event) {
                var repair = prompt("Repair rate", event.cyTarget.data('repair'));
                if (repair != null) {
                    event.cyTarget.data('repair', repair);
                    setLabelNode(event.cyTarget);
                }
            },
        },
        {
            id: 'changedorm',
            title: 'change dormancy',
            selector: 'node.be',
            onClickFunction: function (event) {
                var dorm = prompt("Dormancy factor", event.cyTarget.data('dorm'));
                if (dorm != null) {
                    event.cyTarget.data('dorm', dorm);
                }
            },
        },
        {
            id: 'changethreshold',
            title: 'change threshold',
            selector: 'node.vot',
            onClickFunction: function (event) {
                var voting = prompt("Voting threshold", event.cyTarget.data('voting'));
                if (voting != null) {
                    event.cyTarget.data('voting', voting);
                    setLabelNode(event.cyTarget);
                }
            },
        },
        {
            id: 'toplevel',
            title: 'set as toplevel',
            selector: 'node[type != "compound"]',
            onClickFunction: function (event) {
                setToplevel(event.cyTarget);
            },
            hasTrailingDivider: true
        },
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
            id: 'add-vot',
            title: 'add VOT',
            coreAsWell: true,
            onClickFunction: function (event) {
                addNode(event, DftTypes.VOT);
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
            },
            hasTrailingDivider: true
        },
        {
            id: 'add-block',
            title: 'add block',
            coreAsWell: true,
            onClickFunction: function (event) {
                addBlock(event);
            },
        },
        {
            id: 'add-covered-failure',
            title: 'add covered fault',
            coreAsWell: true,
            onClickFunction: function (event) {
                addCoveredFailure(event);
            },
            hasTrailingDivider: true
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
    edgeType: function(sourceNode, targetNode) {
        if (sourceNode.data('type') == DftTypes.BE) {
            // No edges starting from BEs
            return null;
        }
        if (sourceNode.data('type') == DftTypes.COMPOUND || targetNode.data('type') == DftTypes.COMPOUND) {
            // No edges from compound nodes
            return null;
        }
        return 'flat';
    },
    edgeParams: function(sourceNode, targetNode, i) {
        return getNewEdge(sourceNode, targetNode);
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
            console.log("Already exists");
            cy.remove(addedEdge);
        } else {
            addEdge(addedEdge, sourceNode, targetNode);
        }
        // Update labels
        if (sourceNode.data('type') == DftTypes.VOT) {
            setLabelNode(sourceNode);
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