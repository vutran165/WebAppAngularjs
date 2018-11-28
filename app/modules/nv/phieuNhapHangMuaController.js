var phieuNhapHangMuaService = nvModule.factory('phieuNhapHangMuaService',
    ['$resource', '$http', '$window', 'configService', 'clientService',
  function ($resource, $http, $window, configService, clientService) {
      var rootUrl = configService.apiServiceBaseUri;
      var serviceUrl = rootUrl + '/api/Nv/NhapHangMua';

      this.parameterPrint = {};
      function getParameterPrint() {
          return this.parameterPrint;
      }

      var calc = {
          sum: function (obj, name) {
              var total = 0;
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
                  tienVat = (target.thanhTienTruocVat - target.tienChietKhau) * (tyGia / 100);
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
          changeSoLuongBao: function (item) {
              if (!item.soLuongLe) {
                  item.soLuongLe = 0;
              }
              if (!item.maBaoBi) {
                  item.luongBao = 1;
              }
              item.soLuong = item.soLuongBao * item.luongBao + item.soLuongLe;
              item.thanhTien = item.soLuong * item.donGia;
              item.thanhTienVAT = item.thanhTien * (1 + item.tyLeVatVao / 100);

          },
          changeDonGia: function (item) {
              if (!item.maBaoBi) {
                  item.luongBao = 1;
              }
              if (!item.soLuongBao) {
                  item.soLuongBao = 0;
              }
              if (!item.soLuongLe) {
                  item.soLuongLe = 0;
              }
              item.soLuong = item.soLuongBao * item.luongBao + item.soLuongLe;
              item.thanhTien = item.soLuong * item.donGia;
              item.giaMuaCoVat = item.donGia * (1 + item.tyLeVatVao / 100);
              item.thanhTienVAT = item.thanhTien * (1 + item.tyLeVatVao / 100);
          },
          changeSoLuongLe: function (item) {
              if (!item.soLuong) {
                  item.soLuong = 0;
              }
              if (!item.donGia) {
                  item.donGia = 0;
              }
              if (!item.maBaoBi) {
                  item.luongBao = 1;
              }
              if (!item.soLuongBao) {
                  item.soLuongBao = 0;
              }
              item.soLuong = item.soLuongBao * item.luongBao + item.soLuongLe;
              item.thanhTien = item.soLuong * item.donGia;
              item.thanhTienVAT = item.thanhTien * (1 + item.tyLeVatVao / 100);

          },
          changeGiaMuaDonGia: function (item) {
              if (!item.soLuong) {
                  item.soLuong = 0;
              }
              if (!item.donGia) {
                  item.donGia = 0;
              }
              if (!item.maBaoBi) {
                  item.luongBao = 1;
              }
              if (!item.soLuongBao) {
                  item.soLuongBao = 0;
              }
              item.donGia = item.giaMuaCoVat / (1 + item.tyLeVatVao / 100);
              item.thanhTien = item.soLuong * item.donGia;
              item.thanhTienVAT = item.thanhTien * (1 + item.tyLeVatVao / 100);

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
          getWareHouseByCode: function (code, callback) {
              $http.get(rootUrl + '/api/Md/WareHouse/GetByCode/' + code).success(callback);
          },
          getOrderById: function (id, callback) {
              $http.get(rootUrl + '/api/Nv/DatHang/GetDetailComplete/' + id).success(callback);
          },
          getOrderByCustomer: function (code, callback) {
              $http.get(rootUrl + '/api/Nv/DatHang/GetSelectDataIsCompleteByCustomerCode/' + code).success(callback);
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
          getMerchandise: function (maChungTuPk) {
              return $http.get(rootUrl + '/api/Nv/NhapHangMua/GetMerchandise/' + maChungTuPk);
          },
          getUnitName: function (maDonVi) {
              return $http.get(rootUrl + '/api/Md/UnitUser/GetUnitName/' + maDonVi);
          },
          getCustomerName: function (maHang) {
              return $http.get(rootUrl + '/api/Md/Merchandise/GetByCode/' + maHang);
          },
          getCurrentUser: function (callback) {
              $http.get(rootUrl + '/api/Authorize/User/GetCurrentUser').success(callback);
          },
          writeDataToExcel: function (data, callback) {
              $http.post(serviceUrl + '/WriteDataToExcel', data).success(callback);
          },
          exportReportToExcel: function (data, callback) {
              $http.post(serviceUrl + '/ExportReportToExcel', data).success(callback);
          },
          getDetailByCode: function (code) {
              return $http.get(rootUrl + '/api/Md/Merchandise/GetDetailByCode/' + code);
          },
          getByCode: function (code) {
              return $http.get(rootUrl + '/api/Md/Merchandise/GetByCode/' + code);
          },
          getDetailInTem: function (code) {
              return $http.get(rootUrl + '/api/Md/Merchandise/GetDetailInTem/' + code);
          },
          getInfoItemDetails: function (id, callback) {
              $http.get(serviceUrl + '/GetInfoItemDetails/' + id).success(callback);
          },
          deleteItem: function (params) {
              return $http.delete(serviceUrl + '/' + params.id, params);
          },
      };
      return result;

  }
    ])

var NhapHangMuaController = nvModule.controller('phieuNhapHangMuaController', [
    '$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
    'phieuNhapHangMuaService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'serviceNhapHangAndMerchandise', '$mdDialog', 'authorizeService',
    function(
        $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
        phieuNhapHangMuaService, configService, clientService, nvService, mdService, blockUI, serviceNhapHangAndMerchandise, $mdDialog, authorizeService
    ) {
        $scope.config = nvService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        $scope.permission = authorizeService.permissionModel.permission;

        $scope.isEditable = true;
        $scope.setPage = function(pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.doSearch = function() {
            $scope.paged.currentPage = 1;
            filterData();
        };
        $scope.pageChanged = function() {
            filterData();
        };

        $scope.goHome = function() {
            $state.go('home');
        };
        $scope.refresh = function() {
            $scope.setPage($scope.paged.currentPage);
        };
        $scope.title = function() {
            return 'Phiếu nhập hàng mua';
        };
        $scope.displayHelper = function(code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "Empty!";
        }
        $scope.formatLabel = function(model, module, displayModel) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                displayModel = data[0].text;
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.create = function() {

            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvNhapHangMua', 'add'),
                controller: 'phieuNhapHangMuaCreateController',
                windowClass: 'app-modal-window',
                //size: 'lg',
                resolve: {}

            });

            modalInstance.result.then(function(updatedData) {
                serviceNhapHangAndMerchandise.getSelectData().clear();
                $scope.refresh();
            }, function() {
                serviceNhapHangAndMerchandise.getSelectData().clear();
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.details = function(target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvNhapHangMua', 'details'),
                controller: 'phieuNhapHangMuaDetailsController',
                windowClass: 'app-modal-window',
                //size: 'lg',
                resolve: {
                    targetData: function() {
                        return target;
                    }
                }
            });
            modalInstance.result.then(function(updatedData) {
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.printITem = function(target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvNhapHangMua', 'printItem'),
                controller: 'phieuNhapHangMuaExportItemController',
                windowClass: 'app-modal-window',
                resolve: {
                    targetData: function() {
                        return target;
                    }
                }
            });
            modalInstance.result.then(function(updatedData) {
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.tranferFrom = function(item) {
            var modalInstance = $uibModal.open({
                templateUrl: nvService.buildUrl('nvPhieuDieuChuyenNoiBo', 'add'),
                controller: 'phieuDieuChuyenNoiBoCreateController',
                windowClass: 'app-modal-window',
                resolve: {
                    objectFilter: function() {
                        return {
                            maChungTu: item.maChungTu,
                            maKhoXuat: item.maKhoNhap
                        };
                    }
                }
            });

            modalInstance.result.then(function(updatedData) {
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.sum = function() {
            var total = 0;
            if ($scope.data) {
                angular.forEach($scope.data, function(v, k) {
                    total = total + v.thanhTienSauVat;
                });
            }
            return total;
        }
        $scope.update = function(target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvNhapHangMua', 'update'),
                controller: 'phieuNhapHangMuaEditController',
                windowClass: 'app-modal-window',
                //size:'lg',
                resolve: {
                    targetData: function() {
                        return target;
                    }
                }
            });
            modalInstance.result.then(function(updatedData) {
                serviceNhapHangAndMerchandise.getSelectData().clear();
                $scope.refresh();
            }, function() {
                serviceNhapHangAndMerchandise.getSelectData().clear();
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.print = function() {
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            console.log('Print', postdata);
            phieuNhapHangMuaService.setParameterPrint(
                postdata);
            $state.go("nvPrintPhieuNhapMua");
        }
        $scope.printDetail = function() {

            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            phieuNhapHangMuaService.setParameterPrint(
                postdata);
            $state.go("nvPrintDetailPhieuNhapHangMua");
        }

        //delete
        $scope.deleteItem = function(ev, item) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Cảnh báo')
                .textContent('Dữ liệu có thể liên kết với các dữ liệu khác, bạn có chắc muốn xóa?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                phieuNhapHangMuaService.deleteItem(item).then(function(data) {
                    console.log(data);
                }).then(function(data) {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Thông báo')
                            .textContent('Xóa thành công')
                            .ariaLabel('Alert')
                            .ok('Ok')
                            .targetEvent(ev))
                        .finally(function() {
                            //  $scope.tempData.update('khoanMucs');
                            filterData();
                        });
                });

            }, function() {
                console.log('Không xóa');
            });
        };

        filterData();

        function filterData() {
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            phieuNhapHangMuaService.postQuery(
                JSON.stringify(postdata),
                function(response) {

                    $scope.isLoading = false;
                    if (response.status) {
                        $scope.data = response.data.data;
                        angular.extend($scope.paged, response.data);
                    }
                });
        };
    }
]);
nvModule.controller('phieuNhapHangMuaDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuNhapHangMuaService', 'targetData', 'clientService', 'configService', '$filter',
function ($scope, $uibModalInstance,
    mdService, phieuNhapHangMuaService, targetData, clientService, configService, $filter) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Phiếu nhập hàng mua';
    };
    fillterData();
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };
    $scope.approval = function () {
        phieuNhapHangMuaService.postApproval($scope.target, function (response) {
            if (response) {

                alert("Duyệt thành công!");
                $uibModalInstance.close($scope.target);
                $scope.goIndex = function () {
                    $state.go('nvNhapHangMua');
                };

            }
            else { alert("Thất bại! - Xảy ra lỗi hoặc phiếu này đã duyệt"); }
        });
    };

    function fillterData() {
        $scope.isLoading = true;
        phieuNhapHangMuaService.getDetails($scope.target.id, function (response) {
            console.log(response);
            if (response.status) {
                $scope.target = response.data;
            }
            $scope.isLoading = false;
            $scope.pageChanged();
        });
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
                $scope.target.dataDetails[i].thanhTienVAT = $scope.target.dataDetails[i].thanhTien * (1 + $scope.target.dataDetails[i].tyLeVatVao / 100);
                $scope.target.dataDetails[i].giaMuaCoVat = $scope.target.dataDetails[i].giaMua * (1 + $scope.target.dataDetails[i].tyLeVatVao / 100);
                $scope.data.push($scope.target.dataDetails[i]);
            }
        }
    }

}
]);
nvModule.controller('phieuNhapHangMuaCreateController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'phieuNhapHangMuaService', 'mdService', 'configService', 'serviceNhapHangAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, phieuNhapHangMuaService, mdService, configService, serviceNhapHangAndMerchandise, focus) {
        $scope.robot = angular.copy(phieuNhapHangMuaService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.newItem = {};
        $scope.donHangs = [];
        $scope.target = { dataDetails: [], dataClauseDetails: [] };
        $scope.tkKtKhoNhap = "";
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.tyGia = 0;
        $scope.isListItemNull = true;
        $scope.addRow = function () {
            if (!$scope.newItem.soLuong || $scope.newItem.soLuong < 1) {
                focus('soluong');
                return;
            }
            if (($scope.target.dataDetails.length != 0) && ($scope.newItem.tyLeVatVao != $scope.target.dataDetails[0].tyLeVatVao)) {
                clientService.noticeAlert("Các mặt hàng phải cùng loại VAT" + $scope.target.dataDetails[0].tyLeVatVao + "%", "danger");
                return;
            }
            if ($scope.newItem.validateCode == $scope.newItem.maHang) {
                $scope.target.dataDetails.push($scope.newItem);
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
                    updatedData.donGia = updatedData.giaMua;
                    $scope.newItem.validateCode = updatedData.maHang;
                    $scope.newItem.giaBanLe = updatedData.giaBanLe;
                    $scope.newItem.giaMuaCoVat = updatedData.giaMua * (1 + updatedData.tyLeVatVao / 100);
                    console.log($scope.newItem);
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
            return 'Phiếu nhập hàng mua';
        };
        $scope.selectedkhachHang = function (item) {
            $scope.target.maKhachHang = item.value;
            phieuNhapHangMuaService.getOrderByCustomer(item.value, function (response) {
                $scope.donHangs = response;
            });
            phieuNhapHangMuaService.getCustomer(item.id, function (response) {
                $scope.target.maSoThue = response.maSoThue;
            });
        };
        $scope.selectedDonDatHang = function (item) {
            $scope.isLoading = true;
            phieuNhapHangMuaService.getOrderById(item.id, function (response) {
                var donHang = response.data;
                $scope.target.dataDetails.clear();
                angular.forEach(donHang.dataDetails, function (v, k) {
                    $scope.target.dataDetails.push(v);
                });
                $scope.isLoading = false;
                $scope.pageChanged();

            });
        }
        $scope.selectedTkCo = function (item) {
            $scope.target.tkCo = item.value;
        };
        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuNhapHangMuaService.getMerchandiseForNvByCode(code).then(function(response) {
                        $scope.newItem = response.data;
                        $scope.newItem.donGia = $scope.newItem.giaMua;
                        $scope.newItem.validateCode = response.data.maHang;
                    }, function(error) {
                        $scope.addNewItem(code);
                    }
                );
            }
        }
        $scope.selectedTax = function (target) {
            for (var i = 0; i < $scope.tempData.taxs.length; i++) {
                var tmp = $scope.tempData.taxs[i];
                if (target.vat == tmp.value) {
                    $scope.tyGia = tmp.extendValue;
                }
            }
            //var z = $filter('filter')($scope.tempData.taxs, { value: item.value }, true);

            //console.log(item);
            //$scope.tyGia = z[0].extendValue;
        };


        $scope.selectedKhoNhap = function (item) {
            $scope.target.maKhoNhap = item.value;
            phieuNhapHangMuaService.getWareHouse(item.id, function (response) {
                $scope.tkKtKhoNhap = response.taiKhoanKt;
            });
        }
        $scope.selectedMaBaoBi = function (model, item) {
            if (!model.soLuongBao) {
                model.soLuongBao = 0;
            }
            if (!model.donGia) {
                model.donGia = 0;
            }
            if (!model.soLuongLe) {
                model.soLuongLe = 0;
            }
            model.luongBao = parseFloat(item.extendValue);
            model.soLuong = model.soLuongBao * model.luongBao + model.soLuongLe;
            model.thanhTien = model.soLuong * model.donGia;
        }


        $scope.save = function () {
            $scope.Loading = true;
            phieuNhapHangMuaService.post(
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
        $scope.saveAndKeep = function () {
            var tempData = angular.copy($scope.target);
            phieuNhapHangMuaService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        $scope.target.dataDetails.clear();
                        $scope.isListItemNull = true;
                        phieuNhapHangMuaService.getNewInstance(function (response1) {
                            var expectData = response1;
                            tempData.maChungTu = expectData.maChungTu;
                            tempData.ngay = expectData.ngay;
                            $scope.target = tempData;
                        })
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }

                }
                );
        };

        $scope.saveAndPrint = function () {
            phieuNhapHangMuaService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        var url = $state.href('reportPhieuNhapHangMua', { id: response.data.id });
                        window.open(url, 'Report Viewer');
                        $scope.target.dataDetails.clear();
                        $scope.isListItemNull = true;
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        }
        function filterData() {
            $scope.isLoading = true;
            phieuNhapHangMuaService.getNewInstance(function(response) {

                $scope.target = response;
                $scope.target.dataDetails = serviceNhapHangAndMerchandise.getSelectData();
                $scope.pageChanged();
                $scope.isLoading = false;

                $scope.$watch('target.vat', function(v, k) {
                    if (!v) {
                        $scope.target.tienVat = 0;

                    } else {
                        $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                    }

                    $scope.target.thanhTienSauVat = $scope.target.thanhTienTruocVat + $scope.target.tienVat - $scope.target.tienChietKhau;
                });
                $scope.$watch('target.tienChietKhau', function(v, k) {
                    $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                    $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                    $scope.target.thanhTienSauVat = $scope.target.thanhTienTruocVat + $scope.target.tienVat - $scope.target.tienChietKhau;
                });
                $scope.$watch("target.dataDetails", function(newValue, oldValue) {
                    if (!$scope.target.tienChietKhau) {
                        $scope.target.tienChietKhau = 0;
                    }
                    $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                    $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                    $scope.target.thanhTienSauVat = $scope.target.thanhTienTruocVat + $scope.target.tienVat - $scope.target.tienChietKhau;
                }, true);
            });
            phieuNhapHangMuaService.getOrder(function (response) {
                $scope.donHangs = response;
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
        $scope.createPackage = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdPackaging', 'add'),
                controller: 'packagingCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('packagings', function () {
                    if (target && name) {
                        target[name] = updatedData.maBaoBi;
                        target.luongBao = updatedData.soLuong;
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
                    $scope.data.push($scope.target.dataDetails[i])
                }
            }
        }
    }
]);
nvModule.controller('phieuNhapHangMuaEditController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'phieuNhapHangMuaService', 'mdService', 'targetData', 'configService', 'serviceNhapHangAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, phieuNhapHangMuaService, mdService, targetData, configService, serviceNhapHangAndMerchandise, focus) {
        $scope.robot = angular.copy(phieuNhapHangMuaService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.newItem = {};
        $scope.tkKtKhoNhap = "";
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.tyGia = 0;
        $scope.addRow = function () {
            if (!$scope.newItem.soLuong || $scope.newItem.soLuong < 1) {
                focus('soluong');
                return;
            }
            if (($scope.target.dataDetails.length != 0) && ($scope.newItem.tyLeVatVao != $scope.target.dataDetails[0].tyLeVatVao)) {
                clientService.noticeAlert("Các mặt hàng phải cùng loại VAT" + $scope.target.dataDetails[0].tyLeVatVao + "%", "danger");
                return;
            }
            if ($scope.newItem.validateCode == $scope.newItem.maHang) {
                $scope.target.dataDetails.push($scope.newItem);
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
                    updatedData.donGia = updatedData.giaMua;
                    $scope.newItem = updatedData;
                    $scope.newItem.validateCode = updatedData.maHang;
                    $scope.newItem.giaMuaCoVat = updatedData.giaMua * (1 + updatedData.tyLeVatVao / 100);
                }
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
            return 'Phiếu nhập hàng mua';
        };

        $scope.selectedkhachHang = function (item) {
            $scope.target.maKhachHang = item.value;
            phieuNhapHangMuaService.getCustomer(item.id, function (response) {
                $scope.target.maSoThue = response.maSoThue;
            });
        };
        $scope.selectedkhachHang = function (item) {
            $scope.target.maKhachHang = item.value;
            phieuNhapHangMuaService.getOrderByCustomer(item.value, function (response) {
                $scope.donHangs = response;
            });
            phieuNhapHangMuaService.getCustomer(item.id, function (response) {
                $scope.target.maSoThue = response.maSoThue;
            });
        };
        $scope.selectedTkCo = function (item) {
            $scope.target.tkCo = item.value;
        };
        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuNhapHangMuaService.getMerchandiseForNvByCode(code).then(function(response) {
                        $scope.newItem = response.data;
                        $scope.newItem.donGia = $scope.newItem.giaMua;
                        $scope.newItem.validateCode = response.data.maHang;
                    }, function(error) {
                        $scope.addNewItem(code);
                    }
                );
            }
        }
        $scope.selectedTax = function (target) {
            var z = $filter('filter')($scope.tempData.taxs, { value: target.vat }, true);
            $scope.tyGia = z[0].extendValue;
            //$scope.selectedTax = function (target) {
            //    for (var i = 0; i < $scope.tempData.taxs.length; i++) {
            //        var tmp = $scope.tempData.taxs[i];
            //        if (target.vat == tmp.value) {
            //            $scope.tyGia = tmp.extendValue;
            //        }

            //var z = $filter('filter')($scope.tempData.taxs, { value: item.value }, true);

            //console.log(item);
            //$scope.tyGia = z[0].extendValue;

        };


        $scope.save = function () {
            phieuNhapHangMuaService.updateCT($scope.target).then(
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
        $scope.saveAndPrint = function () {
            phieuNhapHangMuaService.updateCT($scope.target).then(
                    function (response) {
                        if (response.data.status) {
                            clientService.noticeAlert("Thành công", "success");
                            console.log('Update Successfully!');
                            var url = $state.href('reportPhieuNhapHangMua', { id: response.data.data.id });
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
            phieuNhapHangMuaService.getDetails($scope.target.id, function (response) {
                if (response.data.id) {
                    $scope.target = response.data;
                    serviceNhapHangAndMerchandise.setSelectData($scope.target.dataDetails);
                    $scope.pageChanged();
                    var z = $filter('filter')($scope.tempData.taxs, { value: $scope.target.vat }, true);
                    $scope.tyGia = z[0].extendValue;
                    $scope.$watch('target.vat', function (newValue, oldValue) {
                        if (!newValue) {
                            $scope.target.tienVat = 0;

                        } else {
                            $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                        }
                        $scope.target.thanhTienSauVat = $scope.target.thanhTienTruocVat + $scope.target.tienVat - $scope.target.tienChietKhau;
                    });
                    $scope.$watch('target.tienChietKhau', function (newValue, oldValue) {
                        $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                        $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                        $scope.target.thanhTienSauVat = $scope.target.thanhTienTruocVat + $scope.target.tienVat - $scope.target.tienChietKhau;
                    });
                    $scope.$watch("target.dataDetails", function (newValue, oldValue) {
                        if (!$scope.target.tienChietKhau) {
                            $scope.target.tienChietKhau = 0;
                        }
                        $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                        $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                        $scope.target.thanhTienSauVat = $scope.target.thanhTienTruocVat + $scope.target.tienVat - $scope.target.tienChietKhau;
                    }, true);
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
        $scope.createPackage = function (target, name) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdPackaging', 'add'),
                controller: 'packagingCreateController',
                resolve: {}
            });

            modalInstance.result.then(function (updatedData) {
                $scope.tempData.update('packagings', function () {
                    if (target && name) {
                        target[name] = updatedData.maBaoBi;
                        target.luongBao = updatedData.soLuong;
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
                    $scope.data.push($scope.target.dataDetails[i])
                }
            }
        }
    }
]);
nvModule.controller('reportPhieuNhapHangMuaController', [
    '$scope', '$filter', '$window', '$stateParams', '$timeout', '$state',
    'mdService', 'phieuNhapHangMuaService', 'clientService',
    function ($scope, $filter, $window, $stateParams, $timeout, $state,
        mdService, phieuNhapHangMuaService, clientService) {
        $scope.robot = angular.copy(phieuNhapHangMuaService.robot);
        var id = $stateParams.id;
        $scope.target = {};
        $scope.goIndex = function () {
            $state.go('nvNhapHangMua');
        }

        function filterData() {
            if (id) {
                phieuNhapHangMuaService.getReport(id, function (response) {
                    console.log(response);
                    if (response.status) {
                        $scope.target = response.data;
                    }
                });
                phieuNhapHangMuaService.getCurrentUser(function (response) {
                    //console.log(response);
                    $scope.currentUser = response.username;
                    //	console.log($scope.target);

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
            $state.go("nvNhapHangMua");
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
        $scope.printExcel = function () {
            var data = [document.getElementById('main-report').innerHTML];
            var fileName = "NhapHangMua_ExportData.xls";
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
        filterData();
    }
]);
nvModule.controller('printPhieuNhapHangMuaController', ['$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
'mdService', 'phieuNhapHangMuaService', 'clientService',
function ($scope, $state, $window, $stateParams, $timeout, $filter,
mdService, phieuNhapHangMuaService, clientService) {
    $scope.robot = angular.copy(phieuNhapHangMuaService.robot);
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return "Empty!";
    }
    function filterData() {
        phieuNhapHangMuaService.postPrint(
            function (response) {
                $scope.printData = response;
            });
    };
    $scope.info = phieuNhapHangMuaService.getParameterPrint().filtered.advanceData;
    $scope.goIndex = function () {
        $state.go("nvNhapHangMua");
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
            })
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
}])
nvModule.controller('printDetailPhieuNhapHangMuaController', [
    '$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
    'mdService', 'phieuNhapHangMuaService', 'clientService',
    function ($scope, $state, $window, $stateParams, $timeout, $filter,
        mdService, phieuNhapHangMuaService, clientService) {
        $scope.robot = angular.copy(phieuNhapHangMuaService.robot);
        $scope.displayHelper = function (code, module) {
            var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
            if (data && data.length == 1) {
                return data[0].text;
            };
            return "Empty!";
        }
        $scope.info = phieuNhapHangMuaService.getParameterPrint().filtered.advanceData;
        $scope.goIndex = function () {
            $state.go("nvNhapHangMua");
        }

        function filterData() {
            phieuNhapHangMuaService.postPrintDetail(
                function (response) {
                    $scope.printData = response;
                });
        }

        $scope.sum = function () {
            var total = 0;
            if ($scope.printData) {
                angular.forEach($scope.printData, function (v, k) {
                    total = total + v.thanhTienSauVat;
                })
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
nvModule.controller('phieuNhapHangMuaExportItemController', [
    '$scope', '$filter', '$window', '$stateParams', '$timeout', '$state',
    'mdService', 'phieuNhapHangMuaService', 'clientService', '$uibModalInstance', 'targetData', 'Excel', 'configService', '$location',
    function ($scope, $filter, $window, $stateParams, $timeout, $state,
        mdService, phieuNhapHangMuaService, clientService, $uibModalInstance, targetData, Excel, configService, $location) {
        $scope.config = mdService.config;
        $scope.title = function () {
            return 'Danh sách hàng nhập';
        };
        $scope.lstMerchandise = [];
        $scope.dataHangHoa = {};
        $scope.hrefTem = configService.apiServiceBaseUri + "/Upload/Barcode/Barcode.xls";

        $scope.target = targetData;
        $scope.maChungTuPk = targetData.maChungTuPk;
        var index = $scope.maChungTuPk.indexOf('.');
        $scope.maDonVi = $scope.maChungTuPk.substr(0, index);
        phieuNhapHangMuaService.getUnitName($scope.maDonVi).then(function (response) {
            $scope.tenDonVi = response.data;
        });
        phieuNhapHangMuaService.getInfoItemDetails($scope.target.id, function (response) {
            console.log(response);
            if (response.status) {
                $scope.dataHangHoa = response.data;
                $scope.lstMerchandise = response.data.dataDetails;
            }
            $scope.isLoading = false;

        });


        $scope.exportToExcel = function () {
            phieuNhapHangMuaService.writeDataToExcel($scope.dataHangHoa, function (response) {
                if (response.status) {
                    clientService.noticeAlert("Thành công", "success");
                    //  $uibModalInstance.close($scope.target);
                }
                else {
                    clientService.noticeAlert("Thành công", "success");

                }

            });
        }


        $scope.goIndex = function () {
            $state.go('nvNhapHangMua');
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);