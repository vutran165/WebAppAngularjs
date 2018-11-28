nvModule.factory('phieuXuatBanLeService',
    ['$resource', '$http', '$window', 'configService', 'clientService',
  function ($resource, $http, $window, configService, clientService) {
      var rootUrl = configService.apiServiceBaseUri;
      this.parameterPrint = {};
      function getParameterPrint() {
          return this.parameterPrint;
      }
      var serviceUrl = rootUrl + '/api/Nv/XuatBanLe';

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
                  tienVat = (target.thanhTienTruocVatSauCK * tyGia) / 100;
              }
              return tienVat;
          },



          changeTyGia: function (item) {
              if (!item.thanhTienSauVat) {
                  item.thanhTienSauVat = 0;
              }
              if (!item.tyGia) {
                  item.tyGia = 0;
              }
              item.quyDoi = item.thanhTienSauVat / item.tyGia;


          },
          changeSoLuong: function (item) {
              if (!item.soLuong) {
                  item.soLuong = 0;
              }
              if (!item.donGia) {
                  item.donGia = 0;
              }
              item.thanhTien = item.soLuong * item.donGia;

          },
          changeDonGia: function (item) {
              if (!item.soLuong) {
                  item.soLuong = 0;
              }
              if (!item.donGia) {
                  item.donGia = 0;
              }
              item.thanhTien = item.soLuong * item.donGia;

          },

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
          getCurrentUser: function (callback) {
              $http.get(rootUrl + '/api/Authorize/User/GetCurrentUser').success(callback);
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
          postApproval: function (id, callback) {
              $http.post(serviceUrl + '/PostApproval', id).success(callback);
          },
          update: function (params) {
              return $http.put(serviceUrl + '/' + params.id, params);
          },
          getMerchandiseForNvByCode: function (code) {
              return $http.get(rootUrl + '/api/Md/Merchandise/GetForNvByCode/' + code);
          },
          getCustomerForNvByCode: function (code) {
              return $http.get(rootUrl + '/api/Md/Customer/GetForNvByCode/' + code);
          },
          getHistories: function (data, callback) {
              $http.post(serviceUrl + '/GetHistories', data).success(callback);
          },
          getSelectCompanyByCode: function (id) {
              return $http.get(rootUrl + '/api/Md/Company/GetSelectCompanyByCode/' + id);
          }
      };
      return result;
  }]);
