var phieuDatHangService = nvModule.factory('phieuDatHangService', ['$resource', '$http', '$window', 'configService', 'clientService',
  function ($resource, $http, $window, configService, clientService) {
      var rootUrl = configService.apiServiceBaseUri;
      var serviceUrl = rootUrl + '/api/Nv/DatHang';
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
          changeSoLuongBao: function (item) {
              if (!item.soLuongLe) {
                  item.soLuongLe = 0;
              }
              if (!item.maBaoBi) {
                  item.luongBao = 1;
              }
              item.soLuong = item.soLuongBao * item.luongBao + item.soLuongLe;
              item.thanhTien = item.soLuong * item.donGia;
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
          },
          changeSoLuongLeDuyet: function (item) {
              if (!item.soLuongDuyet) {
                  item.soLuongDuyet = 0;
              }
              if (!item.donGiaDuyet) {
                  item.donGiaDuyet = 0;
              }
              item.thanhTien = item.donGiaDuyet * (item.soLuongDuyet + item.soLuongLeDuyet);
          },
          changeSoLuongBaoDuyet: function (item) {
              if (!item.soLuongLeDuyet) {
                  item.soLuongLeDuyet = 0;
              }
              if (!item.donGiaDuyet) {
                  item.donGiaDuyet = 0;
              }
              item.soLuongDuyet = item.luongBao * item.soLuongBaoDuyet + item.soLuongLeDuyet;
              item.thanhTien = item.donGiaDuyet * item.soLuongDuyet;
          },
          changeDonGiaDuyet: function (item) {
              if (!item.soLuongDuyet) {
                  item.soLuongDuyet = 0;
              }
              if (!item.soLuongLeDuyet) {
                  item.soLuongLeDuyet = 0;
              }
              item.thanhTien = item.donGiaDuyet * (item.soLuongDuyet + item.soLuongLeDuyet);
          }
      }
      this.parameterPrint = {};
      var selectedData = [];
      function getParameterPrint() {
          return this.parameterPrint;
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
          postQueryApproval: function (data, callback) {

              $http.post(serviceUrl + '/PostQueryApproval', data).success(callback);
          },
          postSelectData: function (data, callback) {
              $http.post(serviceUrl + '/PostSelectData', data).success(callback);
          },
          postMerger: function (data, callback) {
              $http.post(serviceUrl + '/PostMerger', data).success(callback);
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
          getDetailsContract: function (id, callback) {
              $http.get(rootUrl + '/api/Md/Contract/GetDetails/' + id).success(callback);
          },
          getContractByCustomerId: function (id, callback) {
              $http.get(rootUrl + '/api/Md/Contract/GetContractByCustomerId/' + id).success(callback);
          },
          postApproval: function (data, callback) {
              $http.post(serviceUrl + '/PostApproval', data).success(callback);
          },
          postComplete: function (data, callback) {
              $http.post(serviceUrl + '/PostComplete', data).success(callback);
          },
          postCompletes: function (data, callback) {
              $http.post(serviceUrl + '/PostCompletes', data).success(callback);
          },
          updateCT: function (params) {
              return $http.put(serviceUrl + '/' + params.id, params);
          },
          getMerchandiseForNvByCode: function (code) {
              return $http.get(rootUrl + '/api/Md/Merchandise/GetForNvByCode/' + code);
          },
          getUnitUsers: function (callback) {
              $http.get(rootUrl + '/api/Md/UnitUser/GetSelectAll').success(callback);
          },
          getSelectData: function () {
              return selectedData;
          },
          setSelectData: function (array) {
              selectedData = array;
          },
          deleteItem: function (params) {
              return $http.delete(serviceUrl + '/' + params.id, params);
          }
      };
      return result;
  }
])

