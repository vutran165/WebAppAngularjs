ngDirectives.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
ngDirectives.directive('deleteKey', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 46) {
                scope.$apply(function () {
                    scope.$eval(attrs.deleteKey);
                });
                event.preventDefault();
            }
        });
    };
});
ngDirectives.factory('focus', function ($timeout, $window) {
    return function (id) {
        // timeout makes sure that it is invoked after any other event has been triggered.
        // e.g. click events that need to run before the focus or
        // inputs elements that are in a disabled state but are enabled when those events
        // are triggered.
        $timeout(function () {
            var element = $window.document.getElementById(id);
            if (element)
                element.focus();
        });
    };
});
ngDirectives.directive('eventFocus', function (focus) {
    return function (scope, elem, attr) {
        elem.on(attr.eventFocus, function () {
            focus(attr.eventFocusId);
        });

        // Removes bound events in the element itself
        // when the scope is destroyed
        scope.$on('$destroy', function () {
            element.off(attr.eventFocus);
        });
    };
})
ngDirectives.directive('arrowSelector', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl) {
            var elemFocus = false;
            elem.on('mouseenter', function () {
                elemFocus = true;
            });
            elem.on('mouseleave', function () {
                elemFocus = false;
            });
            $document.bind('keydown', function (e) {
                
                if ($(document.activeElement).val()) {
                    if ($(document.activeElement).attr('type')) {
                        if ($(document.activeElement).attr('type') != "number") {
                            return;
                        }
                    }
                    if ($(document.activeElement).attr('format-number-input')) {
                        if ($(document.activeElement).attr('format-number-input') != "number") {
                            return;
                        }
                    }
                }

                if (elemFocus) {
                    if (e.keyCode == 38) {
                        var indexInput = $($(elem[0]).find('tbody').children()[scope.selectedRow].cells).index($(document.activeElement).parent());
                        var elementName = $(document.activeElement)[0].localName;
                        if (elementName != 'input') {
                            return;
                        }
                        if (scope.selectedRow == 0) {
                            return;
                        }
                        $($(elem[0]).find('tbody').children()[scope.selectedRow - 1].cells[indexInput]).find(elementName)[0].focus();
                        //scope.selectedRow--;
                        //scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {

                        var indexInput = $($(elem[0]).find('tbody').children()[scope.selectedRow].cells).index($(document.activeElement).parent());
                        var elementName = $(document.activeElement)[0].localName;
                        if (elementName != 'input')
                        {
                            return;
                        }
                        if (scope.selectedRow == scope.target[attrs.itemTarget].length - 1) {
                            return;
                        }
                        
                        $($(elem[0]).find('tbody').children()[scope.selectedRow + 1].cells[indexInput]).find(elementName)[0].focus();
                        //scope.selectedRow++;
                        //scope.$apply();
                        e.preventDefault();
                    }
                }
            });
        }
    };
}]);
