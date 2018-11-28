var phieuVuotDinhMucService = nvModule.factory('phieuVuotDinhMucService',
[
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.apiServiceBaseUri;
        var serviceUrl = rootUrl + '/api/Nv/VuotDinhMuc';

        this.parameterPrint = {};

        function getParameterPrint() {
            return this.parameterPrint;
        }

        var calc = {
            sum: function (obj, name) {
                var total = 0
                if (obj && obj.length > 0) {
                    angular.forEach(obj, function (v, k) {
                        var increase = v[name];
                        if (!increase) {
                            increase = 0;
                        }
                        total += increase;
                    });
                }
                return total;
            },
            sumVat: function (tyGia, target) {
                var tienVat = 0;
                if (tyGia) {
                    tienVat = (target.thanhTienTruocVat * tyGia) / 100;
                }
                return tienVat;
            },
            changeChietKhau: function (target) {
                if (!target.tienChietKhau) {
                    target.tienChietKhau = 0;
                }
                if (!target.thanhTienTruocVat) {
                    target.thanhTienTruocVat = 0;
                }
                if (!target.tienVat) {
                    target.tienVat = 0;
                }
                target.tienChietKhau = (target.thanhTienTruocVat * target.chietKhau) / 100;
                target.thanhTienSauVat = target.thanhTienTruocVat + target.tienVat - target.tienChietKhau;
                item.thanhTienVAT = item.thanhTien * (1 + item.tyLeVatVao / 100);

            },
            changeTienChietKhau: function (target) {
                if (!target.thanhTienTruocVat) {
                    target.thanhTienTruocVat = 0;
                }
                if (!target.tienVat) {
                    target.tienVat = 0;
                }
                target.chietKhau = (target.tienChietKhau * 100) / target.thanhTienTruocVat;
                target.thanhTienSauVat = target.thanhTienTruocVat + target.tienVat - target.tienChietKhau;
                item.thanhTienVAT = item.thanhTien * (1 + item.tyLeVatVao / 100);

            },

            changeDonGia: function (item) {
                if (!item.soLuong) {
                    item.soLuong = 0;
                }
                item.thanhTien = item.soLuong * item.donGia;
            },
            changeSoLuong: function (item) {
                if (!item.donGia) {
                    item.donGia = 0;
                }
                item.thanhTien = item.soLuong * item.donGia;

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
            postPrint: function (callback) {
                $http.post(serviceUrl + '/PostPrint', getParameterPrint()).success(callback);
            },
            postPrintDetail: function (callback) {
                $http.post(serviceUrl + '/PostPrintDetail', getParameterPrint()).success(callback);
            },
            getNewInstance: function (callback) {
                $http.get(serviceUrl + '/GetNewInstance').success(callback);
            },
            getReport: function (id, callback) {
                $http.get(serviceUrl + '/GetReport/' + id).success(callback);
            },
            getDetails: function (id, callback) {
                $http.get(serviceUrl + '/GetDetails/' + id).success(callback);
            },
            getWareHouse: function (id, callback) {
                $http.get(rootUrl + '/api/Md/WareHouse/' + id).success(callback);
            },
            getCustomer: function (id, callback) {
                $http.get(rootUrl + '/api/Md/Customer/' + id).success(callback);
            },
            getCurrentUser: function (callback) {
                $http.get(rootUrl + '/api/Authorize/User/GetCurrentUser').success(callback);
            },
            getWareHouseByCode: function (code, callback) {
                $http.get(rootUrl + '/api/Md/WareHouse/GetByCode/' + code).success(callback);
            },
            getOrderById: function (id, callback) {
                $http.get(rootUrl + '/api/Nv/DatHang/GetDetailComplete/' + id).success(callback);
            },
            getOrder: function (callback) {
                $http.get(rootUrl + '/api/Nv/DatHang/GetSelectDataIsComplete').success(callback);
            },
            postApproval: function (data, callback) {
                $http.post(serviceUrl + '/PostApproval', data).success(callback);
            },
            updateCT: function (params) {
                return $http.put(serviceUrl + '/' + params.id, params);
            },
            getMerchandiseForNvByCode: function (code) {
                return $http.get(rootUrl + '/api/Md/Merchandise/GetForNvByCode/' + code);
            },
            deleteItem: function (params) {
                return $http.delete(serviceUrl + '/' + params.id, params);
            },
        };
        return result;

    }
]);

