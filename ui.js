// Set max/min zoomlevel
cy.maxZoom(3);
cy.minZoom(0.7);

// Information Array
var foundElements = [];
var counter = 0;
var maxCount = 0;
var transferObjectEnter = {};

// Switch Elements
var switchElem = {};
var switched = false;

// Name handling
var usedNames = new Set();

// Edge Adding 
var setEdges = false;
var sourceNode = {};
var targetNode = {};


$('#option-icon').on('click', function() {
    $('#cy').toggleClass('not-Clicked');
    $('#cy').toggleClass('clicked');

    toggleOptionBar();
});

function toggleOptionBar() {
    $('.clicked').animate({'top': '257px'}, { start: function() { $('#option-bar').toggle(); }, done: function() { $('#cy').css('zIndex', '-1'); } });
    $('.not-Clicked').animate({'top': '72px'}, { start: function() { $('#cy').css('zIndex', '0'); }, done: function() {$('#option-bar').toggle(); } }, 'fast');
}

$(function() {
    $('#tabs').tabs();
    $('#be-elem').draggable({revert: true, revertDuration: 1});
    $('#and-elem').draggable({revert: true, revertDuration: 1});
    $('#or-elem').draggable({revert: true, revertDuration: 1});
    $('#vot-elem').draggable({revert: true, revertDuration: 1});
    $('#pand-elem').draggable({revert: true, revertDuration: 1});
    $('#por-elem').draggable({revert: true, revertDuration: 1});
    $('#fdep-elem').draggable({revert: true, revertDuration: 1});
    $('#pdep-elem').draggable({revert: true, revertDuration: 1});
    $('#spare-elem').draggable({revert: true, revertDuration: 1});
    $('#seq-elem').draggable({revert: true, revertDuration: 1});

    // Search field 
    $('#search-input').val("");

    // Tooltipps
    $('#name-be').tooltip({
        position: { my: 'left+45 center', at: 'right center'}
    });
    $('#failure').tooltip({
        position: { my: 'left+45 center', at: 'right center'}
    });
    $('#repair').tooltip({
        position: { my: 'left+45 center', at: 'right center'}
    });
    $('#dormancy').tooltip({
        position: { my: 'left+45 center', at: 'right center'}
    });

    $('#name-gate').tooltip({
        position: { my: 'left+45 center', at: 'right center'}
    });

    $('#name-vot').tooltip({
        position: { my: 'left+45 center', at: 'right center'}
    });

    $('#threshold').tooltip({
        position: { my: 'left+45 center', at: 'right center'}
    });

    // Clear Inputs
    $('#name-be').val('');
    $('#failure').val('');
    $('#repair').val('');
    $('#dormancy').val('');
    $('#name-vot').val('');
    $('#threshold').val('');
    $('#name-gate').val('');

    // Edge Adding checkboxradio
    $('#edge-radio').checkboxradio({
    });
    $('#edge-radio').attr('checked', false);
    $('#edge-radio').checkboxradio('refresh');

    // Parents drop down menu
    $('#info-parents').hover(    
        function() {
            $('#hover-div').slideDown('medium');
        }
    );
    $('#hover-div').on('mouseleave', function() {
        $('#hover-div').slideUp('medium');
    });
});

