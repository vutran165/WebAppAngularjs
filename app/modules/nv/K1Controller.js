var giaHanToKhaiService = nvModule.factory('giaHanToKhaiService',
[
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = rootUrl + '/api/Nv/NghiepVuKhac/GiaHanToKhai';

        this.parameterPrint = {};

        function getParameterPrint() {
            return this.parameterPrint;
        }

        var calc = {
            changeAmount_1: function (item) {
                if (!item.soLuongToKhai) {
                    item.soLuongToKhai = 0;
                }
                item.soLuongTon = item.soLuongToKhai - item.soLuongXuat;
            },
            changeAmount_2: function (item) {
                if (!item.soLuongXuat) {
                    item.soLuongXuat = 0;
                }
                item.soLuongTon = item.soLuongToKhai - item.soLuongXuat;
            }
        }

        var result = {
            robot: calc,
            setParameterPrint: function (data) {
                parameterPrint = data;
            },
            getParameterPrint: function () {
                return parameterPrint;
            },
            post: function (data, callback) {
                $http.post(serviceUrl + '/Post', data).success(callback);
            },
            postQuery: function (data, callback) {
                $http.post(serviceUrl + '/PostQuery', data).success(callback);
            },

            getMerchandiseForNvByCode: function (code) {
                return $http.get(rootUrl + '/api/Md/Merchandise/GetForNvByCode/' + code);
            },

            getNewInstance: function (callback) {
                $http.get(serviceUrl + '/GetNewInstance').success(callback);
            },
            getByCode: function (id, callback) {
                $http.get(rootUrl + '/api/Md/NhomVatTu/GetByCode/' + id).success(callback);
            },
            getReport: function (id, callback) {
                $http.get(serviceUrl + '/GetReport/' + id).success(callback);
            },
            getDetails: function (id, callback) {
                $http.get(serviceUrl + '/GetDetails/' + id).success(callback);
            },
            getDeclaration: function (id, callback) {
                $http.get(serviceUrl + '/GetDeclaration/' + id).success(callback);
            },
            getDeclarationByCompany: function (company, callback) {
                $http.get(serviceUrl + '/GetSelectDeclaration/' + company).success(callback);
            },
            getCurrentUser: function (callback) {
                $http.get(rootUrl + '/api/Authorize/User/GetCurrentUser').success(callback);
            },
            writeDataToExcel: function (data, callback) {
                $http.post(serviceUrl + '/WriteDataToExcel', data).success(callback);
            },

            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
            acceptItem: function (params) {
                return $http.put(serviceUrl + '/Accept/' + params.id, params);
            },
            getHistories: function (data, callback) {
                $http.post(serviceUrl + '/GetHistories', data).success(callback);
            },
            getSelectCompanyByCode: function (id) {
                return $http.get(rootUrl + '/api/Md/Company/GetSelectCompanyByCode/' + id);
            }
        };
        return result;

    }
]);

