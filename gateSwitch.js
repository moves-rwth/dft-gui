/*   ________________________________________________________________________________
 *  |Components for switching the gate type in a DFT.                                |
 *  |________________________________________________________________________________|
 */  

/*  JQuerry onClick functions
 *
 *  Prepare the visable gui elements for the switching and call the switchElement function.
 */
$('#gateSwitch-vot, #gateSwitch-gate, #gateSwitch-pdep').on('click', function() {
    switched = true;
    if (switchElem.data('type') == 'vot') {
        $('#dialog-vot').dialog('close');
    } else if (switchElem.data('type') == 'pdep') {
        $('#dialog-pdep').dialog('close');
    } else  {
        $('#dialog-gate').dialog('close');
    }
    $('#dialog-switch').dialog({
        width: 250,
        height: 250,

        modal: true,
        resizable: false,
        dialogClass: 'no-close',
        classes: {
            'ui-dialog': 'highlight'
        },
        buttons: [{
            id: 'switchConfirmButton',
            text: 'Change',
            click: function() {
                $(this).dialog('close');
                var type = $('#switch-type').val();
                if (type == 'vot') {
                    $('#gateSwitch-vot').addClass('nonVis');
                    $('#gateSwitch-vot').removeClass('vis');
                    var sub = 'Change to ' + $('#switch-type').val().toUpperCase();
                    $('#dialog-vot').dialog({
                        width: 300,
                        modal: true,
                        title: sub,
                        resizable: false,
                        dialogClass: 'no-close',
                        classes: {
                            'ui-dialog': 'highlight'
                        },
                        buttons: [{
                            id: 'switchConfirmButton-vot',
                            text: 'Confirm',
                            click: function() {
                                if (validationCheck($('#switch-type').val())) {
                                    switchElement(type);
                                    switched = false;
                                }
                            }
                        },
                        {
                            text: 'Cancel',
                            click: function() {
                                $(this).dialog('close');
                            }
                        }
                        ],
                        close: function() {
                            invalidNameReset();
                        }
                    });                    
                } else if (type == 'pdep') {
                    $('#gateSwitch-pdep').addClass('nonVis');
                    $('#gateSwitch-pdep').removeClass('vis');
                    var sub = 'Change to ' + $('#switch-type').val().toUpperCase();
                    $('#dialog-pdep').dialog({
                        width: 300,
                        modal: true,
                        title: sub,
                        resizable: false,
                        dialogClass: 'no-close',
                        classes: {
                            'ui-dialog': 'highlight'
                        },
                        buttons: [{
                            id: 'switchConfirmButton-pdep',
                            text: 'Confirm',
                            click: function() {
                                if (validationCheck($('#switch-type').val())) {
                                    switchElement(type);
                                    switched = false;
                                }
                            }
                        },
                        {
                            text: 'Cancel',
                            click: function() {
                                $(this).dialog('close');
                            }
                        }
                        ],
                        close: function() {
                            invalidNameReset();
                        }
                    });
                } else {
                    $('#gateSwitch-gate').addClass('nonVis');
                    $('#gateSwitch-gate').removeClass('vis');
                    var sub = 'Change to ' + $('#switch-type').val().toUpperCase();
                    $('#dialog-gate').dialog({
                        width: 300,
                        modal: true,
                        title: sub,
                        resizable: false,
                        dialogClass: 'no-close',
                        classes: {
                            'ui-dialog': 'highlight'
                        },
                        buttons: [{
                            id: 'switchConfirmButton-gate',
                            text: 'Confirm',
                            click: function() {
                                switchElement(type);
                                switched = false;
                            }
                        },
                        {
                            text: 'Cancel',
                            click: function() {
                                $(this).dialog('close');
                            }
                        }
                        ],
                        close: function() {
                            invalidNameReset();
                        }
                    });
                }
            }
        }, 
        {
            text: 'Cancel',
            click: function() {
                $(this).dialog('close');
            }
        }],
        close: function() {
            $(this).dialog('close');
        }
    });
});

/*  void  switchElement(type)
 *  @param type - the new type of the gate
 *   
 *
 *  Save all edges, delete old gate, create new gate and restore the edges.
 */
function switchElement(type) {
    var id = switchElem.data('id');

    // Save connected edges.
    var incomers = switchElem.incomers().edges();
    var outGoing = switchElem.outgoers().edges();
    removeNode(cy.getElementById(id));
    var storedCurrentId = currentId;
    currentId = switchElem.id() - 1;
    if (type == 'vot') {
        addVot(switchElem.position('x'), switchElem.position('y'), type);
    } else if (type == 'pdep') {
        addPDEP(switchElem.position('x'), switchElem.position('y'), type);
    } else {
        addGate(switchElem.position('x'), switchElem.position('y'), type);
    }
    currentId = storedCurrentId;

    // Restore edges
    outGoing.forEach(function(edge) {
        var sourceId = edge.data('source');
        var targetId = edge.data('target');

        addEdge(edge, cy.getElementById(sourceId), cy.getElementById(targetId));
        cy.add(edge);
    });

    incomers.forEach(function(edge) {
        var sourceId = edge.data('source');
        var targetId = edge.data('target');

        addEdge(edge, cy.getElementById(sourceId), cy.getElementById(targetId));
        cy.add(edge);
    });

    switchElem = {};
}