nvModule.controller('phieuXuatBanLeController', [
    '$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
    'phieuXuatBanLeService', 'configService', 'clientService', 'nvService', 'mdService', 'companyService', 'serviceXuatKhacAndMerchandise', 'localStorageService', 'serviceCompanySelected',
    function (
        $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
        phieuXuatBanLeService, configService, clientService, nvService, mdService, companyService, serviceXuatKhacAndMerchandise, localStorageService, serviceCompanySelected) {
        $scope.config = nvService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.filtered.isAdvance = true;
        $scope.isEditable = true;
        $scope.tempData = mdService.tempData;
        $scope.filtered.advanceData.denNgay = new Date();


        //load dữ liệu hải quan lên combo tìm kiếm
        function loadDefault() {
            var strKey = '';
            $scope.filtered.advanceData.maHaiQuan = $rootScope.currentUser.maHaiQuan;
            $scope.filtered.advanceData.idHaiQuan = $rootScope.currentUser.idHaiQuan;
            strKey = $scope.filtered.advanceData.maHaiQuan.substring(0, 2);
            if ($rootScope.currentUser.idHaiQuan == 01) {
                $scope.listUnitCustom = mdService.tempData.donViHaiQuans;
            }
            else {
                $scope.listUnitCustom = $filter('filter')(mdService.tempData.donViHaiQuans, { value: strKey });
            }

        }

        loadDefault();

        function filterData() {
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            phieuXuatBanLeService.postQuery(JSON.stringify(postdata), function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.extend($scope.paged, response.data);
                }
            });
        };


        $scope.selectedCompany = function (mst) {
            if (mst) {
                companyService.getByMaSoThue(mst).then(function (response) {
                    if (response.data) {
                        $scope.filtered.advanceData.maSoThue = response.data.maSoThue;
                        $scope.filtered.advanceData.tenDoanhNghiep = response.data.tenDoanhNghiep;
                    } else {
                        $scope.addCompany(mst);
                    }
                }, function (error) {
                    $scope.addCompany(mst);
                });
            }
        }

        $scope.addCompany = function (mst) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('MdCompany', 'selectForMainController'),
                controller: 'companySelectForMainController',
                size: 'lg',
                resolve: {
                    filterObject: function () {
                        return {
                            summary: mst
                        };
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
                $scope.filtered.advanceData.maSoThue = updatedData.value;
                $scope.filtered.advanceData.tenDoanhNghiep = updatedData.description;
            }, function () {

            });
        }


        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };


        $scope.doSearch = function () {
            $scope.paged.currentPage = 1;
            filterData();
        };


        $scope.goHome = function () {
            $state.go('home');
        };
        $scope.refresh = function () {
            $scope.filtered = angular.copy(configService.filterDefault);

            $scope.setPage($scope.paged.currentPage);
        };


        $scope.sortType = 'ngayCT'; // set the default sort type
        $scope.sortReverse = false; // set the default sort order

        $scope.pageChanged = function () {
            filterData();
        };
        $scope.sum = function () {
            var total = 0;
            if ($scope.data) {
                angular.forEach($scope.data, function (v, k) {
                    total = total + v.thanhTienSauVat;
                });
            }
            return total;
        };

        $scope.title = function () {
            return 'Phiếu xuất hàng từ cửa hàng bán cho khách hàng';
        };


        $scope.displayHelper = function (code, module) {
            if (!code) return "";
            var data = $filter('filter')(mdService.tempData[module], { id: code }, true);
            if (data && data.length == 1) {
                return data[0].description;
            };
            return code;
        };

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
                var data = $filter('filter')(mdService.tempData.donViHaiQuansByUnitCode, { value: mahq }, true);
                if (data && data.length > 0) {
                    $scope.filtered.advanceData.maHaiQuan = data[0].value;
                    $scope.filtered.advanceData.idHaiQuan = data[0].id;
                }
            }
        };

        $scope.create = function () {

            //var modalInstance = $uibModal.open({
            //    backdrop: 'static',
            //    templateUrl: nvService.buildUrl('nvXuatBanLe', 'add'),
            //    controller: 'phieuXuatBanLeCreateController',
            //    windowClass: 'app-modal-window',
            //    resolve: {}
            $state.go("nvAddphieuXuatBanLe");
            //});

            //modalInstance.result.then(function (updatedData) {
            //    serviceXuatKhacAndMerchandise.getSelectData().clear();
            //    $scope.refresh();
            //}, function () {
            //    $log.info('Modal dismissed at: ' + new Date());
            //});
        };

        $scope.print = function () {
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            phieuXuatBanLeService.setParameterPrint(
                postdata);
            $state.go("nvPrintphieuXuatBanLe");
        }
        $scope.printDetail = function () {
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            phieuXuatBanLeService.setParameterPrint(
                postdata);
            $state.go("nvPrintDetailphieuXuatBanLe");
        }
        $scope.goHome = function () {
            $state.go('home');
        };

        $scope.refresh = function () {
            $scope.setPage($scope.paged.currentPage);
        };

        $scope.printPopup = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvXuatBan', 'report'),
                controller: 'reportPhieuXuatBanLeController',
                size: 'lg',
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
                templateUrl: nvService.buildUrl('nvXuatBan', 'update'),
                controller: 'phieuXuatBanLeEditController',
                windowClass: 'app-modal-window',
                resolve: {
                    targetData: function () {
                        return target;
                    }
                }
            });

            modalInstance.result.then(function (updatedData) {
                serviceXuatKhacAndMerchandise.getSelectData().clear();
                $scope.refresh();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.details = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvXuatBanLe', 'details'),
                controller: 'phieuXuatBanLeDetailsController',
                windowClass: 'app-modal-window',
                resolve: {
                    targetData: function () {
                        return target;
                    }
                }
            });
        };

        $scope.histories = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvXuatBanLe', 'histories'),

                controller: 'phieuXuatBanLeHistoryController',
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
    }
]);