var giaHanToKhaiController = nvModule.controller('giaHanToKhaiController', [
    '$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
    'giaHanToKhaiService', 'configService', 'clientService', 'nvService', 'mdService', 'serviceMerchandiseGroup', 'serviceNhapHangAndMerchandise', 'authorizeService', '$mdDialog','serviceCompanySelected',
    function (
        $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
        giaHanToKhaiService, configService, clientService, nvService, mdService, serviceMerchandiseGroup, serviceNhapHangAndMerchandise, authorizeService, $mdDialog, serviceCompanySelected
    ) {
        $scope.config = nvService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.filtered.isAdvance = true;
        $scope.filtered.advanceData.denNgay = new Date();
        $scope.permission = authorizeService.permissionModel.permission;
        $scope.tempData = mdService.tempData;
        $scope.lstDoanhnghiep = angular.copy($scope.tempData.companiesByHQ);
        $scope.isEditable = true;
        $scope.title = function () {
            return 'Phiếu gia hạn tờ khai';
        };

        $scope.selectedCompany = function (code) {
            if (code) {
                giaHanToKhaiService.getSelectCompanyByCode(code).then(function (response) {
                    console.log(response);
                    $scope.data = response.data;
                    $scope.filtered.advanceData.maSoThue = $scope.data.maSoThue;
                    $scope.filtered.advanceData.tenDoanhNghiep = $scope.data.tenDoanhNghiep;
                }, function (error) {
                    $scope.addCompany(code);
                });
            }
        }

        $scope.addCompany = function (str) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('MdCompany', 'selectForMainController'),
                controller: 'companySelectForMainController',
                size: 'lg',
                resolve: {
                    serviceSelectData: function () {
                        return serviceCompanySelected;
                    },
                    filterObject: function () {
                        return {
                            summary: str
                        };
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {

                if (!updatedData.selected) {
                    console.log(updatedData);
                    $scope.filtered.advanceData.maSoThue = updatedData.value;
                    $scope.filtered.advanceData.tenDoanhNghiep = updatedData.description;
                }
            }, function () {

            });
        }


        function filterData() {
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            giaHanToKhaiService.postQuery(
                JSON.stringify(postdata),
                function (response) {
                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.extend($scope.paged, response.data);
                    }
                });

        };

        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };

        $scope.doSearch = function () {
            $scope.paged.currentPage = 1;
            filterData();
        };

        $scope.pageChanged = function () {
            filterData();
        };

        $scope.displayHelper = function (code, module) {
            if (!code) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return code;
        }

        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
            return model;
        };

        $scope.onChangeMaHaiQuan = function (mahq) {
            if (mahq) {
                mahq = mahq.toUpperCase();
                var data = $filter('filter')(mdService.tempData.donViHaiQuans, { value: mahq }, true);
                if (data && data.length > 0) {
                    $scope.filtered.advanceData.maHaiQuan = data[0].value;
                    $scope.filtered.advanceData.idHaiQuan = data[0].id;

                    $scope.lstDoanhnghiep = $scope.tempData.companiesByHQ.filter(function (dn) {
                        return (dn.referenceDataId.indexOf($scope.filtered.advanceData.idHaiQuan) === 0);
                    });
                }
            }
        };

        $scope.create = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrlTax('NghiepVuKhac', 'GiaHanToKhai', 'add'),
                controller: 'giaHanToKhaiCreateController',
                windowClass: 'app-modal-window',
                //size: 'lg',
                resolve: {}
            });
            modalInstance.result.then(function (updatedData) {
                $scope.refresh();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.details = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrlTax('NghiepVuKhac', 'GiaHanToKhai', 'details'),
                controller: 'giaHanToKhaiDetailsController',
                windowClass: 'app-modal-window',
                //size: 'lg',
                resolve: {
                    targetData: function () {
                        return target;
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.histories = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrlTax('NghiepVuKhac', 'GiaHanToKhai', 'histories'),
                controller: 'giaHanToKhaiHistoryController',
                windowClass: 'app-modal-window',
                //size: 'lg',
                resolve: {
                    targetData: function () {
                        return target;
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.update = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrlTax('NghiepVuKhac', 'GiaHanToKhai', 'update'),
                controller: 'giaHanToKhaiEditController',
                windowClass: 'app-modal-window',
                //size:'lg',
                resolve: {
                    targetData: function () {
                        return target;
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
                serviceNhapHangAndMerchandise.getSelectData().clear();
                $scope.refresh();
            }, function () {
                serviceNhapHangAndMerchandise.getSelectData().clear();
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.accept = function (ev, item) {
            var confirm = $mdDialog.confirm()
            .title('Thông báo')
            .textContent('Bạn có chắc muốn duyệt?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                giaHanToKhaiService.acceptItem(item).then(function (data) {
                    console.log(data);
                }).then(function (data) {
                    $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Thông báo')
                    .textContent('Duyệt thành công')
                    .ariaLabel('Alert')
                    .ok('Ok')
                    .targetEvent(ev))
                    .finally(function () {
                        filterData();
                    });
                });
            }, function () {
                console.log('Không duyệt được');
            });
        }

        $scope.deleteItem = function (ev, item) {
            var confirm = $mdDialog.confirm()
                .title('Cảnh báo')
                .textContent('Dữ liệu có thể liên kết với các dữ liệu khác, bạn có chắc muốn xóa?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                giaHanToKhaiService.deleteItem(item).then(function (data) {
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
                            filterData();
                        });
                });
            }, function () {
                console.log('Không xóa');
            });
        };
    }
]);

