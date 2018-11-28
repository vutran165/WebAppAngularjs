mdModule.factory('merchandiseTypeService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        //var serviceUrl = rootUrl + '/_vti_bin/Apps/Md/MerchandiseTypeService.svc';
        var serviceUrl = configService.rootUrlWebApi + '/Md/MerchandiseType';
        var result = {
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
            },
            postSelectData: function (data, callback) {
                $http.post(serviceUrl + '/PostSelectData', data).success(callback);
            },
            getNewInstance: function (callback) {
                $http.get(serviceUrl + '/GetNewInstance').success(callback);
            },
            getSelectAll: function (callback) {
                $http.get(serviceUrl + '/GetSelectAll').success(callback);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            }
        }
        return result;
    }
]);

var merchandiseTypeController = mdModule.controller('merchandiseTypeController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'merchandiseTypeService', 'configService', 'mdService', 'blockUI', 'localStorageService', 'clientService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
merchandiseTypeService, configService, mdService, blockUI, localStorageService, clientService) {
    $scope.tempData = mdService.tempData;
    $scope.config = mdService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'maLoaiVatTu'; // set the default sort type
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
        return 'Danh mục loại hàng hóa';
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
                merchandiseTypeService.deleteItem(item).then(function(data) {
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
                            $scope.tempData.update('merchandiseTypes');
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
                templateUrl: mdService.buildUrl('mdMerchandiseType', 'add'),
                controller: 'merchandiseTypeCreateController',
                resolve: {}
            });

            modalInstance.result.then(function(updatedData) {
                $scope.tempData.update('merchandiseTypes');
                $scope.refresh();
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.update = function(target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandiseType', 'update'),
                controller: 'merchandiseTypeEditController',
                resolve: {
                    targetData: function() {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function(updatedData) {
                $scope.tempData.update('merchandiseTypes');
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
                templateUrl: mdService.buildUrl('mdMerchandiseType', 'details'),
                controller: 'merchandiseTypeDetailsController',
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
            merchandiseTypeService.postQuery(
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

mdModule.controller('merchandiseTypeDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'merchandiseTypeService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    mdService, merchandiseTypeService, targetData, $filter) {
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

    $scope.title = function () { return 'Thông tin loại hàng hóa ' ; };
    function filterData() {
        merchandiseTypeService.getSelectAll(function (response) {
            $scope.merchandiseTypeSort = response;
        })

    }
    filterData();
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('merchandiseTypeCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'merchandiseTypeService', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, merchandiseTypeService, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = {};

        $scope.title = function () { return 'Thêm loại hàng hóa'; };
        function filterData() {
            merchandiseTypeService.getNewInstance(function (response) {
                $scope.target = response;
                $scope.target.trangThai = 10;
            });
            merchandiseTypeService.getSelectAll(function(response) {
                $scope.merchandiseTypeSort = response;
            });

        };
        filterData();
        $scope.save = function () {
            merchandiseTypeService.post(
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

mdModule.controller('merchandiseTypeEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'merchandiseTypeService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, merchandiseTypeService, targetData, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = targetData;
        $scope.title = function () { return 'Cập nhập loại hàng hóa '; };
        console.log(targetData);
        $scope.save = function () {
            merchandiseTypeService.update($scope.target).then(
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
            merchandiseTypeService.getSelectAll(function(response) {
                $scope.merchandiseTypeSort = response;
            });

        }
        filterData();
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

mdModule.controller('merchandiseTypeSelectDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state',
    'merchandiseTypeService', 'configService', 'mdService', 'serviceSelectData', 'filterObject',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state,
        merchandiseTypeService, configService, mdService, serviceSelectData, filterObject) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        angular.extend($scope.filtered, filterObject);
        $scope.isEditable = true;
        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.selecteItem = function (item) {
            $uibModalInstance.close(item);
        }
        $scope.sortType = 'maLoai'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.doSearch = function () {
            $scope.paged.currentPage = 1;
            filterData();
        };
        $scope.pageChanged = function () {
            filterData();
        };
        $scope.refresh = function () {
            $scope.setPage($scope.paged.currentPage);
        };
        $scope.title = function () {
            return 'Loại hàng';
        };
        $scope.doCheck = function (item) {
            if (item) {
                var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                    return element.id == item.id;
                });
                if (item.selected) {
                    if (!isSelected) {
                        $scope.listSelectedData.push(item);
                    }
                } else {
                    if (isSelected) {
                        $scope.listSelectedData.splice(item, 1);
                    }
                }
            } else {
                angular.forEach($scope.data, function (v, k) {

                    $scope.data[k].selected = $scope.all;
                    var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                        if (!element) return false;
                        return element.id == v.id;
                    });

                    if ($scope.all) {
                        if (!isSelected) {
                            $scope.listSelectedData.push($scope.data[k]);
                        }
                    } else {
                        if (isSelected) {
                            $scope.listSelectedData.splice($scope.data[k], 1);
                        }
                    }
                });
            }
        }
        $scope.create = function () {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdTypeMerchandise', 'add'),
                controller: 'typeMerchandiseCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('typeMerchandises');
                $scope.refresh();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.save = function () {
            //console.log($scope.listSelectedData);
            $uibModalInstance.close($scope.listSelectedData);
        };
        filterData();
        function filterData() {
            $scope.listSelectedData = serviceSelectData.getSelectData();
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            merchandiseTypeService.postSelectData(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.forEach($scope.data, function (v, k) {
                            var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                                if (!element) return false;
                                return element.value == v.value;
                            });
                            if (isSelected) {
                                $scope.data[k].selected = true;
                            }
                        })
                        angular.extend($scope.paged, response.data);
                    }
                });
        };
    }]);