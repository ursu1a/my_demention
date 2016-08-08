/**
 * Created by Angelika on 04.08.16.
 */

var DB = {

    dbName: 'Book',
    tblParts: 'Parts',

    init: function() {
        $.indexedDB(DB.dbName, {
            "schema": {
                "1": function(versionTransaction) {
                        var parts = versionTransaction.createObjectStore(DB.tblParts, {
                            "keyPath": "itemId"
                        });
                        //parts.createIndex("price");
                    },
                "2": function(versionTransaction) { }
            }
        }).done(function(){
                // Once the DB is opened with the object stores set up, show data from all tables
                window.setTimeout(function(){
                    DB.uploadBook();
                }, 200);
        });
    },

    uploadBook: function() {
        var data = Book;
        $.indexedDB(DB.dbName).transaction(DB.tblParts).then(function(){
            console.log("Transaction completed, all data inserted");
        }, function(err, e){
            console.log("Transaction NOT completed", err, e);
        }, function(transaction){
            var parts = transaction.objectStore(DB.tblParts);
            parts.clear();
            $.each(data, function(i){
                _(parts.add(this));
            })
        });
    },

    deleteDB: function(){
        // Delete the database
        $.indexedDB(DB.dbName).deleteDatabase();
    }
}

function _(promise){
    promise.then(function(a, e){
        console.log("Action completed", e.type, a, e);
    }, function(a, e){
        console.log("Action completed", a, e);
    }, function(a, e){
        console.log("Action completed", a, e);
    })
}

var Form = {

    initMainChakraPanel: function() {
        var positions = ['front', 'back', 'middle'];
        var translate = ['спереди', 'сзади', 'по центру']
        for (var i=0; i<3; i++) {
            var fieldset = $('<div class="col-md-4"><fieldset><legend>Чакры '+translate[i]+'</legend></fieldset></div>');
            for (var j=0; j<MainChakraViolations.length; j++) {
                var id = j+1;
                var checkbox = $('<div class="form-group row"><div class="checkbox"><label><input type="checkbox" data-position="' +positions[i]+'" data-id="'+id+'" value="">'+ MainChakraViolations[j].chakra +'</label></div>');
                fieldset.append(checkbox);
            }
            $('#chakra_main_form').append(fieldset);
        }
    },

    initSmallChakraPanel: function() {
        var index = 0;
        for (var i=0; i<3; i++) {
            var div = $('<div class="col-md-4"></div>');
            for (var j=0; j<9; j++) {
                var id = index+1;
                var checkbox = $('<div class="form-group row"><div class="checkbox"><label><input type="checkbox" data-id="'+ id +'" value="">'+ SmallChakraViolations[index].chakra +'</label></div></div>');
                div.append(checkbox);
                index++;
            }
            $('#chakra_small_form').append(div);
        }
    },

    initCocoonPart: function() {
        var div = $('<div class="form-group row col-md-12"></div>');
        for (var i=1; i<6; i++) {
            var id = i+1;
            var radio = $('<label class="radio-inline"><input type="radio" name="cocoon" data-id="'+id+'" value="">'+CocoonViolations[i].subname+'</label>');
            div.append(radio);
        }
        $('#cocoon_violations').append(div);
    },

    initOrganSystemsDiagnosticsPart: function() {
        var part1 = $('<div class="col-md-6"></div>');
        var part2 = $('<div class="col-md-6"></div>');

        var k = 1;
        var m = Math.trunc(OrganSystems.length / 2);

        for (var i in OrganSystems) {
            var row = $('<div class="form-group row"><div class="col-md-5"><label class="control-label">' + OrganSystems[i] +'</label></div></div>');
            var checkboxes = $('<div class="col-md-7"></div>');
            for (var j in Thinlevels) {
                var level = Thinlevels[j];
                var checkbox = $('<div class="checkbox-inline"><label><input type="checkbox" data-level="'+ level.L +'">'+ level.L +'</label></div>');
                checkboxes.append(checkbox);
            }
            row.append(checkboxes);
            if (k <= m) {
                part1.append(row);
            } else {
                part2.append(row);
            }
            k++;
        }
        $('#organ #systems').append(part1).append(part2);
    },

    initOrganDiagnosticsPart: function() {
        var n = OrganDiagnostics.length;
        for (var i in OrganDiagnostics) {
            if (OrganDiagnostics[i].hasOwnProperty('parts')) {
                n++;
                n += OrganDiagnostics[i].parts.length;
            }
        }


        var m = Math.trunc(n/2)-1;
        var k = 1;

        var initOrganCheckboxes = function(obj, pair) {
            var levels = ["Ф", "Э", "А", "М"];
            var pairs = ["Л", "П"];

            var row = $('<div class="form-group row"><div class="col-md-4"><label class="control-label">'+ obj.organ +'</label></div></div>');
            for (var j in levels) {
                var checkbox = '<div class="checkbox-inline"><label><input type="checkbox" data-id="'+ obj.organ +' data-level=' + levels[j] +'">'+ levels[j] +'</label></div>';
                row.append(checkbox);
            }

            if (obj.pair || pair) {
                for (var i in pairs) {
                    var checkbox = $('<div class="checkbox-inline pair-'+i+'"><label><input type="checkbox" data-pair="' + pairs[i] +'">' + pairs[i] +'</label></div>');
                    row.append(checkbox);
                }
            }

            if (obj.hasOwnProperty('additional')) {
                var checkbox = $('<div class="checkbox-inline additional"><label><input type="checkbox" data-additional="1">' + obj.additional +'</label></div>');
                row.append(checkbox);
            }

            k++;
            return row;
        };

        var part1 = $('<div class="col-md-6"></div>');
        var part2 = $('<div class="col-md-6 second"></div>');

        for (var i=0; i<OrganDiagnostics.length; i++) {
            var obj = OrganDiagnostics[i];

            if (!obj.hasOwnProperty('parts')) {
                k < m ? part1.append(initOrganCheckboxes(obj)) : part2.append(initOrganCheckboxes(obj));
            } else {
                var fieldset = $('<fieldset><legend>'+ obj.section +'</legend></fieldset>');
                k++;
                for (var p in obj.parts) {
                    fieldset.append(initOrganCheckboxes(obj.parts[p], obj.pair));
                }
                k < m ? part1.append(fieldset) : part2.append(fieldset);
                k < m ? part1.append('<hr>') : part2.append('<hr>');
            }
        }

        $('#organs').append(part1).append(part2);
    }
}
