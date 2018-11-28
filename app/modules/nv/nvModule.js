var nvModule = angular.module('nvModule', ['ui.bootstrap', 'ngFilters', 'ngServices', 'ngResource', 'blockUI', 'xeditable', 'ngAnimate', 'ngFileUpload']);
nvModule.config(['$windowProvider', '$stateProvider', '$httpProvider', '$urlRouterProvider', '$routeProvider', '$locationProvider',
    function ($windowProvider, $stateProvider, $httpProvider, $urlRouterProvider, $routeProvider, $locationProvider) {
        var window = $windowProvider.$get('$window');
        var hostname = window.location.hostname;
        var port = window.location.port;
        var rootUrl = 'http://' + hostname + ':' + port;
        var moduleUrl = rootUrl + 'nv';
        $stateProvider
            .state('nvTonDauKy',
            {
                url: '/nv/nvTonDauKy',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvTonDauKy/index.html',
                controller: 'phieuTonDauKyController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvTonDauKy');
                    }
                }
            })
             .state('nvPrintPhieuNhapTonDauKy',
            {
                url: '/nv/nvPrintPhieuNhapTonDauKy',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvTonDauKy/report.html',
                controller: 'reportPhieuTonDauKyController'
            })
            .state('reportPhieuNhapTonDauKy',
            {
                url: '/nv/nvTonDauKy/reportPhieuNhapTonDauKy/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvTonDauKy/report.html',
                controller: 'reportPhieuTonDauKyController'
            })
            .state('nvTinhHinhSuDungHangMau',
            {
                url: '/nv/nvTinhHinhSuDungHangMau',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvTinhHinhSuDungHangMau/index.html',
                controller: 'tinhHinhSuDungHangMauController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvTinhHinhSuDungHangMau');
                    }
                }
            })
             .state('nvPrintTinhHinhSuDungHangMau',
            {
                url: '/nv/nvPrintTinhHinhSuDungHangMau',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvTinhHinhSuDungHangMau/print.html',
                controller: 'printTinhHinhSuDungHangMauController'
            })
            .state('reportTinhHinhSuDungHangMau',
            {
                url: '/nv/nvTinhHinhSuDungHangMau/reportTinhHinhSuDungHangMau/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvTinhHinhSuDungHangMau/report.html',
                controller: 'reportTinhHinhSuDungHangMauController'
            })
            .state('nvPhieuThuTienMat',
            {
                url: '/nv/nvPhieuThuTienMat',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuThuTienMat/index.html',
                controller: 'phieuThuTienMatController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvPhieuThuTienMat');
                    }
                }
            })
            .state('reportPhieuThuTienMat',
            {
                url: '/nv/nvPhieuThuTienMat/reportPhieuThuTienMat/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuThuTienMat/report.html',
                controller: 'reportPhieuThuTienMatController'
            })
            .state('reportPhieuChiTienMat',
            {
                url: '/nv/nvPhieuChiTienMat/reportPhieuChiTienMat/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuChiTienMat/report.html',
                controller: 'reportPhieuChiTienMatController'
            })
            .state('reportUyNhiemChi', {
                url: '/nv/nvUyNhiemChi/reportUyNhiemChi/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvUyNhiemChi/report.html',
                controller: 'reportUyNhiemChiController'
            })
            .state('nvPhieuChiTienMat',
            {
                url: '/nv/nvPhieuChiTienMat',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuChiTienMat/index.html',
                controller: 'phieuChiTienMatController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvPhieuChiTienMat');
                    }
                }
            })
            .state('nvUyNhiemChi',
            {
                url: '/nv/nvUyNhiemChi',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvUyNhiemChi/index.html',
                controller: 'uyNhiemChiController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvUyNhiemChi');
                    }
                }
            })
            .state('nvNhapHangMua',
            {
                url: '/nv/nvNhapHangMua',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvNhapHangMua/index.html',
                controller: 'phieuNhapHangMuaController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvNhapHangMua');
                    }
                }
            })
            .state('nvNhapKhac',
            {
                url: '/nv/nvNhapKhac',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvNhapKhac/index.html',
                controller: 'phieuNhapKhacController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvNhapKhac');
                    }
                }
            })
            .state('nvPhieuDatHangParameter',
            {
                url: '/nv/nvphieuDatHangParameter',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvDatHang/param-merger.html',
                controller: 'phieuDatHangParameterController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvPhieuDatHangParameter');
                    }
                }
            })
            .state('nvKhuyenMai',
            {
                url: '/nv/nvKhuyenMai',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvKhuyenMai/index.html',
                controller: 'khuyenMaiController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKhuyenMai');
                    }
                }
            })
            .state('nvDatHang',
            {
                url: '/nv/nvDatHang',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvDatHang/index.html',
                controller: 'phieuDatHangController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvDatHang');
                    }
                }
            })
            .state('reportDatHang',
            {
                url: '/nv/reportDatHang/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvDatHang/report.html',
                controller: 'reportDatHangController'
            })
          .state('nvPrintDatHang',
            {
                url: '/nv/nvPrintDatHang',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvDatHang/print.html',
                controller: 'printDatHangController'
            })
          .state('nvPrintDetailDatHang',
            {
                url: '/nv/nvPrintDetailDatHang',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvDatHang/printDetail.html',
                controller: 'printDetailDatHangController'
            })
            .state('approvalList',
            {
                url: '/nv/nvDatHang/approvalList',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvDatHang/index-approval.html',
                controller: 'phieuDatHangApprovalController'
            })
            .state('reportPhieuNhapHangMua', {
                url: '/nv/nvNhapHangMua/reportNhapHangMua/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvNhapHangMua/report.html',
                controller: 'reportPhieuNhapHangMuaController'
            })
          .state('nvPrintDetailPhieuNhapHangMua',
            {
                url: '/nv/nvPrintDetailPhieuNhapMua',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvNhapHangMua/printDetail.html',
                controller: 'printDetailPhieuNhapHangMuaController'
            })
          .state('nvPrintPhieuNhapMua',
            {
                url: '/nv/nvPrintPhieuNhapMua',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvNhapHangMua/print.html',
                controller: 'printPhieuNhapHangMuaController'
            })
            .state('reportPhieuNhapKhac', {
                url: '/nv/nvNhapHangMua/reportPhieuNhapKhac/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvNhapKhac/report.html',
                controller: 'reportPhieuNhapKhacController'
            })
          .state('nvPrintDetailPhieuNhapKhac',
            {
                url: '/nv/nvPrintDetailPhieuNhapKhac',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvNhapKhac/printDetail.html',
                controller: 'printDetailPhieuNhapKhacController'
            })
          .state('nvPrintPhieuNhapKhac',
            {
                url: '/nv/nvPrintPhieuNhapKhac',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvNhapKhac/print.html',
                controller: 'printPhieuNhapKhacController'
            })
            .state('nvPhieuDieuChuyenNoiBo',
            {
                url: '/nv/nvPhieuDieuChuyenNoiBo',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuDieuChuyenNoiBo/index.html',
                controller: 'phieuDieuChuyenNoiBoController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvPhieuDieuChuyenNoiBo');
                    }
                }
            })
            .state('nvPhieuDieuChuyenNoiBoNhan',
            {
                url: '/nv/nvPhieuDieuChuyenNoiBoNhan',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuDieuChuyenNoiBo/index-recieve.html',
                controller: 'phieuDieuChuyenNoiBoNhanController'
            })
          .state('nvPrintDetailPhieuDieuChuyenNoiBo',
            {
                url: '/nv/nvPrintDetailPhieuDieuChuyenNoiBo',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuDieuChuyenNoiBo/printDetail.html',
                controller: 'printDetailPhieuDieuChuyenNoiBoController'
            })
          .state('nvPrintPhieuDieuChuyenNoiBo',
            {
                url: '/nv/nvPrintPhieuDieuChuyenNoiBo',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuDieuChuyenNoiBo/print.html',
                controller: 'printPhieuDieuChuyenNoiBoController'
            })
            .state('nvPhieuDieuChuyenNoiBoRecieve',
            {
                url: '/nv/nvPhieuDieuChuyenNoiBoRecieve',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuDieuChuyenNoiBo/recieve.html',
                controller: 'phieuDieuChuyenNoiBoRecieveController'
            })
            .state('reportPhieuDieuChuyenNoiBo', {
                url: '/nv/nvPhieuDieuChuyenNoiBo/reportPhieuDieuChuyenNoiBo/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuDieuChuyenNoiBo/report.html',
                controller: 'reportPhieuDieuChuyenNoiBoController'
            })
            .state('nvPhieuXuatNVLSanXuat',
            {
                url: '/nv/nvPhieuXuatNVLSanXuat',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuXuatNVLSanXuat/index.html',
                controller: 'phieuXuatNVLSanXuatController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvPhieuXuatNVLSanXuat');
                    }
                }
            })
            .state('nvPhieuNhapKhoThanhPham',
            {
                url: '/nv/nvPhieuNhapKhoThanhPham',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuNhapKhoThanhPham/index.html',
                controller: 'phieuNhapKhoThanhPhamController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvPhieuNhapKhoThanhPham');
                    }
                }
            })
            .state('nvPhieuCapNhatChungTu',
            {
                url: '/nv/nvPhieuCapNhatChungTu',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuCapNhatChungTu/index.html',
                controller: 'phieuCapNhatChungTuController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvPhieuCapNhatChungTu');
                    }
                }
            })
            .state('nvPhieuXuatKhoTPTC',
            {
                url: '/nv/nvPhieuXuatKhoTPTC',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuXuatKhoTPTC/index.html',
                controller: 'phieuXuatKhoTPTCController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvPhieuXuatKhoTPTC');
                    }
                }
            })
            .state('nvAddphieuXuatBanLe',
            {
                url: '/nv/nvAddXuatBanLe',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvXuatBanLe/add.html',
                controller: 'phieuXuatBanLeCreateController'
            })
            .state('nvXuatBanLe',
            {
                url: '/nv/nvXuatBanLe',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvXuatBanLe/index.html',
                controller: 'phieuXuatBanLeController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvXuatBanLe');
                    }
                }
            })
            .state('reportPhieuXuatBanLe', {
                url: '/nv/nvXuatBanLe/reportPhieuXuatBanLe/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvXuatBanLe/report.html',
                controller: 'reportPhieuXuatBanLeController'
            })
          .state('nvPrintDetailPhieuXuatBanLe',
            {
                url: '/nv/nvPrintDetailPhieuXuatBanLe',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvXuatBanLe/printDetail.html',
                controller: 'printDetailPhieuXuatBanLeController'
            })
          .state('nvPrintPhieuXuatBanLe',
            {
                url: '/nv/nvPrintPhieuXuatBanLe',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvXuatBanLe/print.html',
                controller: 'printPhieuXuatBanLeController'
            })
            .state('nvXuatBan',
            {
                url: '/nv/nvXuatBan',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvXuatBan/index.html',
                controller: 'phieuXuatBanController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvXuatBan');
                    }
                }
            })
            .state('reportPhieuXuatBan', {
                url: '/nv/nvXuatBan/reportPhieuXuatBan/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvXuatBan/report.html',
                controller: 'reportPhieuXuatBanController'
            })
          .state('nvPrintDetailPhieuXuatBan',
            {
                url: '/nv/nvPrintDetailPhieuXuatBan',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvXuatBan/printDetail.html',
                controller: 'printDetailPhieuXuatBanController'
            })
          .state('nvPrintPhieuXuatBan',
            {
                url: '/nv/nvPrintPhieuXuatBan',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvXuatBan/print.html',
                controller: 'printPhieuXuatBanController'
            })
            .state('nvXuatKhac',
            {
                url: '/nv/nvXuatKhac',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvXuatKhac/index.html',
                controller: 'phieuXuatKhacController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvXuatKhac');
                    }
                }
            })
            .state('reportPhieuXuatKhac', {
                url: '/nv/nvXuatBan/reportPhieuXuatKhac/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvXuatKhac/report.html',
                controller: 'reportPhieuXuatKhacController'
            })
          .state('nvPrintDetailPhieuXuatKhac',
            {
                url: '/nv/nvPrintDetailPhieuXuatKhac',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvXuatKhac/printDetail.html',
                controller: 'printDetailPhieuXuatKhacController'
            })
          .state('nvPrintPhieuXuatKhac',
            {
                url: '/nv/nvPrintPhieuXuatKhac',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvXuatKhac/print.html',
                controller: 'printPhieuXuatKhacController'
            })
          .state('nvPhieuNhapHangBanTraLai',
            {
                url: '/nv/nvPhieuNhapHangBanTraLai',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuNhapHangBanTraLai/index.html',
                controller: 'phieuNhapHangBanTraLaiController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvPhieuNhapHangBanTraLai');
                    }
                }
            })
          .state('printPhieuNhapHangBanTraLai',
            {
                url: '/nv/nvPrintPhieuNhapHangBanTraLai',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuNhapHangBanTraLai/print.html',
                controller: 'printNhapHangBanTraLaiController'
            })
          .state('printDetailNhapHangBanTraLaiController',
            {
                url: '/nv/nvPrintDetailPhieuNhapHangBanTraLai',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuNhapHangBanTraLai/printDetail.html',
                controller: 'printDetailNhapHangBanTraLaiController'
            })
            .state('reportPhieuNhapHangBanTraLai', {
                url: '/nv/nvXuatBan/reportPhieuNhapHangBanTraLai/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvPhieuNhapHangBanTraLai/report.html',
                controller: 'reportPhieuNhapHangBanTraLaiController'
            })
            .state('nvDangKy',
            {
                url: '/nv/nvDangKyKinhDoanhMT',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvDangKyKinhDoanhMT/index.html',
                controller: 'dangKyKinhDoanhMTController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvDangKy');
                    }
                }
            })
        //Mien Thue nghiep vu
            //Ke khai hang nhap
          .state('nvTheoDoiTemCapPhat',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/NvTheoDoiTemCapPhat',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvTheoDoiTemCapPhat/index.html',
                controller: 'TheoDoiTemCapPhatController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvTheoDoiTemCapPhat');
                    }
                }
            })
            .state('nvDoanhNghiepKeKhaiTem',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/NvDoanhNghiepKeKhaiTem',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvDoanhNghiepKeKhaiTem/index.html',
                controller: 'DoanhNghiepKeKhaiTemController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvDoanhNghiepKeKhaiTem');
                    }
                }
            })
            .state('reportDoanhNghiepKeKhaiTem',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/NvDoanhNghiepKeKhaiTem/GetReport/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvDoanhNghiepKeKhaiTem/report.html',
                controller: 'reportDoanhNghiepKeKhaiTemConTroller',

            })
			.state('reportTheoDoiTemCapPhat',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/NvTheoDoiTemCapPhat/GetReport/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvTheoDoiTemCapPhat/report.html',
                controller: 'reportTheoDoiTemCapPhatController'
            })

            .state('nvKeKhaiHangNhapKhoDn',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/nvKeKhaiHangNhapKhoDn',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangHoaNhapKhoDn/index.html',
                controller: 'keKhaiHangHoaNhapKhoDnController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangNhapKhoDn');
                    }
                }
            })
            .state('reportHangHoaNhapKhoDnTuNk',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/reportHangHoaNhapKhoDnTuNk/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangHoaNhapKhoDn/report.html',
                controller: 'reportkeKhaiHangHoaNhapKhoDnController'
            })
         .state('nvKeKhaiHangNhapKhoDnTrongNuoc',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/nvKeKhaiHangNhapKhoDnTrongNuoc',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangHoaNhapKhoDnTrongNuoc/index.html',
                controller: 'keKhaiHangHoaNhapKhoDnTrongNuocController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangNhapKhoDnTrongNuoc');
                    }
                }
            })
            .state('reportkeKhaiHangHoaNhapKhoDnTrongNuoc',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/reportkeKhaiHangHoaNhapKhoDnTrongNuoc/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangHoaNhapKhoDnTrongNuoc/report.html',
                controller: 'reportkeKhaiHangHoaNhapKhoDnTrongNuocController'
            })

          .state('nvKeKhaiHangNhapKhoDnSangTn',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/nvKeKhaiHangNhapKhoDnSangTn',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangHoaNhapKhoDnSangTn/index.html',
                controller: 'keKhaiHangHoaNhapKhoDnSangTnController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangNhapKhoDnSangTn');
                    }
                }
            })
             .state('reportKeKhaiHangHoaNhapKhoDnSangTn',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/reportKeKhaiHangHoaNhapKhoDnSangTn/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangHoaNhapKhoDnSangTn/report.html',
                controller: 'reportKeKhaiHangHoaNhapKhoDnSangTnController'
            })

          .state('nvKeKhaiHangHoaHetHanTamNhap',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/nvKeKhaiHangHoaHetHanTamNhap',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangHoaHetHanTamNhap/index.html',
                controller: 'keKhaiHangHoaHetHanTamNhapController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangHoaHetHanTamNhap');
                    }
                }
            })
            .state('nvKeKhaiHangHoaHetHanTaiXuat',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/nvKeKhaiHangHoaHetHanTaiXuat',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaHetHanTaiXuat/index.html',
                controller: 'keKhaiHangHoaHetHanTaiXuatController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangHoaHetHanTaiXuat');
                    }
                }
            })
            .state('reportKeKhaiHangHoaHetHanTaiXuat',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/reportKeKhaiHangHoaHetHanTaiXuat/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaHetHanTaiXuat/report.html',
                controller: 'reportKeKhaiHangHoaHetHanTaiXuatController'

            })
            .state('nvKeKhaiHangNhapVaoCuaHangTuKho',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/nvKeKhaiHangNhapVaoCuaHangTuKho',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangNhapVaoCuaHangTuKho/index.html',
                controller: 'keKhaiHangNhapVaoCuaHangTuKhoDnController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangNhapVaoCuaHangTuKho');
                    }
                }
            })
             .state('reportKeKhaiHangNhapVaoCuaHangTuKhoDn',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/reportKeKhaiHangNhapVaoCuaHangTuKhoDn/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangNhapVaoCuaHangTuKho/report.html',
                controller: 'reportKeKhaiHangNhapVaoCuaHangTuKhoController'

            })
            .state('nvKeKhaiHangNhapVaoKhoDnTuCuaHang',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/nvKeKhaiHangNhapVaoKhoDnTuCuaHang',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangNhapVaoKhoTuCuaHang/index.html',
                controller: 'keKhaiHangNhapVaoKhoDnTuCuaHangController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangNhapVaoKhoDnTuCuaHang');
                    }
                }
            })
              .state('reportKeKhaiHangNhapVaoKhoDnTuCuaHang',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/reportKeKhaiHangNhapVaoKhoDnTuCuaHang/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangNhapVaoKhoTuCuaHang/report.html',
                controller: 'reportKeKhaiHangNhapVaoKhoDnTuCuaHangController'

            })
             .state('nvKeKhaiHangNhapVaoTauTuPhieuXuatKho',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/NvKeKhaiHangNhapVaoTauTuPhieuXuatKho',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangNhapVaoTauTuPhieuXuatKho/index.html',
                controller: 'keKhaiHangNhapVaoTauTuPhieuXuatKhoController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangNhapVaoTauTuPhieuXuatKho');
                    }
                }
            })
            //nhap hang thu hang mau
              .state('nvKeKhaiHangMauHangThuVaoChTuKho',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/NvKeKhaiHangMauHangThuVaoChTuKho',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangMauHangThuVaoChTuKho/index.html',
                controller: 'keKhaiNhapHangMauHangThuVaoChTuKhoController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangMauHangThuVaoChTuKho');
                    }
                }
            })
              .state('reportKeKhaiNhapHangMauHangThuVaoChTuKho',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/reportKeKhaiNhapHangMauHangThuVaoChTuKho/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangMauHangThuVaoChTuKho/report.html',
                controller: 'reportKeKhaiNhapHangMauHangThuVaoChTuKhoController'

            })
            .state('nvKeKhaiHangThuNhapVaoKhoDnTuCuaHang',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/nvKeKhaiHangThuNhapVaoKhoDnTuCuaHang',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangThuNhapVaoKhoTuCuaHang/index.html',
                controller: 'keKhaiHangThuNhapVaoKhoDnTuCuaHangController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangThuNhapVaoKhoDnTuCuaHang');
                    }
                }
            })
              .state('reportKeKhaiHangThuNhapVaoKhoDnTuCuaHang',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/reportKeKhaiHangThuNhapVaoKhoDnTuCuaHang/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangThuNhapVaoKhoTuCuaHang/report.html',
                controller: 'reportkeKhaiHangThuNhapVaoKhoDnTuCuaHangController'

            })            //
        //Ke khai hang xuat
        .state('nvKeKhaiHangHoaXuatTuKhoDn',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/nvkeKhaiHangHoaXuatTuKhoDn',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoDn/index.html',
                controller: 'keKhaiHangHoaXuatTuKhoDnController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangHoaXuatTuKhoDn');
                    }
                }
            })
        .state('reportKeKhaiHangHoaXuatTuKhoDn',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/ReportKeKhaiHangHoaXuatTuKhoDn/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoDn/report.html',
                controller: 'reportkeKhaiHangHoaXuatTuKhoDnController'

            })
        .state('nvKeKhaiHangHoaXuatTuKhoDnDiTh',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/nvKeKhaiHangHoaXuatTuKhoDnDiTh',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoDnDiTh/index.html',
                controller: 'keKhaiHangHoaXuatTuKhoDnDiThController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangHoaXuatTuKhoDnDiTh');
                    }
                }
            })
        .state('reportKeKhaiHangHoaXuatTuKhoDnDiTh',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/ReportKeKhaiHangHoaXuatTuKhoDnDiTh/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoDnDiTh/report.html',
                controller: 'reportkeKhaiHangHoaXuatTuKhoDnDiThController'
            })

          .state('nvKeKhaiHangHoaXuatTuKhoDnSangTx',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/NvkeKhaiHangHoaXuatTuKhoDnSangTx',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoDnSangTx/index.html',
                controller: 'keKhaiHangHoaXuatTuKhoDnSangTxController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangHoaXuatTuKhoDnSangTx');
                    }
                }
            })
          .state('reportKeKhaiHangHoaXuatTuKhoDnSangTx',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/ReportKeKhaiHangHoaXuatTuKhoDnSangTx/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoDnSangTx/report.html',
                controller: 'reportkeKhaiHangHoaXuatTuKhoDnSangTxController'
            })

          .state('nvKeKhaiHangHoaXuatTuKhoDnChuyenNd',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoDnChuyenNd',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoDnChuyenNd/index.html',
                controller: 'keKhaiHangHoaXuatTuKhoDnChuyenNdController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangHoaXuatTuKhoDnChuyenNd');
                    }
                }
            })
          .state('reportKeKhaiHangHoaXuatTuKhoDnChuyenNd',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/ReportKeKhaiHangHoaXuatTuKhoDnChuyenNd/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoDnChuyenNd/report.html',
                controller: 'reportkeKhaiHangHoaXuatTuKhoDnChuyenNdController'
            })

          .state('nvKeKhaiHangHoaXuatTuKhoDnSangTn',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoDnSangTn',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoDnSangTn/index.html',
                controller: 'keKhaiHangHoaXuatTuKhoDnSangTnController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangHoaXuatTuKhoDnSangTn');
                    }
                }
            })
           .state('reportKeKhaiHangHoaXuatTuKhoDnSangTn',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/ReportKeKhaiHangHoaXuatTuKhoDnSangTn/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoDnSangTn/report.html',
                controller: 'reportKeKhaiHangHoaXuatTuKhoDnSangTnController'
            })
             .state('nvKeKhaiHangXuatTuTauBayVeKho',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/NvKeKhaiHangXuatTuTauBayVeKho',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangXuatTuTauBayVeKho/index.html',
                controller: 'keKhaiHangXuatTuTauBayVeKhoController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangXuatTuTauBayVeKho');
                    }
                }
            })

            //Tiep nhan cua hang
          .state('nvCuaHangNhapTuNguonTrongNuoc',
            {
                url: '/nv/TiepNhanHangNhapCh/NvCuaHangNhapTuNguonTrongNuoc',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/TiepNhanHangNhapCuaHang/NhapTuNguonTrongNuoc/index.html',
                controller: 'cuaHangNhapTuNguonTrongNuocController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvCuaHangNhapTuNguonTrongNuoc');
                    }
                }
            })
             .state('reportCuaHangNhapTuNguonTrongNuoc',
            {
                url: '/nv/TiepNhanHangNhapCh/reportHangChuyenTuKhoVaoCh/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/TiepNhanHangNhapCuaHang/NhapTuNguonTrongNuoc/report.html',
                controller: 'reportCuaHangNhapTuNguonTrongNuocController'
            })
        .state('nvCuaHangNhapTuNguonTamNhap',
            {
                url: '/nv/TiepNhanHangNhapCh/NvCuaHangNhapTuNguonTamNhap',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/TiepNhanHangNhapCuaHang/NhapTuNguonTamNhap/index.html',
                controller: 'cuaHangNhapTuNguonTamNhapController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvCuaHangNhapTuNguonTamNhap');
                    }
                }
            })
        .state('reportCuaHangNhapTuNguonTamNhap',
            {
                url: '/nv/TiepNhanHangNhapCh/reportCuaHangNhapTuNguonTamNhap/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/TiepNhanHangNhapCuaHang/NhapTuNguonTamNhap/report.html',
                controller: 'reportcuaHangNhapTuNguonTamNhapController'
            })
            .state('nvCuaHangNhapTuNguonNhapKhau',
            {
                url: '/nv/TiepNhanHangNhapCh/NvCuaHangNhapTuNguonNhapKhau',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/TiepNhanHangNhapCuaHang/NhapTuNguonNhapKhau/index.html',
                controller: 'cuaHangNhapTuNguonNhapKhauController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvCuaHangNhapTuNguonNhapKhau');
                    }
                }
            })
              .state('reportCuaHangNhapTuNguonNhapKhau',
            {
                url: '/nv/TiepNhanHangNhapCh/reportCuaHangNhapTuNguonNhapKhau/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/TiepNhanHangNhapCuaHang/NhapTuNguonNhapKhau/report.html',
                controller: 'reportCuaHangNhapTuNguonNhapKhauController'
            })
            //xuat hang thu, hang mau
             .state('nvKeKhaiXuatHangMauHangThu',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/NvKeKhaiXuatHangMauHangThu',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiXuatHangMauHangThu/index.html',
                controller: 'keKhaiXuatHangMauHangThuController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiXuatHangThuHangMau');
                    }
                }
            })
             .state('reportKeKhaiXuatHangMauHangThu',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/reportKeKhaiXuatHangMauHangThu/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiXuatHangMauHangThu/report.html',
                controller: 'reportKeKhaiXuatHangMauHangThuController'
            })
            //
                .state('nvKeKhaiXuatHangMauHangThuTuKhoLenCh',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/nvKeKhaiXuatHangMauHangThuTuKhoLenCh',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangMauHangThuTuKhoLenCh/index.html',
                controller: 'keKhaiXuatHangMauHangThuTuKhoLenChController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiXuatHangMauHangThuTuKhoLenCh');
                    }
                }
            })
        .state('reportKeKhaiXuatHangMauHangThuTuKhoLenCh',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/reportKeKhaiXuatHangMauHangThuTuKhoLenCh/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangMauHangThuTuKhoLenCh/report.html',
                controller: 'reportKeKhaiXuatHangMauHangThuTuKhoLenChController'

            })
            //xuat hang tu cua hang mien thue
         .state('nvXuatHangTraVeKho',
            {
                url: '/nv/xuatHangTuCuaHangMienThue/nvXuatHangTraVeKho',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/XuatHangTuCuaHangMienThue/XuatHangTraVeKho/index.html',
                controller: 'xuatHangTuCuaHangVeKhoController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvXuatHangTraVeKho');
                    }
                }
            })
          .state('reportXuatHangTraVeKho',
            {
                url: '/nv/xuatHangTuCuaHangMienThue/ReportXuatHangTraVeKho/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/XuatHangTuCuaHangMienThue/XuatHangTraVeKho/report.html',
                controller: 'reportXuatHangTuCuaHangVeKhoController'
            })
                .state('nvXuatHangThuTraVeKho',
            {
                url: '/nv/xuatHangTuCuaHangMienThue/nvXuatHangThuTraVeKho',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/XuatHangTuCuaHangMienThue/XuatHangThuVeKho/index.html',
                controller: 'xuatHangThuTuCuaHangVeKhoController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvXuatHangThuTraVeKho');
                    }
                }
            })
          .state('reportXuatHangThuTraVeKho',
            {
                url: '/nv/xuatHangTuCuaHangMienThue/ReportXuatHangThuTraVeKho/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/XuatHangTuCuaHangMienThue/XuatHangThuVeKho/report.html',
                controller: 'reportXuatHangThuTuCuaHangVeKhoController'
            })
         .state('nvKeKhaiHangHoaHongHocDiTh',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/nvKeKhaiHangHoaHongHocDiTh',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvKeKhaiHangHoaHongHocDiTh/index.html',
                controller: 'keKhaiHangHoaHongHocDiThController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangHoaHongHocDiTh');
                    }
                }
            })
         .state('reportKeKhaiHangHoaHongHocDiTh',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/ReportKeKhaiHangHoaHongHocDiTh/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvKeKhaiHangHoaHongHocDiTh/report.html',
                controller: 'keKhaiHangHoaHongHocDiThController'
            })
         .state('nvKeKhaiHangHoaXuatTuKhoLenTau',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/nvKeKhaiHangHoaXuatTuKhoLenTau',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoLenTau/index.html',
                controller: 'keKhaiHangHoaXuatTuKhoLenTauController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangHoaXuatTuKhoLenTau');
                    }
                }
            })
            .state('reportKeKhaiHangHoaXuatTuKhoLenTau',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/reportKeKhaiHangHoaXuatTuKhoLenTau/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangXuatKhoDn/NvKeKhaiHangHoaXuatTuKhoLenTau/report.html',
                controller: 'reportKeKhaiHangHoaXuatTuKhoLenTauController'
            })
         .state('nvKeKhaiHangHoaNhapTuTauVeKho',
            {
                url: '/nv/KeKhaiHangNhapKhoDn/nvKeKhaiHangHoaNhapTuTauVeKho',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangHoaNhapTuTauVeKho/index.html',
                controller: 'keKhaiHangHoaNhapTuTauVeKhoController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvKeKhaiHangHoaNhapTuTauVeKho');
                    }
                }
            })
            .state('reportKeKhaiHangHoaNhapTuTauVeKho',
            {
                url: '/nv/KeKhaiHangXuatKhoDn/reportKeKhaiHangHoaNhapTuTauVeKho/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/KeKhaiHangNhapKhoDn/NvKeKhaiHangHoaNhapTuTauVeKho/report.html',
                controller: 'reportKeKhaiHangHoaNhapTuTauVeKhoController'
            })

             //NGHIỆP VỤ KHÁC
            .state('nvVuotDinhMuc',
            {
                url: '/nv/VuotDinhMuc',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvVuotDinhMuc/index.html',
                controller: 'phieuVuotDinhMucController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('nvVuotDinhMuc');
                    }
                }
            })
             .state('nvPrintPhieuVuotDinhMuc',
            {
                url: '/nv/VuotDinhMuc',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvVuotDinhMuc/report.html',
                controller: 'reportPhieuVuotDinhMucController'
            })
            .state('reportPhieuVuotDinhMuc',
            {
                url: '/nv/VuotDinhMuc/reportPhieuVuotDinhMuc/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NvVuotDinhMuc/report.html',
                controller: 'reportPhieuVuotDinhMucController'
            })
            .state('yeuCauHoTro',
            {
                url: '/nv/YeuCauHoTro',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/YeuCauHoTro/index.html',
                controller: 'yeuCauHoTroController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('yeuCauHoTro');
                    }
                }
            })
            .state('reportYeuCauHoTro',
            {
                url: '/nv/reportYeuCauHoTro/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/YeuCauHoTro/report.html',
                controller: 'reportYeuCauHoTroController'
            })
            .state('replyYeuCauHoTro',
            {
                url: '/nv/ReplyYeuCauHoTro',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/YeuCauHoTro/reply-index.html',
                controller: 'replyYeuCauHoTroController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('replyYeuCauHoTro');
                    }
                }
            })
            .state('reportReplyYeuCauHoTro',
            {
                url: '/nv/reportReplyYeuCauHoTro/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/YeuCauHoTro/reply-report.html',
                controller: 'reportReplyYeuCauHoTroController'
            })

            .state('giaHanToKhai',
            {
                url: '/giahan/giaHanToKhai',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NghiepVuKhac/GiaHanToKhai/index.html',
                controller: 'giaHanToKhaiController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('giaHanToKhai');
                    }
                }
            })
            .state('reportGiaHanToKhai',
            {
                url: '/giahan/reportGiaHanToKhai/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NghiepVuKhac/GiaHanToKhai/report.html',
                controller: 'reportGiaHanToKhaiController'
            })
               .state('phieuGiaoHang',
            {
                url: '/giaoHang/phieuGiaoHang',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NghiepVuKhac/GiaoHang/index.html',
                controller: 'phieuGiaoHangController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('phieuGiaoHang');
                    }
                }
            })
            .state('reportPhieuGiaoHang',
            {
                url: '/giaoHang/reportPhieuGiaoHang/:id',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/NghiepVuKhac/GiaoHang/report.html',
                controller: 'reportPhieuGiaoHangController'
            })
            //END

        //Thanh Khoan
            .state('thanhKhoan',
            {
                url: '/nv/thanhKhoan',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/ThanhKhoan/index.html',
                controller: 'thanhKhoanController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('thanhKhoan');
                    }
                }
            })
           .state('indexReportThanhKhoan',
            {
                url: '/nv/indexReportThanhKhoan',
                templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/ThanhKhoan/indexReport.html',
                controller: 'indexReportThanhKhoanController',
                resolve: {
                    permission: function (authorizeService) {
                        return authorizeService.permissionCheck('thanhKhoan');
                    }
                }
            })
            .state('reportThanhKhoan', {
                url: '/nv/reportThanhKhoan',
                    templateUrl: rootUrl + '/_layouts/15/BTS.SP.ERP/NV/ThanhKhoan/report.html',
                    controller: 'reportThanhKhoanController',
                    params: {
                        obj: null
                    }
                })


        ;
    }]);