nvModule.controller('phieuDatHangController', [
'$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
'phieuDatHangService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', 'serviceDatHangAndMerchandise', '$mdDialog',
function (
    $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
phieuDatHangService, configService, clientService, nvService, mdService, blockUI, serviceDatHangAndMerchandise, $mdDialog
    ) {
    $scope.config = nvService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.robot = angular.copy(phieuDatHangService.robot);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'Ngay'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function () {
        $scope.paged.currentPage = 1;
        filterData(); 
    };
    $scope.pageChanged = function () {
        filterData();
    };
    $scope.nextToApproval = function () {
        $state.go('approvalList');
    }
    $scope.goHome = function () {
        $state.go('home');
    };
    $scope.refresh = function () {
        $scope.setPage($scope.paged.currentPage);
    };
    $scope.title = function () {
        return 'Phiếu đặt hàng';
    };
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
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
            templateUrl: nvService.buildUrl('nvDatHang', 'add'),
            controller: 'phieuDatHangCreateController',
            windowClass: 'app-modal-window',
            resolve: {}
        });

        modalInstance.result.then(function (updatedData) {
            serviceDatHangAndMerchandise.getSelectData().clear();
            $scope.refresh();
        }, function () {
            serviceDatHangAndMerchandise.getSelectData().clear();
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.details = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvDatHang', 'details'),
            controller: 'phieuDatHangDetailsController',
            windowClass: 'app-modal-window',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
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
            phieuDatHangService.deleteItem(item).then(function (data) {
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

    $scope.update = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvDatHang', 'update'),
            controller: 'phieuDatHangEditController',
            windowClass: 'app-modal-window',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
        modalInstance.result.then(function (updatedData) {
            serviceDatHangAndMerchandise.getSelectData().clear();
            $scope.refresh();
        }, function () {
            serviceDatHangAndMerchandise.getSelectData().clear();
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.sum = function () {
        var total = 0;
        if ($scope.data) {
            angular.forEach($scope.data, function (v, k) {
                total = total + v.thanhTien;
            })
        }
        return total;
    }
    $scope.goToParam = function () {
        $state.go('nvPhieuDatHangParameter');
    }
    $scope.print = function () {
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        phieuDatHangService.setParameterPrint(
            postdata);
        $state.go("nvPrintDatHang");
    }
    $scope.printDetail = function () {

        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        phieuDatHangService.setParameterPrint(
            postdata);
        $state.go("nvPrintDetailDatHang");
    }
    $scope.approval = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvDatHang', 'update-need-approval'),
            controller: 'phieuDatHangApprovalEditController',
            windowClass: 'app-modal-window',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
        modalInstance.result.then(function (updatedData) {
            filterData();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    filterData();
    function filterData() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        phieuDatHangService.postQuery(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data= response.data.data;
                    angular.extend($scope.paged, response.data);
                }
            });
    };
}])

nvModule.controller('phieuDatHangParameterController', [
'$scope', '$uibModal', '$log', '$rootScope',
'mdService', 'nvService', 'phieuDatHangService', 'clientService', '$filter', 'configService', 'nvService',
function ($scope, $uibModal, $log, $rootScope,
    mdService, nvService,phieuDatHangService, clientService, $filter, configService, nvService) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Phiếu đặt hàng';
    };
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };
    $scope.tagDatHangs = [];
    $scope.target = {};
    $scope.selectDatHang = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('NvDatHang', 'selectData'),
            controller: 'datHangSelectDataController',
            resolve: {
                serviceSelectData: function () {
                    return phieuDatHangService;
                },
                filterObject: function () {
                    return {
                        advanceData: {
                            trangThai: 20 //Được duyệt, chưa hoàn thành
                        },
                        isAdvance: true
                    }
                }
            }
        });
        modalInstance.result.then(function (updatedData) {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
    $scope.removeDatHang = function (index) {
        $scope.tagDatHangs.splice(index, 1);
    }
    $scope.$watch('tagDatHangs', function (newValue, oldValue) {
        var values = $scope.tagDatHangs.map(function (element) {
            return element.value;
        })
        $scope.target.tagDatHangs = values;
    }, true);
    $scope.merger = function () {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvDatHang', 'merger'),
            controller: 'phieuDatHangMergerController',
            windowClass: 'app-modal-window',
            resolve: {
                filterObject: function () {
                    return $scope.target.tagDatHangs;
                }
            }
        });

        modalInstance.result.then(function (updatedData) {
            phieuDatHangService.getSelectData().clear();
        }, function () {
            phieuDatHangService.getSelectData().clear();
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
    $rootScope.$on('$locationChangeStart',
function (event, next, current) {
    $scope.tagDatHangs.clear();

})
    function fillterData() {
        $scope.tagDatHangs = phieuDatHangService.getSelectData();

    }
    fillterData();

}
]);
nvModule.controller('phieuDatHangDetailsController', [
'$scope', '$uibModalInstance',
'mdService', 'phieuDatHangService', 'targetData', 'clientService', '$filter', 'configService',
function ($scope, $uibModalInstance,
    mdService, phieuDatHangService, targetData, clientService, $filter, configService) {
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.config = mdService.config;
    $scope.target = targetData;
    $scope.tempData = mdService.tempData;
    $scope.title = function () {
        return 'Phiếu đặt hàng';
    };
    $scope.formatLabel = function (model, module) {
        if (!model) return "";
        var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
        if (data && data.length == 1) {
            return data[0].text;
        }
        return "Empty!";
    };   
    $scope.sum = function () {
        var total = 0;
        if ($scope.target.dataDetails) {
            angular.forEach($scope.target.dataDetails, function (v, k) {
                total = total + v.thanhTien;
            })
        }
        return total;
    };

    function fillterData() {
        $scope.isLoading = true;
        phieuDatHangService.getDetails($scope.target.id, function (response) {
            if (response.status) {
                $scope.target = response.data;
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
                $scope.data.push($scope.target.dataDetails[i])
            }
        }
    }
}
]);
nvModule.controller('phieuDatHangCreateController', [
    '$scope', '$uibModal', '$uibModalInstance', 'clientService', '$filter', '$state', '$log',
    'nvService', 'phieuDatHangService', 'mdService', 'configService', 'serviceDatHangAndMerchandise',
    function ($scope, $uibModal, $uibModalInstance, clientService, $filter, $state, $log,
        nvService, phieuDatHangService, mdService, configService, serviceDatHangAndMerchandise) {
        $scope.robot = angular.copy(phieuDatHangService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        //$scope.customers = [];
        $scope.contracts = [];
        $scope.target = { dataDetails: [] };
        $scope.newItem = {};
        $scope.addRow = function () {
            $scope.target.dataDetails.push($scope.newItem);
            $scope.pageChanged();
            $scope.newItem = {};
        };
        $scope.addNewItem = function (strKey) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
                controller: 'merchandiseSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return serviceDatHangAndMerchandise;
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
        $scope.isHopDongInpDisabled = true;
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

        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            return 'Phiếu đặt hàng';
        };

        $scope.save = function () {
            phieuDatHangService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        $scope.target.dataDetails.clear();
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        };
        $scope.saveAndKeep = function () {
            var tempData = angular.copy($scope.target);
            phieuDatHangService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        phieuDatHangService.getNewInstance(function (response1) {
                            tempData.soPhieu = expectData.soPhieu;
                            tempData.ngay = expectData.ngay;
                            $scope.target = tempData;
                        })
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    } 
                }
                );
        };
        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuDatHangService.getMerchandiseForNvByCode(code).then(function (response) {
                    
                        $scope.newItem = response.data;
                    },function(error){
                        $scope.addNewItem(code);
                    }
                )
            }
        }
        $scope.selectedMaKhachHang = function (item) {
            phieuDatHangService.getContractByCustomerId(item.id, function (response) {
               
                $scope.contracts = response;
            })
        };
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
        $scope.selectedHD = function (item) {
            $scope.isLoading = true;
            phieuDatHangService.getDetailsContract(item.id, function (response) {

                if (response.status) {
                    $scope.target.dataDetails.clear();
                    angular.forEach(response.data.dataDetails, function (v, k) {
                        
                        $scope.target.dataDetails.push(v);
                    })
                }
                $scope.isLoading = false;
                $scope.pageChanged();
               
            });
        };
        $scope.saveAndPrint = function () {
            phieuDatHangService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        var url = $state.href('reportphieuDatHang', { id: response.id });
                        window.open(url, 'Report Viewer');
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        }
        $scope.ClearContent = function () {

            var inpKhachHang = $scope.target.maKhachHang;
            if (inpKhachHang == null) {
                $scope.target.dataDetails.clear();
                $scope.target.maHd = "";
                $scope.pageChanged();
            }
        }

        function filterData() {
            $scope.isLoading = true;
            phieuDatHangService.getNewInstance(function (response) {
                $scope.target = response;
                $scope.target.dataDetails = serviceDatHangAndMerchandise.getSelectData();
                $scope.pageChanged();
                $scope.isLoading = false;
            })
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
nvModule.controller('phieuDatHangMergerController', [
    '$scope', '$uibModal', '$uibModalInstance', 'clientService', '$filter', '$state', '$log',
    'nvService', 'phieuDatHangService', 'mdService', 'configService', 'serviceDatHangAndMerchandise', 'filterObject',
    function ($scope, $uibModal, $uibModalInstance, clientService, $filter, $state, $log,
        nvService, phieuDatHangService, mdService, configService, serviceDatHangAndMerchandise, filterObject) {
        $scope.robot = angular.copy(phieuDatHangService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.contracts = [];
        $scope.target = { dataDetails: [] };
        $scope.newItem = {};
        $scope.addRow = function () {
            $scope.target.dataDetails.push($scope.newItem);
            $scope.pageChanged();
            $scope.newItem = {};
        };
        $scope.addNewItem = function (strKey) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
                controller: 'merchandiseSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return serviceDatHangAndMerchandise;
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
        $scope.isHopDongInpDisabled = true;
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

        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $uibModalInstance.dismiss('cancel');
        };
        $scope.title = function () {
            return 'Phiếu đặt hàng';
        };

        $scope.save = function () {
            phieuDatHangService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        phieuDatHangService.postCompletes(filterObject, function (response) {
                            clientService.noticeAlert("Cập nhật đơn hàng thành công", "success");
                        })
                        $scope.target.dataDetails.clear();
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        };
        $scope.saveAndPrint = function () {
            phieuDatHangService.post(
                JSON.stringify($scope.target), function (response) {
                    if (response.status) {
                        clientService.noticeAlert("Thành công", "success");
                        var url = $state.href('reportphieuDatHang', { id: response.id });
                        window.open(url, 'Report Viewer');
                        $uibModalInstance.close($scope.target);
                    } else {
                        clientService.noticeAlert(response.message, "danger");
                    }
                }
                );
        }
        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuDatHangService.getMerchandiseForNvByCode(code).then(function (response) {

                    $scope.newItem = response.data;
                }, function (error) {
                    $scope.addNewItem(code);
                }
                )
            }
        }
        $scope.selectedMaKhachHang = function (item) {
            phieuDatHangService.getContractByCustomerId(item.id, function (response) {

                $scope.contracts = response;
            })
        };
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
        $scope.selectedHD = function (item) {
            $scope.isLoading = true;
            phieuDatHangService.getDetailsContract(item.id, function (response) {

                if (response.status) {
                    $scope.target.dataDetails.clear();
                    angular.forEach(response.data.dataDetails, function (v, k) {

                        $scope.target.dataDetails.push(v);
                    })
                }
                $scope.isLoading = false;
                $scope.pageChanged();

            });
        };

        $scope.ClearContent = function () {

            var inpKhachHang = $scope.target.maKhachHang;
            if (inpKhachHang == null) {
                $scope.target.dataDetails.clear();
                $scope.target.maHd = "";
                $scope.pageChanged();
            }
        }

        function filterData() {
            $scope.isLoading = true;
            phieuDatHangService.getNewInstance(function (response) {
                $scope.target = response;
                $scope.target.dataDetails = serviceDatHangAndMerchandise.getSelectData();
                getDetail($scope.pageChanged);
                
                $scope.isLoading = false;
            })
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
        function getDetail(callback)
        {
            phieuDatHangService.postMerger(filterObject, function (response) {
                if (response && response.length > 0) {
                    angular.forEach(response, function (v, k) {
                        $scope.target.dataDetails.push(v);
                    })
                }
                callback();

            })
        }
    }
]);

