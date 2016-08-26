/**
 * 自定义插件
 */
;
(function ($, undefined) {
    /**
     * Table对象（后续扩展其他功能）
     */
    var JMTable = function (ele, opt) {
        this.$element = ele;
        this.defaults = {};
        this.options = $.extend({}, this.defaults, opt);
        this.isAlertBinded = false;
    };

    JMTable.prototype = {
        refresh: function (scope, alert) {
            return this.$element.DataTable().ajax.reload(function (json) {
                if (alert) {
                    toaster(json, scope);
                }
            });
        },
        post: function (param, scope, alert) {
            var url = this.$element.attr('url');
            var p = '';
            for (var i in param) {
                p += i + '=' + param[i] + "&";
            }
            p = p.substr(0, p.length - 1);
            if (url.indexOf("?") > 0) {
                url += "&" + p;
            } else {
                url += "?" + p;
            }
            this.$element.DataTable().ajax.url(url).load(function (json) {
                if (alert) {
                    toaster(json, scope);
                }
            });
        },
        ajax: function (param) {
            var method = this.$element.attr('req-method');
            var url = this.$element.attr('req-method');
            $http({
                method: method ? "POST" : method,
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function (data, status, headers, config) {
                if (data && (data.code == 0)) {
                    if (attrs.callback) {
                        if (data.data) {
                            var tmpFunc = scope.$eval(attrs.callback);
                            var tmpData = tmpFunc(json);
                            if (null == tmpData || '' == tmpData) {
                                tmpData = [];
                            }
                            options.data = tmpData;
                            elm.DataTable(options);
                            if (attrs.dtOpsEvents) {
                                var func = scope.$eval(attrs.dtOpsEvents);
                                func(elm);
                            }
                        }
                    }
                }
            }).error(function (data, status, headers, config) {
                console.log(status);
            });
        }
    };

    function toaster(json, scope) {
        if (json && json.code) {
            if (json.code == 0) {
                Utils.popToaster('success', '提示', '请求成功！ Msg: ' + json.message);
            } else {
                Utils.popToaster('error', '提示', '请求失败！ Msg: ' + json.message);
            }
        }
        scope.$apply();
    }

    $.fn.JMTable = function () {
        var self = this;
        var jmTable = new JMTable(self, null);
        this.refresh = function () {
            return jmTable.refresh(scope, alert);
        };
        this.post = function (param, scope) {
            return jmTable.post(param, scope, alert);
        };
        return this;
    };

})(jQuery);

/**
 * directives
 */
angular.module('app').directive('jmTable',
    function (JQ_CONFIG, uiLoad, $timeout, $http) {

        return {
            restrict: 'A',
            compile: function (tElm, tAttrs) {

                return function (scope, elm, attrs) {

                    function getOptions() {
                        var linkOptions = {};
                        linkOptions.processing = true;

                        if (attrs.dtOptions) {
                            linkOptions = scope.$eval(attrs.dtOptions);
                        }
                        linkOptions.ajax = {
                            url: null == attrs.url ? "" : attrs.url,
                            type: null == attrs.reqMethod ? "POST" : attrs.reqMethod
                        };
                        if (null != attrs.reqParam) {
                            var paramFunc = scope.$eval(attrs.reqParam);
                            linkOptions.ajax.data = paramFunc();
                        }
                        // if (null != attrs.defer) {
                        // linkOptions.serverSide = true;
                        // linkOptions.deferLoading = 0;
                        // }
                        return linkOptions;
                    }

                    // If change compatibility is enabled, the form input's "change"
                    // event
                    // will trigger an "input" event
                    if (attrs.ngModel && elm.is('select,input,textarea')) {
                        elm.bind('change', function () {
                            elm.trigger('input');
                        });
                    }

                    function callPlugin() {
                        var options = getOptions();
                        // if (attrs.defer) {
                        // options.data = [];
                        // elm.DataTable(options);
                        // } else {
                        // $http({
                        // method: attrs.reqMethod ? "POST" : attrs.reqMethod,
                        // url: attrs.url,
                        // headers: {
                        // 'Content-Type': 'application/json'
                        // }
                        // }).success(function(data, status, headers, config) {
                        // if (data && (data.code == 0)) {
                        // if (attrs.callback) {
                        // if (data.data) {
                        // var tmpFunc = scope.$eval(attrs.callback);
                        // var tmpData = tmpFunc(json);
                        // if (null == tmpData || '' == tmpData) {
                        // tmpData = [];
                        // }
                        // options.data = tmpData;
                        // elm.DataTable(options);
                        // if (attrs.dtOpsEvents) {
                        // var func = scope.$eval(attrs.dtOpsEvents);
                        // func(elm);
                        // }
                        // }
                        // }
                        // }
                        // }).error(function(data, status, headers, config) {
                        // console.log(status);
                        // });
                        // }

                        elm.on('xhr.dt', function (e, settings, json, xhr) {
                            if (attrs.callback) {
                                if (json) {
                                    var tmpFunc = scope.$eval(attrs.callback);
                                    var tmpData = tmpFunc(json);
                                    if (null == tmpData || '' == tmpData) {
                                        tmpData = [];
                                    }
                                    json.data = tmpData;
                                    // json.recordsTotal = tmpData.length;
                                    // json.recordsFiltered = tmpData.length;
                                }
                            }
                        }).DataTable(options);
                        if (attrs.dtOpsEvents) {
                            var func = scope.$eval(attrs.dtOpsEvents);
                            func(elm);
                        }
                    }

                    function refresh() {
                        if (attrs.customData) {
                            scope.$watch(attrs.customData, function () {
                                elm.dataTable().fnDraw();
                            });
                        }
                    }

                    if (JQ_CONFIG['dataTable']) {
                        uiLoad.load(JQ_CONFIG['dataTable']).then(function () {
                            callPlugin();
                        });
                    }
                };
            }
        };
    });

angular.module("app").directive('datetimepicker', function (JQ_CONFIG, uiLoad) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var _conf = {
                lang: 'zh'
            };

            if (attr.plugintype == 'datetime') {
                _conf.format = attr.format || 'Y-m-d H:i:s';
            } else if (attr.plugintype == 'date') {
                _conf.format = attr.format || 'Y-m-d';
                _conf.timepicker = false;
            } else if (attr.plugintype == 'time') {
                _conf.format = attr.format || 'H:i:s';
                _conf.datepicker = false;
            }
            if (JQ_CONFIG['datetimepicker']) {
                uiLoad.load(JQ_CONFIG['datetimepicker']).then(function () {
                    $(element).datetimepicker(_conf);
                });

            }
        }
    }
});

