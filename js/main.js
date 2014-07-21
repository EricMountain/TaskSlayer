// todo - resize dynamically
// todo - colour selection
// todo - drag n drop
// todo - mark done, delete…

$(function() {

    // var lines = [ "KEEP", "CALM", "AND", "CARRY", "ON" ];
    // var maxLineLength = 0;
    // var nbLines = lines.length;
    // var marginPct = 5;
    // var marginWidth = 0;
    // var marginHeight = 0;
    // var pageWidth = $(window).width();
    // var pageHeight = $(window).height();

    // var params = [ "bg", "fg", "typeface", "graphic" ];

    // for (var j = 0; j < lines.length; j++) {
    //     var param = $.url().param((j + 1).toString());
        
    //     if (param) {
    //         lines[j] = param.toUpperCase();
    //     }
    //     // Whitespace is counted as a letter
    //     maxLineLength = Math.max(lines[j].length, maxLineLength);
    // }

    // var marginWidth = pageWidth * marginPct / 100;
    // var marginHeight = pageHeight * marginPct / 100;

    // var usableWidth = pageWidth - marginWidth * 2;
    // var usableHeight = pageHeight - marginHeight * 2;

    // // Decide how tall the crown will be and resize, then include in font size calculation
    // var crownPct = 20;
    // var crownHeight = usableHeight * 20 / 100;
    // $("#crown").attr("height", crownHeight);

    // var textUsableHeight = usableHeight - crownHeight;

    // var targetFontSize = Math.min(usableWidth / maxLineLength,
    //                              textUsableHeight / nbLines);

    // $("#keep-calm").css("margin-top", marginHeight);
    // $(".kc").css({"font-size": targetFontSize,
    //               "margin-top": 0,
    //               "margin-bottom": 0
    //              });
    // $(".kc").css("line-height", "1em");

    // ks = {'font-size': targetFontSize, 'margin-top': 0, 'margin-bottom': 0, 'line-height': '1em'};


    // // Some debug stuff
    // console.log(screen.width);
    // console.log(screen.height);
    // console.log($(window).width());
    // console.log($(window).height());
    // console.log(targetFontSize);
    // console.log(maxLineLength);
    // console.log(marginWidth);
    // console.log(marginHeight);
    // console.log(usableWidth);
    // console.log(usableHeight);
    // console.log(maxLineLength);

    // Bootstrap Angular
    var taskMatrixApp = angular.module('taskMatrixApp', []);

    taskMatrixApp.controller('taskMatrixCtrl', ['$scope', function($scope) {
                $scope.text = "hi";
            }
        ]);

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['taskMatrixApp']);
    });

});

