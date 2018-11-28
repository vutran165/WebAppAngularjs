mdModule.factory('menuService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var serviceUrl = configService.rootUrlWebApi + '/Md/Menu';
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
            getSelectData: function (callback) {
                $http.get(serviceUrl + '/GetSelectData').success(callback);
            },
            getTreeMenu: function (callback) {
                $http.get(serviceUrl + '/GetTreeMenu').success(callback);
            },
            getMenu: function (para, callback) {
                $http.post(serviceUrl + '/GetMenu', para).success(callback);
            }
        }
        return result;
    }
]);

var menuController = mdModule.controller('menuController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'menuService', 'configService', 'mdService', '$filter', 'localStorageService', 'clientService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
menuService, configService, mdService, $filter, ocalStorageService, clientService) {
    $scope.config = mdService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);

    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return code;
    }

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
        return 'Menu';
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
            menuService.deleteItem(item).then(function (data) {
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
            templateUrl: mdService.buildUrl('mdMenu', 'add'),
            controller: 'menuCreateController',
            //windowClass: 'app-modal-window',
            resolve: {}
        });

        modalInstance.result.then(function (updatedData) {
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdMenu', 'update'),
            controller: 'menuEditController',
            //windowClass: 'app-modal-window',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
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
            templateUrl: mdService.buildUrl('mdMenu', 'details'),
            controller: 'menuDetailsController',
            //windowClass: 'app-modal-window',
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
        menuService.postQuery(
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

mdModule.controller('menuDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'menuService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    mdService, menuService, targetData, $filter) {
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

    $scope.title = function () { return 'Thông tin Menu '; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('menuCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'menuService', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, menuService, clientService) {

        $scope.config = mdService.config;
        $scope.target = {};
        $scope.tempData = mdService.tempData;
        $scope.title = function () { return 'Thêm Menu'; };

        $scope.save = function () {
            menuService.post(
                JSON.stringify($scope.target),
                function (response) {
                    //Fix
                    if (response.status) {
                        console.log('Create  Successfully!');
                        clientService.noticeAlert("Thành công", "success");
                        $uibModalInstance.close($scope.target);
                        $scope.tempData.update('menus');
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                    //End fix
                });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        function filterData() {
            menuService.getSelectData(function (response) {
                if (response) {
                    console.log(response);
                    $scope.tempData.menus = response;
                }
            });
        }
    }
]);

mdModule.controller('menuEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'menuService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, menuService, targetData, clientService) {

        $scope.config = mdService.config;
        $scope.target = targetData;
        $scope.tempData = mdService.tempData;
        $scope.title = function () { return 'Cập nhập Menu'; };
        console.log(targetData);
        $scope.save = function () {
            menuService.update($scope.target).then(
                function (response) {
                    if (response.status && response.status == 200) {
                        if (response.data.status) {
                            console.log('Create  Successfully!');
                            clientService.noticeAlert("Thành công", "success");
                            $uibModalInstance.close($scope.target);
                        } else {

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



mdModule.controller('loadMenu', [
    '$scope', 'mdService', 'menuService', 'clientService', 'menuService', '$rootScope',
    function ($scope, mdService, menuService, clientService, menuService, $rootScope) {
        var maDonVi = $rootScope.currentUser.maDonVi;
        var userName = $rootScope.currentUser.username;
        $scope.para = {
            maDonVi: maDonVi,
            userName: userName
        };
        $scope.dataMenu = {};
        menuService.getMenu($scope.para, function (response) {
            $scope.dataMenu = response;
        });
    }
]);
