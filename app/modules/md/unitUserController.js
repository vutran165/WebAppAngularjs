mdModule.factory('unitUserService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var serviceUrl = configService.rootUrlWebApi + '/Md/UnitUser';
        var rootUrl = configService.apiServiceBaseUri;
        var result = {
            postSelectData: function (data, callback) {
                $http.post(serviceUrl + '/PostSelectData', data).success(callback);
            },
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
            },
            update: function (params) {
                return $http.put(serviceUrl + '/Put?id=' + params.id, params);
            },

            addUser: function (id, username, callback) {
                $http.post(serviceUrl + '/AddUser/' + id, username).success(callback);
            },
            removeUser: function (id, username, callback) {
                $http.post(serviceUrl + '/RemoveUser/' + id, username).success(callback);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/Delete/' + params.id, params);
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

            postCodeStore: function (data, callback) {
                $http.post(serviceUrl + '/PostCodeStore', data).success(callback);
            },
            putActive: function (param) {
                return $http.put(serviceUrl + '/PutActive/' + param.id, param);
            },
            putInActive: function (param) {
                return $http.put(serviceUrl + '/PutInActive/' + param.id, param);
            }
        }
        return result;
    }
]);

var unitUserController = mdModule.controller('unitUserController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog', '$filter',
'unitUserService', 'configService', 'mdService', 'blockUI', 'clientService', 'localStorageService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog, $filter,
unitUserService, configService, mdService, blockUI, clientService, localStorageService) {
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

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].description;
        }
        return "Empty!";
    };

    $scope.customChange = function (mahq) {
        if (mahq) {
            mahq = mahq.toUpperCase();
            var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: mahq }, true);
            console.log(data);
            if (data && data.length > 0) {
                $scope.filtered.advanceData.maHaiQuan = data[0].value;
                $scope.filtered.advanceData.idHaiQuan = data[0].id;
            }
        }
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
        return 'Danh sách cửa hàng miễn thuế';
    };
    //delete
    $scope.deleteItem = function (ev, item) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Cảnh báo')
              .textContent('Dữ liệu này có thể liên kết với các dữ liệu khác, bạn có chắc muốn xóa?')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Ok')
              .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            unitUserService.deleteItem(item).then(function (data) {
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

    $scope.create = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdUnitUser', 'add'),
            controller: 'unitUserCreateController',
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
    $scope.active = function (item) {
        $scope.isDisabled = true;
        unitUserService.putActive(
            item).success(
            function (response) {
                //Fix
                if (response.status) {
                    console.log('Create  Successfully!');
                    clientService.noticeAlert(response.message, "success");
                    $scope.isDisabled = false;
                    $scope.refresh();
                } else {
                    $scope.isDisabled = false;
                    clientService.noticeAlert(response.message, "danger");
                }
                //End fix
            }).error(function (error) {
                $scope.isDisabled = false;
            });
    }
    $scope.inActive = function (item) {
        unitUserService.putInActive(
            item).success(
            function (response) {
                //Fix
                if (response.status) {
                    console.log('Create  Successfully!');
                    clientService.noticeAlert(response.message, "success");
                    $scope.refresh();
                } else {
                    clientService.noticeAlert(response.message, "danger");
                }
                //End fix
            }).error(function (error) {
            });
    }
    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdUnitUser', 'update'),
            controller: 'unitUserEditController',
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
            templateUrl: mdService.buildUrl('mdUnitUser', 'details'),
            controller: 'unitUserDetailsController',
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
    filterData();


}]);