nvModule.controller('phieuXuatBanLeDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuXuatBanLeService', 'targetData', 'clientService', '$filter', 'configService',
function ($scope, $uibModalInstance,
    mdService, phieuXuatBanLeService, targetData, clientService, $filter, configService) {
    $scope.robot = phieuXuatBanLeService.robot;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Phiếu xuất hàng từ cửa hàng bán cho khách hàng';
    };
    fillterData();


    $scope.displayHelper = function (code, module) {
        if (!code) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return " ";
    }

    $scope.nameCurrency = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
    };



    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {

            return data[0].text;
        }
        return "Empty!";
    };

    $scope.approval = function () {
        phieuXuatBanLeService.postApproval($scope.target, function (response) {
            if (response) {
                alert("Duyệt thành công!");
                fillterData();
            }
            else { alert("Thất bại! - Xảy ra lỗi hoặc phiếu này đã duyệt"); }
        });
    };

    function fillterData() {
        $scope.isLoading = true;
        phieuXuatBanLeService.getDetails($scope.target.id, function (response) {
            if (response.status) {
                $scope.target = response.data;
                var data = $filter('filter')(mdService.tempData.unitUsers, { value: $scope.target.maCuaHang }, true);
                if (data && data.length == 1) {
                    $scope.target.tenCuaHang = data[0].description;
                }

            }
            $scope.isLoading = false;
            $scope.pageChanged();
        });
    }
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
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);