var VuotDinhMucController = nvModule.controller('phieuVuotDinhMucController', [
    '$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
    'phieuVuotDinhMucService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'serviceVuotDinhMucAndMerchandise', '$mdDialog', 'clientService', 'localStorageService',
    function (
        $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
        phieuVuotDinhMucService, configService, clientService, nvService, mdService, blockUI, serviceVuotDinhMucAndMerchandise, $mdDialog, clientService, localStorageService
    ) {
        $scope.config = nvService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.tempData = mdService.tempData;
        console.log($scope.tempData.donViHaiQuans);
        $scope.isEditable = true;
        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.sortType = 'ngayCT'; // set the default sort type
        $scope.sortReverse = false; // set the default sort order
        $scope.doSearch = function() {
            $scope.paged.currentPage = 1;
            filterData();
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
                    phieuVuotDinhMucService.deleteItem(item).then(function (data) {
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

            $scope.pageChanged = function () {
                filterData();
            };

            $scope.goHome = function () {
                $state.go('home');
            };
            $scope.refresh = function () {
                $scope.filtered.advanceData = {};
                $scope.setPage($scope.paged.currentPage);
            };
            $scope.title = function () {
                return 'Phiếu vượt định mức';
            };

            //$scope.displayHelper = function (model, module) {
            //    if (!model) return "";
            //    var data = $filter('filter')(mdService.tempData[module], { id: model }, true);
            //    if (data && data.length == 1) {
            //        return data[0].description;
            //    };
            //    return "Empty!";
            //};

            //$scope.formatLabel = function (model, module) {
            //    if (!model) return "";
            //    console.log('a1', model);
            //    var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            //    if (data && data.length == 1) {
            //        return data[0].description;
            //    }
            //    return "Empty!";
            //};
            $scope.displayHelper = function (code, module) {
                var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
                if (data && data.length == 1) {
                    return data[0].description;
                };
                return "";
            }
            $scope.formatLabel = function (model, module) {
                if (!model) return "";
                var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
                if (data && data.length == 1) {
                    return data[0].text;
                }
                return "Empty!";
            };
            $scope.import = function () {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: nvService.buildUrl('nvVuotDinhMuc', 'import'),
                    controller: 'phieuVuotDinhMucImportController',
                    size: 'md'
                });
                modalInstance.result.then(function (updatedData) {
                    serviceVuotDinhMucAndMerchandise.getSelectData().clear();
                    $scope.refresh();
                }, function () {
                    serviceVuotDinhMucAndMerchandise.getSelectData().clear();
                    $scope.refresh();
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.create = function () {

                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: nvService.buildUrl('nvVuotDinhMuc', 'add'),
                    controller: 'phieuVuotDinhMucCreateController',
                    windowClass: 'app-modal-window',
                    //size: 'lg',
                    resolve: {}

                });

                modalInstance.result.then(function (updatedData) {
                    serviceVuotDinhMucAndMerchandise.getSelectData().clear();
                    $scope.refresh();
                }, function () {
                    serviceVuotDinhMucAndMerchandise.getSelectData().clear();
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.details = function (target) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: nvService.buildUrl('nvVuotDinhMuc', 'details'),
                    controller: 'phieuVuotDinhMucDetailsController',
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

            $scope.sum = function () {
                var total = 0;
                if ($scope.data) {
                    angular.forEach($scope.data, function (v, k) {
                        total = total + v.thanhTienSauVat;
                    })
                }
                return total;
            }
            $scope.update = function (target) {
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: nvService.buildUrl('nvVuotDinhMuc', 'update'),
                    controller: 'phieuVuotDinhMucEditController',
                    windowClass: 'app-modal-window',
                    //size:'lg',
                    resolve: {
                        targetData: function () {
                            return target;
                        }
                    }
                });
                modalInstance.result.then(function (updatedData) {
                    serviceVuotDinhMucAndMerchandise.getSelectData().clear();
                    $scope.refresh();
                }, function () {
                    serviceVuotDinhMucAndMerchandise.getSelectData().clear();
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.print = function () {
                var postdata = { paged: $scope.paged, filtered: $scope.filtered };
                phieuVuotDinhMucService.setParameterPrint(
                    postdata);
                $state.go("nvPrintPhieuVuotDinhMuc");
            }
            $scope.printDetail = function () {
                var postdata = { paged: $scope.paged, filtered: $scope.filtered };
                phieuVuotDinhMucService.setParameterPrint(
                    postdata);
                $state.go("nvPrintDetailPhieuVuotDinhMuc");
            }

            function filterData() {
                $scope.isLoading = true;
                var postdata = { paged: $scope.paged, filtered: $scope.filtered };
                phieuVuotDinhMucService.postQuery(
                    JSON.stringify(postdata),
                    function (response) {
                        $scope.isLoading = false;
                        if (response.status) {
                            $scope.data = response.data.data;
                            angular.extend($scope.paged, response.data);
                            //console.log($scope.paged);
                        }
                    });
            };
            filterData();
    }
]);

nvModule.controller('phieuVuotDinhMucImportController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuVuotDinhMucService', 'clientService', 'configService', '$filter', 'Upload',
function ($scope, $uibModalInstance,
    mdService, phieuVuotDinhMucService, clientService, configService, $filter, Upload) {
    $scope.config = mdService.config;
    $scope.title = function () {
        return 'Import Phiếu vượt định mức';
    };

    $scope.import = function () {
        $scope.isLoading = true;
        if ($scope.form.file.$valid && $scope.file) {
            $scope.upload($scope.file);
        }
    };

    $scope.upload = function (file) {
        Upload.upload({
            url: configService.apiServiceBaseUri + '/api/Nv/VuotDinhMuc/ImportXml',
            data: { file: file }
        }).then(function (resp) {
            $scope.isLoading = false;
            console.log(resp);
            if (resp.data.code === 1) {
                clientService.noticeAlert("Import thành công", "success");
            } else if (resp.data.code === 19) {
                clientService.noticeAlert(resp.data.data, "danger");
                var file = new Blob([resp.data.exData], { type: 'text/plain;charset=utf-8;' });
                var fileURL = URL.createObjectURL(file);
                var a = document.createElement('a');
                a.href = fileURL;
                a.target = '_blank';
                a.download = 'error.txt';
                document.body.appendChild(a);
                a.click();
            } else {
                clientService.noticeAlert(resp.data.data, "danger");
            }
            $uibModalInstance.close();
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);

nvModule.controller('phieuVuotDinhMucDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuVuotDinhMucService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, phieuVuotDinhMucService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Phiếu vượt định mức';
    };
    fillterData();
    $scope.nameCurrency = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
    };
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
        if (data && data.length == 1) {
            return data[0].description;
        };
        return "Empty!";
    }
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };

    $scope.approval = function () {
        phieuVuotDinhMucService.postApproval($scope.target, function (response) {
            if (response) {

                alert("Duyệt thành công!");
                $uibModalInstance.close($scope.target);
                $scope.goIndex = function () {
                    $state.go('nvVuotDinhMuc');
                };
            }
            else { alert("Thất bại! - Xảy ra lỗi hoặc phiếu này đã duyệt"); }
        });
    };

    function fillterData() {
        $scope.isLoading = true;

        phieuVuotDinhMucService.getDetails($scope.target.id, function (response) {
            if (response.status) {
                $scope.target = response.data;
            }
            $scope.isLoading = false;
            $scope.pageChanged();
        });
        console.log($scope.target);
    }

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
                $scope.data.push($scope.target.dataDetails[i])
            }
        }
    }
}
]);

nvModule.controller('phieuVuotDinhMucCreateController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log', 'userService', '$rootScope',
    'nvService', 'phieuVuotDinhMucService', 'mdService', 'configService', 'serviceVuotDinhMucAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log, userService, $rootScope,
        nvService, phieuVuotDinhMucService, mdService, configService, serviceVuotDinhMucAndMerchandise, focus) {
        $scope.robot = angular.copy(phieuVuotDinhMucService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.newItem = {};
        $scope.target = { dataDetails: [] };
        $scope.customCode = {};


        // $scope.target.ngayCT = $filter('date')($scope.target.ngayCT, "dd/MM/yyyy");

        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return "Empty!";
        }
        $scope.formatLabel = function (model, module) {
            console.log(model);
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };
        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };
        $scope.isListItemNull = true;


        $scope.addRow = function () {
            if (!$scope.newItem.soLuong || $scope.newItem.soLuong < 1) {
                focus('soluong');
                return;
            }
            if ($scope.newItem.validateCode == $scope.newItem.maHang) {
                var exsist = $scope.target.dataDetails.some(function (element, index, array) {
                    return $scope.newItem.maHang == element.maHang && $scope.newItem.soToKhai == element.soToKhai;
                });
                if (exsist) {
                    clientService.noticeAlert("Mã hàng này bạn đã nhập rồi. Cộng gộp", "success");
                    angular.forEach($scope.target.dataDetails, function (v, k) {
                        if (v.maHang == $scope.newItem.maHang && $scope.newItem.soToKhai == v.soToKhai) {
                            $scope.target.dataDetails[k].soLuong = $scope.newItem.soLuong + $scope.target.dataDetails[k].soLuong;
                            $scope.target.dataDetails[k].thanhTien = $scope.newItem.soLuong * $scope.target.dataDetails[k].donGia;
                            phieuVuotDinhMucService.robot.changeSoLuong($scope.target.dataDetails[k]);
                        }
                    });
                } else {
                    $scope.target.dataDetails.push($scope.newItem);
                }

                $scope.isListItemNull = false;
            }
            $scope.pageChanged();
            $scope.newItem = {};
            focus('mahang');
        };


        $scope.addNewItem = function (strKey) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
                controller: 'merchandiseSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return serviceVuotDinhMucAndMerchandise;
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
                    $scope.newItem.validateCode = updatedData.maVatTu;
                    $scope.newItem.maHang = updatedData.maVatTu;
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
        $scope.title = function () {
            return 'Phiếu vượt định mức';
        };

        $scope.selectedkhachHang = function (item) {
            $scope.target.maKhachHang = item.value;

        };


        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuVuotDinhMucService.getMerchandiseForNvByCode(code).then(function (response) {
                    $scope.newItem = response.data;
                    $scope.newItem.maHang = response.data.maVatTu;
                    $scope.newItem.validateCode = response.data.maVatTu;
                }, function (error) {
                    $scope.addNewItem(code);
                }
                );
            }
        }


        $scope.save = function () {
            $scope.Loading = true;
            phieuVuotDinhMucService.post(
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
            phieuVuotDinhMucService.getNewInstance(function (response) {
                $scope.target = response;
                $scope.target.ngayCT = new Date();
                //$scope.target.ngayHoaDon = new Date();
                $scope.target.dataDetails = serviceVuotDinhMucAndMerchandise.getSelectData();
                $scope.pageChanged();
                $scope.isLoading = false;
                $scope.$watch("target.dataDetails", function (newValue, oldValue) {
                    if (!$scope.target.tienChietKhau) {
                        $scope.target.tienChietKhau = 0;
                    }
                    $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                    $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                }, true);

                $scope.target.idHaiQuan = $rootScope.currentUser.idHaiQuan;
                $scope.target.maHaiQuan = $rootScope.currentUser.maHaiQuan;
                $scope.target.maSoThue = $rootScope.currentUser.maSoThue;
                $scope.target.maDoanhNghiep = $rootScope.currentUser.maDoanhNghiep;

                var data = $filter('filter')($scope.tempData.companies, { id: $scope.target.maDoanhNghiep }, true);
                if (data && data.length > 0) {
                    $scope.target.tenDoanhNghiep = data[0].description;
                }

                //phieuVuotDinhMucService.getCurrentUser(function (response) {
                //    $scope.target.maDoanhNghiep = response.unitUser.id;
                //    $scope.target.maHaiQuan = response.unitUser.maHaiQuan;
                //    var data = $filter('filter')($scope.tempData.companies, { id: $scope.target.maDoanhNghiep }, true);
                //    var dataCustom = $filter('filter')($scope.tempData.donViHaiQuans, { value: $scope.target.maHaiQuan }, true);
                //    if (data && dataCustom) {
                //        $scope.target.maSoThue = data[0].value;
                //        $scope.target.tenDoanhNghiep = data[0].description;
                //        $scope.target.idHaiQuan = dataCustom[0].id;

                //    }
                //});

            });



        };

        $scope.createWareHouse = function (target, name) {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdWareHouse', 'add'),
                controller: 'wareHouseCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('wareHouses', function () {
                    if (target && name) {
                        target[name] = updatedData.maKho;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.createMerchandise = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'add'),
                controller: 'merchandiseCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('merchandises', function () {
                    if (target && name) {
                        target[name] = updatedData.maVatTu;
                    }
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.createCustomer = function (target, name) {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdCustomer', 'add'),
                controller: 'customerCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('customers', function () {
                    if (target && name) {
                        target[name] = updatedData.maKH;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
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

nvModule.controller('phieuVuotDinhMucEditController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'phieuVuotDinhMucService', 'mdService', 'targetData', 'configService', 'serviceVuotDinhMucAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, phieuVuotDinhMucService, mdService, targetData, configService, serviceVuotDinhMucAndMerchandise, focus) {
        $scope.robot = angular.copy(phieuVuotDinhMucService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.newItem = {};
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return "Empty!";
        }
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
        $scope.tyGia = 0;
        $scope.addRow = function () {
            if (!$scope.newItem.soLuong || $scope.newItem.soLuong < 1) {
                focus('soluong');
                return;
            }
            if ($scope.newItem.validateCode == $scope.newItem.maHang) {
                var exsist = $scope.target.dataDetails.some(function (element, index, array) {
                    return $scope.newItem.maHang == element.maHang && $scope.newItem.soToKhai == element.soToKhai;
                });
                if (exsist) {
                    clientService.noticeAlert("Mã hàng này bạn đã nhập rồi. Cộng gộp", "success");
                    angular.forEach($scope.target.dataDetails, function (v, k) {
                        if (v.maHang == $scope.newItem.maHang && $scope.newItem.soToKhai == v.soToKhai) {
                            $scope.target.dataDetails[k].soLuong = $scope.newItem.soLuong + $scope.target.dataDetails[k].soLuong;
                            $scope.target.dataDetails[k].thanhTien = $scope.newItem.soLuong * $scope.target.dataDetails[k].donGia;
                            phieuVuotDinhMucService.robot.changeSoLuong($scope.target.dataDetails[k]);
                        }
                    });
                } else {
                    $scope.target.dataDetails.push($scope.newItem);
                };

                $scope.isListItemNull = false;
            }
            $scope.pageChanged();
            $scope.newItem = {};
            focus('mahang');
        };
        $scope.addNewItem = function (strKey) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
                controller: 'merchandiseSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return serviceVuotDinhMucAndMerchandise;
                    },
                    filterObject: function () {
                        return {
                            summary: strKey
                        };
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
                $scope.newItem = updatedData;
                $scope.newItem.validateCode = updatedData.maHang;
                $scope.pageChanged();
            }, function () {

            });
        }
        $scope.removeItem = function (index) {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            currentPageIndex = (currentPage - 1) * itemsPerPage + index;
            $scope.target.dataDetails.splice(currentPageIndex, 1);
            $scope.pageChanged();
        }
        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $uibModalInstance.dismiss('cancel');
        };

        $scope.title = function () {
            return 'Phiếu vượt định mức';
        };

        $scope.selectedkhachHang = function (item) {
            $scope.target.maKhachHang = item.value;
            phieuVuotDinhMucService.getCustomer(item.id, function (response) {
                $scope.target.maSoThue = response.maSoThue;
            });
        };


        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuVuotDinhMucService.getMerchandiseForNvByCode(code).then(function (response) {
                    $scope.newItem = response.data;
                    $scope.newItem.maHang = response.data.maVatTu;
                    $scope.newItem.validateCode = response.data.maVatTu;
                }, function (error) {
                    $scope.addNewItem(code);
                }
                );
            }
        }



        $scope.save = function () {
            phieuVuotDinhMucService.updateCT($scope.target).then(
                    function (response) {
                        if (response.status && response.status == 200) {
                            if (response.data.status) {
                                console.log('Create  Successfully!');
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
        $scope.saveAndPrint = function () {
            phieuVuotDinhMucService.updateCT($scope.target).then(
                    function (response) {
                        if (response.data.status) {
                            clientService.noticeAlert("Thành công", "success");
                            console.log('Update Successfully!');
                            var url = $state.href('reportphieuVuotDinhMuc', { id: response.data.data.id });
                            window.open(url, 'Report Viewer');
                            $scope.target.dataDetails.clear();
                            $uibModalInstance.close(response.data);
                        } else {
                            clientService.noticeAlert(response.data.message, "danger");
                        }
                    },
                    function (response) {
                        console.log('ERROR: Update failed! ' + response);
                    }
                );
        }
        function filterData() {
            phieuVuotDinhMucService.getDetails($scope.target.id, function (response) {
                if (response.data.id) {
                    $scope.target = response.data;
                    serviceVuotDinhMucAndMerchandise.setSelectData($scope.target.dataDetails);
                    $scope.pageChanged();

                    $scope.$watch("target.dataDetails", function (newValue, oldValue) {
                        $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                        $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                    }, true);
                    var data = $filter('filter')($scope.tempData.donViHaiQuans, { value: $scope.target.maDoanhNghiep }, true)
                    if (data && dataCustom) {
                        $scope.target.tenDoanhNghiep = data[0].description;

                    }
                }
            });

        };
        $scope.createWareHouse = function (target, name) {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdWareHouse', 'add'),
                controller: 'wareHouseCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('wareHouses', function () {
                    if (target && name) {
                        target[name] = updatedData.maKho;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.createMerchandise = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'add'),
                controller: 'merchandiseCreateController',
                windowClass: 'app-modal-window',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('merchandises', function () {
                    if (target && name) {
                        target[name] = updatedData.maVatTu;
                    }
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.createCustomer = function (target, name) {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdCustomer', 'add'),
                controller: 'customerCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('customers', function () {
                    if (target && name) {
                        target[name] = updatedData.maKH;
                    }
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
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

nvModule.controller('reportPhieuVuotDinhMucController', [
    '$scope', '$filter', '$window', '$stateParams', '$timeout', '$state',
    'mdService', 'phieuVuotDinhMucService', 'clientService',
    function ($scope, $filter, $window, $stateParams, $timeout, $state,
        mdService, phieuVuotDinhMucService, clientService) {
        $scope.robot = angular.copy(phieuVuotDinhMucService.robot);
        var id = $stateParams.id;
        $scope.target = {};



        $scope.goIndex = function () {
            $state.go('nvVuotDinhMuc');
        };

        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return "Empty!";
        }
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };

        $scope.displayWareHouse = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].description;
            }
            return "Empty!";
        };

        function filterData() {
            if (id) {
                phieuVuotDinhMucService.getReport(id, function (response) {

                    if (response.status) {
                        $scope.target = response.data;

                    }
                    phieuVuotDinhMucService.getCurrentUser(function (response) {
                        $scope.currentUser = response;
                    });

                });

            }
        };

        $scope.checkDuyet = function () {
            // console.log($scope.target.trangThai);
            if ($scope.target.trangThai == 10) {
                return false;
            } else {
                return true;
            }
        }
        $scope.goIndex = function () {
            $state.go("nvVuotDinhMuc");
        };

        $scope.nameCompany = '';

        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                $scope.nameCompany = data[0].text;
                return $scope.nameCompany;
            };
            return "Empty!";
        }
        $scope.print = function () {
            var table = document.getElementById('main-report').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
        }

        $scope.printExcel = function () {
            var data = [document.getElementById('main-report').innerHTML];
            var fileName = "VuotDinhMuc_ExportData.xls";
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

            //      var uri = 'data:application/vnd.ms-excel;base64,'
            //, template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
            //, base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
            //, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

            //      var source = document.getElementById("main-report");
            //      var filters = $('.ng-table-filters').remove();
            //      $('.ng-table-sort-header').after(filters);
            //      var ctx = { worksheet: name || 'Sheet 1', table: source.innerHTML };
            //      var url = uri + base64(format(template, ctx));
            //      var a = document.createElement('a');
            //      a.href = url;
            //      a.download = 'NhapHangMua_ExportData.xls';
            //      a.click();
        }

        //$scope.$on('$viewContentLoaded', function () {
        //    $scope.$watch('target', function (newVal, oldVal) {

        //        //Force angular not to fire script on load
        //        if (newVal != oldVal) {

        //            //Force script to run AFTER ng-repeat has rendered its things to the DOM
        //            $timeout(function () {

        //                //And finally setTimout to wait for browser to render the custom fonts for print preview
        //                setTimeout(function () {

        //                    //Print document
        //                    $scope.print();
        //                    //window.close();
        //                }, 100);
        //            }, 0);
        //        }
        //    }, true);
        //});
        filterData();
    }
]);

nvModule.controller('printPhieuVuotDinhMucController', [
    '$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
    'mdService', 'phieuVuotDinhMucService', 'clientService',
    function ($scope, $state, $window, $stateParams, $timeout, $filter,
        mdService, phieuVuotDinhMucService, clientService) {
        $scope.robot = angular.copy(phieuVuotDinhMucService.robot);
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "Empty!";
        }

        function filterData() {
            phieuVuotDinhMucService.postPrint(
                function (response) {
                    $scope.printData = response;
                });
        };

        $scope.info = phieuVuotDinhMucService.getParameterPrint().filtered.advanceData;
        $scope.goIndex = function () {
            $state.go("pghVuotDinhMuc");
        }
        $scope.printExcel = function () {
            var data = [document.getElementById('dataTable').innerHTML];
            clientService.saveExcel(data, "Danh_sach");
        }
        $scope.sum = function () {
            var total = 0;
            if ($scope.printData) {
                angular.forEach($scope.printData, function (v, k) {
                    total = total + v.thanhTienSauVat;
                });
            }
            return total;
        }
        $scope.print = function () {
            var table = document.getElementById('dataTable').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
        }
        filterData();
    }
]);

nvModule.controller('printDetailPhieuVuotDinhMucController', [
    '$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
    'mdService', 'phieuVuotDinhMucService', 'clientService',
    function ($scope, $state, $window, $stateParams, $timeout, $filter,
        mdService, phieuVuotDinhMucService, clientService) {
        $scope.robot = angular.copy(phieuVuotDinhMucService.robot);
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "Empty!";
        }
        $scope.info = phieuVuotDinhMucService.getParameterPrint().filtered.advanceData;
        $scope.goIndex = function () {
            $state.go("nvVuotDinhMuc");
        }

        function filterData() {
            phieuVuotDinhMucService.postPrintDetail(
                function (response) {
                    $scope.printData = response;
                });
        }

        $scope.sum = function () {
            var total = 0;
            if ($scope.printData) {
                angular.forEach($scope.printData, function (v, k) {
                    total = total + v.thanhTienSauVat;
                });
            }
            return total;
        }
        $scope.printExcel = function () {
            var data = [document.getElementById('dataTable').innerHTML];
            clientService.saveExcel(data, "Danh_sach_chi_tiet");
        }
        $scope.print = function () {
            var table = document.getElementById('dataTable').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
        }
        filterData();
    }
]);