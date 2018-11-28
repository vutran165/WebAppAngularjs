nvModule.factory('phieuXuatKhacService',
    ['$resource', '$http', '$window', 'configService', 'clientService',
  function ($resource, $http, $window, configService, clientService) {
      var rootUrl = configService.apiServiceBaseUri;
      this.parameterPrint = {};
      function getParameterPrint() {
          return this.parameterPrint;
      }
      var serviceUrl = rootUrl + '/api/Nv/XuatKhac';

      var calc = {
          sum: function (obj, name) {
              var total = 0
              if (obj && obj.length > 0)
              {
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
              if (!target.thanhTienTruocVat)
              {
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
              if (!item.soLuong) {
                  item.soLuong = 0;
              }
              if (!item.giamGia) {
                  item.giamGia = 0;
              }
              if (!item.donGia) {
                  item.donGia = 0;
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
          getSelectDataType: function (type, callback) {
              $http.get(rootUrl + '/api/Md/TypeReason/GetSelectDataType/' + type).success(callback);
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
          },

      };
      return result;
  }]);

nvModule.controller('phieuXuatKhacController', [
'$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
'phieuXuatKhacService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'serviceXuatKhacAndMerchandise', '$mdDialog', 'authorizeService',
function (
    $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
phieuXuatKhacService, configService, clientService, nvService, mdService, blockUI, serviceXuatKhacAndMerchandise, $mdDialog, authorizeService
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
    $scope.sortType = 'maChungTu'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function () {
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
            phieuXuatKhacService.deleteItem(item).then(function (data) {
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
        phieuXuatKhacService.setParameterPrint(
            postdata);
        $state.go("nvPrintPhieuXuatKhac");
    }
    $scope.printDetail = function () {
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        phieuXuatKhacService.setParameterPrint(
            postdata);
        $state.go("nvPrintDetailPhieuXuatKhac");
    }
    $scope.goHome = function () {
        $state.go('home');
    };
    $scope.refresh = function () {
        $scope.setPage($scope.paged.currentPage);
    };
    $scope.title = function () {
        return 'Xuất khác';
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
            templateUrl: nvService.buildUrl('nvXuatKhac', 'add'),
            controller: 'phieuXuatKhacCreateController',
            windowClass: 'app-modal-window',
            resolve: {}

        });

        modalInstance.result.then(function (updatedData) {
            serviceXuatKhacAndMerchandise.getSelectData().clear();
            $scope.refresh();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvXuatKhac', 'update'),
            controller: 'phieuXuatKhacEditController',
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
            templateUrl: nvService.buildUrl('nvXuatKhac', 'details'),
            controller: 'phieuXuatKhacDetailsController',
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
        phieuXuatKhacService.postQuery(
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
nvModule.controller('phieuXuatKhacDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuXuatKhacService', 'targetData', 'clientService', '$filter', 'configService',
function ($scope, $uibModalInstance,
    mdService, phieuXuatKhacService, targetData, clientService, $filter, configService) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Xuất khác';
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
        phieuXuatKhacService.postApproval($scope.target, function (response) {
            if (response) {
                alert("Duyệt thành công!");
                fillterData();
            }
            else { alert("Thất bại! - Xảy ra lỗi hoặc phiếu này đã duyệt"); }
        });
    };

    function fillterData() {
        $scope.isLoading = true;
        phieuXuatKhacService.getDetails($scope.target.id, function (response) {
            if (response.status) {
                $scope.target = response.data;
            }
            $scope.isLoading = false;
            $scope.pageChanged();
        });
        phieuXuatKhacService.getSelectDataType('XUAT', function (response) {
            $scope.typeReasonXuats = response;
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
nvModule.controller('phieuXuatKhacCreateController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'phieuXuatKhacService', 'mdService', 'configService', 'serviceXuatKhacAndMerchandise','focus',
    function ($scope, $uibModalInstance, clientService, $filter, $state, $uibModal, $log,
        nvService, phieuXuatKhacService, mdService, configService, serviceXuatKhacAndMerchandise,focus) {
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.robot = angular.copy(phieuXuatKhacService.robot);
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
                        return serviceXuatKhacAndMerchandise;
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
                    $scope.newItem.validateCode = updatedData.maHang;
                }
                $scope.pageChanged();
            }, function () {
            });
        }
        $scope.removeItem = function(index)
        {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            currentPageIndex = (currentPage - 1) * itemsPerPage + index;
            $scope.target.dataDetails.splice(currentPageIndex, 1);
            $scope.pageChanged();
        }
        
        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuXuatKhacService.getMerchandiseForNvByCode(code).then(function (response) {

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
            $scope.target.dataDetails.clear();
            $uibModalInstance.dismiss('cancel');
        };

        $scope.title = function () {
            return 'Xuất khác';
        };

        $scope.save = function () {
            phieuXuatKhacService.post(
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
            phieuXuatKhacService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        $scope.target.dataDetails.clear();
                        clientService.noticeAlert("Thành công", "success");
                        phieuXuatKhacService.getNewInstance(function (response) {
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
            phieuXuatKhacService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        $scope.target.dataDetails.clear();
                        clientService.noticeAlert("Thành công", "success");
                        var url = $state.href('reportphieuXuatKhac', { id: response.id });
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
            phieuXuatKhacService.getCustomer(item.id, function (response) {
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
            phieuXuatKhacService.getNewInstance(function (response) {
                $scope.target = response;
                $scope.target.dataDetails = serviceXuatKhacAndMerchandise.getSelectData();
                $scope.pageChanged();

                $scope.$watch("target.dataDetails", function (newValue, oldValue) {
                    $scope.target.tongTienGiamGia = $scope.robot.sum($scope.target.dataDetails, 'tienGiamGia');
                    $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                    $scope.target.thanhTienTruocVatSauCK = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') - $scope.target.tongTienGiamGia - $scope.target.tienChietKhau;
                    $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                    $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') + $scope.target.tienVat - $scope.target.tienChietKhau - $scope.target.tongTienGiamGia;
                }, true);
                $scope.$watch('target.vat', function (v, k) {
                    $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                    $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') + $scope.target.tienVat - $scope.target.tienChietKhau - $scope.target.tongTienGiamGia;
                });
                $scope.$watch('target.tienChietKhau', function (v, k) {
                    $scope.target.thanhTienTruocVatSauCK = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') - $scope.target.tongTienGiamGia - $scope.target.tienChietKhau;
                    $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                    $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') + $scope.target.tienVat - $scope.target.tienChietKhau - $scope.target.tongTienGiamGia;
                });
            })
            phieuXuatKhacService.getSelectDataType('XUAT', function (response) {
                $scope.typeReasonXuats = response;
            });
        };
        filterData();
    }
]);
nvModule.controller('phieuXuatKhacEditController', [
    '$scope', '$uibModalInstance', '$filter', '$state', '$uibModal', '$log',
    'nvService', 'phieuXuatKhacService', 'mdService', 'targetData','clientService', 'configService', 'serviceXuatKhacAndMerchandise','focus',
    function ($scope, $uibModalInstance,$filter, $state, $uibModal, $log,
        nvService, phieuXuatKhacService, mdService, targetData,  clientService, configService, serviceXuatKhacAndMerchandise,focus) {
        $scope.robot = angular.copy(phieuXuatKhacService.robot);
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
                        return serviceXuatKhacAndMerchandise;
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
                    $scope.newItem.validateCode = updatedData.maHang;
                }
                $scope.pageChanged();
            }, function () {
            });
        }
        $scope.removeItem = function(index)
        {
            var currentPage = $scope.paged.currentPage;
            var itemsPerPage = $scope.paged.itemsPerPage;
            currentPageIndex = (currentPage - 1) * itemsPerPage + index;
            $scope.target.dataDetails.splice(currentPageIndex, 1);
            $scope.pageChanged();
        }
        
        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuXuatKhacService.getMerchandiseForNvByCode(code).then(function (response) {

                    $scope.newItem = response.data;
                }, function () {
                    $scope.addNewItem();
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
            return 'Xuất khác';
        };

        $scope.save = function () {
            //$scope.updateDetails();
            phieuXuatKhacService.update($scope.target).then(
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
            phieuXuatKhacService.getCustomer(item.id, function (response) {
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
            phieuXuatKhacService.getDetails($scope.target.id, function (response) {
                if (response.status) {
                    $scope.target = response.data;
                    serviceXuatKhacAndMerchandise.setSelectData($scope.target.dataDetails);
                    $scope.pageChanged();
                    init();

                    $scope.$watch("target.dataDetails", function (newValue, oldValue) {
                        $scope.target.tongTienGiamGia = $scope.robot.sum($scope.target.dataDetails, 'tienGiamGia');
                        $scope.target.thanhTienTruocVat = $scope.robot.sum($scope.target.dataDetails, 'thanhTien');
                        $scope.target.thanhTienTruocVatSauCK = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') - $scope.target.tongTienGiamGia - $scope.target.tienChietKhau;
                        $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                        $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') + $scope.target.tienVat - $scope.target.tienChietKhau - $scope.target.tongTienGiamGia;
                    }, true);
                    $scope.$watch('target.vat', function (v, k) {
                        $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                        $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') + $scope.target.tienVat - $scope.target.tienChietKhau - $scope.target.tongTienGiamGia;
                    });
                    $scope.$watch('target.tienChietKhau', function (v, k) {
                        $scope.target.thanhTienTruocVatSauCK = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') - $scope.target.tongTienGiamGia - $scope.target.tienChietKhau;
                        $scope.target.tienVat = $scope.robot.sumVat($scope.tyGia, $scope.target);
                        $scope.target.thanhTienSauVat = $scope.robot.sum($scope.target.dataDetails, 'tienTruocGiamGia') + $scope.target.tienVat - $scope.target.tienChietKhau - $scope.target.tongTienGiamGia;
                    });
                }
            });
            phieuXuatKhacService.getSelectDataType('XUAT', function (response) {
                $scope.typeReasonXuats = response;
            });
        };
        function init()
        {
            var z = $filter('filter')($scope.tempData.taxs, { value: $scope.target.vat }, true);
            $scope.tyGia = parseFloat(z[0].extendValue);
        }

        filterData();
    }
]);
nvModule.controller('reportPhieuXuatKhacController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
'mdService', 'phieuXuatKhacService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
mdService, phieuXuatKhacService, clientService) {
    $scope.robot = angular.copy(phieuXuatKhacService.robot);
    var id = $stateParams.id;
    $scope.target = {};
    $scope.goIndex = function () {
        $state.go('nvXuatKhac');
    }
    function filterData() {
        if (id) {
            phieuXuatKhacService.getReport(id, function (response) {

                if (response.status) {
                    $scope.target = response.data;
                }
            });
        }
        $scope.checkDuyet = function () {
            console.log($scope.target.trangThai);
            if ($scope.target.trangThai == 10) {
                return false;
            }
            else {
                return true;
            }
        }

    };


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
nvModule.controller('printPhieuXuatKhacController', ['$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
'mdService', 'phieuXuatKhacService', 'clientService',
function ($scope, $state, $window, $stateParams, $timeout, $filter,
mdService, phieuXuatKhacService, clientService) {
    $scope.robot = angular.copy(phieuXuatKhacService.robot);
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return "Empty!";
    }
    function filterData() {
        phieuXuatKhacService.postPrint(
            function (response) {
                $scope.printData = response;
            });
    };
    $scope.info = phieuXuatKhacService.getParameterPrint().filtered.advanceData;
    $scope.goIndex = function () {
        $state.go("nvXuatKhac");
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
nvModule.controller('printDetailPhieuXuatKhacController', ['$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
'mdService', 'phieuXuatKhacService', 'clientService',
function ($scope, $state, $window, $stateParams, $timeout, $filter,
mdService, phieuXuatKhacService, clientService) {
    $scope.robot = angular.copy(phieuXuatKhacService.robot);
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return "Empty!";
    }
    $scope.info = phieuXuatKhacService.getParameterPrint().filtered.advanceData;
    $scope.goIndex = function () {
        $state.go("nvXuatKhac");
    }
    function filterData() {
        phieuXuatKhacService.postPrintDetail(
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