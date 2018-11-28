nvModule.factory('phieuXuatBanService',
    ['$resource', '$http', '$window', 'configService', 'clientService',
  function ($resource, $http, $window, configService, clientService) {
      var rootUrl = configService.apiServiceBaseUri;
      this.parameterPrint = {};
      function getParameterPrint() {
          return this.parameterPrint;
      }
      var serviceUrl = rootUrl + '/api/Nv/XuatBan';

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
          changeChietKhau: function (target) {
              if (!target.thanhTienTruocVat) {
                  target.thanhTienTruocVat = 0;
              }
              if (!target.chietKhau) {
                  target.chietKhau = 0;
              }
              target.tienChietKhau = (target.thanhTienTruocVat * target.chietKhau) / 100;
          },
          changeTienChietKhau: function (target) {
              target.chietKhau = 100 * (target.tienChietKhau / target.thanhTienTruocVat);
          },
          changeSoLuongBao: function (item) {
              if (!item.soLuongLe) {
                  item.soLuongLe = 0;
              }
              if (!item.maBaoBi) {
                  item.luongBao = 1;
              }
              if (!item.giamGia) {
                  item.giamGia = 0;
              }
              item.soLuong = item.soLuongBao * item.luongBao + item.soLuongLe;
              item.tienTruocGiamGia = item.soLuong * item.donGia;
              item.tienGiamGia = item.soLuong * item.giamGia;
              item.thanhTien = item.soLuong * item.donGia - item.tienGiamGia;
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
              if (!item.giamGia) {
                  item.giamGia = 0;
              }
              item.soLuong = item.soLuongBao * item.luongBao + item.soLuongLe;
              item.tienTruocGiamGia = item.soLuong * item.donGia;
              item.tienGiamGia = item.soLuong * item.giamGia;
              item.thanhTien = item.soLuong * item.donGia - item.tienGiamGia;
          },
          changeDonGia: function (item) {
              if (!item.soLuong) {
                  item.soLuong = 0;
              }
              if (!item.giamGia) {
                  item.giamGia = 0;
              }
              item.tienTruocGiamGia = item.soLuong * item.donGia;
              item.tienGiamGia = item.soLuong * item.giamGia;
              item.thanhTien = item.soLuong * item.donGia - item.tienGiamGia;
          },
          changeGiamGia: function (item) {
              if (!item.soLuong) {
                  item.soLuong = 0;
              }
              if (!item.donGia) {
                  item.donGia = 0;
              }
              item.tienGiamGia = item.soLuong * item.giamGia;
              item.thanhTien = item.soLuong * item.donGia - item.tienGiamGia;
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
          postApproval: function (id, callback) {
              $http.post(serviceUrl + '/PostApproval', id).success(callback);
          },
          update: function (params) {
              return $http.put(serviceUrl + '/' + params.id, params);
          },
          getMerchandiseForNvByCode: function (code) {
              return $http.get(rootUrl + '/api/Md/Merchandise/GetForNvByCode/' + code);
          },
          deleteItem: function (params) {
              return $http.delete(serviceUrl + '/' + params.id, params);
          }
      };
      return result;
  }]);

