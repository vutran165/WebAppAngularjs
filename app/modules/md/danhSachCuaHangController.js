mdModule.factory('dsCuaHangService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var serviceUrl = configService.rootUrlWebApi + '/Md/DanhSachCuaHang';
        var result = {
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
            },
            postNhanVien: function (data, callback) {
                $http.post(serviceUrl + '/PostNhanVien', data).success(callback);
            },
            postKho: function (data, callback) {
                $http.post(serviceUrl + '/PostKho', data).success(callback);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/Delete/' + params.id, params);
            },
            getNhanVien: function (id, callback) {
                $http.get(serviceUrl + '/GetNhanVien/' + id).success(callback);
            },
            getKhoHang: function (id, callback) {
                $http.get(serviceUrl + '/GetKhoHang/' + id).success(callback);
            },
            getDonVi: function (callback) {
                $http.get(serviceUrl + '/GetDonVi').success(callback);
            },
            uploadMutipleFile: function (modulename) {
                var uploadUrl = "/_layouts/15/Upload/UpLoadFile.ashx/";
                return clientService.multipleUploadFile(modulename, uploadUrl);
            },
            uploadSingleFile: function (modulename, index) {
                var uploadUrl = "/_layouts/15/Upload/UpLoadFile.ashx/";
                return clientService.singleUpLoad(index, modulename, uploadUrl);
            },
            getReport: function (id, callback) {
                $http.get(serviceUrl + '/GetReport/' + id).success(callback);
            },
            setParameterPrint: function (data) {
                parameterPrint = data;
            },
            getParameterPrint: function () {
                return parameterPrint;
            },
            postPrint: function (callback) {
                $http.post(serviceUrl + '/PostPrint', getParameterPrint()).success(callback);
            },
            createCode: function (maCuaHang, callback) {
                $http.get(serviceUrl + '/CreateEmployCode/' + maCuaHang).success(callback);
            },
            createCodeWareHouse: function (maCuaHang, callback) {
                $http.get(serviceUrl + '/CreateWareHouseCode/' + maCuaHang).success(callback);
            }
        }
        return result;
    }
]);
var danhSachCuaHangController = mdModule.controller('danhSachCuaHangController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'unitUserService', 'configService', 'mdService', 'blockUI', 'dsCuaHangService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
unitUserService, configService, mdService, blockUI, dsCuaHangService) {
    $scope.tempData = mdService.tempData;
    $scope.config = mdService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'maCuaHang'; // set the default sort type
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
        return 'Danh sách siêu thị';
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
        });
    };
    $scope.create = function (item) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdDanhSachCuaHang', 'add'),
            controller: 'mdDanhSachCuaHangCreateController',
            resolve: {
                targetData: function () {
                    return item;
                }
            },
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
            templateUrl: mdService.buildUrl('mdDanhSachCuaHang', 'update'),
            controller: 'mdDanhSachCuaHangEditController',
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
    unitUserService.getDonVi(function (response) {
        if (response.status) {
            $scope.lstDonVi = response.data.dataDonVi;
        }
    });
    $scope.itemSelected = function (item) {
        $scope.filtered.advanceData.maDonViCha = item;
        filterData();
    };

    $scope.addNhanVien = function (item) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdDanhSachCuaHang', 'addNhanVien'),
            controller: 'mdAddNhanVienController',
            size: 'lg',
            resolve: {
                targetData: function () {
                    return item;
                }
            }
        });
    };

    $scope.addKho = function (item) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdDanhSachCuaHang', 'addKho'),
            controller: 'mdAddKhoController',
            size: 'lg',
            resolve: {
                targetData: function () {
                    return item;
                }
            }
        });
    };

    $scope.details = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdDanhSachCuaHang', 'details'),
            controller: 'mdDanhSachCuaHangDetailsController',
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
        dsCuaHangService.postQuery(JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.extend($scope.paged, response.data);
                }
            });
    };
}]);

