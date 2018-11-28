var ngDirectives = angular.module('ngDirectives', ['ngResource']);

ngDirectives.directive('myLoading', function () {
    var hostname = window.location.hostname;
    var port = window.location.port;
    var rootUrl = 'http://' + hostname + ':' + port;

    var result = {
        restrict: 'E',
        templateUrl: rootUrl + '/_layouts/15/app/views/loading.html',
    }
    return result;
});

ngDirectives.directive('spFlash',
function () {
    var hostname = window.location.hostname;
    var port = window.location.port;
    var rootUrl = 'http://' + hostname + ':' + port;

    return {
        restrict: 'A',
        replace: true,
        templateUrl: rootUrl + '/_layouts/15/app/views/noticeAlert.html',
        //template : '<div class="flash row-fluid">'
        //+ '<div data-ng-repeat="item in noticeAlert"  class="alert alert-{{item.type}}" role="alert">Thông báo: {{item.msg}}</div>'
        //    + '</div>',

        link: function ($rootScope, scope, element, attrs) {
            $rootScope.$watch('noticeAlert', function (val) {
                if (val) {
                    if (val.length) {
                        update();
                    }
                }
            }, true);

            function update() {
                $('.flash')
                 .fadeIn(500).delay(3000)
                 .fadeOut(500, function () {
                     $rootScope.noticeAlert.splice(0);
                 });
            }
        }
    };
});

ngDirectives.directive('styleChanger', function () {
    return {
        'scope': false,
        'link': function (scope, element, attrs) {
            var someFunc = function (item) {
                var ngayToKhai = item.ngayToKhai;
                var hanSuDung = item.hanSuDung;
                if (ngayToKhai == '' || hanSuDung == '') {
                    return 'color : #000000;';
                }
                var date = (hanSuDung - ngayToKhai) / 1000 / 60 / 60 / 24 / 365;
                if (date > 1) {
                    return 'color:#ff0000;';
                }
                return 'color: #000000;';
            }
            var newStyle = attrs.styleChanger;
            scope.$watch(newStyle, function (style) {
                if (!style) {
                    return;
                }
                attrs.$set('style', someFunc(style));
            });
        }
    };
});