nvModule.controller('phieuXuatBanController', [
'$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
'phieuXuatBanService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'serviceXuatBanAndMerchandise', '$mdDialog', 'authorizeService',
function (
    $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
phieuXuatBanService, configService, clientService, nvService, mdService, blockUI, serviceXuatBanAndMerchandise, $mdDialog, authorizeService
    ) {
    $scope.config = nvService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.permission = authorizeService.permissionModel.permission;

    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'ngayCT'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function () {
        $scope.paged.currentPage = 1;
        filterData();
    };
    $scope.pageChanged = function () {
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
            phieuXuatBanService.deleteItem(item).then(function (data) {
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


    $scope.sum = function () {
        var total = 0;
        if ($scope.data) {
            angular.forEach($scope.data, function (v, k) {
                total = total + v.thanhTienSauVat;
            })
        }
        return total;
    };
    $scope.print = function () {
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        phieuXuatBanService.setParameterPrint(
            postdata);
        $state.go("nvPrintPhieuXuatBan");
    }
    $scope.printDetail = function () {
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        phieuXuatBanService.setParameterPrint(
            postdata);
        $state.go("nvPrintDetailPhieuXuatBan");
    }
    $scope.goHome = function () {
        $state.go('home');
    };
    $scope.refresh = function () {
        $scope.setPage($scope.paged.currentPage);
    };
    $scope.title = function () {
        return 'Xuất bán';
    };
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    }
    $scope.formatLabel = function (model, module, displayModel) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            displayModel = data[0].text;
            return data[0].text;
        }
        return "Empty!";
    };
    $scope.create = function () {

        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvXuatBan', 'add'),
            controller: 'phieuXuatBanCreateController',
            windowClass: 'app-modal-window',
            resolve: {}

        });

        modalInstance.result.then(function (updatedData) {
            serviceXuatBanAndMerchandise.getSelectData().clear();
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvXuatBan', 'update'),
            controller: 'phieuXuatBanEditController',
            windowClass: 'app-modal-window',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            serviceXuatBanAndMerchandise.getSelectData().clear();
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.details = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvXuatBan', 'details'),
            controller: 'phieuXuatBanDetailsController',
            windowClass: 'app-modal-window',
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
        phieuXuatBanService.postQuery(
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
}])
nvModule.controller('phieuXuatBanDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuXuatBanService', 'targetData', 'clientService', '$filter', 'configService',
function ($scope, $uibModalInstance,
    mdService, phieuXuatBanService, targetData, clientService, $filter, configService) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Xuất bán';
    };
    fillterData();
    $scope.isDisable = true;

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
    $scope.approval = function () {
        phieuXuatBanService.postApproval($scope.target, function (response) {
            if (response) {
                alert("Duyệt thành công!");
                fillterData();
            }
            else { alert("Thất bại! - Xảy ra lỗi hoặc phiếu này đã duyệt"); }
        });
    };

    function fillterData() {
        $scope.isLoading = true;
        phieuXuatBanService.getDetails($scope.target.id, function (response) {
            if (response.status) {
                $scope.target = response.data;
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
nvModule.controller('phieuXuatBanCreateController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'phieuXuatBanService', 'mdService', 'configService', 'serviceXuatBanAndMerchandise', 'focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, phieuXuatBanService, mdService, configService, serviceXuatBanAndMerchandise, focus) {
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.robot = angular.copy(phieuXuatBanService.robot);
        $scope.tempData = mdService.tempData;
        $scope.target = { dataDetails: [], dataClauseDetails: [] };
        $scope.tkKtKhoXuat = "";
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.target.tienChietKhau = 0;
        $scope.target.tongTienGiamGia = 0;
        $scope.target.thanhTienTruocVat = 0;
        $scope.target.thanhTienTruocVatSauCK = 0;
        $scope.target.tienVat = 0;
        $scope.target.thanhTienSauVat = 0;
        $scope.tyGia = 0;
        $scope.newItem = {};
        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };
        $scope.addRow = function () {
            console.log('ra roi');
            if (!$scope.newItem.soLuong || $scope.newItem.soLuong < 1) {
                focus('soluong');
                return;
            }
            if ($scope.newItem.validateCode == $scope.newItem.maHang) {
                $scope.target.dataDetails.push($scope.newItem);
            }
            $scope.pageChanged();
            $scope.newItem = {};
            focus('mahang');
        };
        $scope.isDisable = false;
        $scope.addNewItem = function (strKey) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
                controller: 'merchandiseSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return serviceXuatBanAndMerchandise;
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
                    updatedData.donGia = updatedData.giaBanLe;

                    $scope.newItem = updatedData;
                    $scope.newItem.validateCode = updatedData.maHang;
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
            $scope.pageChanged();
        }


        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuXuatBanService.getMerchandiseForNvByCode(code).then(function (response) {

                    $scope.newItem = response.data;
                }, function (error) {
                    $scope.addNewItem(code);
                }
                )
            }
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

        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $uibModalInstance.dismiss('cancel');
        };

        $scope.title = function () {
            return 'Xuất bán';
        };

        $scope.save = function () {
            phieuXuatBanService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        };
        $scope.saveAndKeep = function () {
            var tempData = angular.copy($scope.target);
            phieuXuatBanService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        $scope.target.dataDetails.clear();
                        clientService.noticeAlert("Thành công", "success");
                        phieuXuatBanService.getNewInstance(function (response) {
                            var expectData = response;
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
            phieuXuatBanService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        $scope.target.dataDetails.clear();
                        clientService.noticeAlert("Thành công", "success");
                        var url = $state.href('reportphieuXuatBan', { id: response.id });
                        window.open(url, 'Report Viewer');
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
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
        $scope.selectedkhachHang = function (item) {
            $scope.target.maKhachHang = item.value;
            phieuXuatBanService.getCustomer(item.id, function (response) {
                $scope.target.maSoThue = response.maSoThue;
            });
        };
        $scope.selectedTax = function (target, item) {
            target.vat = item.value;
            var z = $filter('filter')($scope.tempData.taxs, { value: item.value }, true);
            $scope.tyGia = parseFloat(z[0].extendValue);
        };
        $scope.selectedKhoXuat = function (item) {
            $scope.target.maKhoXuat = item.value;
        }

        function filterData() {
            phieuXuatBanService.getNewInstance(function (response) {
                $scope.target = response;
                $scope.target.dataDetails = serviceXuatBanAndMerchandise.getSelectData();
                $scope.pageChanged();

                $scope.$watch("target.dataDetails", function (newValue, oldValue) {
                    $scope.target.tongTienGiamGia = $scope.robot.sum($scope.target.dataDetails, 'tienGiamGia');
                    $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                    $scope.target.thanhTienTruocVatSauCK = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') - $scope.target.tongTienGiamGia - $scope.target.tienChietKhau;
                    $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                    $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') + $scope.target.tienVat - $scope.target.tienChietKhau - $scope.target.tongTienGiamGia;
                }, true);
                $scope.$watch('target.vat', function (newValue, oldValue) {
                    if (!newValue) {
                        $scope.target.tienVat = 0;

                    } else {
                        $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                    }
                    $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') + $scope.target.tienVat - $scope.target.tienChietKhau - $scope.target.tongTienGiamGia;
                });
                $scope.$watch('target.tienChietKhau', function (newValue, oldValue) {
                    $scope.target.thanhTienTruocVatSauCK = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') - $scope.target.tongTienGiamGia - $scope.target.tienChietKhau;
                    $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                    $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') + $scope.target.tienVat - $scope.target.tienChietKhau - $scope.target.tongTienGiamGia;
                });
            })
        };
        filterData();
    }
]);
nvModule.controller('phieuXuatBanEditController', [
    '$scope', '$uibModalInstance', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'phieuXuatBanService', 'mdService', 'targetData', 'clientService', 'configService', 'serviceXuatBanAndMerchandise','focus',
    function ($scope, $uibModalInstance, $filter, $state, $uibModal, $log,
        nvService, phieuXuatBanService, mdService, targetData, clientService, configService, serviceXuatBanAndMerchandise, focus) {
        $scope.robot = angular.copy(phieuXuatBanService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.tkKtKhoXuat = "";
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.tyGia = 0;
        $scope.newItem = {};

        $scope.addRow = function () {
            if (!$scope.newItem.soLuong || $scope.newItem.soLuong < 1) {
                focus('soluong');
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
                        return serviceXuatBanAndMerchandise;
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
                    updatedData.donGia = updatedData.giaBanLe;

                    $scope.newItem = updatedData;
                    $scope.newItem.validateCode = updatedData.maHang;
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
            $scope.pageChanged();
        }
        $scope.nameCurrency = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
        };
        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuXuatBanService.getMerchandiseForNvByCode(code).then(function (response) {

                    $scope.newItem = response.data;
                }, function () {
                    $scope.addNewItem(code);
                }
                )
            }
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


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            return 'Xuất bán';
        };

        $scope.save = function () {
            phieuXuatBanService.update($scope.target).then(
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
        $scope.selectedkhachHang = function (item) {
            $scope.target.maKhachHang = item.value;
            phieuXuatBanService.getCustomer(item.id, function (response) {
                $scope.target.maSoThue = response.maSoThue;
            });
        };
        $scope.selectedTax = function (target, item) {
            target.vat = item.value;
            var z = $filter('filter')($scope.tempData.taxs, { value: item.value }, true);
            $scope.tyGia = parseFloat(z[0].extendValue);
        };
        $scope.selectedKhoXuat = function (item) {
            $scope.target.maKhoXuat = item.value;
        }
        function filterData() {
            phieuXuatBanService.getDetails($scope.target.id, function (response) {
                if (response.status) {
                    $scope.target = response.data;
                    serviceXuatBanAndMerchandise.setSelectData($scope.target.dataDetails);
                    $scope.pageChanged();

                    $scope.$watch("target.dataDetails", function (newValue, oldValue) {
                        $scope.target.tongTienGiamGia = $scope.robot.sum($scope.target.dataDetails, 'tienGiamGia');
                        $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                        $scope.target.thanhTienTruocVatSauCK = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') - $scope.target.tongTienGiamGia - $scope.target.tienChietKhau;
                        $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                        $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') + $scope.target.tienVat - $scope.target.tienChietKhau - $scope.target.tongTienGiamGia;
                    }, true);
                    $scope.$watch('target.vat', function (newValue, oldValue) {
                        if (!newValue) {
                            $scope.target.tienVat = 0;

                        } else {
                            $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                        }
                        $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') + $scope.target.tienVat - $scope.target.tienChietKhau - $scope.target.tongTienGiamGia;
                    });
                    $scope.$watch('target.tienChietKhau', function (newValue, oldValue) {
                        $scope.target.thanhTienTruocVatSauCK = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') - $scope.target.tongTienGiamGia - $scope.target.tienChietKhau;
                        $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                        $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') + $scope.target.tienVat - $scope.target.tienChietKhau - $scope.target.tongTienGiamGia;
                    });
                }
            });

        };
        filterData();
    }
]);
nvModule.controller('reportPhieuXuatBanController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
'mdService', 'phieuXuatBanService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
mdService, phieuXuatBanService, clientService) {
    $scope.robot = angular.copy(phieuXuatBanService.robot);
    var id = $stateParams.id;
    $scope.target = {};
    $scope.goIndex = function () {
        $state.go('nvXuatBan');
    }
    function filterData() {
        if (id) {
            phieuXuatBanService.getReport(id, function (response) {

                if (response.status) {
                    $scope.target = response.data;
                    console.log($scope.target);
                }

            });
        }
    };
    // $scope.dateNow = new Date();

    $scope.print = function () {
        var table = document.getElementById('main-report').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
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
}])
nvModule.controller('printPhieuXuatBanController', ['$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
'mdService', 'phieuXuatBanService', 'clientService',
function ($scope, $state, $window, $stateParams, $timeout, $filter,
mdService, phieuXuatBanService, clientService) {
    $scope.robot = angular.copy(phieuXuatBanService.robot);
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return "Empty!";
    }
    function filterData() {
        phieuXuatBanService.postPrint(
            function (response) {
                $scope.printData = response;
            });
    };
    $scope.info = phieuXuatBanService.getParameterPrint().filtered.advanceData;
    $scope.goIndex = function () {
        $state.go("nvXuatBan");
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
nvModule.controller('printDetailPhieuXuatBanController', ['$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
'mdService', 'phieuXuatBanService', 'clientService',
function ($scope, $state, $window, $stateParams, $timeout, $filter,
mdService, phieuXuatBanService, clientService) {
    $scope.robot = angular.copy(phieuXuatBanService.robot);
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return "Empty!";
    }
    $scope.info = phieuXuatBanService.getParameterPrint().filtered.advanceData;
    $scope.goIndex = function () {
        $state.go("nvXuatBan");
    }
    function filterData() {
        phieuXuatBanService.postPrintDetail(
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
}])