mdModule.factory('danhSachDVKDService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var serviceUrl = configService.rootUrlWebApi + '/Md/DanhSachDonVi';
        var result = {
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            createCode: function (maDonVi, callback) {
                $http.get(serviceUrl + '/CreateEmployCode/' + maDonVi).success(callback);
            },
            postNhanVienDonVi: function (data, callback) {
                $http.post(serviceUrl + '/PostNhanVienDonVi', data).success(callback);
            }
        }
        return result;
    }
]);
var danhSachDVKDController = mdModule.controller('danhSachDVKDController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'unitUserService', 'configService', 'mdService', 'blockUI',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
unitUserService, configService, mdService, blockUI) {
    $scope.tempData = mdService.tempData;
    $scope.config = mdService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'maDonVi'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function () {
        $scope.paged.currentPage = 1;
        var objectSeach = angular.copy($scope.filtered);
        if ($scope.filtered.advanceData.ngayDangKy) {
            $scope.filtered.advanceData = clientService.convertToDateNumber($scope.filtered.advanceData, ["NgayDangKy"]);
        }
        filterData();
        $scope.filtered = objectSeach;
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
        return 'Danh sách đơn vị';
    };

    //delete
    $scope.deleteItem = function (ev, item) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Cảnh báo')
              .textContent('Dữ liệu đơn vị có thể liên kết với các dữ liệu cửa hàng, bạn có chắc muốn xóa?')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Ok')
              .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            unitUserService.deleteItem(item).then(function (data) {
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
                        $scope.tempData.update('unitUsers');
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
            templateUrl: mdService.buildUrl('mdDanhSachDVKD', 'add'),
            controller: 'mdDanhSachDVKDCreateController',
            resolve: {},
            size: 'lg'
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('unitUsers');
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdDanhSachDVKD', 'update'),
            controller: 'mdDanhSachDVKDEditController',
            size: 'lg',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('unitUsers');
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
            templateUrl: mdService.buildUrl('mdDanhSachDVKD', 'details'),
            controller: 'mdDanhSachDVKDDetailsController',
            size: 'lg',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
    };

    $scope.addNhanVien = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdDanhSachDVKD', 'addNhanVien'),
            controller: 'mdAddNhanVienDonViController',
            size: 'lg',
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
        unitUserService.postDonVi(JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.extend($scope.paged, response.data);
                }
            });
    };
}]);

mdModule.controller('mdDanhSachDVKDDetailsController', [
    '$scope', '$uibModalInstance',
    'mdService', 'unitUserService', 'targetData', '$filter', 'clientService',
function ($scope, $uibModalInstance,
    mdService, unitUserService, targetData, $filter, clientService) {
    $scope.config = mdService.config;
    $scope.format = "dd/MM/yyyy";
    $scope.tempData = mdService.tempData;
    $scope.target = targetData;
    $scope.target = clientService.convertFromDateNumber(targetData, ["NgayDangKy"]);
    unitUserService.getDetails($scope.target.maDonVi, function (response) {
        if (response.status) {
            $scope.lstCuaHang = response.data.dataDetails;
        }
    });
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };
    $scope.title = function () { return 'Thông tin đơn vị'; };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('mdDanhSachDVKDCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'unitUserService', 'clientService',
    function ($scope, $uibModalInstance, mdService, unitUserService, clientService) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = {};
        $scope.lstCuaHang = [];
        unitUserService.createUnitCode(function (response) {
            $scope.target.maDonVi = response;
        });
        $scope.title = function () { return 'Thêm đơn vị'; };
        $scope.save = function () {
            $scope.target.dataDetails = $scope.lstCuaHang;
            var convertData = clientService.convertToDateNumber($scope.target, ["NgayDangKy"]);
            angular.extend(convertData);
            unitUserService.post(
                JSON.stringify(convertData), function (response) {
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

mdModule.controller('mdDanhSachDVKDEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'unitUserService', 'targetData', 'clientService', '$mdDialog',
    function ($scope, $uibModalInstance,
        mdService, unitUserService, targetData, clientService, $mdDialog) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = targetData;
        $scope.target = clientService.convertFromDateNumber(targetData, ["NgayDangKy"]);
        unitUserService.getDetails($scope.target.maDonVi, function (response) {
            if (response.status) {
                $scope.lstCuaHang = response.data.dataDetails;
            }
        });
        $scope.addRow = function () {
            $scope.lstCuaHang.push({ MaDonViCha: $scope.target.maDonVi });
        };
        $scope.removeCuaHang = function (index, ev, item) {
            var confirm = $mdDialog.confirm()
          .title('Cảnh báo')
          .textContent('Dữ liệu có thể liên kết với các dữ liệu khác, bạn có chắc muốn xóa?')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Oke')
          .cancel('Cancle');
            $mdDialog.show(confirm).then(function () {
                unitUserService.deleteItem(item).then(function (data) {
                }).then(function (data) {
                    $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Thông báo')
                    .textContent('Xóa cửa hàng thành công')
                    .ariaLabel('Alert')
                    .ok('Oke')
                    .targetEvent(ev))
                        .finally(function () {
                            $scope.tempData.update('unitUsers');
                            filterData();
                        });
                    $scope.lstCuaHang.splice(index, 1);
                });
            }, function () {
                console.log('Không xóa');
            });
        }
        $scope.title = function () { return 'Cập nhập đăng ký '; };
        console.log(targetData);
        $scope.save = function () {
            $scope.target.dataDetails = $scope.lstCuaHang;
            var convertData = clientService.convertToDateNumber($scope.target, ["NgayDangKy"]);
            unitUserService.update(convertData).then(
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

mdModule.controller('mdAddNhanVienDonViController', [
    '$scope', '$uibModalInstance',
    'mdService', 'danhSachDVKDService', 'clientService', 'targetData',
    function ($scope, $uibModalInstance, mdService, danhSachDVKDService, clientService, targetData) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.maDonVi = targetData.maDonVi;
        $scope.target = {};
        $scope.title = function () { return 'Thêm nhân viên đơn vị ' + $scope.maDonVi; };
        danhSachDVKDService.createCode($scope.maDonVi, function (response) {
            $scope.target.maNhanVien = response;
        });

        $scope.save = function () {
            $scope.target.maDonVi = $scope.maDonVi;
            $scope.target.maCuaHang = $scope.maDonVi;
            danhSachDVKDService.postNhanVienDonVi(
                JSON.stringify($scope.target), function (response) {
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
