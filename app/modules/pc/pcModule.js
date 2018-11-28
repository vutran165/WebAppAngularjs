var pcModule = angular.module('pcModule', ['ui.bootstrap', 'ngFilters', 'ngServices', 'ngResource', 'blockUI'])

pcModule.config([
    '$windowProvider', '$stateProvider', '$httpProvider', '$urlRouterProvider', '$routeProvider', '$locationProvider',
    function ($windowProvider, $stateProvider, $httpProvider, $urlRouterProvider, $routeProvider, $locationProvider) {
        var window = $windowProvider.$get('$window');

        var hostname = window.location.hostname;
        var port = window.location.port;
        var rootUrl = 'http://' + hostname + ':' + port;
        var moduleUrl = rootUrl + 'pc';
        $stateProvider
            .state('pcCongThucGiaThanh',
                {
                    url: '/pc/congThucGiaThanh',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/PC/PCCongThucGiaThanh/index.html',
                    controller: 'congThucGiaThanhController'
                }
            );

    }
]);


pcModule.factory('pcService', [
    '$resource', '$http', '$window', 'clientService', 'configService',
    function ($resource, $http, $window, clientService, configService) {
        var hostname = window.location.hostname;
        var port = window.location.port;
        var rootUrl = 'http://' + hostname + ':' + port;

        var result = {
            config: configService,
            client: clientService,
        };
        result.buildUrl = function (module, action) {
            return rootUrl + '/_layouts/15/BTS.SP.ERP/PC/' + module + '/' + action + '.html';
        };
        //result.buildView = function (control, view) {
        //    return $window.buildView(control, view, moduleRoot);
        //};

        var tempData = $window.CacheManager();
        var cacheStatus = tempData.cacheStatus;
        result.cacheStatus = cacheStatus;
        result.tempData = tempData;

        function initData() {
            tempData.register('loaiCongThucs',
[
{ value: "DD", Text: 'Đậm đặc' },
],
null);


        }

        initData();

        return result;
    }]);
