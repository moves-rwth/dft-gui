// Cytoscape graph visualization.

// DEVELOPER MODE
const DEVELOPER = false;
// TopNode set?
var topNodeSet = false;

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
    if (topNodeSet) {
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
    } else alert("No top element found!");
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

// Set label for a node.
function setLabelNode(node) {
    var elemName = node.data('name');
    if (node.data('type') == DftTypes.BE) {
        var rate = node.data('rate');
        if (rate < 0.001 && rate != 0) {
            var num = new Number(rate);
            rate = num.toExponential();
        }
        var repair = node.data('repair');
        if (repair < 0.001 && repair != 0) {
            var num = new Number(repair);
            repair = num.toExponential();
        }
        if (repair != 0) {
            node.data('label', elemName + ' (\u03BB: ' + rate + ', r: ' + repair + ')');
        } else {
            node.data('label', elemName + ' (\u03BB: ' + rate + ')');
        }
    } else if (node.data('type') == DftTypes.BOT) {
        node.data('label', elemName);
    } else if (node.data('type') == DftTypes.COMPOUND) {
        node.data('label', elemName);
    } else if (node.data('type') == DftTypes.VOT) {
        var voting = node.data('voting') + "/" + node.data('children').length;
        node.data('label', elemName + ' (' + voting + ')');
    } else if (node.data('type') == DftTypes.PDEP) {
        var probability = node.data('probability');
        node.data('label', elemName + ' (P: ' + probability + ')');
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
    topNodeSet = true;
}

// Add subtree for block
function addBlock(event) {
    var blockName = prompt("Block name", currentId+1);
    // Create subtree
    createBlock(blockName, event.cyPosition.x, event.cyPosition.y);
}

// Add subtree for (partly) covered failures
function addCoveredFailure(event) {
    var faultName = prompt('Element name', 'fault' + (currentId+1));
    var rate = prompt('Failure rate of fault', 0.0);
    var coverage = -1;
    while (coverage < 0.0 || coverage > 1.0) {
        coverage = prompt('Fault coverage', 0.0);
    }
    var safetyRate = prompt('Failure rate of safety mechanism', 0.0);
    // Create subtree
    createCoveredFailure(faultName, rate, coverage, safetyRate, event.cyPosition.x, event.cyPosition.y);
}

////////////////////////////////////////

// Add a node
function addNode(event, dftType) {
    openDialog(event.cyPosition.x, event.cyPosition.y, dftType);
}

// Open a specific dialog ui for input
function openDialog(posX, posY, dftType, create = true, elem) {
    // If createObj.create == TRUE, a new element is created. Otherwise an existing element is changed
    var heightVal;
    var type;

    // Save elem for switching
    switchElem = elem;

    switch(dftType) {
        case DftTypes.BE: heightVal = 400; type = '-be'; break;
        case DftTypes.VOT: heightVal = 300; type = '-vot'; break;
        case DftTypes.PDEP: heightVal = 300; type = '-pdep'; break;
        default: heightVal = 225; type = '-gate';
    };

    if (create) {
        $('#gateSwitch-vot, #gateSwitch-gate, #gateSwitch-pdep').addClass('nonVis');
        $('#gateSwitch-vot, #gateSwitch-gate, #gateSwitch-pdep').removeClass('vis');

    } else {
        $('#gateSwitch-vot, #gateSwitch-gate, #gateSwitch-pdep').addClass('vis');
        $('#gateSwitch-vot, #gateSwitch-gate, #gateSwitch-pdep').removeClass('nonVis');
    }

    if (type == '-gate' && create) {
        var sub = 'Create new ' + dftType.substring(dftType.indexOf('.') + 1).toUpperCase();
    } else if (type == '-be' && create){
        var sub = 'Create new BE';
    } else if (type == '-vot' && create){
        var sub = 'Create new VOT Gate';
    } else if (create) {
        var sub = 'Create new PDEP Gate';
    } else {
        var sub = 'Change Element'
    }

    transferObjectEnter.dftType = dftType;
    transferObjectEnter.x = posX;
    transferObjectEnter.y = posY;
    transferObjectEnter.elem = elem;
    transferObjectEnter.type = type;
    transferObjectEnter.create = create;

    if (elem) {
        var name = elem.data('name');
    }

    if (!create) {
        usedNames.delete(name);
    }

    $('#dialog' + type).dialog({
        width: 300,
        modal: true,
        title: sub,
        resizable: false,
        dialogClass: 'no-close',
        classes: {
            'ui-dialog': 'highlight'
        },
        buttons: [{
            id: 'confirmButton',
            text: 'Confirm',
            click: function() {
                if (!validationCheck(type)) {
                } else {
                    invalidNameReset();
                    if (type == '-gate') {
                        if (create) {
                            addGate(posX, posY, dftType); 
                        } else changeGate(elem);
                    } else if (type == '-pdep') {
                        if (create) {
                            addPDEP(posX, posY);
                        } else changePDEP(elem);
                    } else if (type.indexOf('e') > -1) {
                        if (create) {
                            addBE(posX, posY);
                        } else changeBE(elem);
                    } else if (type.indexOf('t') > -1) {
                        if (create) {
                            addVot(posX, posY);
                        } else changeVot(elem);
                    } else {
                        alert("HERE");
                    }
                    if (!create) {
                        propagateUp(elem, checkRepairable);
                    }
                }
                if (elem) {
                    fillInfoBox(elem);
                }
            }
        }, 
        {
            text: 'Cancel',
            click: function() {
                usedNames.add(name);
                $(this).dialog('close');
            }
        }],
        close: function() {
            $(this).dialog('close');
            invalidNameReset();
        }
    });
}



function addBE(posX, posY) {
    var elemName = checkName($('#name-be').val(), 'DftTypes.be', false);
    var rate = checkValue($('#failure').val());
    var repair = checkValue($('#repair').val());
    var dorm = checkValue($('#dormancy').val());
    $('#dialog-be').dialog('close');
    var newElement = createBe(elemName, rate, repair, dorm, posX, posY);
    createNode(newElement);
    // Empty inputs
    var list = ['name-be', 'failure', 'repair', 'dormancy'];
    for (var i = 0; i < list.length; i++) {
        $('#' + list[i]).val('');
    }
}

function changeBE(elem) {
    var id = elem.id();
    elem.data('name', checkName($('#name-be').val(), elem.data('type'), true, id));
    elem.data('rate', checkValue($('#failure').val()));
    elem.data('repair', checkValue($('#repair').val()));
    elem.data('dorm', checkValue($('#dormancy').val()));
    setLabelNode(elem)
    $('#dialog-be').dialog('close');
    // Empty inputs
    var list = ['name-be', 'failure', 'repair', 'dormancy'];
    for (var i = 0; i < list.length; i++) {
        $('#' + list[i]).val('');
    }
    if (elem.data('repair') > 0) {
        elem.data('repairable', true);
    } else elem.data('repairable', false);
}

function addVot(posX, posY, parent) {
    var elemName = checkName($('#name-vot').val(), 'DftTypes.vot', false);
    var threshold = checkValueVot($('#threshold').val());
    $('#dialog-vot').dialog('close');
    var newElement = createVotingGate(elemName, threshold, posX, posY);
    if (parent != null) {
        createNode(newElement, parent);
    } else {
        createNode(newElement);
    }
    // Empty inputs
    var list = ['name-vot', 'threshold'];
    for (var i = 0; i < list.length; i++) {
        $('#' + list[i]).val('');
    }
}

function addPDEP(posX, posY, parent) {
    var elemName = checkName($('#name-pdep').val(), 'DftTypes.pdep', false);
    var probability = checkValue($('#probability-pdep').val());
    $('#dialog-pdep').dialog('close');
    var newElement = createPDEPGate(elemName, probability, posX, posY);
    if (parent != null) {
        createNode(newElement, parent);
    } else {
        createNode(newElement);
    }
    // Empty Inputs
    var list = ['name-pdep', 'probability-pdep'];
    for (var i = 0; i < list.length; i++) {
        $('#' + list[i]).val('');
    }
}

function changeVot(elem) {
    var id = elem.id();
    elem.data('name', checkName($('#name-vot').val(), elem.data('type'), true, id));
    elem.data('voting', checkValueVot($('#threshold').val()));
    setLabelNode(elem);
    $('#dialog-vot').dialog('close');
    var list = ['name-vot', 'threshold'];
    for (var i = 0; i < list.length; i++) {
        $('#' + list[i]).val('');
    }
}

function changePDEP(elem) {
    var id = elem.id();
    elem.data('name', checkName($('#name-pdep').val(), elem.data('type'), true, id));
    elem.data('probability', checkValue($('#probability-pdep').val()));
    setLabelNode(elem);
    $('#dialog-pdep').dialog('close');
    var list = ['name-pdep', 'probability-pdep'];
    for (var i = 0; i < list.length; i++) {
        $('#' + list[i]).val('');
    }
}

function addGate(posX, posY, type, parent) {
    var elemName = checkName($('#name-gate').val(), type, false);
    $('#dialog-gate').dialog('close');
    var newElement = createGate(type, elemName, posX, posY);
    if (parent != null) {
        createNode(newElement, parent);
    } else {
        createNode(newElement);
    }
    $('#name-gate').val('');
}

function changeGate(elem) {
    var id = elem.id();
    elem.data('name', checkName($('#name-gate').val(), elem.data('type'), true, id));
    setLabelNode(elem);
    $('#dialog-gate').dialog('close');
    $('#name-gate').val('');
}

// Checks for undefined values. If some undefined found -> change to 0
//TODO Check if renaming to more general expression is desired (since it technically only parses and sets undefined to 0)
function checkValue(value) {
    if (value) {
        return parseFloat(value);
    } else {
        return 0;
    }
}
function checkValueVot(value) {
    if (value) {
        return parseInt(value);
    } else {
        return 1;
    }
}

// Checks for valid name. Otherwise returns gate type + currentID
function checkName(name, dftType, change, id) {
    if (name) {
        return name;
    } else {
        if(change) {
            var sub = dftType.substring(dftType.indexOf('.') + 1);
            var res =  sub + '_' + id;
            return res;
        } else {
            var sub = dftType.substring(dftType.indexOf('.') + 1);
            var res =  sub + '_' + (currentId + 1);
            return res;
        }
    }
}

//////////////////////////////////////////////////

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
                'background-opacity': 0,
                'background-fit': 'cover',
}
        },
        {
            selector: 'node.toplevel',
            css: {
                color: 'white',
                'font-size': '25px',
                'font-weight': 'bold'
            }
        },
        {
            selector: 'node.be_exp',
            css: {
                'height': 42,
                'width': 42,
                'background-image': 'img/beInv.png'
            }
        },
        {
            selector: 'node.be_const',
            css: {
                'height': 42,
                'width': 42,
                'background-image': 'img/bot.png'
            }
        },
        {
            selector: 'node.and, node.compound-and[expanded-collapsed="collapsed"]',
            css: {
                'height': 66.65,
                'width': 50,
                'background-image': 'img/andInv.png'
            }
        },
        {
            selector: 'node.or, node.compound-or[expanded-collapsed="collapsed"]',
            css: {
                'height': 66.65,
                'width': 50,
                'background-image': 'img/orInv.png'
        }
        },
        {
            selector: 'node.vot, node.compound-vot[expanded-collapsed="collapsed"]',
            css: {
                'height': 66.65,
                'width': 50,
                'background-image': 'img/andInv.png'
            }
        },
        {
            selector: 'node.pand, node.compound-pand[expanded-collapsed="collapsed"]',
            css: {
                'height': 66.65,
                'width': 50,
                'background-image': 'img/pandInv.png'
        }
        },
        {
            selector: 'node.por, node.compound-por[expanded-collapsed="collapsed"]',
            css: {
                'height': 66.65,
                'width': 50,
                'background-image': 'img/porInv.png'
        }
        },
        {
            selector: 'node.pdep, node.compound-pdep[expanded-collapsed="collapsed"]',
            css: {
                'height': 50,
                'width': 100,
                'background-image': 'img/pdep.png'
            }
        },
        {
            selector: 'node.fdep, node.compound-fdep[expanded-collapsed="collapsed"]',
            css: {
                'height': 50,
                'width': 100,
                'background-image': 'img/fdep.png'
            }
        },
        {
            selector: 'node.spare, node.compound-spare[expanded-collapsed="collapsed"]',
            css: {
                'height': 50,
                'width': 100,
                'background-image': 'img/spare.png'
            }
        },
        {
            selector: 'node.seq, node.compound-seq[expanded-collapsed="collapsed"]',
            css: {
                'height': 26,
                'width': 49,
                'background-image': 'img/seq.png'
            }
        },
        {
            selector: "[expanded-collapsed='expanded']",
            style: {
                label: '',
                'background-color': '#999999'
            }
        },
        {
            selector: 'edge',
            css: {
                label: '',
                'width': 2,
                'target-arrow-shape': 'triangle',
                'line-style': 'solid',
                'line-color': 'black',
                'target-arrow-color': 'black',
                'curve-style': 'bezier',
                'source-endpoint': 'outside-to-line'
            }
        },
        {
            selector: 'edge.pand, edge.por, edge.spare, edge.seq, edge.fdep, edge.pdep',
            css: {
                'source-label': 'data(index)',
                'source-text-margin-y': -25,
                'source-text-margin-x': -10,
                'source-text-offset': 60
            }
        },
        {
            selector: 'edge.fdep[index = 0], edge.pdep[index = 0], edge.spare[index > 0]',
            css: {
                'source-label': 'data(index)',
                'source-text-margin-y': -25,
                'source-text-margin-x': -10,
                'source-text-offset': 60,
                'line-style': 'dashed',
            }
        },
    ]
});