nvModule.controller('phieuXuatBanLeHistoryController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuXuatBanLeService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, phieuXuatBanLeService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Phiếu xuất hàng từ cửa hàng bán cho khách hàng';
    };
    fillterData();


    $scope.displayHelper = function (code, module) {
        if (!code) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].value;
        }
        return "Empty!";
    }

    $scope.nameCurrency = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
    };



    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {

            return data[0].text;
        }
        return "Empty!";
    };


    var choiceObj = angular.copy(configService.choiceObj);

    function fillterData() {
        $scope.isLoading = true;
        choiceObj.id = $scope.target.maHoaDon;
        choiceObj.value = $scope.target.loaiPhieu;
        choiceObj.extendValue = $scope.target.maSoThue;
        phieuXuatBanLeService.getHistories(choiceObj, function (response) {
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

nvModule.controller('phieuXuatBanLeCreateController', [
    '$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
    'phieuXuatBanLeService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'serviceXuatBanLeAndMerchandise',
    function (
        $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
        phieuXuatBanLeService, configService, clientService, nvService, mdService, blockUI, serviceXuatBanLeAndMerchandise
    ) {
        $scope.robot = phieuXuatBanLeService.robot;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.paged2 = angular.copy(configService.pageDefault);
        $scope.paged2.itemsPerPage = 3;
        $scope.tempData = mdService.tempData;
        $scope.config = nvService.config;

        $scope.tyGia = 0;
        $scope.goHome = function () {
            $state.go('nvXuatBanLe');
        };
        $scope.title = function () {
            return 'Phiếu xuất hàng từ cửa hàng bán cho khách hàng';
        };
        $scope.target = {};
        $scope.newItem = {};
        $scope.newItem2 = {};
        $scope.target.soDinhMuc = {};
        $scope.isDT4 = true;

        $scope.displayHelper = function (code, module) {
            if (!code) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].value;
            }
            return code;
        }

        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].value;
            }
        };


        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {

                return data[0].text;
            }
            return code;
        };


        $scope.selectedKhoXuat = function (item) {
            $scope.target.tenKhoXuat = item.description;
        }

        $scope.selectedCuaHang = function (item) {
            $scope.target.tenCuaHang = item.description;
            $scope.target.maKhoXuat = "";
        }
        console.log($scope.tempData);
        $scope.selectedDoiTuong = function (item) {
            if (item.value == 'ĐT4') {
                $scope.isDT4 = false;

            }
            else {
                $scope.isDT4 = true;

            }
            // switch (item) {
            // case 'ĐT1':
            // $("#Content").load("./_layouts/15/BTS.SP.ERP/NV/NvXuatBanLe/DoiTuongOne.html");
            // $scope.tempData = mdService.tempData;
            // break;
            // case 'ĐT2':
            // $("#Content").load("/_layouts/15/BTS.SP.ERP/NV/NvXuatBanLe/DoiTuongTwo.html");
            // break;
            // case 'ĐT3':
            // $("#Content").load("/_layouts/15/BTS.SP.ERP/NV/NvXuatBanLe/DoiTuongThree.html");
            // break;
            // case 'ĐT4':
            // $("#Content").load("/_layouts/15/BTS.SP.ERP/NV/NvXuatBanLe/DoiTuongFour.html");
            // break;
            // case 'ĐT5':
            // $("#Content").load("/_layouts/15/BTS.SP.ERP/NV/NvXuatBanLe/DoiTuongFive.html");
            // break;
            // case 'ĐT6':
            // $("#Content").load("/_layouts/15/BTS.SP.ERP/NV/NvXuatBanLe/DoiTuongSix.html");
            // break;
            // case 'ĐT7':
            // $("#Content").load("/_layouts/15/BTS.SP.ERP/NV/NvXuatBanLe/DoiTuongSeven.html");
            // break;
            // default:
            // $("#Content").load("/_layouts/15/BTS.SP.ERP/NV/NvXuatBanLe/DoiTuongOne.html");
            // break;
            // }
        }

        $scope.changePlaceExport = function (code) {
            console.log(code);
            if (code == 1) {
                $scope.target.maKhoXuat = "";
                $scope.target.tenKhoXuat = "";
            }
            else {
                $scope.target.maCuaHang = "";
                $scope.target.tenCuaHang = "";
            }
        }
        $scope.getNewInstance = function () {
            phieuXuatBanLeService.getNewInstance(function (response) {
                console.log(response);
                $scope.target = response;
                $scope.focusKhachHang = true;
            });
        }
        $scope.addNewItem = function (strKey) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
                controller: 'merchandiseSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return serviceXuatBanLeAndMerchandise;
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
                    $scope.newItem.maHang = updatedData.maVatTu;


                }
            }, function () {
            });
        }

        $scope.addNewCustomer = function (code) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdCustomer', 'selectData'),
                controller: 'customerSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return null;
                    },
                    filterObject: function () {
                        return {
                            advanceData: {
                                maKH: code
                            },
                            isAdvance: true,
                        };
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
                $scope.target.maKhachHang = updatedData.value;
                $scope.target.tenKhachHang = updatedData.text;
                $scope.searchMaKH = "";
                $scope.focusKhachHang = true;
            }, function () {
            });
        }
        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuXuatBanLeService.getMerchandiseForNvByCode(code).then(function (response) {
                    $scope.newItem = response.data;
                    $scope.newItem.maHang = response.data.maVatTu;

                }, function () {
                    $scope.addNewItem(code);
                }
                );
            }
        }
        $scope.selectedMaKhachHang = function (code) {
            if (code) {
                phieuXuatBanLeService.getCustomerForNvByCode(code).then(function (response) {
                    $scope.target.maKhachHang = response.data.maKH;
                    $scope.target.tenKhachHang = response.data.tenKhachHang;
                }, function () {
                    $scope.addNewCustomer(code);
                }
                );
            }
        }
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
        $scope.changeSoLuong = function (item) {
            if (!item.giamGia) {
                item.giamGia = 0;
            }
            item.tienGiamGia = item.donGia * (item.giamGia / 100);
            item.thanhTien = item.soLuong * (item.donGia - item.tienGiamGia);
        }

        $scope.changeTienKhachDua = function (target) {
            target.tienTraLai = target.tienKhachDua - target.thanhTienSauVat;
        }
        $scope.remove = function (index) {
            $scope.target.dataDetails.splice(index, 1);
        }

        $scope.changeChietKhau = function (target) {
            target.tienChietKhau = (target.thanhTienTruocVat + target.tongTienGiamGia) * (target.chietKhau / 100);
            target.thanhTienSauVat = target.thanhTienTruocVat - target.tienChietKhau;
        }
        $scope.addToOrder = function (item) {
            if (!item.maHang) {
                return;
            }
            $scope.changeSoLuong(item);
            $scope.target.dataDetails.push(item);

            $scope.newItem = {};
        }
        $scope.removeToOrder = function (index) {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            currentPageIndex = (currentPage - 1) * itemsPerPage + index;
            $scope.target.dataDetails.splice(currentPageIndex, 1);
            if ($scope.target.dataDetails.length == 0) {
                $scope.isListItemNull = true;
            }

            $scope.pageChanged();
        }
        $scope.addToOrderSoDinhMuc = function (item) {
            $scope.target.soDinhMuc.detailSoDinhMuc.push(item);
            $scope.newItem2 = {};
            $scope.paged2.totalItems = $scope.target.soDinhMuc.detailSoDinhMuc.length;
            $scope.data2 = [];
            if ($scope.paged2.totalItems > $scope.paged2.itemsPerPage) {
                $scope.data2 = [];
                for (var i = $scope.paged2.totalItems - 1; i >= $scope.paged2.totalItems - 3; i--) {
                    $scope.data2.push($scope.target.soDinhMuc.detailSoDinhMuc[i]);
                }

            } else {
                $scope.data2 = angular.copy($scope.target.soDinhMuc.detailSoDinhMuc);
                $scope.data2 = $scope.data2.reverse();
            }
        }
        $scope.removeToOrderSoDinhMuc = function (index) {
            var currentPage = $scope.paged2.currentPage;
            var itemsPerPage = 3;
            currentPageIndex = (currentPage - 1) * itemsPerPage + index;
            $scope.target.soDinhMuc.detailSoDinhMuc.splice(currentPageIndex, 1);
            if ($scope.target.soDinhMuc.detailSoDinhMuc.length == 0) {
                $scope.isListItemNull = true;
            }
            //$scope.pageChangedSoDinhMuc();
        }
        $scope.save = function () {
            $scope.target.maDoiTuong = $scope.doiTuong.value;
            console.log($scope.target.maDoiTuong);
            phieuXuatBanLeService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        $scope.target.dataDetails.clear();
                        $scope.isListItemNull = true;
                        $state.go('nvXuatBanLe');
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
            );
        }

        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $state.go('nvXuatBanLe');
        };

        function filterData() {
            $scope.getNewInstance();

            phieuXuatBanLeService.getCurrentUser(function (response) {

                $scope.target.maDoanhNghiep = response.unitUser.id;
                $scope.target.maHaiQuan = response.unitUser.maHaiQuan;
                var data = $filter('filter')($scope.tempData.companies, { id: $scope.target.maDoanhNghiep }, true);
                var dataCustom = $filter('filter')($scope.tempData.donViHaiQuans, { value: $scope.target.maHaiQuan }, true);
                if (data && dataCustom) {
                    $scope.target.maSoThue = data[0].value;
                    $scope.target.maHaiQuan = data[0].parent;
                    $scope.target.idHaiQuan = dataCustom[0].id;
                }
            });
            $scope.target.tyGia = 1;
            $scope.$watch("target.dataDetails", function (newValue, oldValue) {
                $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                $scope.target.quyDoi = $scope.target.thanhTienSauVat / $scope.target.tyGia;
            }, true);
            $scope.doiTuong = ($scope.tempData.doiTuongs[0]);
            $scope.target.placeExport = 1;
        }

        filterData();

  

        function printBill(target) {
            var table = document.getElementById('bill').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
            filterData();
        }

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
        $scope.pageChangedSoDinhMuc = function () {
            $scope.data2 = [];
            var temp = ($scope.paged2.totalPage - $scope.paged2.currentPage)
            var itemPerpage = $scope.paged2.itemsPerPage;
            for (var i = temp * itemPerpage; i >= (temp + 1) * itemPerpage; i--) {
                $scope.data2.push($scope.target.soDinhMuc.detailSoDinhMuc[i]);
            }
            console.log($scope.data2);
        }

    }
]);