// Dragstop events
$('#be-elem').on('dragstart', function(event, ui) {
    if (window.outerWidth < 1500) {
        dragHelperStart();
    }
});
$('#be-elem').on('dragstop', function(event, ui) {
    openDialog((ui.position.left + 250), (ui.position.top - 150), DftTypes.BE);
    if (window.outerWidth < 1500) {
        dragHelperStop();
    }
});
$('#and-elem').on('dragstart', function(event, ui) {
    if (window.outerWidth < 1500) {
        dragHelperStart();
    }
});
$('#and-elem').on('dragstop', function(event, ui) {
    openDialog((ui.position.left + 250), (ui.position.top - 150), DftTypes.AND);
    if (window.outerWidth < 1500) {
        dragHelperStop();
    }
});
$('#or-elem').on('dragstart', function(event, ui) {
    if (window.outerWidth < 1500) {
        dragHelperStart();
    }
});
$('#or-elem').on('dragstop', function(event, ui) {
    openDialog((ui.position.left + 250), (ui.position.top - 150), DftTypes.OR);
    if (window.outerWidth < 1500) {
        dragHelperStop();
    }
});
$('#vot-elem').on('dragstart', function(event, ui) {
    if (window.outerWidth < 1500) {
        dragHelperStart();
    }
});
$('#vot-elem').on('dragstop', function(event, ui) {
    openDialog((ui.position.left + 250), (ui.position.top - 150), DftTypes.VOT);
    if (window.outerWidth < 1500) {
        dragHelperStop();
    }
});
$('#pand-elem').on('dragstart', function(event, ui) {
    if (window.outerWidth < 1500) {
        dragHelperStartDyn();
    }
});
$('#pand-elem').on('dragstop', function(event, ui) {
    openDialog((ui.position.left + 250), (ui.position.top - 150), DftTypes.PAND);
    if (window.outerWidth < 1500) {
        dragHelperStopDyn();
    }
});
$('#por-elem').on('dragstart', function(event, ui) {
    if (window.outerWidth < 1500) {
        dragHelperStartDyn();
    }
});
$('#por-elem').on('dragstop', function(event, ui) {
    openDialog((ui.position.left + 250), (ui.position.top - 150), DftTypes.POR);
    if (window.outerWidth < 1500) {
        dragHelperStopDyn();
    }
});
$('#fdep-elem').on('dragstart', function(event, ui) {
    if (window.outerWidth < 1500) {
        dragHelperStartDyn();
    }
});
$('#fdep-elem').on('dragstop', function(event, ui) {
    openDialog((ui.position.left + 250), (ui.position.top - 150), DftTypes.FDEP);
    if (window.outerWidth < 1500) {
        dragHelperStopDyn();
    }
});
$('#pdep-elem').on('dragstart', function(event, ui) {
    if (window.outerWidth < 1500) {
        dragHelperStartDyn();
    }
});
$('#pdep-elem').on('dragstop', function(event, ui) {
    openDialog((ui.position.left + 250), (ui.position.top - 150), DftTypes.PDEP);
    if (window.outerWidth < 1500) {
        dragHelperStopDyn();
    }
}); 
$('#spare-elem').on('dragstart', function(event, ui) {
    if (window.outerWidth < 1500) {
        dragHelperStartDyn();
    }
});
$('#spare-elem').on('dragstop', function(event, ui) {
    openDialog((ui.position.left + 250), (ui.position.top - 150), DftTypes.SPARE);
    if (window.outerWidth < 1500) {
        dragHelperStopDyn();
    }
});
$('#seq-elem').on('dragstart', function(event, ui) {
    if (window.outerWidth < 1500) {
        dragHelperStartDyn();
    }
});
$('#seq-elem').on('dragstop', function(event, ui) {
    openDialog((ui.position.left + 250), (ui.position.top - 150), DftTypes.SEQ);
    if (window.outerWidth < 1500) {
        dragHelperStopDyn();
    }
}); 

function dragHelperStart() {
    $('.ui-tabs').css('overflow', 'visible');
    $('#dynamic-elements').css('display', 'none');
}
function dragHelperStop() {
    $('.ui-tabs').css('overflow', 'scroll');
    $('#dynamic-elements').css('display', 'inline-block');
}
function dragHelperStartDyn() {
    $('.ui-tabs').css('overflow', 'visible');
    $('#static-elements').css('display', 'none');
}
function dragHelperStopDyn() {
    $('.ui-tabs').css('overflow', 'scroll');
    $('#static-elements').css('display', 'inline-block');
}

window.onresize = function(event) {
    if (window.outerWidth > 1500) {
        $('.ui-tabs').css('overflow', 'visible');
    } else $('.ui-tabs').css('overflow', 'scroll');
}

// ADD Buttons

$('#be-button').on('click', function() {
    openDialog(cy.width()/2, cy.height()/2, DftTypes.BE);
});
$('#and-button').on('click', function() {
    openDialog(cy.width()/2, cy.height()/2, DftTypes.AND);
});
$('#or-button').on('click', function() {
    openDialog(cy.width()/2, cy.height()/2, DftTypes.OR);
});
$('#vot-button').on('click', function() {
    openDialog(cy.width()/2, cy.height()/2, DftTypes.VOT);
});
$('#pand-button').on('click', function() {
    openDialog(cy.width()/2, cy.height()/2, DftTypes.PAND);
});
$('#por-button').on('click', function() {
    openDialog(cy.width()/2, cy.height()/2, DftTypes.POR);
});
$('#fdep-button').on('click', function() {
    openDialog(cy.width()/2, cy.height()/2, DftTypes.FDEP);
});
$('#pdep-button').on('click', function() {
    openDialog(cy.width()/2, cy.height()/2, DftTypes.PDEP);
});
$('#spare-button').on('click', function() {
    openDialog(cy.width()/2, cy.height()/2, DftTypes.SPARE);
});
$('#seq-button').on('click', function() {
    openDialog(cy.width()/2, cy.height()/2, DftTypes.SEQ);
});


