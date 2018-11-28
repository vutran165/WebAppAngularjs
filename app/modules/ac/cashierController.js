acModule.factory('cashierService', ['$resource', '$http', '$window', 'configService', 'clientService',
function ($resource, $http, $window, configService, clientService) {
    var rootUrl = configService.apiServiceBaseUri;
    var serviceUrl = configService.rootUrlWebApi + '/Ac/Closeout';
    //var serviceUrl = rootUrl + '/_vti_bin/Apps/AC/CloseoutService.svc';
    var calc = {
        sum: function (obj, name) {
            var total = 0
            if (obj && obj.length > 0) {
                angular.forEach(obj, function (v, k) {
                    var increase = v[name];
                    if (!increase) {
                        increase = 0;
                    }
                    total += increase;
                });
            }
            return total;
        },
    }
    var result = {
        robot: calc,
        postCreateReportCashierByStaff: function (filter, callback) {
            $http.post(serviceUrl + '/CreateReportCashierByStaff', filter).success(callback);
        },
        getUnitUsers: function (callback) {
            $http.get(rootUrl + '/api/Md/UnitUser/GetSelectAll').success(callback);
        }

    }
    return result;
}])

acModule.controller('cashierController', ['$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$sce', '$state', '$uibModal', '$log',
'mdService', 'cashierService', 'clientService', 'configService', '$filter',
function ($scope, $rootScope, $window, $stateParams, $timeout, $sce, $state, $uibModal, $log,
mdService, cashierService, clientService, configService, $filter) {
    $scope.tempData = mdService.tempData;
    $scope.config = configService;
    $scope.target = {};
    function filterData() {

        cashierService.getUnitUsers(function (response) {
            $scope.unitUsers = response;
        });
    }
    filterData();
    $scope.report = function () {
        $state.go('cashierReport', { obj: $scope.target });
    }

}])
nvModule.controller('reportCashierController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'cashierService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, cashierService, mdService, clientService) {
    var para = $state.params.obj;
    $scope.robot = angular.copy(cashierService.robot);
    $scope.tempData = mdService.tempData;
    $scope.target = [];
    $scope.goIndex = function () {
        $state.go('cashier');
    }
    function filterData() {
        if (para) {
            cashierService.postCreateReportCashierByStaff(para, function (response) {
                if (response.status) {
                    $scope.target = response.data;
                }
            });
        }
    };

    $scope.print = function () {
        var table = document.getElementById('main-report').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    }

    filterData();
}]);