mdModule.controller('unitUserDetailsController', [
    '$scope', '$uibModalInstance',
    'mdService', 'unitUserService', 'targetData', '$filter', 'clientService',
function ($scope, $uibModalInstance,
    mdService, unitUserService, targetData, $filter, clientService) {
    $scope.config = mdService.config;
    $scope.format = "dd/MM/yyyy";
    $scope.tempData = mdService.tempData;
    $scope.target = targetData;
    console.log($scope.target);

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].description;
        }
        return "Empty!";
    };

    $scope.displayHelper = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
        if (data && data.length == 1) {
            return data[0].description;
        }
        return "Empty!";
    };



    $scope.target = clientService.convertFromDateNumber(targetData, ["NgayDangKy"]);


    $scope.tagdoiTuongs = [];

    $scope.tagCustomerTypes = [];


    var lstStore = [];
    var lstCompanyType = [];

    function loadStore() {
        if (targetData.loaiHinhCuaHang) {
            lstStore = targetData.loaiHinhCuaHang.split(',');
        }
        if (targetData.maDoiTuong) {
            lstCompanyType = targetData.maDoiTuong.split(',');
        }
        angular.forEach(lstStore, function (filterObject) {
            angular.forEach(mdService.tempData.loaiHinhCuaHangs, function (obj) {
                if (obj.value == filterObject) {
                    $scope.tagdoiTuongs.push(obj);
                }

            });
        });

        angular.forEach(lstCompanyType, function (filterObject) {
            angular.forEach(mdService.tempData.doiTuongs, function (obj) {
                if (obj.value == filterObject) {
                    $scope.tagCustomerTypes.push(obj);
                }

            });
        });

        var data = $filter('filter')(mdService.tempData.companies, { value: $scope.target.maSoThue }, true);
        var dataCustom = $filter('filter')(mdService.tempData.donViHaiQuans, { value: $scope.target.donViHaiQuanChuQuan }, true);
        if (data && dataCustom) {
            $scope.target.maDoanhNghiep = data[0].id;
            $scope.target.idHaiQuan = dataCustom[0].value;
        }

    }

    loadStore();

    $scope.title = function () { return 'Thông tin đăng ký '; };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


}
]);

mdModule.controller('unitUserCreateController', [
    '$scope', '$uibModalInstance',
    'mdService', 'unitUserService', 'clientService', 'Upload', 'configService', '$timeout', '$filter',
    function ($scope, $uibModalInstance, mdService, unitUserService, clientService, Upload, configService, $timeout, $filter) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.tagdoiTuongs = [];
        $scope.tagCustomerTypes = [];
        $scope.target = {};
        var codeTmp = [];

        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].value;
            }
            return "Empty!";
        };

        $scope.displayHelper = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
            return "Empty!";
        };

        var choiceObj = angular.copy(configService.choiceObj);

        function selectedComapny() {
            choiceObj.id = $scope.target.maSoThue;
            choiceObj.value = $scope.target.donViHaiQuanChuQuan;
            unitUserService.postCodeStore(choiceObj, function (response) {
                $scope.target.maDonVi = response;
            });
        }

        $scope.objectChange = function (item) {

            var data = $filter('filter')(mdService.tempData.companies, { id: item }, true);
            if (data && data.length > 0) {
                $scope.target.maSoThue = data[0].value;
                selectedComapny();
            }

        }

        $scope.customChange = function () {

            var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: $scope.target.donViHaiQuanChuQuan }, true);
            if (data && data.length > 0) {
                $scope.target.idHaiQuan = data[0].value;
            }
            selectedComapny();
        }

        $scope.selectedCustom = function (item) {
            $scope.target.donViHaiQuanChuQuan = item.value;
            selectedComapny();
        }

        $scope.selectedObject = function (item) {
            $scope.target.maSoThue = item.value;
            $scope.target.maDoanhNghiep = item.id;
            selectedComapny();
        }

        $scope.loadCustomerType = function (query) {
            return $scope.tempData.doiTuongs;
        }


        $scope.$watch('tagCustomerTypes', function (newV, oldV) {
            var values = $scope.tagCustomerTypes.map(function (element) {
                return element.value;
            });
            $scope.target.maDoiTuong = values.join();
            console.log($scope.target.maDoiTuong);
        }, true);

        $scope.loadDoiTuong = function (query) {

            return $scope.tempData.loaiHinhCuaHangs;
        }

        $scope.$watch('tagdoiTuongs', function (newValue, oldValue) {

            var values = $scope.tagdoiTuongs.map(function (element) {
                return element.value;
            });
            $scope.target.loaiHinhCuaHang = values.join();
            console.log($scope.tagdoiTuongs);
        }, true);

        $scope.files = [];
        $scope.uploadFiles = function (files, errFiles, name) {
            var rootUrl = configService.rootUrlWebApi + '/Md/UnitUser';
            var serviceUrl = rootUrl + '/STREAMING/UploadFile?fileName=';
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

        $scope.addCuaHang = function () {

            var codeUnit = (parseInt(codeTmp[codeTmp.length - 1]) + 1).toString();
            var numStr = 4 - codeUnit.length;
            for (var i = 0; i < numStr; i++) {

                codeUnit = "0" + codeUnit;
            }

            $scope.vNew = codeUnit;
            codeTmp.push($scope.vNew);
            $scope.lstCuaHang.push({ maCuaHang: $scope.vNew, maDonViCha: $scope.target.maDonVi });
        };

        $scope.removeCuaHang = function (index) {
            for (var i = codeTmp.length; i > 0; i--) {
                $scope.lstCuaHang.splice(index, 1)[i - 1];
                codeTmp.splice(index, 1)[i - 1];
                break;
            }
        };




        $scope.title = function () { return 'Thêm đăng ký'; };

        $scope.save = function () {
            $scope.target.dataDetails = $scope.lstCuaHang;
            var convertData = $scope.target;
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

        function loadData() {

            // unitUserService.getMaCuaHang($scope.target.maDoanhNghiep, function (response) {
            // $scope.target.maDonVi = response;
            // });

        }
        loadData();


    }
]);

