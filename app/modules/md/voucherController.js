mdModule.factory('voucherService', ['$resource', '$http', '$window', 'configService', 'clientService',
function ($resource, $http, $window, configService, clientService) {
    var rootUrl = configService.rootUrlWeb;
    var serviceUrl = configService.rootUrlWebApi + '/Md/Voucher';
    var result = {
        postQuery: function (data, callback) {
            $http.post(serviceUrl + '/PostQuery', data).success(callback);
        },
        post: function (data, callback) {
            $http.post(serviceUrl + '/Post', data).success(callback);
        },
        update: function (params) {
            return $http.put(serviceUrl + '/' + params.id, params);
        },
        deleteItem: function (params) {
            return $http.delete(serviceUrl + '/' + params.id, params);
        },
    }
    return result;
}])

var voucherController = mdModule.controller('voucherController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'voucherService', 'configService', 'mdService', 'blockUI',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
voucherService, configService, mdService, blockUI) {
    $scope.tempData = mdService.tempData;
    $scope.config = mdService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'code'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function () {
        $scope.paged.currentPage = 1;
        filterData();
    };
    $scope.pageChanged = function () {
        filterData();
    };
    $scope.goHome = function () {
        $state.go('home');
    };
    $scope.refresh = function () {
        $scope.setPage($scope.paged.currentPage);
    };
    $scope.title = function () {
        return 'Chứng từ';
    };

    //delete
    $scope.deleteItem = function (ev, item) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Cảnh báo')
              .textContent('Dữ liệu có thể liên kết với các dữ liệu khác, bạn có chắc muốn xóa?')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Ok')
              .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            voucherService.deleteItem(item).then(function (data) {
                console.log(data);
            }).then(function (data) {
                $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Thông báo')
                .textContent('Xóa thành công')
                .ariaLabel('Alert')
                .ok('Ok')
                .targetEvent(ev))
                    .finally(function () {
                        $scope.tempData.update('vouchers');
                        filterData();
                    });
            });

        }, function () {
            console.log('Không xóa');
        });
    };
    $scope.create = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdVoucher', 'add'),
            controller: 'voucherCreateController',
            resolve: {}
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('vouchers');
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdVoucher', 'update'),
            controller: 'vourcherEditController',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('vouchers');
            var index = $scope.data.indexOf(target);
            if (index !== -1) {
                $scope.data[index] = updatedData;
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.details = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdVoucher', 'details'),
            controller: 'voucherDetailsController',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
    };


    filterData();
    function filterData() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        voucherService.postQuery(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {

                    $scope.data = response.data.data;
                    angular.extend($scope.paged, response.data);
                    console.log($scope.paged);
                }
            });
    };
}]);
mdModule.controller('voucherDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'voucherService', 'targetData','$filter',
function ($scope, $uibModalInstance,
    mdService, voucherService, targetData,$filter) {
    $scope.tempData = mdService.tempData;
    $scope.config = mdService.config;
    $scope.target = targetData;

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };

    $scope.title = function () { return 'Thông tin Chứng từ ' ; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);
mdModule.controller('voucherCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'voucherService', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, voucherService, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = {};
        $scope.tempDisplay = {};
        $scope.title = function () { return 'Thêm Chứng từ'; };
        $scope.save = function () {
            //var convertData = clientService.convertToDateNumber($scope.target, ["ToDate", "FromDate"]);
            var convertData = $scope.target;
            voucherService.post(
                JSON.stringify(convertData),
                function (response) {
                    //Fix
                    if (response.status) {
                        console.log('Create  Successfully!');
                        clientService.noticeAlert("Thành công", "success");
                        $uibModalInstance.close($scope.target);

                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                    //End fix
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
mdModule.controller('vourcherEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'voucherService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, voucherService, targetData, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        //$scope.target = clientService.convertFromDateNumber(targetData, ["ToDate", "FromDate"]);
        $scope.target = targetData;
        $scope.title = function () { return 'Cập nhập Chứng từ ' ; };
        $scope.save = function () {
            //var convertData = clientService.convertToDateNumber($scope.target, ["ToDate", "FromDate"]);
            var convertData = $scope.target;
            voucherService.update(convertData).then(
                function (response) {
                    if (response.status && response.status == 200) {
                        if (response.data.status) {
                            console.log('Create  Successfully!');
                            clientService.noticeAlert("Thành công", "success");
                            $uibModalInstance.close($scope.target);
                        } else {
                            clientService.noticeAlert(response.data.message, "danger");
                        }
                    } else {
                        console.log('ERROR: Update failed! ' + response.errorMessage);
                        clientService.noticeAlert(response.errorMessage, "danger");
                    }
                },
                function (response) {
                    console.log('ERROR: Update failed! ' + response);
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);