nvModule.controller('reportPhieuXuatBanLeController', [
    '$scope', '$rootScope', '$window', '$stateParams', '$timeout', '$state', 'targetData', '$uibModalInstance',
    'mdService', 'phieuXuatBanLeService', 'clientService', function (
     $scope, $rootScope, $window, $stateParams, $timeout, $state, targetData, $uibModalInstance,
        mdService, phieuXuatBanLeService, clientService) {
        $scope.robot = angular.copy(phieuXuatBanLeService.robot);
        var id = $stateParams.id;
        $scope.target = {};

        $scope.title = "PHIẾU KÊ KHAI PHIẾU XUẤT BÁN CHO KHÁCH HÀNG";

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        function filterData() {
            if (targetData.id) {
                phieuXuatBanLeService.getReport(targetData.id, function (response) {
                    if (response.status) {
                        $scope.target = response.data;

                        $scope.objUser = $rootScope.currentUser;
                        var data1 = $filter('filter')(mdService.tempData.donViHaiQuans, { id: $scope.objUser.idHaiQuan }, true);
                        if (data1) {
                            var dataCustom = $filter('filter')(mdService.tempData.donViHaiQuans, { value: data1[0].extendValue }, true);
                            if (dataCustom.length > 0) {
                                $scope.nameOfCustom = dataCustom[0].description;
                            }
                        }
                    }
                });
            }
        };


        $scope.print = function () {
            var table = document.getElementById('main-report').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
        }

        filterData();
    }
]);