mdModule.controller('unitUserEditController', [
    '$scope', '$uibModalInstance',
    'mdService', 'unitUserService', 'targetData', 'clientService', '$mdDialog', 'Upload', 'configService', '$timeout', '$filter',
    function ($scope, $uibModalInstance,
        mdService, unitUserService, targetData, clientService, $mdDialog, Upload, configService, $timeout, $filter) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.target = targetData;
        var codeTmp = [];

        var choiceObj = angular.copy(configService.choiceObj);

        function selectedComapny() {
            choiceObj.id = $scope.target.maSoThue;
            choiceObj.value = $scope.target.donViHaiQuanChuQuan;
            unitUserService.postCodeStore(choiceObj, function (response) {
                $scope.target.maDonVi = response;
                console.log($scope.target.maSoThue);
            });
        }


        $scope.objectChange = function (item) {

            var data = $filter('filter')(mdService.tempData.companies, { id: item }, true);
            if (data && data.length > 0) {
                $scope.target.maSoThue = data[0].value;
                selectedComapny();
            }

        }



        $scope.customChange = function () {

            var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: $scope.target.donViHaiQuanChuQuan }, true);
            if (data && data.length > 0) {
                $scope.target.idHaiQuan = data[0].value;
            }
            selectedComapny();
        }

        $scope.selectedCustom = function (item) {
            $scope.target.donViHaiQuanChuQuan = item.value;
            selectedComapny();
        }

        $scope.selectedObject = function (item) {
            $scope.target.maSoThue = item.value;
            $scope.target.maDoanhNghiep = item.id;
            selectedComapny();
        }


        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].value;
            }
            return "Empty!";
        };

        $scope.displayHelper = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
            return "Empty!";
        };


        $scope.loadCustomerType = function (query) {
            return $scope.tempData.doiTuongs;
        }


        $scope.$watch('tagCustomerTypes', function (newV, oldV) {
            var values = $scope.tagCustomerTypes.map(function (element) {
                return element.value;
            });
            $scope.target.maDoiTuong = values.join();
            console.log($scope.target.maDoiTuong);
        }, true);



        $scope.loadDoiTuong = function (query) {

            return $scope.tempData.loaiHinhCuaHangs;
        }

        $scope.$watch('tagdoiTuongs', function (newValue, oldValue) {

            var values = $scope.tagdoiTuongs.map(function (element) {
                return element.value;
            });
            $scope.target.loaiHinhCuaHang = values.join();
            console.log($scope.tagdoiTuongs);

        }, true);

        $scope.tagdoiTuongs = [];

        $scope.tagCustomerTypes = [];

        console.log(targetData);

        var lstStore = [];
        var lstCompanyType = [];

        function loadStore() {
            if (targetData.loaiHinhCuaHang) {
                lstStore = targetData.loaiHinhCuaHang.split(',');
            }
            if (targetData.maDoiTuong) {
                lstCompanyType = targetData.maDoiTuong.split(',');
            }
            angular.forEach(lstStore, function (filterObject) {
                angular.forEach(mdService.tempData.loaiHinhCuaHangs, function (obj) {
                    if (obj.value == filterObject) {
                        $scope.tagdoiTuongs.push(obj);
                    }

                });
            });

            angular.forEach(lstCompanyType, function (filterObject) {
                angular.forEach(mdService.tempData.doiTuongs, function (obj) {
                    if (obj.value == filterObject) {
                        $scope.tagCustomerTypes.push(obj);
                    }

                });
            });

            var data = $filter('filter')(mdService.tempData.companies, { value: $scope.target.maSoThue }, true);
            var dataCustom = $filter('filter')(mdService.tempData.donViHaiQuans, { value: $scope.target.donViHaiQuanChuQuan }, true);
            if (data && dataCustom) {
                $scope.target.maDoanhNghiep = data[0].id;
                $scope.target.idHaiQuan = dataCustom[0].value;
            }
        }

        loadStore();

        $scope.addCuaHang = function () {

            var codeUnit = (parseInt(codeTmp[codeTmp.length - 1]) + 1).toString();
            var numStr = 4 - codeUnit.length;
            for (var i = 0; i < numStr; i++) {

                codeUnit = "0" + codeUnit;
            }

            $scope.vNew = codeUnit;
            codeTmp.push($scope.vNew);
            $scope.lstCuaHang.push({ maCuaHang: $scope.vNew, maDonViCha: $scope.target.maDonVi });

        };
        //upload file
        $scope.uploadFiles = function (files, errFiles, name) {
            //var rootUrl = configService.rootUrlWeb;
            var rootUrl = configService.rootUrlWebApi + '/Md/UnitUser';
            var serviceUrl = rootUrl + '/STREAMING/UploadFile?fileName=';
            // var serviceUrl = rootUrl + '/_vti_bin/Apps/Md/UnitUserService.svc/STREAMING/UploadFile?fileName=';
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

        $scope.removeCuaHang = function (index) {
            for (var i = codeTmp.length; i > 0; i--) {
                $scope.lstCuaHang.splice(index, 1)[i - 1];
                codeTmp.splice(index, 1)[i - 1];
                break;
            }
        };




        //
        $scope.userNotIn = [];
        $scope.userIn = [];
        $scope.title = function () { return 'Cập nhập đăng ký '; };
        $scope.save = function () {
            $scope.target.dataDetails = $scope.lstCuaHang;
            var convertData = $scope.target;
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

        $scope.removeUser = function (username) {
            var id = targetData.id;
            var rqData = {
                RequestData: username
            }
            unitUserService.removeUser(id, rqData, function (response) {
            });
        }
        $scope.addUser = function (username) {
            var id = targetData.id;
            var rqData = {
                RequestData: username
            }
            unitUserService.addUser(id, rqData, function (response) {
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

mdModule.controller('reportDangKyKinhDoanhController', ['$scope', '$window', '$stateParams', '$timeout',
'mdService', 'unitUserService', 'clientService', '$state',
function ($scope, $window, $stateParams, $timeout,
mdService, unitUserService, clientService, $state) {
    var id = $stateParams.id;
    $scope.target = {};
    $scope.goIndex = function () {
        $state.go('mdUnitUser');
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    function filterData() {
        if (id) {
            unitUserService.getReport(id, function (response) {
                if (response.status) {
                    $scope.target = response.data;
                }
            });
        }
    };
    $scope.$on('$viewContentLoaded', function () {
        $scope.$watch('target', function (newVal, oldVal) {
            if (newVal != oldVal) {
                $timeout(function () {
                    setTimeout(function () {
                    }, 100);
                }, 0);
            }
        }, true);
    });
    $scope.print = function () {
        var table = document.getElementById('main-report').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
    }
    filterData();
}]);

mdModule.controller('UnitUserSelectDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state', 'configService', 'unitUserService', 'mdService', 'selectedCuaHang', 'selectedDoanhNghiep', '$filter',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state, configService, unitUserService, mdService, selectedCuaHang, selectedDoanhNghiep, $filter) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.isEditable = true;
        console.log(selectedCuaHang);
        console.log(selectedDoanhNghiep);
        $scope.filtered.advanceData.listDoanhNghiep = selectedDoanhNghiep;
        function filterData() {
            if (selectedCuaHang) {
                $scope.listSelected = angular.copy(selectedCuaHang);
            } else {
                $scope.listSelected = [];
            }

            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            unitUserService.postSelectData(JSON.stringify(postdata), function (response) {
                $scope.isLoading = false;
                if (response.status && response.data) {
                    $scope.data = response.data.data;
                    if ($scope.data && $scope.data.length > 0 && $scope.listSelected && $scope.listSelected.length > 0) {
                        for (var i = 0; i < $scope.data.length; i++) {
                            var tmp = $filter('filter')($scope.listSelected, { id: $scope.data[i].id }, true);
                            if (tmp && tmp.length > 0) {
                                $scope.data[i].selected = true;
                            }
                        }
                    }
                    angular.extend($scope.paged, response.data);
                }
            });
        }
        filterData();
        $scope.doSearch = function () {
            $scope.paged.currentPage = 1;
            filterData();
        };
        $scope.doCheck = function (item) {
            var tmp = $filter('filter')($scope.listSelected, { id: item.id }, true);
            if (item.selected) {
                if (!tmp || tmp.length < 1) {
                    $scope.listSelected.push(item);
                }
            } else {
                if (tmp && tmp.length > 0) {
                    $scope.listSelected.splice($scope.listSelected.indexOf(tmp[0]), 1);
                }
            }
        }

        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.save = function () {
            $uibModalInstance.close($scope.listSelected);
        };
    }
]);
//mdModule.controller('UnitUserSelectDataController', [
//    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state',
//    'unitUserService', 'configService', 'mdService', 'serviceSelectData', 'filterObject', 'serviceInventoryAndUnitUser',
//    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state,
//        unitUserService, configService, mdService, serviceSelectData, filterObject, serviceInventoryAndUnitUser) {
//        $scope.tempData = mdService.tempData;
//        $scope.config = mdService.config;
//        $scope.filtered = angular.copy(configService.filterDefault);
//        $scope.filtered = angular.extend($scope.filtered, filterObject);
//        $scope.paged = angular.copy(configService.pageDefault);
//        $scope.isEditable = true;
//        $scope.setPage = function (pageNo) {
//            $scope.paged.currentPage = pageNo;
//            filterData();
//        };
//        $scope.selecteItem = function (item) {
//            $uibModalInstance.close(item);
//        }
//        $scope.sortType = 'maDonVi'; // set the default sort type
//        $scope.sortReverse = false;  // set the default sort order
//        $scope.doSearch = function () {
//            $scope.paged.currentPage = 1;
//            filterData();
//        };
//        $scope.pageChanged = function () {
//            filterData();
//        };
//        $scope.refresh = function () {
//            $scope.setPage($scope.paged.currentPage);
//        };
//        $scope.title = function () {
//            return 'Cửa hàng';
//        };
//        $scope.doCheck = function (item) {
//            if (item) {
//                var isSelected = $scope.listSelectedData.some(function (element, index, array) {
//                    return element.id == item.id;
//                });
//                if (item.selected) {
//                    if (!isSelected) {
//                        $scope.listSelectedData.push(item);
//                    }
//                } else {
//                    if (isSelected) {
//                        $scope.listSelectedData.splice(item, 1);
//                    }
//                }
//            } else {
//                angular.forEach($scope.data, function (v, k) {
//                    $scope.data[k].selected = $scope.all;
//                    var isSelected = $scope.listSelectedData.some(function (element, index, array) {
//                        if (!element) return false;
//                        return element.id == v.id;
//                    });
//                    if ($scope.all) {
//                        if (!isSelected) {
//                            $scope.listSelectedData.push($scope.data[k]);
//                        }
//                    } else {
//                        if (isSelected) {
//                            $scope.listSelectedData.splice($scope.data[k], 1);
//                        }
//                    }
//                });
//            }
//        }
//        $scope.create = function () {
//            var modalInstance = $uibModal.open({
//                backdrop: 'static',
//                templateUrl: mdService.buildUrl('mdCompany', 'add'),
//                controller: 'companyCreateController',
//                windowClass: 'app-modal-window',
//                resolve: {}
//            });
//            modalInstance.result.then(function (updatedData) {
//                $scope.tempData.update('company');
//                $scope.refresh();
//            }, function () {
//                $log.info('Modal dismissed at: ' + new Date());
//            });
//        };
//        $scope.cancel = function () {
//            $uibModalInstance.dismiss('cancel');
//        };
//        $scope.save = function () {
//            console.log($scope.listSelectedData);
//            $uibModalInstance.close(true);
//        };
//        filterData();
//        function filterData() {
//            $scope.listSelectedData = serviceSelectData.getSelectData();
//            $scope.isLoading = true;
//            // $scope.tagDonViHaiQuans = serviceInventoryAndDonViHaiQuan.getSelectData();
//            // var s = '';
//            // for (var i = 0; i < $scope.tagDonViHaiQuans.length; i++) {
//            //     s += $scope.tagDonViHaiQuans[i].maHaiQuan;
//            //     if (i != $scope.tagDonViHaiQuans.length - 1) {
//            //         s += ',';
//            //     }
//            // }
//            // console.log($scope.tagDonViHaiQuans);
//            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
//            unitUserService.postSelectData(
//			JSON.stringify(postdata),
//                function (response) {
//                    $scope.isLoading = false;
//                    if (response.status) {
//                        $scope.data = response.data.data;
//                        angular.forEach($scope.data, function (v, k) {
//                            var isSelected = $scope.listSelectedData.some(function (element, index, array) {
//                                if (!element) return false;
//                                return element.value == v.value;
//                            });
//                            if (isSelected) {
//                                $scope.data[k].selected = true;
//                            }
//                        })
//                        angular.extend($scope.paged, response.data);
//                    }
//                });
//        };
//    }]);
mdModule.controller('UnitUserSelectSingleDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state',
    'unitUserService', 'configService', 'mdService', 'serviceSelectData', 'filterObject', 'serviceInventoryAndUnitUser',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state,
        unitUserService, configService, mdService, serviceSelectData, filterObject, serviceInventoryAndUnitUser) {
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
        $scope.sortType = 'maDonVi'; // set the default sort type
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
            return 'Cửa hàng';
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
        function filterData() {

            $scope.listSelectedData = serviceSelectData.getSelectData();
            $scope.isLoading = true;

            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            unitUserService.postSelectData(
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
                        });
                        angular.extend($scope.paged, response.data);
                    }
                });
        };

        filterData();

    }]);