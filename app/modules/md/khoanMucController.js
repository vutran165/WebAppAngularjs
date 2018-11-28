mdModule.factory('khoanMucService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function($resource, $http, $window, configService, clientService) {
    var rootUrl = configService.rootUrlWeb;
    //var serviceUrl = rootUrl + '/_vti_bin/Apps/Md/khoanMucService.svc';
    var serviceUrl = configService.rootUrlWebApi + '/Md/KhoanMuc';

    var result = {
            postQuery: function(data, callback) {
            $http.post(serviceUrl + '/PostQuery', data).success(callback);
        },
            post: function(data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
        },
            update: function(params) {
                return $http.put(serviceUrl + '/' + params.id, params);
        },
            deleteItem: function(params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            }
    }
    return result;
    }
]);

var khoanMucController = mdModule.controller('khoanMucController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'khoanMucService', 'configService', 'mdService', 'blockUI',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
khoanMucService, configService, mdService, blockUI) {
    $scope.config = mdService.config;
    $scope.tempData = mdService.tempData;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'maKhoanMuc'; // set the default sort type
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
        return 'Khoản mục';
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
            khoanMucService.deleteItem(item).then(function (data) {
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
                        $scope.tempData.update('khoanMucs');
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
            templateUrl: mdService.buildUrl('mdKhoanMuc', 'add'),
            controller: 'khoanMucCreateController',
            resolve: {}
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('khoanMucs');
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdKhoanMuc', 'update'),
            controller: 'khoanMucEditController',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('khoanMucs');
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
            templateUrl: mdService.buildUrl('mdKhoanMuc', 'details'),
            controller: 'khoanMucDetailsController',
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

        khoanMucService.postQuery(
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
mdModule.controller('khoanMucDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'khoanMucService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    mdService, khoanMucService, targetData, $filter) {
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

    $scope.title = function () { return 'Thông tin Khoản mục '; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);
mdModule.controller('khoanMucCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'khoanMucService', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, khoanMucService, clientService) {

        $scope.config = mdService.config;
        $scope.target = {};
        $scope.tempData = mdService.tempData;
        $scope.title = function () { return 'Thêm Khoản mục'; };

        $scope.save = function () {
            khoanMucService.post(
                JSON.stringify($scope.target),
                function (response) {
                    //Fix
                    if (response.status) {
                        console.log('Create  Successfully!');
                        clientService.noticeAlert("Thành công", "success");
                        $uibModalInstance.close($scope.target);

                    } else {
                        clientService.noticeAlert(response.data, "danger");
                    }
                    //End fix
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
mdModule.controller('khoanMucEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'khoanMucService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, khoanMucService, targetData, clientService) {

        $scope.config = mdService.config;
        $scope.target = targetData;
        $scope.tempData = mdService.tempData;
        $scope.title = function () { return 'Cập nhập Khoản mục ' ; };
        $scope.save = function () {
            khoanMucService.update($scope.target).then(
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