// locate
$('#locate').on('click', function() {
    if (topLevelId > -1) {
        var eles = $('#' + topLevelId);
        cy.center(eles);
    } else  cy.center();
});
$('#locate').on('hover', function() {
    alert("Hover");
});

// lock and unlock all elements
$('#lock').on('click', function() {
    if($('#lock').hasClass('clickedLock')) {
        unlockAll();
    } else {
        lockAll();
    }
    $('#lock').toggleClass('clickedLock');

});




// Search Information stuff

$('#searchForElement').on('click', function() {
    // Get search field input
    if (!$('#search-input').val()) {
        $('#searchError').text("Empty Input");
        $('#searchError').animate({paddingLeft: '+=10'}, 'fast');
        $('#searchError').animate({paddingLeft: '-=10'}, 'slow');
    } else {
        foundElements = [];
        counter = 0;
        searchElement();        
    }
});
$('#search-input').on('input', function() {
    $('#searchError').text("");
});

function strcmp(a, b) {
    a = a.toString();
    b = b.toString();
    return a === b;
}

function searchElement() {
    var input = $('#search-input').val();
    var eles = cy.nodes().filter(function(){
        return strcmp(input, this.data('name'));
    });
    if(eles.empty()) {
        alert("Null");
    } else {
        // Found some
        eles.forEach( function(ele) {
            foundElements.push(ele);
        });
        maxCount = foundElements.length - 1;
        $('#search-input').val("");
        prepareResult();
    }
}

// Check which type of node and change eventually gui
function prepareResult() {
    var elem = foundElements[counter];
    // Check type
    var type = elem.data('type');

    if (type == 'be') {

        $('#info-data-be').removeClass('nonViss');
        $('#info-data-gate').addClass('nonViss');
        $('#info-data-fdep').addClass('nonViss');
        $('#info-data-pdep').addClass('nonViss');
        $('#info-data-spare').addClass('nonViss');

        $('#info-pic-big').addClass('nonViss');
        $('#info-pic-small').removeClass('nonViss');
        $('#info-pic-small-pic').attr('src', 'img/beInv.png');
        $('#info-pic-small-text').text(type.toUpperCase());

    } else if (type == 'vot' || type == 'pand' || type == 'por' || type == 'or' || type == 'and' || type == 'seq') {

        $('#info-data-gate').removeClass('nonViss');
        $('#info-data-be').addClass('nonViss');
        $('#info-data-fdep').addClass('nonViss');
        $('#info-data-pdep').addClass('nonViss');
        $('#info-data-spare').addClass('nonViss');

        if (type == 'seq') {
            $('#info-pic-small').addClass('nonViss');
            $('#info-pic-big').removeClass('nonViss');
            $('#info-pic-big-pic').attr('src', 'img/seqInv.png');
            $('#info-pic-big-text').text(type.toUpperCase());
        } else {
            $('#info-pic-big').addClass('nonViss');
            $('#info-pic-small').removeClass('nonViss');
            $('#info-pic-small-pic').attr('src', 'img/' + type + 'Inv.png');
            $('#info-pic-small-text').text(type.toUpperCase());
        }
    } else if (type == 'pdep') {

        $('#info-data-gate').addClass('nonViss');
        $('#info-data-be').addClass('nonViss');
        $('#info-data-pdep').removeClass('nonViss');
        $('#info-data-fdep').addClass('nonViss');
        $('#info-data-spare').addClass('nonViss');

        $('#info-pic-small').addClass('nonViss');
        $('#info-pic-big').removeClass('nonViss');
        $('#info-pic-big-pic').attr('src', 'img/pdep.png');
        $('#info-pic-big-text').text(type.toUpperCase());

    } else if (type == 'spare') {

        $('#info-data-gate').addClass('nonViss');
        $('#info-data-be').addClass('nonViss');
        $('#info-data-fdep').addClass('nonViss');
        $('#info-data-pdep').addClass('nonViss');
        $('#info-data-spare').removeClass('nonViss');

        $('#info-pic-small').addClass('nonViss');
        $('#info-pic-big').removeClass('nonViss');
        $('#info-pic-big-pic').attr('src', 'img/spare.png');
        $('#info-pic-big-text').text(type.toUpperCase());

    } else {

        $('#info-data-gate').addClass('nonViss');
        $('#info-data-be').addClass('nonViss');
        $('#info-data-fdep').removeClass('nonViss');
        $('#info-data-pdep').addClass('nonViss');
        $('#info-data-spare').addClass('nonViss');

        $('#info-pic-small').addClass('nonViss');
        $('#info-pic-big').removeClass('nonViss');
        $('#info-pic-big-pic').attr('src', 'img/fdep.png');
        $('#info-pic-big-text').text(type.toUpperCase());
    }

    showElement(elem, type);
}