nvModule.controller('printphieuXuatBanLeController', ['$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
'mdService', 'phieuXuatBanLeService', 'clientService',
function ($scope, $state, $window, $stateParams, $timeout, $filter,
mdService, phieuXuatBanLeService, clientService) {
    $scope.robot = angular.copy(phieuXuatBanLeService.robot);
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return "Empty!";
    }
    function filterData() {
        phieuXuatBanLeService.postPrint(
            function (response) {
                $scope.printData = response;
            });
    };
    $scope.info = phieuXuatBanLeService.getParameterPrint().filtered.advanceData;
    $scope.goIndex = function () {
        $state.go("nvXuatBanLe");
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
}]);

nvModule.controller('printDetailphieuXuatBanLeController', ['$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
'mdService', 'phieuXuatBanLeService', 'clientService',
function ($scope, $state, $window, $stateParams, $timeout, $filter,
mdService, phieuXuatBanLeService, clientService) {
    $scope.robot = angular.copy(phieuXuatBanLeService.robot);
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return "Empty!";
    }
    $scope.info = phieuXuatBanLeService.getParameterPrint().filtered.advanceData;
    $scope.goIndex = function () {
        $state.go("nvXuatBanLe");
    }
    function filterData() {
        phieuXuatBanLeService.postPrintDetail(
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

}])