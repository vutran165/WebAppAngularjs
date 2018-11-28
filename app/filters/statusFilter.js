
ngFilters.filter("statusFilter", ['$filter', function ($filter) {
    return function (input) {
        if(input)
        {
            if (input == 10) {
                return "Hiệu lực"
            }
            if (input == 20)
            {
                return "Hết hiệu lực"
            }
        }
        return "";
    };
}]);
ngFilters.filter("closedFilter", ['$filter', function ($filter) {
    return function (input) {
        if (input) {
            if (input == 10) {
                return "Đã khóa";
            }
            if (input == 0) {
                return "Chưa Khóa";
            }
        }
        return "";
    };
}]);
ngFilters.filter("activeFilter", ['$filter', function ($filter) {
    return function (input) {
        if (input) {
            if (input == 10) {
                return "Đã kích hoạt";
            } else {
                return "Chưa kích hoạt";
            }

           
        }
        return "";
    };
}]); 


//
ngFilters.filter("naturesFilter", [
    '$filter', function($filter) {
        return function(input) {
            if (input) {
                if (input == 2) {
                    return "Dư nợ";
                }
                if (input == 3) {
                    return "Dư có";
                }
                if (input == 4) {
                    return "Lưỡng tính";
                }
            }
        }
    }
]);
//
ngFilters.filter("stateTranferFilter", [
    '$filter', function($filter) {
        return function(input) {
            if (input) {
                if (input == "isRecievedButNotApproval") {
                    return "Đang xử lý";
                }
                if (input == "IsComplete") {
                    return "Đã xử lý";
                }

            }
            return "Chờ xử lý";
        }
    }
]);