// Display the element in the info box
function showElement(elem, type) {
    $('#info-name').text(elem.data('name'));
    $('#info-id').text(elem.data('id'));
    // Parents

    if (type == 'be') {
        $('#info-failure').text(elem.data('rate'));
        $('#info-repair').text(elem.data('repair'));
        $('#info-dormancy').text(elem.data('dorm'));
    } else if (type == 'vot') {
        $('#info-threshold').text(elem.data('voting'));
    } else $('#info-threshold').text("-");
    if (type == 'vot' || type == 'pand' || type == 'por' || type == 'or' || type == 'and' || type == 'seq') {
        $('#info-children').text("Keine");
    }


    cy.center(elem);
}

$('#next').on('click', function() {
    if (counter == maxCount) {
        counter = 0;
    } else counter++;
    prepareResult();
});

$('#last').on('click', function() {
    if (counter == 0) {
        counter = maxCount;
    } else counter--;
    prepareResult();
});


// REGEX TEST

$('#testButton').on('click', checkText);

function checkText() {
    var input = $('#testField').val();
    var reg = /^\w*$/;
    $('#testField').val('');
    if(reg.test(input)) {
        $('#testCheck').text('True');
        $('#testCheck').animate({paddingLeft:'+=5px'}, 'fast');
        $('#testCheck').animate({paddingLeft:'-=5px'}, 'slow');
    } else {
        $('#testCheck').text('False');
        $('#testCheck').animate({paddingLeft:'+=5px'}, 'fast');
        $('#testCheck').animate({paddingLeft:'-=5px'}, 'slow');
    }
}
    // REGEXE    
    var regName = /^[a-zA-Z]\w*$|^$/; 
    var regRate = /^'[a-zA-Z]+\w*'$|^\d*\.?\d*$|^$/;
    var regDorm = /^'[a-zA-Z]+\w*'$|^0?\.\d*$|^[01]$|^$|1\.0*/;
    var regThresh = /^[1-9]+[0-9]*$|^[1-9]+\d*\.[0]*$|^$/;

$('.switchHelp').keydown(function (e) {
    if (e.which === 13) {
        if(switched) {
            if (validationCheck($('#switch-type').val())) {
                switchElement($('#switch-type').val());
                switched = false;
            }
        } else {
            if (!validationCheck(transferObjectEnter.type)) {
            } else {
                invalidNameReset();
                if (transferObjectEnter.type == '-gate') {
                if (transferObjectEnter.create) {
                        addGate(transferObjectEnter.x, transferObjectEnter.y, transferObjectEnter.dftType);                        
                    } else changeGate(transferObjectEnter.elem);
                } else if (transferObjectEnter.type == '-pdep') {
                    if(transferObjectEnter.create) {
                        addPDEP(transferObjectEnter.x, transferObjectEnter.y, transferObjectEnter.dftType);
                    } else changePDEP(transferObjectEnter.elem);
                } else if (transferObjectEnter.type.indexOf('e') > -1) {
                    if (transferObjectEnter.create) {
                        addBE(transferObjectEnter.x, transferObjectEnter.y);
                    } else changeBE(transferObjectEnter.elem);
                } else if (transferObjectEnter.type.indexOf('t') > -1) {
                    if (transferObjectEnter.create) {
                        addVot(transferObjectEnter.x, transferObjectEnter.y);
                    } else changeVot(transferObjectEnter.elem);
                } else {
                    alert("HERE");
                }   
            }
        }
    }
});