nvModule.controller('giaHanToKhaiDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'giaHanToKhaiService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, giaHanToKhaiService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Phiếu gia hạn tờ khai';
    };

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].description;
        }
        return "Empty!";
    };

    $scope.nameCurrency = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
    };

    $scope.displayHelper = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
        if (data && data.length == 1) {
            return data[0].description;
        }
        return "Empty!";
    };


    $scope.approval = function () {
        giaHanToKhaiService.postApproval($scope.target, function (response) {
            if (response) {

                alert("Duyệt thành công!");
                $uibModalInstance.close($scope.target);
                $scope.goIndex = function () {
                    $state.go('nvgiaHanToKhai');
                };

            }
            else { alert("Thất bại! - Xảy ra lỗi hoặc phiếu này đã duyệt"); }
        });
    };

    function fillterData() {
        $scope.isLoading = true;
        giaHanToKhaiService.getDetails($scope.target.id, function (response) {

            if (response.status) {
                $scope.target = response.data;
                console.log($scope.target);
            }
            $scope.isLoading = false;
            $scope.pageChanged();

        });
    }
    fillterData();




    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.pageChanged = function () {
        var currentPage = $scope.paged.currentPage;
        var itemsPerPage = $scope.paged.itemsPerPage;
        $scope.paged.totalItems = $scope.target.dataDetails.length;
        $scope.data = [];
        if ($scope.target.dataDetails) {
            for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < $scope.target.dataDetails.length; i++) {
                $scope.target.dataDetails[i].thanhTienVAT = $scope.target.dataDetails[i].thanhTien * (1 + $scope.target.dataDetails[i].tyLeVatVao / 100);
                $scope.target.dataDetails[i].giaMuaCoVat = $scope.target.dataDetails[i].giaMua * (1 + $scope.target.dataDetails[i].tyLeVatVao / 100);
                $scope.data.push($scope.target.dataDetails[i]);
            }
        }
    }

}
]);

nvModule.controller('giaHanToKhaiHistoryController', [
'$scope', '$uibModalInstance',
'mdService', 'giaHanToKhaiService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, giaHanToKhaiService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;

    $scope.title = function () {
        return 'Phiếu gia hạn tờ khai';
    };

    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].description;
        }
        return "Empty!";
    };

    $scope.nameCurrency = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
    };

    $scope.displayHelper = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
        if (data && data.length == 1) {
            return data[0].description;
        }
        return "Empty!";
    };



    var choiceObj = angular.copy(configService.choiceObj);

    function fillterData() {
        $scope.isLoading = true;
        choiceObj.id = $scope.target.maHoaDon;
        choiceObj.value = $scope.target.loaiPhieu;
        choiceObj.extendValue = $scope.target.maSoThue;
        giaHanToKhaiService.getHistories(choiceObj, function (response) {
            if (response.status) {
                $scope.dataHistory = response.extData;
                if ($scope.dataHistory.length > 0) {
                    angular.forEach($scope.dataHistory, function (v, k) {
                        v.timeUpdate = "Sửa lần " + ($scope.dataHistory.length - k) + "";
                    });
                } else {
                    $scope.warning = "Không có dữ liệu lịch sử nào";
                }
            }
            $scope.isLoading = false;
            $scope.pageChanged();
        });
    }


    fillterData();


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.pageChanged = function () {
        var currentPage = $scope.paged.currentPage;
        var itemsPerPage = $scope.paged.itemsPerPage;
        $scope.paged.totalItems = $scope.target.dataDetails.length;
        $scope.data = [];
        if ($scope.target.dataDetails) {
            for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < $scope.target.dataDetails.length; i++) {
                $scope.data.push($scope.target.dataDetails[i]);
            }
        }
    }
}
]);

