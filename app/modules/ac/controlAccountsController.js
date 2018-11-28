acModule.factory('controlAccountsService', ['$resource', '$http', '$window', 'configService',
function ($resource, $http, $window, configService) {
    var rootUrl = configService.rootUrlWeb;
    //var serviceUrl = rootUrl + '/_vti_bin/Apps/PC/PCCongThucGiaThanhService.svc';
    var result = {
    }
    return result;
}])


acModule.controller('controlAccountsController', ['$scope', '$window', '$stateParams', '$timeout',
'mdService', 'controlAccountsService', 'clientService', '$filter',
function ($scope, $window, $stateParams, $timeout,
mdService, controlAccountsService, clientService, $filter) {
    var id = $stateParams.id;
    $scope.target = {};
    $scope.dataCurrency = {};
    function filterData() {
    };
    filterData();

}])