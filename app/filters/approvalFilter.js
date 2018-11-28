
ngFilters.filter("approval", ['$filter', function ($filter) {
    return function (input) {
        if (input) {
            if (input == 10) {
                return "Đã duyệt";
            }
            if(input == 20)
            {
                return "Chưa duyệt";
            }
            
        }
        return "Chưa duyệt";
    };
}]);

ngFilters.filter("reply", ['$filter', function ($filter) {
    return function (input) {
        if (input) {
            if (input == 10) {
                return "Đã xử lý";
            }
            if (input == 20) {
                return "Chưa xử lý";
            }

        }
        return "Chưa xử lý";
    };
}]);

ngFilters.filter("statusHistory", [
    '$filter', function($filter) {

        return function (input) {
            var output = "";
            if (input) {
                if (input == 10) {
                    output = "Đã sửa ";
                    return output;
                }
                //if (input == 0) {
                //    return "Chưa sửa ";
                //}
            }
            return output;
        }
    }
]);

ngFilters.filter("thanhkhoan", ['$filter', function ($filter) {
    return function (input) {
        if (input) {
            if (input == 10) {
                return "Còn";
            }
            if (input == 20) {
                return "Hết";
            }
            if (input == 30) {
                return "Đã thanh khoản";
            }
            if (input == 40) {
                return "Chưa duyệt";
            }
        }
        return "Chưa duyệt";
    };
}]);
ngFilters.filter("trangthai_khoaso", ['$filter', function ($filter) {
    return function (input) {
        if (input) {
            if (input == 10) {
                return "Đã khóa sổ";
            }                       
        }
        return "Chưa khóa sổ";
    };
}]);
ngFilters.filter("trangThaiSoDinhMuc", ['$filter', function ($filter) {
    return function (input) {
        if (input) {
            if (input == 10) {
                return "Đã hết";
            }                       
        }
        return "Còn";
    };
}]);