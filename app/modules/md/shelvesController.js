mdModule.factory('shelvesService', ['$resource', '$http', '$window', 'configService', 'clientService',
function ($resource, $http, $window, configService, clientService) {
    var rootUrl = configService.rootUrlWeb;
    //var serviceUrl = rootUrl + '/_vti_bin/Apps/Md/shelvesService.svc';
    var serviceUrl = configService.rootUrlWebApi + '/Md/Shelves';
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
        getNewInstance: function (callback) {
            $http.get(serviceUrl + '/GetNewInstance').success(callback);
        },

    }
    return result;
}])

var shelvesController = mdModule.controller('shelvesController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'shelvesService', 'configService', 'mdService', 'blockUI',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
shelvesService, configService, mdService, blockUI) {
    $scope.tempData = mdService.tempData;
    $scope.config = mdService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'maKeHang'; // set the default sort type
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
        return 'Kệ hàng';
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
            shelvesService.deleteItem(item).then(function (data) {
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
                        $scope.tempData.update('shelves');
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
            templateUrl: mdService.buildUrl('mdshelves', 'add'),
            controller: 'shelvesCreateController',
            resolve: {}
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('shelves');
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdshelves', 'update'),
            controller: 'shelvesEditController',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('shelves');
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
            templateUrl: mdService.buildUrl('mdshelves', 'details'),
            controller: 'shelvesDetailsController',
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
        shelvesService.postQuery(
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

mdModule.controller('shelvesDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'shelvesService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    mdService, shelvesService, targetData, $filter) {
    $scope.tempData = mdService.tempData;
    $scope.config = mdService.config;
    $scope.target = targetData;

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true)
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    }

    $scope.title = function () { return 'Thông tin Kệ hàng '; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('shelvesCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'shelvesService', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, shelvesService, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = {};

        $scope.title = function () { return 'Thêm Kệ hàng'; };
        function filterData() {
            shelvesService.getNewInstance(function (response) {
                $scope.target = response;
            });
        };
        filterData();

        $scope.save = function () {
            shelvesService.post(
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


mdModule.controller('shelvesEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'shelvesService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, shelvesService, targetData, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = targetData;

        $scope.title = function () { return 'Cập nhập Kệ hàng '; };
        console.log(targetData);
        $scope.save = function () {
            shelvesService.update($scope.target).then(
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