mdModule.factory('customerService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        //var serviceUrl = rootUrl + '/_vti_bin/Apps/Md/CustomerService.svc';
        var serviceUrl = configService.rootUrlWebApi + '/Md/Customer';
        var result = {
            postQuery: function(data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            postSelectData: function(data, callback) {
                $http.post(serviceUrl + '/PostSelectData', data).success(callback);
            },
            post: function(data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
            },
            getNewInstance: function(callback) {
                $http.get(serviceUrl + '/GetNewInstance').success(callback);
            },
            update: function(params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            deleteItem: function(params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            getNewCode: function(callback) {
                $http.get(serviceUrl + '/GetNewCode').success(callback);
            },

        }
        return result;
    }
]);

var customerController = mdModule.controller('customerController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'customerService', 'configService', 'mdService', 'blockUI', 'localStorageService', 'clientService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
customerService, configService, mdService, blockUI, localStorageService, clientService) {
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
        return 'Danh sách khách hàng';
    };
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
                customerService.deleteItem(item).then(function(data) {
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
                            $scope.tempData.update('customers');
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
                templateUrl: mdService.buildUrl('mdCustomer', 'add'),
                controller: 'customerCreateController',
                resolve: {}
            });

            modalInstance.result.then(function(updatedData) {
                $scope.tempData.update('customers');
                $scope.refresh();
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.update = function(target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdCustomer', 'update'),
                controller: 'customerEditController',
                resolve: {
                    targetData: function() {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function(updatedData) {
                $scope.tempData.update('customers');
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
                templateUrl: mdService.buildUrl('mdCustomer', 'details'),
                controller: 'customerDetailsController',
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

            customerService.postQuery(
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

mdModule.controller('customerDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'customerService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    mdService, customerService, targetData, $filter) {

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

    $scope.title = function () { return 'Thông tin Khách hàng '; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('customerCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'customerService', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, customerService, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = {};

        $scope.title = function () { return 'Thêm mới khách hàng'; };
        $scope.save = function () {
            customerService.post(
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
        function filterData() {
            customerService.getNewInstance(function (response) {
                $scope.target = response;
            })
        }
        function getNewCode() {
            customerService.getNewCode(function (response) {
                $scope.target.makh = response;
            })
        }

        getNewCode();
        console.log($scope.target);
        //filterData();
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

mdModule.controller('customerEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'customerService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, customerService, targetData, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = targetData;

        $scope.title = function () { return 'Cập nhập thông tin khách hàng '; };
        console.log(targetData);
        $scope.save = function () {
            customerService.update($scope.target).then(
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

mdModule.controller('customerSelectDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state',
    'customerService', 'configService', 'mdService', 'serviceSelectData', 'filterObject',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state,
        customerService, configService, mdService, serviceSelectData, filterObject) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        angular.extend($scope.filtered, filterObject);
        $scope.modeClickOneByOne = true;

        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.selecteItem = function (item) {
            $uibModalInstance.close(item);
        }
        $scope.sortType = 'maKH'; // set the default sort type
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
            return 'Danh sách khách hàng';
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
                templateUrl: mdService.buildUrl('mdMerchandise', 'add'),
                controller: 'merchandiseCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('merchandises');
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
            if (serviceSelectData) {

                $scope.modeClickOneByOne = false;
            }

            if ($scope.modeClickOneByOne) {
                $scope.isLoading = true;
                var postdata = { paged: $scope.paged, filtered: $scope.filtered };
                customerService.postSelectData(
                    JSON.stringify(postdata),
                    function (response) {
                        $scope.isLoading = false;
                        if (response.status) {
                            $scope.data = response.data.data;
                            angular.extend($scope.paged, response.data);
                        }
                    });
            } else {
                $scope.listSelectedData = serviceSelectData.getSelectData();
                $scope.isLoading = true;
                var postdata = { paged: $scope.paged, filtered: $scope.filtered };
                customerService.postSelectData(
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
            }         
        };
    }]);