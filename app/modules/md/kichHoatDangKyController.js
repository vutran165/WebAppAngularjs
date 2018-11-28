var kichHoatDangKyController = mdModule.controller('kichHoatDangKyController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog',
'unitUserService', 'configService', 'mdService', 'blockUI', 'clientService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog,
unitUserService, configService, mdService, blockUI, clientService) {
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
        return 'Kích hoạt đăng ký';
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

    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdKichHoatDangKy', 'update'),
            controller: 'mdKichHoatEditController',
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
            templateUrl: mdService.buildUrl('mdKichHoatDangKy', 'details'),
            controller: 'mdKichHoatDetailsController',
            size: 'lg',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
    };

    $scope.addinfo = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdKichHoatDangKy', 'addinfo'),
            controller: 'mdKichHoatAddInfoController',
            size: 'lg',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
        modalInstance.result.then(function () {
            filterData();
        });
    };

    filterData();
    function filterData() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        unitUserService.postQuery(
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

mdModule.controller('mdKichHoatDetailsController', [
    '$scope', '$uibModalInstance',
    'mdService', 'unitUserService', 'targetData', '$filter', 'clientService',
function ($scope, $uibModalInstance,
    mdService, unitUserService, targetData, $filter, clientService) {
    $scope.config = mdService.config;
    $scope.format = "dd/MM/yyyy";
    $scope.tempData = mdService.tempData;
    $scope.target = targetData;
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
    $scope.title = function () { return 'Thông tin đăng ký: ' + $scope.target.tenDonVi + '[' + $scope.target.maDonVi + ']'; };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('mdKichHoatEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'unitUserService', 'targetData', 'clientService', '$mdDialog',
    function ($scope, $uibModalInstance,
        mdService, unitUserService, targetData, clientService, $mdDialog) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = targetData;
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
        $scope.title = function () { return 'Cập nhập thông tin đăng ký: ' + $scope.target.tenDonVi + '[' + $scope.target.maDonVi + ']'; };
        $scope.save = function () {
            $scope.target.dataDetails = $scope.lstCuaHang;
            unitUserService.update($scope.target).then(
                function (response) {
                    if (response.status && response.status == 200) {
                        if (response.data.status) {
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

        $scope.removeUser = function (username) {
            var id = targetdata.id;
            var rqData = {
                RequestData: username
            }
            unitUserService.removeUser(id, rqData, function (response) {
                filterData();
            });
        }
        $scope.addUser = function (username) {
            var id = targetdata.id;
            var rqData = {
                RequestData: username
            }
            unitUserService.addUser(id, rqData, function(response) {
                filterData();
            });
        };


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

mdModule.controller('mdKichHoatAddInfoController', [
    '$scope', '$uibModalInstance', 'mdService', 'unitUserService', 'clientService', 'targetData', '$uibModal', 'Upload', 'configService', '$timeout',
    function ($scope, $uibModalInstance, mdService, unitUserService, clientService, targetData, $uibModal, Upload, configService, $timeout) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = targetData;
        $scope.format = "dd/MM/yyyy";
        $scope.target = clientService.convertFromDateNumber(targetData, ["NgayDangKy", "NgayXuLy"]);
        $scope.title = function () { return 'Thông tin kích hoạt'; };
        unitUserService.getDetails($scope.target.maDonVi, function (response) {
            if (response.status) {
                $scope.lstCuaHang = response.data.dataDetails;
            }
        });
        //upload file
        $scope.uploadFiles = function (files, errFiles, name) {
            var rootUrl = configService.rootUrlWeb;
            var serviceUrl = rootUrl + '/_vti_bin/Apps/Md/UnitUserService.svc/STREAMING/UploadFile?fileName=';
            $scope.files = files;
            $scope.target[name] = files[0].name;
            for (var i = 0; i < $scope.lstCuaHang.length; i++) {
                $scope.lstCuaHang[name] = files[0].name;
            }
            $scope.errFiles = errFiles;
            angular.forEach(files, function (file) {
                file.upload = Upload.upload({
                    url: serviceUrl + file.name,
                    data: { file: file }
                });
                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                                             evt.loaded / evt.total));
                });
            });
        }

        function filterData() {
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            unitUserService.postQuery(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.extend($scope.paged, response.data);
                    }
                });
        };

        $scope.active = function () {
            $scope.target.dataDetails = $scope.lstCuaHang;
            unitUserService.addInfoAndActive($scope.target).then(function (response) {
                if (response.status === 200) {
                    clientService.noticeAlert("Kích hoạt thành công", "success");
                    $uibModalInstance.close($scope.target);
                }
                else {
                    clientService.noticeAlert(response.errorMessage, "danger");
                }
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

       
    }
]);