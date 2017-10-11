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
    $('#be-elem').draggable({revert: true});
    $('#and-elem').draggable({revert: true});
    $('#or-elem').draggable({revert: true});
    $('#vot-elem').draggable({revert: true});
    $('#pand-elem').draggable({revert: true});
    $('#por-elem').draggable({revert: true});
    $('#fdep-elem').draggable({revert: true});
    $('#pdep-elem').draggable({revert: true});
    $('#spare-elem').draggable({revert: true});
    $('#seq-elem').draggable({revert: true});

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

});

// Dragstop events
$('#be-elem').on('dragstart', function(event, ui) {
    if (window.outerWidth < 1500) {
        dragHelperStart();
    }
});
$('#be-elem').on('dragstop', function(event, ui) {
    openDialog(ui.position.left, ui.position.top, DftTypes.BE);
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
    openDialog(ui.position.left, ui.position.top, DftTypes.AND);
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
    openDialog(ui.position.left, ui.position.top, DftTypes.OR);
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
    openDialog(ui.position.left, ui.position.top, DftTypes.VOT);
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
    openDialog(ui.position.left, ui.position.top, DftTypes.PAND);
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
    openDialog(ui.position.left, ui.position.top, DftTypes.POR);
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
    openDialog(ui.position.left, ui.position.top, DftTypes.FDEP);
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
    openDialog(ui.position.left, ui.position.top, DftTypes.PDEP);
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
    openDialog(ui.position.left, ui.position.top, DftTypes.SPARE);
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
    openDialog(ui.position.left, ui.position.top, DftTypes.SEQ);
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

$('.no-float').keydown(function (e) {
    if (e.which === 13) {
        if (!validationCheck(transferObjectEnter.type)) {
            $('.errorLabel').text('Inavild Input');
        } else {
            $('.errorLabel').text('');
            if (transferObjectEnter.type == '-gate') {
            if (transferObjectEnter.create) {
                    addGate(transferObjectEnter.x, transferObjectEnter.y, transferObjectEnter.dftType);                        
                } else changeGate(transferObjectEnter.elem);
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
});

// ValidationCheck 

function validationCheck(type) {
    if (type == '-gate') {
        var input = $('#name-gate').val();
        if(regName.test(input)) {
            return true;
        } else {
            return false;
        }
    } else if (type == '-be') {
        if (!regName.test($('#name-be').val())) {
            return false;
        }
        if (!regRate.test($('#failure').val()) || !regRate.test($('#repair').val())) {
            return false;
        } 
        if (!regDorm.test($('#dormancy').val())) {
            return false;
        }
        return true;
    } else {
        if (!regThresh.test($('#threshold').val())) {
            return false;
        }
        if (!regName.test($('#name-vot').val())) {
            return false;
        }
        return true;
    } 
}

// Gate type switch
$('#gateSwitch').on('click', function() {
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
                var type = $('#switch-type').val();
                if (type == 'vot') {

                } else {
                    $('#gateSwitch').addClass('nonVis');
                    $('#gateSwitch').removeClass('vis');
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
                            id: 'switchConfirmButton2',
                            text: 'Confirm',
                            click: function() {
                                switchElement(type)
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
                            $(this).dialog('close');
                            $('#gateSwitch').addClass('vis');
                            $('#gateSwitch').removeClass('nonVis');
                            $('#dialog-switch').dialog('close');
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
    alert('Actual id: ' + id + ' which is deleted.');
    removeNode(cy.getElementById(id));


    if (type == 'and') {
        var storedCurrentId = currentId;
        alert('Stored ID: ' + storedCurrentId);
        currentId -= 1;
        alert('Add gate with id: ' + currentId);
        addGate(switchElem.position('x'), switchElem.position('y'), type);
        currentId = storedCurrentId;
        alert(currentId);
    }
    else if (type == 'or') {

    }
    else if (type == 'pand') {

    }
    else if (type == 'por') {

    }
    else if (type == 'vot') {

    }
}