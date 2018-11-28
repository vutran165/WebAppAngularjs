var mainApp = angular.module('mainApp', [
    'ngResource', 'ui.bootstrap', 'ui.router', 'ngRoute',
    'ngDirectives', 'ngFilters', 'ngControllers', 'ngServices', 'ngHandlers', 'ngMaterial', 'ngTagsInput', 'ngAnimate',
    'mdModule', 'nvModule', 'pcModule', 'authorizeModule', 'acModule', 'ui.tree', 'angularTreeview', 'ngCookies', 'LocalStorageModule', 'ngFileUpload', 'ivh.treeview', 'ngSanitize', 'adaptv.adaptStrap'
]);

//var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;
//var regexIso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
//var regexIso8601 = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d(:?[0-5]\d)?|Z)$/;
var regexIso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
function convertDateStringsToDates(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
            var milliseconds = Date.parse(match[0]);
            if (!isNaN(milliseconds)) {
                input[key] = new Date(milliseconds);
            }
        } else if (typeof value === "object") {
            // Recurse into object
            convertDateStringsToDates(value);
        }
    }
}

mainApp.config([
    '$windowProvider', '$stateProvider', '$httpProvider', '$urlRouterProvider', '$routeProvider', '$locationProvider',
    function ($windowProvider, $stateProvider, $httpProvider, $urlRouterProvider, $routeProvider, $locationProvider) {
        var window = $windowProvider.$get('$window');

        //$httpProvider.interceptors.push('dateInterceptor');
        $httpProvider.defaults.transformResponse.push(function (responseData) {
            convertDateStringsToDates(responseData);
            return responseData;
        });
        var hostname = window.location.hostname;
        var port = window.location.port;
        var rootUrl = 'http://' + hostname + ':' + port;
        $urlRouterProvider.otherwise('home');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: rootUrl + '/_layouts/15/app/views/home.html',
                controller: 'homeController'
            })
            .state('login',{
                    url: '/login',
                    templateUrl: rootUrl + '/_layouts/15/app/views/login.html',
                    controller: 'loginController'
            }
            );
        $httpProvider.interceptors.push('httpInterceptor');
    }
]);

mainApp.config(function (ivhTreeviewOptionsProvider) {
    ivhTreeviewOptionsProvider.set({
        idAttribute: 'id',
        labelAttribute: 'title',
        childrenAttribute: 'children',
        selectedAttribute: 'selected',
        useCheckboxes: true,
        expandToDepth: 0,
        indeterminateAttribute: '__ivhTreeviewIndeterminate',
        expandedAttribute: '__ivhTreeviewExpanded',
        defaultSelectedState: true,
        validate: true,
        twistieExpandedTpl: '(-)',
        twistieCollapsedTpl: '(+)',
        twistieLeafTpl: 'o',
        nodeTpl: '...'
    });
});


mainApp.run(function (editableOptions, authorizeService, $location) {
    if (!authorizeService.fillAuthData()) {
        $location.path('/login');
    };
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

mainApp.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><meta charset="UTF-8"><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = $(tableId),
                ctx = { worksheet: worksheetName, table: table.html() },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
});
