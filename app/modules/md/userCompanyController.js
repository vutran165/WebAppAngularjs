mdModule.factory('userCompanyService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = configService.rootUrlWebApi + '/Authorize/User';
        //var serviceUrl = rootUrl + '/_vti_bin/Apps/Md/userCompanyService.svc';
        var result = {
            getNewCode: function (callback) {
                $http.get(serviceUrl + '/GetNewCode').success(callback);
            },
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
            },
            registerCompany: function (data, callback) {
                $http.post(serviceUrl + '/RegisterCompany', data).success(callback);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            getSort: function (callback) {
                $http.get(rootUrl + '/api/Md/Company' + '/GetSort').success(callback);
            }

        }
        return result;
    }
]);

var userCompanyController = mdModule.controller('userCompanyController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'userCompanyService', 'configService', 'mdService', 'blockUI', 'clientService', 'localStorageService', 'donViHaiQuanService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
userCompanyService, configService, mdService, blockUI, clientService, localStorageService, donViHaiQuanService) {
    $scope.config = mdService.config;
    $scope.tempData = mdService.tempData;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };

    $scope.sortType = 'maTk'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function () {
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
        return 'Tài khoản';
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
            userCompanyService.deleteItem(item).then(function (data) {
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
                        $scope.tempData.update('userCompanys');
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
            templateUrl: mdService.buildUrl('mdUserCompany', 'add'),
            controller: 'userCompanyCreateController',
            size: 'lg',
            resolve: {}
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('userCompanys');
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdUserCompany', 'update'),
            controller: 'userCompanyEditController',
            size: 'lg',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('userCompanys');
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
            templateUrl: mdService.buildUrl('mdUserCompany', 'details'),
            controller: 'userCompanyDetailsController',
            size: 'lg',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
    };


    function filterData() {
        $scope.isLoading = true;
        var maDonVi = $rootScope.currentUser.maDonVi;
        $scope.filtered.advanceData.typeUser = 2;
        var postdata = { paged: $scope.paged, filtered: $scope.filtered, maDonVi: maDonVi };
        userCompanyService.postQuery(JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.extend($scope.paged, response.data);
                }
            });
    };
    filterData()
}]);

mdModule.controller('userCompanyDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'userCompanyService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    mdService, userCompanyService, targetData, $filter) {
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

    $scope.title = function () { return 'Thông tin Tài khoản'; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    function filterData() {
        userCompanyService.getSort(function (response) {
            $scope.companies = response;
        })
    }
    filterData();
}
]);

mdModule.controller('userCompanyCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'userCompanyService', 'clientService', '$rootScope', '$filter',
    function ($scope, $uibModalInstance,
        mdService, userCompanyService, clientService, $rootScope, $filter) {
        $scope.config = mdService.config;
        $scope.tempData = mdService.tempData;
        var idHaiQuan = $rootScope.currentUser.idHaiQuan;
        $scope.target = {};
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {

                return data[0].text;
            }
            return "Empty!";
        };
        $scope.selectedObject = function (item) {
            $scope.target.maDoanhNghiep = item.id;
        }
        $scope.title = function () { return 'Thêm Tài khoản'; };
        $scope.target.idHaiQuan = idHaiQuan;
        $scope.target.maHaiQuan = $rootScope.currentUser.maHaiQuan;
        $scope.save = function () {
            userCompanyService.registerCompany(JSON.stringify($scope.target),
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
        function filterData() {
            userCompanyService.getSort(function (response) {
                $scope.companies = response;
            });
        }
        filterData();
    }
]);

mdModule.controller('userCompanyEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'userCompanyService', 'targetData', 'clientService', '$filter',
    function ($scope, $uibModalInstance,
        mdService, userCompanyService, targetData, clientService, $filter) {
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
        $scope.tempData = mdService.tempData;
        $scope.title = function () { return 'Cập nhập Tài khoản'; };
        $scope.save = function () {
            userCompanyService.update($scope.target).then(
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
        function filterData() {
            userCompanyService.getSort(function (response) {
                $scope.companies = response;
            })
        }
        filterData();
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);