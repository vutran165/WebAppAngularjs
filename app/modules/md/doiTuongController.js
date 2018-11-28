mdModule.factory('doiTuongService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        //var serviceUrl = rootUrl + '/_vti_bin/Apps/Md/DoiTuongService.svc';
        var serviceUrl = configService.rootUrlWebApi + '/Md/DoiTuong';

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
            update: function(params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            deleteItem: function(params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            postSelectDataQuery: function(callback) {
                $http.get(configService.rootUrlWebApi + '/Md/LoaiDoiTuong/GetSelectData').success(callback);
            }

        }
        return result;
    }
]);

var doiTuongController = mdModule.controller('doiTuongController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'doiTuongService', 'configService', 'mdService', 'blockUI', 'clientService', 'localStorageService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
doiTuongService, configService, mdService, blockUI, clientService, localStorageService) {
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
        return 'Danh mục đối tượng';
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
                doiTuongService.deleteItem(item).then(function (data) {
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
                templateUrl: mdService.buildUrl('mdDoiTuong', 'add'),
                controller: 'doiTuongCreateController',
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
                templateUrl: mdService.buildUrl('mdDoiTuong', 'update'),
                controller: 'doiTuongEditController',
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
                templateUrl: mdService.buildUrl('mdDoiTuong', 'details'),
                controller: 'doiTuongDetailsController',
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
            doiTuongService.postQuery(
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

mdModule.controller('doiTuongDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'doiTuongService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    mdService, doiTuongService, targetData, $filter) {
    $scope.tempData = mdService.tempData;
    $scope.config = mdService.config;
    $scope.target = targetData;

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { Value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };

    $scope.title = function () { return 'Thông tin đối tượng '; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('doiTuongCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'doiTuongService', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, doiTuongService, clientService) {

        $scope.config = mdService.config;
        $scope.target = {};
        $scope.tempData = mdService.tempData;
        $scope.title = function () { return 'Thêm loại đối tượng'; };

        $scope.save = function () {
            doiTuongService.post(
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
        //function filterData() {
        //    doiTuongService.postSelectDataQuery(function (response) {
        //        $scope.tempData.loaiDoiTuongs = response;
        //    });
        //}
        //filterData();
    }
]);

mdModule.controller('doiTuongEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'doiTuongService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, doiTuongService, targetData, clientService) {

        $scope.config = mdService.config;
        $scope.target = targetData;
        $scope.tempData = mdService.tempData;
        $scope.title = function () { return 'Cập nhập loại đối tượng '; };
        $scope.save = function () {
            doiTuongService.update($scope.target).then(
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
        //function filterData() {
        //    doiTuongService.postSelectDataQuery(function (response) {
        //        $scope.tempData.loaiDoiTuongs = response;
        //    });
        //}
        //filterData();
    }
]);
mdModule.controller('doiTuongSelectDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state',
    'doiTuongService', 'configService', 'mdService', 'serviceSelectData', 'filterObject',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state,
        doiTuongService, configService, mdService, serviceSelectData, filterObject) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.filtered = angular.extend($scope.filtered, filterObject);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.isEditable = true;
        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.selecteItem = function (item) {
            $uibModalInstance.close(item);
        }
        $scope.sortType = 'code'; // set the default sort type
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
            return 'Đối tượng';
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
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.save = function () {
            $uibModalInstance.close(true);
        };
        filterData();
        function filterData() {
            $scope.listSelectedData = serviceSelectData.getSelectData();
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            doiTuongService.postSelectData(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.forEach($scope.data, function (v, k) {
                            var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                                if (!element) return false;
                                return element.id == v.id;
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
mdModule.controller('doiTuongSelectSingleDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state',
    'doiTuongService', 'configService', 'mdService', 'serviceSelectData', 'filterObject',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state,
        doiTuongService, configService, mdService, serviceSelectData, filterObject) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.filtered = angular.extend($scope.filtered, filterObject);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.isEditable = true;
        $scope.isShow = false;
        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.selecteItem = function (item) {
            $uibModalInstance.close(item);
        }
        $scope.sortType = 'code'; // set the default sort type
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
            return 'Đối tượng';
        };
        $scope.doCheck = function (item) {
            if (item) {
                var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                    return element.id == item.id;
                });
                if (item.selected) {
                    if (!isSelected) {
                        $scope.listSelectedData.splice(item, 1);
                        $scope.listSelectedData.push(item);
                    }
                } else {
                    if (isSelected) {
                        $scope.listSelectedData.splice(item, 1);
                    }
                }
                filterData();
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
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.save = function () {
            console.log($scope.listSelectedData);
            $uibModalInstance.close(true);
        };
        filterData();
        function filterData() {
            $scope.listSelectedData = serviceSelectData.getSelectData();
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            doiTuongService.postSelectData(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.forEach($scope.data, function (v, k) {
                            var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                                if (!element) return false;
                                return element.id == v.id;
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