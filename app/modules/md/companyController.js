mdModule.factory('companyService', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var serviceUrl = configService.rootUrlWebApi + '/Md/Company';
        var result = {
            postSelectDataByHaiQuan: function (data, callback) {
                $http.post(serviceUrl + '/PostSelectDataByHaiQuan', data).success(callback);
            },
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
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            getReport: function (maDoanhNghiep, callback) {
                $http.get(serviceUrl + '/GetReport/' + maDoanhNghiep).success(callback);
            },
            getByMaSoThue: function (mst) {
                return $http.get(serviceUrl + '/GetSelectCompanyByCode/' + mst);
            }
        }
        return result;
    }
]);

mdModule.controller('companyController', [
'$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$mdDialog', '$filter',
'companyService', 'configService', 'mdService', 'blockUI', 'clientService',
function ($scope, $resource, $rootScope, $location, $window, $uibModal, $log, $state, $mdDialog, $filter,
companyService, configService, mdService, blockUI, clientService) {
    $scope.config = mdService.config;
    $scope.tempData = mdService.tempData;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.filtered.isAdvance = true;
    $scope.isEditable = true;

    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };

    $scope.sortType = 'maSoThue'; // set the default sort type

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
        return 'Doanh nghiệp';
    };

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].value;
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
            companyService.deleteItem(item).then(function (data) {
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
                        $scope.tempData.update('companys');
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
            templateUrl: mdService.buildUrl('mdcompany', 'add'),
            controller: 'companyCreateController',
            resolve: {}
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('companys');
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: mdService.buildUrl('mdcompany', 'update'),
            controller: 'companyEditController',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            $scope.tempData.update('companies');
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
            templateUrl: mdService.buildUrl('mdcompany', 'details'),
            controller: 'companyDetailsController',
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

        companyService.postQuery(
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
    filterData();

}]);

