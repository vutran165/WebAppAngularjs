mdModule.factory('donViHaiQuanService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        //var serviceUrl = rootUrl + '/_vti_bin/Apps/Md/WareHouseService.svc';
        var serviceUrl = configService.rootUrlWebApi + '/Md/DonViHaiQuan';
        var result = {
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            //postSelectDataQuery: function (data, callback) {
            //    $http.post(serviceUrl + '/PostSelectDataQuery', data).success(callback);
            //},
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
            },
            postSelectData: function (data, callback) {
                $http.post(serviceUrl + '/PostSelectData', data).success(callback);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            getHaiQuanById: function (maDonVi, callback) {
                $http.post(serviceUrl + '/GetHaiQuanById/' + maDonVi).success(callback);
            }

        }
        return result;
    }
]);

var donViHaiQuanController = mdModule.controller('donViHaiQuanController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'donViHaiQuanService', 'configService', 'mdService', 'localStorageService', 'clientService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
donViHaiQuanService, configService, mdService, localStorageService, clientService) {
    $scope.tempData = mdService.tempData;
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
        return 'Danh mục đơn vị chủ quản';
    };
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
            donViHaiQuanService.deleteItem(item).then(function (data) {
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
                        $scope.tempData.update('wareHouses');
                        filterData();
                    });
            });

        }, function () {
            console.log('Không xóa');
        });
    };
    $scope.target = { options: 'maHaiQuan' };
    $scope.categories = [{
        value: 'maHaiQuan',
        text: 'Mã Hải Quan'
    },
		{
		    value: 'tenHaiQuan',
		    text: 'Tên Hải Quan'
		},
		{
		    value: 'cap',
		    text: 'Cấp'
		},
		{
		    value: 'diaChi',
		    text: 'Địa chỉ'
		}
    ];


    //function filterAdvanceData() {
    //    $scope.filtered.advanceData = {};
    //    if ($scope.target.options) {
    //        $scope.filtered.isAdvance = true;
    //        $scope.filtered.advanceData[$scope.target.options] = $scope.summary;
    //    }
    //    $scope.isLoading = true;
    //    var postdata = { paged: $scope.paged, filtered: $scope.filtered };
    //    donViHaiQuanService.postSelectDataQuery(
    //        JSON.stringify(postdata),
    //        function (response) {
    //            $scope.isLoading = false;
    //            if (response.status) {
    //                $scope.data = response.data.data;
    //                angular.extend($scope.paged, response.data);
    //                if (response.message) {
    //                    clientService.noticeAlert(response.message, "success");
    //                }
    //            }
    //        });
    //    $scope.filtered.isAdvance = false;
    //}
    //if ($scope.summary != '') {
    //    $scope.doSearchStr = function () {
    //        $scope.paged.currentPage = 1;
    //        filterAdvanceData();
    //    }
    //}


    //$scope.pageChanged = function () {
    //    filterAdvanceData();
    //};


    //filterAdvanceData();


    $scope.create = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdDonViHaiQuan', 'add'),
            controller: 'donViHaiQuanCreateController',
            resolve: {}
        });
        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('donViHaiQuans');
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdDonViHaiQuan', 'update'),
            controller: 'donViHaiQuanEditController',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('donViHaiQuans');
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
            templateUrl: mdService.buildUrl('mdDonViHaiQuan', 'details'),
            controller: 'donViHaiQuanDetailsController',
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
        donViHaiQuanService.postQuery(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    console.log(response.data.data);
                    $scope.data = response.data.data;
                    angular.extend($scope.paged, response.data);
                    console.log($scope.paged);
                }
            });
    };
}]);



mdModule.controller('donViHaiQuanDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'donViHaiQuanService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    mdService, donViHaiQuanService, targetData, $filter) {
    $scope.tempData = mdService.tempData;
    $scope.config = mdService.config;
    $scope.target = targetData;

    $scope.title = function () { return 'Thông tin đơn vị chủ quản '; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('donViHaiQuanCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'donViHaiQuanService', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, donViHaiQuanService, clientService) {

        $scope.config = mdService.config;
        $scope.target = {};
        $scope.tempData = mdService.tempData;
        $scope.title = function () { return 'Thêm đơn vị chủ quản'; };

        $scope.save = function () {
            donViHaiQuanService.post(
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

mdModule.controller('donViHaiQuanEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'donViHaiQuanService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance,
        mdService, donViHaiQuanService, targetData, clientService) {

        $scope.config = mdService.config;
        $scope.target = targetData;
        $scope.tempData = mdService.tempData;
        $scope.title = function () { return 'Cập nhập đơn vị chủ quản'; };
        console.log(targetData);
        $scope.save = function () {
            donViHaiQuanService.update($scope.target).then(
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

mdModule.controller('donViHaiQuanSelectDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state',
    'donViHaiQuanService', 'configService', 'mdService', 'serviceSelectData', 'filterObject',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state,
        donViHaiQuanService, configService, mdService, serviceSelectData, filterObject) {
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
            return 'Đơn vị hải quan';
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
        $scope.create = function () {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdDonViHaiQuan', 'add'),
                controller: 'donViHaiQuanCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('donvihaiquan');
                $scope.refresh();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
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
            donViHaiQuanService.postSelectData(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.forEach($scope.data, function (v, k) {
                            var isSelected = $scope.listSelectedData.some(function (element, index, array) {
                                if (!element) return false;
                                return element.maHaiQuan == v.maHaiQuan;
                            });
                            if (isSelected) {
                                $scope.data[k].selected = true;
                            }
                        });
                        angular.extend($scope.paged, response.data);
                    }
                });
        };
    }]);