nvModule.controller('phieuDatHangEditController', [
    '$scope', '$uibModal', '$uibModalInstance', 'clientService', '$filter', '$state', '$log',
    'nvService', 'phieuDatHangService', 'mdService', 'targetData', 'configService', 'serviceDatHangAndMerchandise',
    function ($scope, $uibModal, $uibModalInstance, clientService, $filter, $state, $log,
        nvService, phieuDatHangService, mdService, targetData, configService, serviceDatHangAndMerchandise) {
        $scope.robot = angular.copy(phieuDatHangService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.newItem = {};
        $scope.addRow = function () {
            $scope.target.dataDetails.push($scope.newItem);
            $scope.pageChanged();
            $scope.newItem = {};
        };
        $scope.addNewItem = function () {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: mdService.buildUrl('mdMerchandise', 'selectData'),
                controller: 'merchandiseSelectDataController',
                windowClass: 'app-modal-window',
                resolve: {
                    serviceSelectData: function () {
                        return serviceDatHangAndMerchandise;
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

        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
        };
        $scope.save = function () {
            phieuDatHangService.updateCT($scope.target).then(
                   function (response) {
                       if (response.status && response.status == 200) {
                           if (response.data.status) {
                               console.log('Create  Successfully!');
                               clientService.noticeAlert("Thành công", "success");
                               $scope.target.dataDetails.clear();
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
                    }
                );
        };
        $scope.saveAndPrint = function () {
            phieuDatHangService.updateCT($scope.target).then(
                    function (response) {
                        if (response.data.status) {
                            clientService.noticeAlert("Thành công", "success");
                            var url = $state.href('reportphieuDatHang', { id: response.data.data.id });
                            window.open(url, 'Report Viewer');
                            $scope.target.dataDetails.clear();
                            $uibModalInstance.close($scope.target);
                        } else {
                            clientService.noticeAlert(response.data.message, "danger");
                        }
                    },
                    function (response) {
                        console.log('ERROR: Update failed! ' + response);
                    }
                );
        }
        $scope.approval = function (target) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: nvService.buildUrl('nvDatHang', 'update-need-approval'),
                controller: 'phieuDatHangApprovalEditController',
                windowClass: 'app-modal-window',
                resolve: {
                    targetData: function () {
                        return target;
                    }
                }
            });
            modalInstance.result.then(function (updatedData) {
                var index = $scope.data.indexOf(target);
                if (index !== -1) {
                    $scope.data[index] = updatedData;
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        function filterData() {
            $scope.isLoading = true;
            phieuDatHangService.getDetails($scope.target.id, function (response) {
                if (response.data.id) {
                    $scope.target = response.data;
                }
                serviceDatHangAndMerchandise.setSelectData($scope.target.dataDetails);
                $scope.pageChanged();
                $scope.isLoading = false;
            });

        };
        $scope.selectedMaHang = function (code) {
            if (code) {
                phieuDatHangService.getMerchandiseForNvByCode(code).then(function (response) {

                    $scope.newItem = response.data;
                }, function (error) {
                    $scope.addNewItem(code);
                }
                )
            }
        }
        $scope.selectedMaKhachHang = function (item) {
            phieuDatHangService.getContractByCustomerId(item.id, function (response) {
                $scope.contracts = response;
            })
        };

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
        $scope.selectedHD = function (item) {
            $scope.isLoading = true;
            phieuDatHangService.getDetailsContract(item.id, function (response) {

                if (response.status) {
                    $scope.target.dataDetails.clear();
                    angular.forEach(response.data.dataDetails, function (v, k) {

                        $scope.target.dataDetails.push(v);
                    })
                }
                $scope.isLoading = false;
                $scope.pageChanged();
            });
            

        };
        $scope.cancel = function () {
            $scope.target.dataDetails.clear();
            $uibModalInstance.dismiss('cancel');
        };
        $scope.ClearContent = function () {

            var inpKhachHang = $scope.target.maKhachHang;
            if (inpKhachHang == null) {
                $scope.target.dataDetails.clear();
                $scope.target.maHd = "";
                $scope.pageChanged();
            }
        }
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
nvModule.controller('reportDatHangController', ['$scope', '$window', '$stateParams', '$timeout', '$state',
    'nvService', 'phieuDatHangService', 'mdService', 'clientService',
function ($scope, $window, $stateParams, $timeout, $state,
nvService, phieuDatHangService, mdService, clientService) {
    $scope.robot = angular.copy(phieuDatHangService.robot);
    var id = $stateParams.id;
    $scope.target = {};
    $scope.goIndex = function () {
        $state.go('nvDatHang');
    }
    function filterData() {
        if (id) {
            phieuDatHangService.getReport(id, function (response) {

                if (response.status) {
                    $scope.target = response.data;
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
}]);
nvModule.controller('phieuDatHangApprovalController', [
'$scope', '$rootScope', '$location', '$window', '$uibModal', '$log', '$state', '$filter', '$http',
'phieuDatHangService', 'configService', 'clientService', 'nvService', 'mdService', 'blockUI', function (
    $scope, $rootScope, $location, $window, $uibModal, $log, $state, $filter, $http,
phieuDatHangService, configService, clientService, nvService, mdService, blockUI
    ) {
    $scope.config = nvService.config;
    $scope.paged = angular.copy(configService.pageDefault);
    $scope.filtered = angular.copy(configService.filterDefault);
    $scope.isEditable = true;
    $scope.setPage = function (pageNo) {
        $scope.paged.currentPage = pageNo;
        filterData();
    };
    $scope.sortType = 'soPhieu'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.doSearch = function () {
        $scope.paged.currentPage = 1;
        filterData();
    };
    $scope.pageChanged = function () {
        filterData();
    };
    $scope.goBack = function () {
        $state.go('nvDatHang');
    };
    $scope.refresh = function () {
        $scope.setPage($scope.paged.currentPage);
    };
    $scope.title = function () {
        return 'Duyệt phiếu đặt hàng';
    };
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
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
    $scope.details = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvDatHang', 'details'),
            controller: 'phieuDatHangDetailsController',
            windowClass: 'app-modal-window',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
    };
    $scope.approval = function (target) {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: nvService.buildUrl('nvDatHang', 'update-need-approval'),
            controller: 'phieuDatHangApprovalEditController',
            windowClass: 'app-modal-window',
            resolve: {
                targetData: function () {
                    return target;
                }
            }
        });
        modalInstance.result.then(function (updatedData) {
            filterData();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    filterData();
    function filterData() {
        $scope.isLoading = true;
        var postdata = { paged: $scope.paged, filtered: $scope.filtered };
        phieuDatHangService.postQueryApproval(
            JSON.stringify(postdata),
            function (response) {
                $scope.isLoading = false;
                if (response.status) {
                    $scope.data = response.data.data;
                    angular.extend($scope.paged, response.data);
                }
            });
    };
}])
nvModule.controller('phieuDatHangApprovalEditController', [
    '$scope', '$uibModalInstance', 'clientService', '$filter', '$state',
    'nvService', 'phieuDatHangService', 'mdService', 'targetData', 'configService',
    function ($scope, $uibModalInstance, clientService, $filter, $state,
        nvService, phieuDatHangService, mdService, targetData, configService) {
        $scope.robot = angular.copy(phieuDatHangService.robot);
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.config = nvService.config;
        $scope.tempData = mdService.tempData;
        $scope.target = targetData;
        $scope.formatLabel = function (model, module) {
            if (!model) return "";
            var data = $filter('filter')(mdService.tempData[module], { value: model }, true);
            if (data && data.length == 1) {
                return data[0].text;
            }
            return "Empty!";
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
        $scope.apply = function () {
            phieuDatHangService.postApproval($scope.target, function (response) {
                if(response)
                {
                    alert("Duyệt thành công");
                    $uibModalInstance.close(response.data);
                } else {
                    alert("Duyệt không thành công");
                }
            });
        }
        $scope.complete = function () {
            phieuDatHangService.postComplete($scope.target, function (response) {
                if (response) {
                    alert("Duyệt thành công");
                    $uibModalInstance.close(response.data);
                } else {
                    alert("Duyệt không thành công");
                }
            });
        }
        function filterData() {
            $scope.isLoading = true;
            phieuDatHangService.getDetails($scope.target.id, function (response) {
                if (response.data.id) {
                    $scope.target = response.data;
                    $scope.pageChanged();
                }
            });
            $scope.isLoading = false;
           

        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        filterData();
    }
]);
nvModule.controller('printDatHangController', ['$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
'mdService', 'phieuDatHangService', 'clientService',
function ($scope, $state, $window, $stateParams, $timeout, $filter,
mdService, phieuDatHangService, clientService) {
    $scope.robot = angular.copy(phieuDatHangService.robot);
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return "Empty!";
    }
    function filterData() {
        phieuDatHangService.postPrint(
            function (response) {
                $scope.printData = response;
            });
    };
    $scope.info = phieuDatHangService.getParameterPrint().filtered.advanceData;
    $scope.goIndex = function () {
        $state.go("nvDatHang");
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
nvModule.controller('printDetailDatHangController', ['$scope', '$state', '$window', '$stateParams', '$timeout', '$filter',
'mdService', 'phieuDatHangService', 'clientService',
function ($scope, $state, $window, $stateParams, $timeout, $filter,
mdService, phieuDatHangService, clientService) {
    $scope.robot = angular.copy(phieuDatHangService.robot);
    $scope.displayHelper = function (code, module) {
        var data = $filter('filter')(mdService.tempData[module], { value: code }, true);
        if (data && data.length == 1) {
            return data[0].text;
        };
        return "Empty!";
    }
    $scope.info = phieuDatHangService.getParameterPrint().filtered.advanceData;
    $scope.goIndex = function () {
        $state.go("nvDatHang");
    }
    function filterData() {
        phieuDatHangService.postPrintDetail(
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

mdModule.controller('datHangSelectDataController', [
    '$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$uibModalInstance', '$log', '$state',
    'phieuDatHangService', 'configService', 'mdService', 'serviceSelectData', 'filterObject',
    function ($scope, $resource, $rootScope, $location, $window, $uibModal, $uibModalInstance, $log, $state,
        phieuDatHangService, configService, mdService, serviceSelectData, filterObject) {
        $scope.tempData = mdService.tempData;
        $scope.config = mdService.config;
        $scope.paged = angular.copy(configService.pageDefault);
        $scope.filtered = angular.copy(configService.filterDefault);
        angular.extend($scope.filtered, filterObject);
        $scope.isEditable = true;
        $scope.setPage = function (pageNo) {
            $scope.paged.currentPage = pageNo;
            filterData();
        };
        $scope.selecteItem = function (item) {
            $uibModalInstance.close(item);
        }
        $scope.selectedDonVi = function () {
            filterData();
        }
        $scope.sortType = 'soPhieu'; // set the default sort type
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
            return 'Đặt hàng';
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
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.save = function () {
            //console.log($scope.listSelectedData);
            $uibModalInstance.close($scope.listSelectedData);
        };
        filterData();
        function filterData() {
            $scope.filtered.isAdvance = true;
            $scope.listSelectedData = serviceSelectData.getSelectData();
            $scope.isLoading = true;
            var postdata = { paged: $scope.paged, filtered: $scope.filtered };
            phieuDatHangService.postSelectData(
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
                        })
                        angular.extend($scope.paged, response.data);
                    }
                });
        };
    }]);