/**
 * service
 */
app.service('mainService', function ($q, $http, $modal) {
    var service = {};
    service.ajaxGet = function (url) {
        var deferred = $q.defer();
        $http.get(url).success(function (data, status, headers, config) {
            deferred.resolve(data);
        });
        return deferred.promise;
    };
    service.ajaxPost = function (url, postData) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: url,
            data: postData,
            cache: false
        }).success(function (data, status, headers, config) {
            deferred.resolve(data);
        });
        return deferred.promise;
    };

    service.popInfo = function (reqObj) {
        var modalInstance = $modal.open({
            size: reqObj.size,
            template: function () {
                var tmp = '';
                for (var k in reqObj.columns) {
                    if (angular.isObject(reqObj.columns)) {
                        tmp += '<tr><td>'+k+'</td>';
                        tmp += '<td>' + reqObj.data[reqObj.columns[k]] + '</td></tr>';
                    }
                }
                return '<div class="panel panel-info"><div class="panel-heading">' + reqObj.title + '</div>'
                    + '<table class="table table-striped m-b-none"><tbody>' + tmp + '</tbody></table></div></div>';
            }
        });
    };

    service.popTable = function (reqObj) {
        var aoColumns = [];
        var modalInstance = $modal.open({
//      templateUrl: reqObj.templateUrl,
            size: reqObj.size,
            template: function () {
                var tmp = '';
                for (var k in reqObj.columns) {
                    if (angular.isObject(reqObj.columns)) {
                        tmp += '<th>' + k + '</th>';
                        aoColumns.push({mData: reqObj.columns[k]});
                    } else if (angular.isArray(reqObj.columns)) {
                        tmp += '<th>' + reqObj.columns[k] + '</th>';
                    }
                }
                return '<div class="panel panel-default">'
                    + '<div class="panel-heading font-bold">' + reqObj.title + '</div>'
                    + '<div class="table-responsive">'
                    + '<table id="popTable_info_table_"'
                    + 'class="table table-striped m-b-none"><thead><tr>'
                    + tmp
                    + '</tr></thead></table></div></div>';
            }
        });
        modalInstance.opened.then(function (data) {
            if (reqObj.url) {
                service.ajaxPost(reqObj.url, reqObj.data).then(function (json) {
                    if (json) {
                        var options = {};
                        options.data = json.data;
                        if (!angular.equals([], aoColumns)) {
                            options.aoColumns = aoColumns;
                        }
                        angular.element('#popTable_info_table_').DataTable(options);
                    }

                });
            }
        });
    };
    return service;
});