nvModule.factory('nvService', [
    '$resource', '$http', '$window', 'clientService', 'configService',
    function ($resource, $http, $window, clientService, configService) {

        var hostname = window.location.hostname;
        var port = window.location.port;
        var rootUrl = 'http://' + hostname + ':' + port;

        var result = {
            config: configService,
            client: clientService,
        };
        result.buildUrl = function (module, action) {
            return rootUrl + '/_layouts/15/BTS.SP.ERP/Nv/' + module + '/' + action + '.html';
        };
        result.buildUrlTax = function (module, folder, action) {
            return rootUrl + '/_layouts/15/BTS.SP.ERP/Nv/' + module + '/' + folder + '/' + action + '.html';
        }
        return result;
    }]);


nvModule.controller('initController', ['$scope', '$resource', '$rootScope', '$location', '$window', '$uibModal', '$log', '$filter', '$http',
    'configService', 'nvService', 'blockUI', function (
        $scope, $resource, $rootScope, $location, $window, $uibModal, $log, $filter, $http,
        configService, nvService, blockUI) {
        $scope.config = nvService.config;
        $scope.thuTien = function () {

            var modalInstance = $uibModal.open({
                templateUrl: nvService.buildUrl('NvPhieuThuTienMat', 'index'),
                controller: 'phieuThuTienMatController',
                resolve: {},
                size: 'lg'
            });

            modalInstance.result.then(function (updatedData) {
                console.log(updatedData);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.chiTien = function () {
            var modalInstance = $uibModal.open({
                templateUrl: nvService.buildUrl('NvPhieuChiTienMat', 'index'),
                controller: 'phieuChiTienMatController',
                resolve: {},
                size: 'lg'
            });

            modalInstance.result.then(function (updatedData) {
                console.log(updatedData);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };

        $scope.uyNhiemChi = function () {
            var modalInstance = $uibModal.open({
                templateUrl: nvService.buildUrl('NvUyNhiemChi', 'index'),
                controller: 'uyNhiemChiController',
                resolve: {},
                size: 'lg'
            });

            modalInstance.result.then(function (updatedData) {
                console.log(updatedData);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

    }]);

nvModule.factory('serviceDatHangAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);

nvModule.factory('serviceNhapHangAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);

nvModule.factory('serviceXuatBanAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
nvModule.factory('serviceYeuCauHoTroAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
nvModule.factory('serviceDieuChuyenAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
nvModule.factory('serviceBanHangTraLaiAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
nvModule.factory('serviceTonDauKyAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
nvModule.factory('serviceVuotDinhMucAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
nvModule.factory('serviceNhapKhacAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';

        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
nvModule.factory('serviceXuatKhacAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
nvModule.factory('serviceXuatBanLeAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);

nvModule.factory('serviceKhuyenMaiAndMerchandise', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/Merchandise';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);

nvModule.factory('serviceMerchandiseGroup', [
    '$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var rootUrl = configService.rootUrlWeb;
        var urlService = configService.rootUrlWebApi;
        var serviceMerchandiseUrl = urlService + '/api/Md/NhomVatTu';
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }
]);

nvModule.factory('serviceThanhKhoanAndDonViHaiQuan', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
nvModule.factory('serviceThanhKhoanAndCompany', ['$resource', '$http', '$window', 'configService', 'clientService',
    function ($resource, $http, $window, configService, clientService) {
        var selectedData = [];
        var result = {
            getSelectData: function () {
                return selectedData;
            },
            setSelectData: function (array) {
                selectedData = array;
            }
        }
        return result;
    }]);
