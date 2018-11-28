authorizeModule.factory('parameterSystemService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var serviceUrl = configService.rootUrlWebApi + '/Authorize/parameterSystem';
        var result = {
            postQuery: function(data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            post: function(data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback)
                    .error(function(msg) {
                        clientService.noticeAlert("Lỗi không xác định", "danger");
                    });
            },
            update: function(params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            deleteItem: function(params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
        }
        return result;
    }
]);

authorizeModule.controller('parameterSystemController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'parameterSystemService', 'configService', 'clientService', 'authorizeService', 'blockUI','localStorageService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
parameterSystemService, configService, clientService, authorizeService, blockUI, localStorageService) {
    $scope.config = authorizeService.config;
    $scope.tempData = authorizeService.tempData;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'unitName'; // set the default sort type
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
        return 'Tham số hệ thống';
    };
        //delete
        $scope.deleteItem = function(ev, item) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Cảnh báo')
                .textContent('Dữ liệu có thể liên kết với các dữ liệu khác, bạn có chắc muốn xóa?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                parameterSystemService.deleteItem(item).then(function(data) {
                    console.log(data);
                }).then(function(data) {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Thông báo')
                            .textContent('Xóa thành công')
                            .ariaLabel('Alert')
                            .ok('Ok')
                            .targetEvent(ev))
                        .finally(function() {
                            filterData();
                        });
                });

            }, function() {
                console.log('Không xóa');
            });
        };

        $scope.create = function() {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: authorizeService.buildUrl('parameterSystem', 'add'),
                controller: 'parameterSystemCreateController',
                resolve: {}
            });

            modalInstance.result.then(function(updatedData) {
                $scope.refresh();
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.update = function(target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: authorizeService.buildUrl('parameterSystem', 'update'),
                controller: 'parameterSystemEditController',
                resolve: {
                    targetData: function() {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function(updatedData) {
                var index = $scope.data.indexOf(target);
                if (index !== -1) {
                    $scope.data[index] = updatedData;
                }
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.details = function(target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: authorizeService.buildUrl('parameterSystem', 'details'),
                controller: 'parameterSystemDetailsController',
                resolve: {
                    targetData: function() {
                        return target;
                    }
                }
            });
        };
    filterData();
    function filterData() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        parameterSystemService.postQuery(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.extend($scope.paged, response.data);
                }
            });
    };
}]);

authorizeModule.controller('parameterSystemDetailsController', [
'$scope', '$uibModalInstance',
'authorizeService', 'parameterSystemService', 'clientService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    authorizeService, parameterSystemService, clientService, targetData, $filter) {

    $scope.config = authorizeService.config;
    $scope.target = clientService.convertFromDateNumber(targetData, ["EffectDate"]);
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(authorizeService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };

    $scope.title = function () { return 'Thông tin Tham số hệ thống: ' + $scope.target.tenTk + '[' + $scope.target.maTk + ']'; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

authorizeModule.controller('parameterSystemCreateController', [
    '$scope', '$uibModalInstance',
    'authorizeService', 'parameterSystemService', 'clientService',
    function ($scope, $uibModalInstance,
        authorizeService, parameterSystemService, clientService) {

        $scope.config = authorizeService.config;
        $scope.target = {};
        $scope.tempData = authorizeService.tempData;
        $scope.title = function () { return 'Thêm Tham số hệ thống'; };

        $scope.save = function () {
            var convertData = clientService.convertToDateNumber($scope.target, ["EffectDate"]);
            parameterSystemService.post(
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

authorizeModule.controller('parameterSystemEditController', [
    '$scope', '$uibModalInstance',
    'authorizeService', 'clientService', 'parameterSystemService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        authorizeService, clientService, parameterSystemService, targetData, clientService) {

        $scope.config = authorizeService.config;
        $scope.target = clientService.convertFromDateNumber(targetData, ["EffectDate"]);
        $scope.tempData = authorizeService.tempData;
        $scope.title = function () { return 'Cập nhập Tham số hệ thống: ' + $scope.target.tenTk + '[' + $scope.target.maTk + ']'; };
        $scope.save = function () {
            var convertData = clientService.convertToDateNumber($scope.target, ["EffectDate"]);
            parameterSystemService.update(convertData).then(
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