mdModule.controller('mdDanhSachCuaHangDetailsController', [
    '$scope', '$uibModalInstance',
    'mdService', 'dsCuaHangService', 'targetData', '$filter', 'clientService',
function ($scope, $uibModalInstance,
    mdService, dsCuaHangService, targetData, $filter, clientService) {
    $scope.config = mdService.config;
    $scope.tempData = mdService.tempData;
    $scope.target = targetData;
    dsCuaHangService.getNhanVien($scope.target.maCuaHang, function (response) {
        if (response.status) {
            $scope.lstNhanVien = response.data.dataNhanVien;
        };
    });
    dsCuaHangService.getKhoHang($scope.target.maCuaHang, function (response) {
        if (response.status) {
            $scope.lstKhoHang = response.data.dataKhoHang;
        };
    });
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };
    $scope.title = function () { return 'Thông tin siêu thị ' + targetData.maCuaHang; };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('mdDanhSachCuaHangCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'dsCuaHangService', 'clientService', 'targetData',
    function ($scope, $uibModalInstance, mdService, dsCuaHangService, clientService, targetData) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = {};
        $scope.title = function () { return 'Thêm siêu thị thuộc đơn vị ' + targetData; };
        $scope.target.maDonViCha = targetData;
        $scope.save = function () {
            angular.extend($scope.target);
            dsCuaHangService.post(
                JSON.stringify($scope.target), function (response) {
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

mdModule.controller('mdAddNhanVienController', [
    '$scope', '$uibModalInstance',
    'mdService', 'dsCuaHangService', 'clientService', 'targetData',
    function ($scope, $uibModalInstance, mdService, dsCuaHangService, clientService, targetData) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = {};
        $scope.saveTmp = [];
        $scope.title = function () { return 'Thêm nhân viên siêu thị ' + targetData.maCuaHang; };
        dsCuaHangService.createCode(targetData.maCuaHang, function (response) {
            $scope.target.maNhanVien = response;
        });
        $scope.save = function () {
            $scope.target.maCuaHang = targetData.maCuaHang;
            $scope.target.maDonVi = targetData.maDonViCha;
            angular.extend($scope.target);
            dsCuaHangService.postNhanVien(
                JSON.stringify($scope.target), function (response) {
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

mdModule.controller('mdDanhSachCuaHangEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'dsCuaHangService', 'targetData', 'clientService', '$mdDialog',
    function ($scope, $uibModalInstance,
        mdService, dsCuaHangService, targetData, clientService, $mdDialog) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = targetData;
        $scope.DataNhanVien = [];
        $scope.title = function () { return 'Cập nhập thông tin siêu thị '; };
        dsCuaHangService.getNhanVien($scope.target.maCuaHang, function (response) {
            if (response.status) {
                $scope.lstNhanVien = response.data.dataNhanVien;
            };
        });
        dsCuaHangService.getKhoHang($scope.target.maCuaHang, function (response) {
            if (response.status) {
                $scope.lstKhoHang = response.data.dataKhoHang;
            };
        });
        $scope.save = function () {
            $scope.target.DataNhanVien = $scope.lstNhanVien;
            $scope.target.DataKhoHang = $scope.lstKhoHang;
            dsCuaHangService.update($scope.target).then(function (response) {
                if (response.status && response.status == 200) {
                    if (response.data.status) {
                        clientService.noticeAlert("Thành công", "success");
                        $uibModalInstance.close($scope.target);
                    } else {

                    }
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

mdModule.controller('mdAddKhoController', [
    '$scope', '$uibModalInstance',
    'mdService', 'dsCuaHangService', 'clientService', 'targetData',
    function ($scope, $uibModalInstance, mdService, dsCuaHangService, clientService, targetData) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = {};
        $scope.title = function () { return 'Thêm kho siêu thị ' + targetData.maCuaHang; };
        dsCuaHangService.createCodeWareHouse(targetData.maCuaHang, function (response) {
            $scope.target.maKho = response;
        });
        $scope.save = function () {
            $scope.target.maCuaHang = targetData.maCuaHang;
            $scope.target.maDonVi = targetData.maDonViCha;
            angular.extend($scope.target);
            dsCuaHangService.postKho(
                JSON.stringify($scope.target), function (response) {
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