ngServices.factory('configService', [
    '$resource', '$http', '$window', '$injector',
    function ($resource, $http, $window, $injector) {
        var hostname = window.location.hostname;
        var port = window.location.port;
        var rootUrl = 'http://' + hostname + ':' + port;
       // var rootUrlApi = 'http://btsoftvn.ddns.net:51944';
        var rootUrlApi = 'http://localhost:51944';
        var clientId = "ngAuthApp";
        if (!port) {
            rootUrl = 'http://' + hostname;
        }

        var result = {
            rootUrlWeb: rootUrl,
            rootUrlWebApi: rootUrlApi + '/api',
            apiServiceBaseUri: rootUrlApi,
            clientId: clientId,
            yearFormat:'yyyy',
            dateFormat: 'dd/MM/yyyy',
            delegateEvent: function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
            },
        };

        result.choiceObj = {
            parent: '',
            description: '',
            oldSelected: false,
            referenceDataId: '',
            id: '',
            value: '',
            extendValue: '',
            text: '',
            selected:false
        }

        result.pageDefault = {
            totalItems: 0,
            itemsPerPage: 10,
            currentPage: 1,
            pageSize: 5,
            totalPage: 5,
        };
        result.filterDefault = {
            summary: '',
            isAdvance: true,
            advanceData: {},
            orderBy: '',
            orderType: 'ASC',
            isStatus: false
        };
        //fix account root
        result.accountRoot = {
            user: 'admin'
        };
        //end 
        var label = {
            lblMessage: 'Thông báo',
            lblNotifications: 'Thông báo',
            lblindex: '',
            lblDetails: 'Thông tin',
            lblEdit: 'Cập nhập',
            lblCreate: 'Thêm',
            lbl: '',

            btnCreate: 'Thêm',
            btnEdit: 'Sửa',
            btnDelete: 'Xóa',
            btnRemove: 'Xóa',
            btnToggle: 'Toggle',
            btnSaveAndKeep: 'Lưu và giữ lại',
            btnSaveAndPrint: 'Lưu và in phiếu',

            btnSearch: 'Tìm kiếm',
            btnSearchAll: 'Tìm kiếm toàn bộ',
            btnRefresh: 'Làm mới',
            btnBack: 'Quay lại',
            btnClear: 'Xóa tất cả',
            btnCancel: 'Hủy',

            btnSave: 'Lưu',
            btnSubmit: 'Lưu',

            btnLogOn: 'Đăng nhập',
            btnLogOff: 'Đăng xuất',
            btnChangePassword: 'Đổi mật khẩu',

            btnSendMessage: 'Gửi tin nhắn',
            btnSendNotification: 'Gửi thông báo',
            btnNotifications: 'Thông báo',

            btnDisconnect: 'Hủy kết nối',
            btnDisconnectSession: 'Hủy kết nối',
            btnDisconnectAccount: 'Hủy mọi kết nối',

            btnUpload: 'Upload',
            btnUploadAll: 'Upload tất cả',
            btnFileCancel: 'Hủy',
            btnFileCancelAll: 'Hủy tất cả',
            btnFileRemove: 'Xóa',
            btnFileRemoveAll: 'Xóa tất cả',
            btn: '',

            btnImportExcel: 'Import từ file excel',
            btnExportExcel: 'Xuất ra file excel',

            btnCall: 'Call',
            btnChart: 'Biểu đồ',
            btnData: 'Số liệu',
            btnPrint: 'In phiếu',
            btnExit: 'Thoát',
            btnExportPDF: 'Kết xuất file PDF',
            btnExport: 'Kết xuất',

            btnPrintList: 'In DS',
            btnPrintDetailList: 'In DS chi tiết',
            btnSend: 'DS duyệt',
            btnApproval: 'Duyệt',
            btnComplete: 'Hoàn thành',
            btnAddInfo: 'Bổ sung',
            btnActive: 'Kích hoạt'
        };
        result.label = label;

        return result;
    }
])