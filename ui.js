// DEVELOPER MODE
var DEVELOPER = true;

// Set max/min zoomlevel
cy.maxZoom(3);
cy.minZoom(0.7);

// Information Array
var actualElement;
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

// Timeout
var shouldClose = false;


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
    if (DEVELOPER) {
            $('#cy').toggleClass('not-Clicked');
            $('#cy').toggleClass('clicked');

            toggleOptionBar();
    }
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
            $('#hover_names').empty();        
            insertNamesToHover('parents');
        }
    );

    // Children drop down menu
    $('#info-children').hover(
        function() {
            $('#hover_names').empty();
            insertNamesToHover('children');
        }
    );
    $('#hover-div').on('mouseenter', function() {
        if (shouldClose) {
            shouldClose = false;
        }
    });
    $('#hover-div').on('mouseleave', function() {
        $('#hover_names').empty();
        $('#hover-div').slideUp('medium');
    });
});

function insertNamesToHover(type) {

    $('#hover_names').empty();
    if (actualElement) {
        if (type == 'parents') {
            var names = createParentStrings(actualElement);
            // Insert parents: into div
            $('#hover_names').append('<li class="underline">Parents: </li>');
        } else if (type == 'children') {
            var names = createChildrenStrings(actualElement);
            $('#hover_names').append('<li class="underline">Children: </li>');
        } else alert('Error in hoverdiv.');
        if (names != -1) {
            for (var i = 0; i < names.length; i++) {
                var name = names[i].name;
                var type = names[i].type;
                var id = names[i].id;
                if (name.length > 10) {
                    name = name.substring(0, 8) + '..';
                } else if (name.length < 10) {
                    var count = 10 - name.length;
                    while (count != 0) {
                        name += '&nbsp;';
                        count -= 1;
                    }
                }
                if (i >= 9) {
                    var res = (i+1) + '.&nbsp;' + name + '| (' + type.toUpperCase() + ')';
                } else {
                    var res = (i+1) + '.&nbsp;&nbsp;' + name + '| (' + type.toUpperCase() + ')';
                }
                var count2 = 5 - type.length;
                while (count2 != 0) {
                    res += '&nbsp;';
                    count2 -= 1;
                }

                if (i < 9) {
                    $('#hover_names').append('<li><a onclick="switchElementID(' + names[i].id + ')">' + res + '</a></li>');
                } else {
                    $('#hover_names').append('<li><a onclick="switchElementID(' + names[i].id + ')">' + res + '</a></li>');
                }
            }
        }

        $('#hover-div').slideDown('medium');
        shouldClose = true;
        window.setTimeout(timeOutClose, 5000);
    }
}

function timeOutClose() {
    if (shouldClose) {
        $('#hover-div').slideUp('medium');
        shouldClose = false;
    }
}

$('#search-input').on('focus', function() {
    // Autocomplete
    $('#search-input').autocomplete({
        autoFocus: true,
        source: [...usedNames]
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
            $('#search-input').val("");
            prepareResult(ele);
        });
    }
}

function switchElementID(id) {
    prepareResult(cy.getElementById(id));
}

// Check which type of node and change eventually gui
function prepareResult(elem) {
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

    var parents = createParentStrings(elem).length;
    if (parents > 0) {
        $('#info-parents').text(parents);
    } else $('#info-parents').text('0');

    if (type == 'be') {
        $('#info-failure').text(elem.data('rate'));
        $('#info-repair').text(elem.data('repair'));
        $('#info-dormancy').text(elem.data('dorm'));
    } else if (type == 'vot') {
        $('#info-threshold').text(elem.data('voting'));
    } else $('#info-threshold').text("-");
    if (type == 'vot' || type == 'pand' || type == 'por' || type == 'or' || type == 'and' || type == 'seq') {
        $('#info-children').text(elem.data('children').length);
        $('#info-repairable').text(elem.data('repairable'));
    } else if (type == 'fdep') {
        $('#info-children-fdep').text(elem.data('children').length);
        $('#info-repairable-fdep').text(elem.data('repairable'));
        $('#info-trigger-fdep').text(cy.getElementById(elem.data('children')[0]).data('name'));
        $('#info-trigger-fdep').on('click', function() {
            var node = cy.getElementById(elem.data('children')[0]);
            cy.center(node);
            prepareResult(node);
        });
    } else if (type == 'pdep') {
        $('#info-children-pdep').text(elem.data('children').length);
        $('#info-repairable-pdep').text(elem.data('repairable'));
        $('#info-probability').text(elem.data('probability'));
    } else if (type == 'spare') {
        $('#info-children-spare').text(elem.data('children').length);
        $('#info-repairable-spare').text(elem.data('repairable'));
        // Placeholder
        if (elem.data('children').length > 1) {
            $('#info-count').text(elem.data('children').length - 1);
        } else {
            $('#info-count').text(0);
        }
    }

    cy.center(elem);
    actualElement = elem;
    $('#hover_names').empty();
    $('#hover-div').slideUp('medium');
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

// Parents FUNCTION

function createParentStrings(node) {
    var incomers = node.incomers('node');
    var data = [];
    for (var i = 0; i < incomers.length; i++) {
        data.push(incomers[i]._private.data);
    }
    if(data.length > 0) {
        return data;
    } else return -1;
}   

function createChildrenStrings(node) {
    var children = node.data('children');
    var data = [];
    for (var i = 0; i < children.length; i++) {
        data.push(cy.getElementById(children[i])._private.data);
    }
    if (children.length > 0) {
        return data;
    } else return -1;
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

    cy.on('click', 'node[type != "compound"]', function(event) {
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
        } else {
            // Change focus
            prepareResult(event.cyTarget);
            $('#hover_names').empty();
            $('#hover-div').slideUp('medium');
        }
    });


function contain(array, element) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == element) {
            return true;
        }
    }
    return false;
}


// Mutex
$('#mutex-button').on('click', function() {
    createMutex(cy.width()/2, cy.height()/2);
});