mdModule.factory('roleService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        //var serviceUrl = rootUrl + '/_vti_bin/Apps/Authorize/RoleService.svc';
        var serviceUrl = configService.rootUrlWebApi + '/Authorize/Role';
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
                return $http.put(serviceUrl + '/Put/' + params.id, params);
            },
            deleteItem: function(params) {
                return $http.delete(serviceUrl + '/Delete/' + params.id, params);
            },
        }
        return result;
    }
]);

var roleController = mdModule.controller('roleController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'roleService', 'configService', 'authorizeService', 'blockUI','localStorageService','clientService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
roleService, configService, authorizeService, blockUI, localStorageService, clientService) {
    $scope.config = authorizeService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'iDRole'; // set the default sort type
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
        return 'Phân quyền';
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
                roleService.deleteItem(item).then(function(data) {
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
                templateUrl: authorizeService.buildUrl('role', 'add'),
                controller: 'roleCreateController',
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
                templateUrl: authorizeService.buildUrl('role', 'update'),
                controller: 'roleEditController',
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
                templateUrl: authorizeService.buildUrl('role', 'details'),
                controller: 'roleDetailsController',
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
        roleService.postQuery(
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

mdModule.controller('roleDetailsController', [
'$scope', '$uibModalInstance',
'authorizeService', 'roleService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    authorizeService, roleService, targetData, $filter) {

    $scope.config = authorizeService.config;
    $scope.target = targetData;

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(authorizeService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };

    $scope.title = function () { return 'Thông tin quyền: ' + $scope.target.nameRole + '[' + $scope.target.idRole + ']'; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('roleCreateController', [
    '$scope', '$uibModalInstance',
    'authorizeService', 'roleService', 'clientService',
    function ($scope, $uibModalInstance,
        authorizeService, roleService, clientService) {

        $scope.config = authorizeService.config;
        $scope.target = {};
        $scope.tempData = authorizeService.tempData;
        $scope.title = function () { return 'Thêm quyền'; };

        $scope.save = function () {
            roleService.post(
                JSON.stringify($scope.target),
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

mdModule.controller('roleEditController', [
    '$scope', '$uibModalInstance',
    'authorizeService', 'roleService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        authorizeService, roleService, targetData, clientService) {
        $scope.config = authorizeService.config;
        $scope.target = targetData;
        $scope.tempData = authorizeService.tempData;
        $scope.title = function () { return 'Cập nhập quyền: ' + $scope.target.nameRole + '[' + $scope.target.idRole + ']'; };
        console.log(targetData);
        $scope.save = function () {
            roleService.update($scope.target).then(
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