// ValidationCheck 

function validationCheck(type) {
    if (type == '-gate') {
        var input = checkName($('#name-gate').val(), transferObjectEnter.dftType);
        var size = usedNames.size;
        addName(input);
        if (size == usedNames.size) {
            // Name already in use.
            invalidName(true);
            return false;
        }
        if(regName.test(input)) {
            return true;
        } else {
            invalidName(false);
            if (removeName(input)) {
                return false;
            } else alert('Name not found!');
        }
    } else if (type == '-be') {
        var input = checkName($('#name-be').val(), transferObjectEnter.dftType);
        var size = usedNames.size;
        addName(input);
        if (size == usedNames.size) {
            // Name already in use.
            invalidName(true);
            return false;
        }
        if (!regName.test(input)) {
            invalidName(false);
            if (removeName(input)) {
                return false;
            } else alert('Name not found!');
        }
        if (!regRate.test($('#failure').val()) || !regRate.test($('#repair').val())) {
            invalidName(false);
            if (removeName(input)) {
                return false;
            } else alert('Name not found!');
        } 
        if (!regDorm.test($('#dormancy').val())) {
            invalidName(false);
            if (removeName(input)) {
                return false;
            } else alert('Name not found!');
        }
        return true;
    } else if (type == '-pdep') {
        var input = checkName($('#name-pdep').val(), transferObjectEnter.dftType);
        var size = usedNames.size;
        addName(input);
        if (size == usedNames.size) {
            // Name already in use
            invalidName(true);
            return false;
        }
        if(!regName.test(input)) {
            invalidName(false);
            if (removeName(input)) {
                return false;
            } else alert('Name not found!');           
        }
        if (!regRate.test($('#probability-pdep').val())) {
            invalidName(false);
            if (removeName(input)) {
                return false;
            } else alert('Name not found!');
        }
        return true;   
    } else {
        var input = checkName($('#name-vot').val(), transferObjectEnter.dftType);
        var size = usedNames.size;
        addName(input);
        if (size == usedNames.size) {
            // Name already in use.
            invalidName(true);
            return false;
        }
        if (!regThresh.test($('#threshold').val())) {
            invalidName(false);
            if (removeName(input)) {
                return false;
            } else alert('Name not found!');
        }
        if (!regName.test(input)) {
            invalidName(false);
            if (removeName(input)) {
                return false;
            } else alert('Name not found!');
        }
        return true;
    } 
}

function addName(name) {
    if (name != "") {
        usedNames.add(name);
    }
}

function removeName(name) {
    return usedNames.delete(name);
}

function invalidName(name) {
    if (name) {
        $('.errorLabel').text('Name already in Use!');
    } else $('.errorLabel').text('Invalid Input!');
}

function invalidNameReset() {
    $('.errorLabel').text('');
}

// Gate type switch
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


// TEST FUNCTION

function testFunction(node) {
    node.outgoers().edges().forEach(function(edge) {
        alert(edge.id());
    });
}   

// Edge Adding

    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    
    var checkbox = $('#edge-radio');
    checkbox.change(function(event) {
        var checkbox = event.target;
        sourceNode = {};
        targetNode = {};
        if (checkbox.checked) {
            setEdges = true;
        } else {
            $('#edge-info').removeClass('red');
            $('#edge-info').text('Add edges by clicking on source and target node.');
            setEdges = false;
        }
    });

    cy.on('click', 'node', function(event) {
        if (setEdges) {
            if (isEmpty(sourceNode)) {
                if (event.cyTarget.data('type') != DftTypes.BE) {
                    $('#edge-info').removeClass('red');
                    $('#edge-info').text('Add edges by clicking on source and target node.');
                    sourceNode = event.cyTarget;                    
                } else {
                    // BE first
                    $('#edge-info').text('Error message: No BEs as source!');
                    $('#edge-info').addClass('red');
                }
            } else if (isEmpty(targetNode)) {
                targetNode = event.cyTarget;
                if (sourceNode === targetNode) {
                    sourceNode = {};
                    targetNode = {};
                    $('#edge-info').text('Error message: No self-loops allowed!');
                    $('#edge-info').addClass('red');
                } else {
                    createEdge(sourceNode, targetNode);
                    sourceNode = {};
                    targetNode = {};
                }
            }
        }
    });