nvModule.controller('giaHanToKhaiCreateController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log', '$rootScope',
    'nvService', 'giaHanToKhaiService', 'mdService', 'configService', 'serviceMerchandiseGroup', 'serviceNhapHangAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log, $rootScope,
        nvService, giaHanToKhaiService, mdService, configService, serviceMerchandiseGroup, serviceNhapHangAndMerchandise, focus) {
        $scope.robot = angular.copy(giaHanToKhaiService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.newItem = {};
        $scope.donHangs = [];
        $scope.target = { dataDetails: [] };

        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };
        $scope.displayHelper = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
            return "Empty!";
        };

        $scope.isListItemNull = true;


        $scope.title = function () {
            return 'Phiếu gia hạn tờ khai';
        };

        $scope.tonSoLuong = function (tokhai, xuat) {
            var ton = tokhai - xuat;
            return ton;
        }

        $scope.addRow = function () {
            $scope.target.dataDetails.push($scope.newItem);
            $scope.pageChanged();
            $scope.newItem = {};
            focus('maNhomVatTu');
        };


        $scope.addNewItem = function (strKey) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
                controller: 'merchandiseSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return serviceNhapHangAndMerchandise;
                    },
                    filterObject: function () {
                        return {
                            summary: strKey
                        };
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
                if (!updatedData.selected) {
                    $scope.newItem = updatedData;
                    $scope.newItem.validateCode = updatedData.maNhomVatTu;
                    $scope.newItem.maNhomVatTu = updatedData.maNhomVatTu;
                }
                $scope.pageChanged();
            }, function () {

            });
        }

        $scope.removeItem = function (index) {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            currentPageIndex = (currentPage - 1) * itemsPerPage + index;
            $scope.target.dataDetails.splice(currentPageIndex, 1);
            if ($scope.target.dataDetails.length == 0) {
                $scope.isListItemNull = true;
            }
            $scope.pageChanged();
        }
        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $scope.isListItemNull = true;
            $uibModalInstance.dismiss('cancel');
        };


        // $scope.selectedMaNhomVatTu = function (code) {
        // if (code) {
        // giaHanToKhaiService.getByCode(code).then(function (response) {
        // $scope.newItem = response.data;
        // $scope.newItem.validateCode = response.data.maNhomVatTu;
        // $scope.newItem.maNhomVatTu = response.data.maNhomVatTu;
        // }, function (error) {
        // $scope.addNewItem(code);
        // });
        // }
        // }

        $scope.selectedMaHang = function (code) {
            if (code) {
                giaHanToKhaiService.getMerchandiseForNvByCode(code).then(function (response) {
                    $scope.newItem = response.data;
                    $scope.newItem.maHang = $scope.newItem.maVatTu;
                    $scope.newItem.validateCode = response.data.maVatTu;
                }, function (error) {
                    $scope.addNewItem(code);
                }
                );
            }
        }



        $scope.declaration = function () {
            giaHanToKhaiService.getDeclaration($scope.target.soToKhai, function (response) {
                $scope.isLoading = true;
                if (response.status) {
                    $scope.target.dataDetails = response.data.dataDetails;
                    $scope.target.maDoanhNghiep = response.data.maDoanhNghiep;
                    var data = $filter('filter')(mdService.tempData.companies, { id: $scope.target.maDoanhNghiep }, true);
                    if (data) {
                        $scope.target.maSoThue = data[0].value;
                    }
                }
                $scope.isLoading = false;
            });
        }


        $scope.save = function () {
            $scope.Loading = true;
            giaHanToKhaiService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        $scope.target.dataDetails.clear();
                        $scope.isListItemNull = true;
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                    $scope.Loading = false;
                }
             );
        };



        function filterData() {
            $scope.isLoading = true;
            giaHanToKhaiService.getNewInstance(function (response) {

                $scope.target = response;

                $scope.target.idHaiQuan = $rootScope.currentUser.idHaiQuan;
                $scope.target.maHaiQuan = $rootScope.currentUser.maHaiQuan;
                $scope.target.maSoThue = $rootScope.currentUser.maSoThue;
                $scope.target.maDoanhNghiep = $rootScope.currentUser.maDoanhNghiep;

                var data = $filter('filter')($scope.tempData.companies, { id: $scope.target.maDoanhNghiep }, true);
                if (data && data.length > 0) {
                    $scope.target.tenDoanhNghiep = data[0].description;
                }

                //$scope.target.maDoanhNghiep = $rootScope.currentUser.maDonVi;
                //var data = $filter('filter')(mdService.tempData.companies, { id: $scope.target.maDoanhNghiep }, true);
                
                //if (data && data.length == 1) {
                //    $scope.target.idHaiQuan = data[0].referenceDataId;
                //    $scope.target.maHaiQuan = data[0].parent;
                //    $scope.target.maSoThue = data[0].value;
                //}
                //console.log($scope.target);
                $scope.pageChanged();
                $scope.isLoading = false;
            });

        };



        filterData();
        $scope.pageChanged = function () {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            $scope.paged.totalItems = $scope.target.dataDetails.length;
            $scope.data = [];
            if ($scope.target.dataDetails) {
                for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < $scope.target.dataDetails.length; i++) {
                    $scope.data.push($scope.target.dataDetails[i]);
                }
            }
        }
    }
]);

