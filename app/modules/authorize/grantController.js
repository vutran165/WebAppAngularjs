mdModule.factory('grantService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var serviceUrl = configService.rootUrlWebApi + '/Authorize/Grant';
        var result = {
            post: function (data, callback) {
                $http.post(serviceUrl + '/PostGrant', data).success(callback)
                    .error(function (msg) {
                        clientService.noticeAlert("Lỗi không xác định", "danger");
                    });
            },
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            getMenu: function () {
                return $http.get(serviceUrl + '/GetMenu');
            },
            loadData: function (data, callback) {
                return $http.post(serviceUrl + '/LoadData', data).success(callback);
            }

        }
        return result;
    }
]);

var grantController = mdModule.controller('grantController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'grantService', 'configService', 'authorizeService', 'blockUI', 'localStorageService', 'clientService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
grantService, configService, authorizeService, blockUI, localStorageService, clientService) {
    $scope.config = authorizeService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.CurrentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'id'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function () {
        $scope.paged.CurrentPage = 1;
        filterData();
    };
    $scope.pageChanged = function () {
        filterData();
    };
    $scope.title = function () {
        return 'Phân quyền';
    };

    $scope.collapseAll = function () {
        $scope.$broadcast('angular-ui-tree:collapse-all');
    };

    $scope.expandAll = function () {
        $scope.$broadcast('angular-ui-tree:expand-all');
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
                grantService.deleteItem(item).then(function(data) {
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
                            binData();
                        });
                });

            }, function() {
                console.log('Không xóa');
            });
        };

        $scope.addAuthor = function(currentNode) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: authorizeService.buildUrl('grant', 'add'),
                controller: 'authorizationCreateAuthorController',
                resolve: {
                    targetData: function() {
                        return currentNode;
                    }
                }
            });
            modalInstance.result.then(function(updatedData) {
                binData();
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.details = function(target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: authorizeService.buildUrl('grant', 'details'),
                controller: 'grantDetailsController',
                resolve: {
                    targetData: function() {
                        return target;
                    }
                }
            });
        };

        $scope.update = function(target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: authorizeService.buildUrl('grant', 'update'),
                controller: 'grantEditController',
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

        function binData() {
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            grantService.postQuery(JSON.stringify(postdata),
                function(response) {
                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.roles = response.data.data;
                    }
                });
        }

    function filterData() {
        $scope.isLoading = true;
        grantService.getMenu().then(function (response) {
            $scope.data = response.data;
        }, function (response) {
            console.log("Log Error:" + response);
        });
    };

    binData();
    filterData();
}]);

mdModule.controller('grantEditController', [
    '$scope', '$uibModalInstance',
    'authorizeService', 'grantService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        authorizeService, grantService, targetData, clientService) {
        $scope.tempData = authorizeService.tempData;
        $scope.config = authorizeService.config;
        $scope.target = targetData;
        $scope.roles = [];
        $scope.title = function () { return 'Cập nhập phân quyền: ' + '[' + $scope.target.menu + ']'; };
        $scope.isView = $scope.target.isView == 1;
        $scope.isAdd = $scope.target.isAdd == 2;
        $scope.isEdit = $scope.target.isEdit == 3;
        $scope.isDelete = $scope.target.isDelete == 4;
        $scope.isApprove = $scope.target.isApprove == 5;
        $scope.save = function () {
            $scope.target.isView = ($scope.isView == true ? 1 : 0);
            $scope.target.isAdd = ($scope.isAdd == true ? 2 : 0);
            $scope.target.isEdit = ($scope.isEdit == true ? 3 : 0);
            $scope.target.isDelete = ($scope.isDelete == true ? 4 : 0);
            $scope.target.isApprove = ($scope.isApprove == true ? 5 : 0);
            console.log($scope.target);
            grantService.update($scope.target).then(
            function (response) {
                    if (response.status && response.status == 200) {
                        if (response.data.status) {
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

mdModule.controller('grantDetailsController', [
'$scope', '$uibModalInstance',
'authorizeService', 'grantService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    mdService, countryService, targetData, $filter) {
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data.length === 1) {
            return data[0].text;
        }
        return "Empty!";
    }
    $scope.title = function () { return 'Thông tin phân quyền: ' + '[' + $scope.target.menu + ']'; };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);



mdModule.controller('authorizationCreateAuthorController', [
    '$scope', '$uibModalInstance', 'authorizeService', 'clientService', 'targetData', '$uibModal', 'grantService',
    function ($scope, $uibModalInstance, authorizeService, clientService, targetData, $uibModal, grantService) {
        $scope.config = authorizeService.config;
        $scope.target = {};
        $scope.tempData = authorizeService.tempData;
        $scope.title = function () { return 'Thêm nhóm quyền'; };
        $scope.currentNode = targetData;
        $scope.target = { users: [] };
        $scope.addUser = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: authorizeService.buildUrl('grant', 'adduser'),
                controller: 'authorizationAddUsersController',
                size: 'lg',
                resolve: {}
            });
            modalInstance.result.then(function (updatedData) {
                $scope.target.users = updatedData;
                console.log(updatedData);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
        $scope.save = function () {
            if ($scope.currentNode)
                $scope.target.Menus = $scope.currentNode;
            $scope.target.menuIdCha = $scope.currentNode.menuIdCha;
            $scope.target.menuId = $scope.currentNode.menuId;
            $scope.target.title = $scope.currentNode.title;
            $scope.target.url = $scope.currentNode.url;
            grantService.post(JSON.stringify($scope.target),
                function (response) {
			      if (response.status) {
                        console.log('Create  Successfully!');
                        clientService.noticeAlert("Thành công", "success");
                        $uibModalInstance.close($scope.target);
                    } else {
			          clientService.noticeAlert(response.message, "danger");
                    }
                });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

mdModule.controller('authorizationAddUsersController', [
    '$scope', '$uibModalInstance', 'authorizeService', 'clientService', 'userService', 'configService', '$filter',
    function ($scope, $uibModalInstance, authorizeService, clientService, userService, configService, $filter) {
        $scope.config = authorizeService.config;
        $scope.target = {};
        $scope.tempData = authorizeService.tempData;
        $scope.title = function () { return 'Thêm người sử dụng'; };
        $scope.lstUser = [];
        $scope.filter = function () {
            userService.getUserByMaDonVi($scope.idDonVi, function (response) {
                $scope.tmp = response;
                $scope.lstUser = response;
                $scope.lstUser = angular.copy($scope.tmp);
            });
        };
        $scope.checkAll = function () {
            if ($scope.check === true) {
                angular.forEach($scope.lstUser, function (item) {
                    item.Selected = $scope.check;
                });
            } else {
                angular.forEach($scope.lstUser, function (item) {
                    item.Selected = $scope.check;
                });
            }
        };
        $scope.check = {};
        $scope.checkUser = [];
        $scope.choice = function () {
            $scope.target = $filter('filter')($scope.lstUser, { Selected: true }, true);
            $uibModalInstance.close($scope.target);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);