// Initialize context menu

if (DEVELOPER) {
    cy.contextMenus({
        menuItems: [
            {
                id: 'change',
                title: 'change element',
                selector: 'node[type != "compound"]',
                onClickFunction: function (event) {
                    var el = {
                        x: event.cyTarget.position('x'),
                        y: event.cyTarget.position('y'),
                        type: event.cyTarget.data('type'),
                        create: false,
                        elem: event.cyTarget
                    };
                    fillInfoDialog(el);
                },
            },
            {
                id: 'toplevel',
                title: 'set as toplevel',
                selector: 'node[type != "compound"]',
                onClickFunction: function (event) {
                    setToplevel(event.cyTarget);
                }
            },
            {
                id: 'information',
                title: 'show info',
                selector: 'node',
                onClickFunction: function (event) {
                    fillInfoBox(event.cyTarget);

                }
            },
            {
                id: 'lockNode',
                title: 'lock node',
                selector: 'node:unlocked',
                onClickFunction: function (event) {
                    lockNode(event.cyTarget);
                },
            },
            {
                id: 'unlockNode',
                title: 'unlock node',
                selector: 'node:locked',
                onClickFunction: function (event) {
                    unlockNode(event.cyTarget);
                },
            },
            {
                id: 'copyPaste',
                title: 'clone elements',
                selector: 'node',
                onClickFunction: function (event) {
                    copyPaste(event.cyTarget);
                }
            },
            {
                id: 'collapse',
                title: 'collapse element',
                selector: 'node[type != "compound"][type != "be_exp"]',
                onClickFunction: function (event) {
                    newCompoundMove(event.cyTarget);
                },
                hasTrailingDivider: true
            },
            {
                id: 'removeCompound',
                title: 'remove compound',
                selector: '[expanded-collapsed="expanded"]',
                onClickFunction: function (event) {
                    removeCompound(event.cyTarget);
                },
                hasTrailingDivider: true
            },
            {
                id: 'log',
                title: 'show in console',
                selector: 'node',
                onClickFunction: function (event) {
                    console.log(event.cyTarget);
                },
            },
            {
                id: 'id',
                title: 'show id',
                selector: 'node',
                onClickFunction: function (event) {
                    alert(event.cyTarget.id());
                    var children = event.cyTarget.data('children');
                    console.log(children);
                    console.log(event.cyTarget.position());
                }
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
                id: 'add-covered-failure',
                title: 'add covered fault',
                coreAsWell: true,
                onClickFunction: function (event) {
                    createBlock('A', 500, 500);
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
} 
// Normal mode
else {
    cy.contextMenus({
        menuItems: [
            {
                id: 'change',
                title: 'change element',
                selector: 'node[type != "compound"]',
                onClickFunction: function (event) {
                    var el = {
                        x: event.cyTarget.position('x'),
                        y: event.cyTarget.position('y'),
                        type: event.cyTarget.data('type'),
                        create: false,
                        elem: event.cyTarget
                    };
                    // Insert actual values
                    if (el.type == DftTypes.BE) {
                        $('#name-be').val(el.elem.data('name'));
                        $('#failure').val(el.elem.data('rate'));
                        $('#repair').val(el.elem.data('repair'));
                        $('#dormancy').val(el.elem.data('dorm'));
                    } else if (el.type == DftTypes.VOT) {
                        $('#name-vot').val(el.elem.data('name'));
                        $('#threshold').val(el.elem.data('voting'));
                    } else if (el.type == DftTypes.PDEP) {
                        $('#name-pdep').val(el.elem.data('name'));
                        $('#probability-pdep').val(el.elem.data('probability'));
                    } else {
                        $('#name-gate').val(el.elem.data('name'));
                    }
                    openDialog(el.x, el.y, el.type, el.create, el.elem);
                },
            },
            {
                id: 'toplevel',
                title: 'set as toplevel',
                selector: 'node[type != "compound"]',
                onClickFunction: function (event) {
                    setToplevel(event.cyTarget);
                }
            },
            {
                id: 'information',
                title: 'show info',
                selector: 'node',
                onClickFunction: function (event) {
                    fillInfoBox(event.cyTarget);
                }
            },
            {
                id: 'lockNode',
                title: 'lock node',
                selector: 'node:unlocked',
                onClickFunction: function (event) {
                    lockNode(event.cyTarget);
                },
            },
            {
                id: 'unlockNode',
                title: 'unlock node',
                selector: 'node:locked',
                onClickFunction: function (event) {
                    unlockNode(event.cyTarget);
                },
            },
            {
                id: 'copyPaste',
                title: 'clone elements',
                selector: 'node',
                onClickFunction: function (event) {
                    copyPaste(event.cyTarget);
                }
            },
            {
                id: 'collapse',
                title: 'collapse element',
                selector: 'node[type != "compound"][type != "be_exp"]',
                onClickFunction: function (event) {
                    newCompoundMove(event.cyTarget);
                },
                hasTrailingDivider: true
            },
            {
                id: 'removeCompound',
                title: 'remove compound',
                selector: '[expanded-collapsed="expanded"]',
                onClickFunction: function (event) {
                    removeCompound(event.cyTarget);
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
}

// Initialize edgehandles.
cy.edgehandles({
    toggleOffOnLeave: true,
    handleNodes: "node",
    handleSize: 30,
    handleOutlineWidth: 10,
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
        if (targetNode.data('type') == DftTypes.SEQ) {
            // SEQs are not allowed to be children of other nodes
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
        //TODO Give some kinda feedback to indicate failure due to invalid edge
        if (addedEdge.data('id') == 'idInvalid' || addedEdge.data('id') == 'cycle') {
            console.log("Edge invalid");
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
    fisheye: false,
    undoable: false,
    cueEnabled: true,
});