nvModule.controller('giaHanToKhaiEditController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'giaHanToKhaiService', 'mdService', 'targetData', 'configService', 'serviceNhapHangAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, giaHanToKhaiService, mdService, targetData, configService, serviceNhapHangAndMerchandise, focus) {
        $scope.robot = angular.copy(giaHanToKhaiService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.newItem = {};


        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
            return "Empty!";
        };
        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };
        $scope.displayHelper = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
            return "Empty!";
        };



        $scope.title = function () {
            return 'Phiếu gia hạn tờ khai';
        };


        $scope.save = function () {
            giaHanToKhaiService.updateCT($scope.target).then(
                    function (response) {
                        if (response.status && response.status == 200) {
                            if (response.data.status) {
                                clientService.noticeAlert("Thành công", "success");
                                $scope.target.dataDetails.clear();
                                $uibModalInstance.close($scope.target);
                            } else {
                                clientService.noticeAlert(response.message, "danger");
                            }
                        } else {
                            console.log('ERROR: Update failed! ' + response.errorMessage);
                            clientService.noticeAlert(response.errorMessage, "danger");
                        }
                    },
                    function (response) {
                        console.log('ERROR: Update failed! ' + response);
                    }
                );
        };

        function filterData() {
            giaHanToKhaiService.getDetails($scope.target.id, function (response) {
                if (response.data.id) {
                    $scope.target = response.data;
                    serviceNhapHangAndMerchandise.setSelectData($scope.target.dataDetails);
                    $scope.pageChanged();

                }
            });

        };


        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $uibModalInstance.dismiss('cancel');
        };

        filterData();
        $scope.pageChanged = function () {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            $scope.paged.totalItems = $scope.target.dataDetails.length;
            $scope.data = [];
            if ($scope.target.dataDetails) {
                for (var i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage && i < $scope.target.dataDetails.length; i++) {
                    $scope.data.push($scope.target.dataDetails[i]);
                }
            }
        }
    }
]);

nvModule.controller('reportGiaHanToKhaiController', [
    '$scope', '$rootScope', '$filter', '$window', '$stateParams', '$timeout', '$state', 'giaHanToKhaiService',
    'mdService', 'clientService',
    function ($scope, $rootScope, $filter, $window, $stateParams, $timeout, $state,
       giaHanToKhaiService, mdService, clientService) {
        $scope.robot = angular.copy(giaHanToKhaiService.robot);
        var id = $stateParams.id;
        $scope.target = {};
        $scope.config = mdService.config;
        $scope.goIndex = function () {
            $state.go('giaHanToKhai');
        };




        $scope.nameOfObject = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
        };

        function filterData() {
            if (id) {
                giaHanToKhaiService.getReport(id, function (response) {

                    if (response.status) {
                        $scope.target = response.data;
                    }
                    $scope.currentUser = $rootScope.currentUser;

                    var data1 = $filter('filter')(mdService.tempData.donViHaiQuans, { id: $scope.currentUser.code }, true);
                    if (data1 && data1.length == 1) {
                        var dataCustom = $filter('filter')(mdService.tempData.donViHaiQuans, { value: data1[0].extendValue }, true);
                        if (dataCustom.length > 0) {

                            $scope.nameOfCustom = dataCustom[0].description;
                        }

                    }


                });

            }
        };
        $scope.checkDuyet = function () {
            console.log($scope.target.trangThai);
            if ($scope.target.trangThai == 10) {
                return false;
            }
            else {
                return true;
            }
        }

        $scope.goIndex = function () {
            $state.go("giaHanToKhai");
        };
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return code;
        }
        $scope.print = function () {
            var table = document.getElementById('main-report').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
        }
        $scope.printExcel = function () {
            var data = [document.getElementById('main-report').innerHTML];
            var fileName = "KeKhaiHangNhapKhoDoanhNghiepTrongNuoc_ExportData.xls";
            var filetype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";
            var ieEDGE = navigator.userAgent.match(/Edge/g);
            var ie = navigator.userAgent.match(/.NET/g); // IE 11+
            var oldIE = navigator.userAgent.match(/MSIE/g);
            if (ie || oldIE || ieEDGE) {
                var blob = new window.Blob(data, { type: filetype });
                window.navigator.msSaveBlob(blob, fileName);
            }
            else {
                var a = $("<a style='display: none;'/>");
                var url = window.webkitURL.createObjectURL(new Blob(data, { type: filetype }));
                a.attr("href", url);
                a.attr("download", fileName);
                $("body").append(a);
                a[0].click();
                window.url.revokeObjectURL(url);
                a.remove();
            }
        }
        filterData();
    }
]);