mdModule.controller('companyDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'companyService', 'targetData', '$filter',
function ($scope, $uibModalInstance,
    mdService, companyService, targetData, $filter) {
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

    $scope.title = function () { return 'Thông tin doanh nghiệp'; };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

mdModule.controller('companyCreateController', [
    '$scope', '$uibModalInstance', '$filter',
    'mdService', 'companyService', 'clientService',
    function ($scope, $uibModalInstance, $filter,
        mdService, companyService, clientService) {

        $scope.config = mdService.config;
        $scope.target = {};
        $scope.tempData = mdService.tempData;
        $scope.title = function () { return 'Thêm doanh nghiệp'; };

        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                $scope.target.idHaiQuan = data[0].id;
                return data[0].text;
            }
            return "Empty!";
        };



        $scope.save = function () {
            companyService.post(
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

mdModule.controller('companyEditController', [
    '$scope', '$uibModalInstance', '$filter',
    'mdService', 'companyService', 'targetData', 'clientService',
    function ($scope, $uibModalInstance, $filter,
        mdService, companyService, targetData, clientService) {

        $scope.config = mdService.config;
        $scope.target = targetData;
        $scope.tempData = mdService.tempData;
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };

        $scope.title = function () { return 'Cập nhập doanh nghiệp'; };
        console.log(targetData);
        $scope.save = function () {
            companyService.update($scope.target).then(
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


mdModule.controller('companySelectDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state', 'companyService', 'configService', 'mdService', 'selectedDoanhNghiep', 'selectedHaiQuan', '$filter',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state, companyService, configService, mdService, selectedDoanhNghiep, selectedHaiQuan, $filter) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.filtered = angular.copy(configService.filterDefault);

        $scope.paged = angular.copy(configService.pageDefault);
        $scope.isEditable = true;
        console.log(selectedDoanhNghiep);
        console.log(selectedHaiQuan);
        $scope.filtered.advanceData.maHaiQuan = selectedHaiQuan.maHaiQuan;
        $scope.filtered.advanceData.idHaiQuan = selectedHaiQuan.idHaiQuan;
        $scope.doSearch = function () {
            $scope.paged.currentPage = 1;
            filterData();
        };


        function filterData() {
            if (selectedDoanhNghiep) {
                $scope.listSelected = angular.copy(selectedDoanhNghiep);
            } else {
                $scope.listSelected = [];
            }
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            companyService.postSelectDataByHaiQuan(JSON.stringify(postdata), function (response) {
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
    }]);

//hàm này lúc trước thấy comment ko dùng bây giờ anh dùng nhé => controller này dùng để show và chọn doanh nghiệp trên phần tìm kiếm
mdModule.controller('companySelectForMainController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state',
    'companyService', 'configService', 'mdService', 'filterObject',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state,
        companyService, configService, mdService, filterObject) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.filtered = angular.extend($scope.filtered, filterObject);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.isEditable = true;

        function filterData() {
            $scope.isLoading = true;
            $scope.filtered.isAdvance = false;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            companyService.postSelectData(JSON.stringify(postdata), function (response) {
                $scope.isLoading = false;
                if (response.status && response.data) {
                    $scope.data = response.data.data;
                }
            });
        };
        filterData();
        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.selecteItem = function (item) {
            $uibModalInstance.close(item);
        }
        $scope.sortType = 'maSoThue'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.doSearch = function () {
            $scope.paged.currentPage = 1;
            $scope.filtered.isAdvance = false;
            filterData();
        };
        $scope.pageChanged = function () {
            filterData();
        };
        $scope.refresh = function () {
            $scope.setPage($scope.paged.currentPage);
        };
        $scope.title = function () {
            return 'Doanh Nghiệp';
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

mdModule.controller('reportCompanyController', [
    '$scope', '$filter', '$window', '$stateParams', '$timeout', '$state',
    'mdService', 'companyService', 'clientService',
    function ($scope, $filter, $window, $stateParams, $timeout, $state,
        mdService, companyService, clientService) {
        $scope.robot = angular.copy(companyService.robot);
        var id = $stateParams.maDoanhNghiep;
        $scope.target = {};

        var loaiHinh = [];
        var doiTuong = [];

        function filterData() {
            if (id) {
                companyService.getReport(id, function (response) {

                    if (response.status) {

                        $scope.target = response.data;
                        console.log($scope.target);
                        angular.forEach($scope.target.danhSachCuaHang, function (v, k) {
                            $scope.lstLoaiHinh = [];
                            if (v.loaiHinhCuaHang) {
                                loaiHinh = v.loaiHinhCuaHang.split(',');
                            }
                            // v.loaiHinhCuaHang = new Array();
                            angular.forEach(loaiHinh, function (obj, key) {
                                var data = $filter('filter')(mdService.tempData.loaiHinhCuaHangs, { value: obj }, true);
                                if (data && data.length > 0) {
                                    $scope.lstLoaiHinh.push(data[0].description);
                                }
                            });
                            console.log(v.loaiHinhCuaHang);
                        });

                        angular.forEach($scope.target.danhSachKho, function (v, k) {
                            $scope.lstDoiTuong = [];
                            if (v.maDoiTuong) {
                                doiTuong = v.maDoiTuong.split(',');
                            }
                            angular.forEach(doiTuong, function (obj, key) {
                                var data = $filter('filter')(mdService.tempData.doiTuongs, { value: obj }, true);
                                if (data && data.length > 0) {
                                    $scope.lstDoiTuong.push(data[0].description);
                                }
                            });

                        });
                    }
                });
            }
        };

        $scope.goIndex = function () {
            $state.go("mdCompany");
        };
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "Empty!";
        }
        $scope.print = function () {
            var table = document.getElementById('main-report').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
        }


        filterData();
    }
]);

mdModule.controller('companySelectSingleDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state', 'companyService', 'configService', 'mdService', 'selectedDoanhNghiep', 'selectedHaiQuan', '$filter',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state, companyService, configService, mdService, selectedDoanhNghiep, selectedHaiQuan, $filter) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.filtered = angular.copy(configService.filterDefault);

        $scope.paged = angular.copy(configService.pageDefault);
        $scope.isEditable = true;
        console.log(selectedDoanhNghiep);
        console.log(selectedHaiQuan);
        $scope.filtered.advanceData.maHaiQuan = selectedHaiQuan.maHaiQuan;
        $scope.filtered.advanceData.idHaiQuan = selectedHaiQuan.idHaiQuan;



        function filterData() {
            if (selectedDoanhNghiep) {
                $scope.listSelected = angular.copy(selectedDoanhNghiep);
            } else {
                $scope.listSelected = [];
            }
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            companyService.postSelectDataByHaiQuan(JSON.stringify(postdata), function (response) {
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

        $scope.doCheck = function (idx, item) {
            angular.forEach($scope.data, function (it, index) {
                if (idx != index) it.selected = false;
            });
            var tmp = $filter('filter')($scope.listSelected, { id: item.id }, true);
            if (item.selected) {
                $scope.listSelected.splice(0, $scope.listSelected.length);
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
    }]);



//It'll be written again in the future

mdModule.controller('companyAllDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state',
    'companyService', 'configService', 'mdService', 'serviceSelectData', 'filterObject', 'serviceInventoryAndDonViHaiQuan',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state,
        companyService, configService, mdService, serviceSelectData, filterObject, serviceInventoryAndDonViHaiQuan) {
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
        $scope.sortType = 'maSoThue'; // set the default sort type
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
            return 'Doanh Nghiệp';
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
                templateUrl: mdService.buildUrl('mdCompany', 'add'),
                controller: 'companyCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('company');
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
        function filterData() {
            $scope.listSelectedData = serviceSelectData.getSelectData();
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            companyService.postSelectData(
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