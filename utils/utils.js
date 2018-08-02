/**
 * 常用工具
 * Created by Yuffie on 2017/8/10.
 * 针对手机端 依赖 vant && （zepto || jquery）
 */

/**
 * @DEBUG
 * 当在web环境下调试文件设置为true
 * 在手机端下设置为false
 */
var DEBUG = true;

var U = (function () {
  var Utils = {};
  var http = "http://39.106.58.28:7777";
  
  /**
   * 日期格式化 根据formatStr生成返回的日期格式
   * @param date
   * @param formatStr 例如：YYYY-MM-DD hh:mm
   * 格式 YYYY/yyyy/YY/yy 表示年份     * MM/M 月份     * W/w 星     * dd/DD/d/D 日期
   * hh/HH/h/H 时间     * mm/m 分钟     * ss/SS/s/S 秒
   * @returns {String}
   */
  Utils.dateFormat = function (date, formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, date.getFullYear());
    str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));

    str = str.replace(/MM/, (date.getMonth() - (-1)) > 9 ? (date.getMonth() - (-1)).toString() : '0' + (date.getMonth() - (-1)));
    str = str.replace(/M/g, date.getMonth() - (-1));

    str = str.replace(/w|W/g, Week[date.getDay()]);

    str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
    str = str.replace(/d|D/g, date.getDate());

    str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
    str = str.replace(/h|H/g, date.getHours());
    str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
    str = str.replace(/m/g, date.getMinutes());

    str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
    str = str.replace(/s|S/g, date.getSeconds());

    return str;
  };

  /**
   * 代替系统new Date方法 为了兼容iOS不识别日期中横线的问题
   * @returns {String}
   */
  Utils.newDate = function (date) {
    if (typeof date === "string") {
      if (/^[0-9]{13}$/.test(date)) {
        date = Number(date);
      } else {
        date = date.replace(/-/g, '/');
      }
    }
    return new Date(date);
  };

  /**
   * 获取所有url参数
   * @return {Object}
   */
  Utils.getRequest = function () {
    var url = location.search;
    var theRequest = {};
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      str = str.split("&");
      for (var i = 0; i < str.length; i++) {
        theRequest[str[i].split("=")[0]] = decodeURI(str[i].split("=")[1]);
      }
    }
    return theRequest;
  };

  /**
   * 获取指定url参数
   * @param name 需要获取的参数名
   * @return {String}
   */
  Utils.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  };

  /**
   * 拼接url参数
   * @return {String}
   */
  Utils.urlEncode = function (path, param) {
    var i, url = '';
    for (i in param) url += '&' + i + '=' + param[i];
    return path + url.replace(/./, '?');
  };

  /**
   * 获取图片原始宽度和高度
   */
  Utils.getImageWidth = function (url, callback) {
    var img = new Image();
    img.src = url;

    // 如果图片被缓存，则直接返回缓存数据
    if (img.complete) {
      callback(img.width, img.height);
    } else {
      // 完全加载完毕的事件
      img.onload = function () {
        callback(img.width, img.height);
      }
    }
  };

  /**
   * U.extend( [deep ], target, object1 [, objectN ] ) 函数用于将一个或多个对象的内容合并到目标对象。
   * @param deep  可选。 Boolean类型 指示是否深度合并对象，默认为false。如果该值为true，且多个对象的某个同名属性也都是对象，则该"属性对象"的属性也将进行合并。
   * @param target Object类型 目标对象，其他对象的成员属性将被附加到该对象上。
   * @param object1 可选。 Object类型 第一个被合并的对象。
   * @param objectN 可选。 Object类型 第N个被合并的对象。
   */
  Utils.extend = function () {
    var copyIsArray,
      toString = Object.prototype.toString,
      hasOwn = Object.prototype.hasOwnProperty,

      class2type = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Object]': 'object'
      },

      type = function (obj) {
        return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
      },

      isWindow = function (obj) {
        return obj && typeof obj === "object" && "setInterval" in obj;
      },

      isArray = Array.isArray || function (obj) {
        return type(obj) === "array";
      },

      isPlainObject = function (obj) {
        if (!obj || type(obj) !== "object" || obj.nodeType || isWindow(obj)) {
          return false;
        }

        if (obj.constructor && !hasOwn.call(obj, "constructor")
          && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
          return false;
        }

        var key;
        for (key in obj) {
        }

        return key === undefined || hasOwn.call(obj, key);
      },

      extend = function (deep, target, options) {
        for (var name in options) {
          var src = target[name];
          var copy = options[name];
          var clone;
          if (target === copy) {
            continue;
          }

          if (deep && copy
            && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && isArray(src) ? src : [];

            } else {
              clone = src && isPlainObject(src) ? src : {};
            }

            target[name] = extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }

        return target;
      };

    return extend;
  }();

  /**
   * U.getBytesLength( str ) 用于获取字符串的字节长度。
   * @param str String 必填
   */
  Utils.getBytesLength = function (str) {
    str = str + '';
    return str.replace(/[^\x00-\xff]/g, 'xx').length;
  };

  /**
   * U.formatRMB( str, defaultStr ) 返回规范民币值
   * @param str 需要转化的值
   * @param defaultStr 当str无效时，默认返回值 若为空则返回¥0.00
   */
  Utils.formatRMB = function (str, defaultStr) {
    var yuan = defaultStr || "¥0.00";
    /*错误数据*/
    if (typeof str !== "string" && typeof str !== "number") {
      return yuan;
    }
    /*空数据||无效数据*/
    if (str.length === 0 || isNaN(str)) {
      return yuan;
    }
    yuan = "¥" + Number(str).toFixed(2);
    return yuan;
  };

  Utils.uuid = function () {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()).toUpperCase();
  };


  /*手机端接口封装 若调用手机端接口建议封装，以免接口大改的情况出现*/

  /**
   * 遮罩层 需加载图片样式css
   */
  var needLoadingRequestCount = 0;

  /*请求数+1*/
  Utils.showFullScreenLoading = function () {
    needLoadingRequestCount++;
    if (needLoadingRequestCount - 1 === 0) {
      U.loading()
    }
  };
  /*请求数-1*/
  Utils.tryHideFullScreenLoading = function () {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
      U.loadDone()
    }
  };

  Utils.loading = function () {
    view.$toast.loading({
      duration: 0,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
      message: ''
    });
  };
  Utils.loadDone = function () {
    view.$toast.clear();
  };

  /**
   * U.toast( message, conf ) 函数用于将一个或多个对象的内容合并到目标对象。
   * 使用时需要引用vant
   * @param message String 必填，提示语
   * @param conf Object类型 可选 vant.toast方法的配置属性。
   */
  Utils.toast = function (message, conf) {
    conf = conf || {};
    var type = conf.type;
    delete conf.type;
    if(type){
      view.$toast[type](message, conf)
    } else {
      view.$toast(message, conf)
    }
  };

  Utils.confirm = function (message, callback, conf) {
    var config = conf || {title: '提示'};
    config.message = message;
    view.$dialog.confirm(config, function (res) {
      callback(res.index);
    });
  };

  Utils.alert = function (message, callback, conf) {
    var config = conf || {};
    config.message = message;
    view.$dialog.alert(config).then(function () {
      callback && callback();
    });
  };

  /**
   * U.get( params, callbacks ) 带遮罩的get请求方法 U.post相同
   * @param params.url 请求地址
   * @param params.code 请求的code
   * @param params.data 请求提交的参数
   * @param callbacks 回调方法
   */
  var AjaxSettings = {
    delay: 20 * 1000,
    unknowMsg: '错误信息未返回，请联系后台',
    timeoutMsg: '连接超时，请检查网络链接',
    offlineMsg: '数据已进入离线库,有网时会自动提交,可在系统设置->离线缓存中查看数据'
  };
  Utils.get = function (params, callbacks) {
    params.showLoading = typeof params.showLoading === 'undefined' ? true : params.showLoading;
    if(params.showLoading){
      U.showFullScreenLoading();
      var timer = setTimeout(function () {
        U.tryHideFullScreenLoading();
        if (!callbacks.fail) {
          U.alert(AjaxSettings.timeoutMsg, function () {
            callbacks.success_0 && callbacks.success_0();
          });
        } else {
          callbacks.fail && callbacks.fail(AjaxSettings.timeoutMsg);
        }
      }, AjaxSettings.delay);
    }
    GET(params, function (res) {
      if(params.showLoading){
        U.tryHideFullScreenLoading();
        clearTimeout(timer);
      }
      /*code 0 请求成功 返回正确数据*/
      if (res.code === 0 || res.code === '0') {
        callbacks.success_0 && callbacks.success_0(res.message);
        return;
      }
      /*code 1 请求成功 返回错误数据*/
      if (res.code === 1 || res.code === '1') {
        if (!callbacks.success_1) {
          U.alert(typeof res.message === 'string' ? res.message : "请求失败", function () {
            callbacks.success_0 && callbacks.success_0();
          });
        } else {
          callbacks.success_1 && callbacks.success_1(res.message);
        }
        return;
      }
      /*code 3 请求失败*/
      if (res.code === 3 || res.code === '3') {
        if (!callbacks.fail) {
          U.alert(typeof res.message === 'string' ? res.message : "请求失败", function () {
            callbacks.success_0 && callbacks.success_0();
          });
        } else {
          callbacks.fail && callbacks.fail(res.message);
        }
        return;
      }
      if (res) {
        U.alert(res.message || res.result || AjaxSettings.unknowMsg);
      }
    });
  };

  Utils.post = function (params, callbacks) {
    params.showLoading = typeof params.showLoading === 'undefined' ? true : params.showLoading;
    if(params.showLoading){
      U.showFullScreenLoading();
      var timer = setTimeout(function () {
        U.tryHideFullScreenLoading();
        if (!callbacks.fail) {
          U.alert(AjaxSettings.timeoutMsg, function () {
            callbacks.success_0 && callbacks.success_0();
          });
        } else {
          callbacks.fail && callbacks.fail(AjaxSettings.timeoutMsg);
        }
      }, AjaxSettings.delay);
    }
    POST(params, function (res) {
      if(params.showLoading){
        U.tryHideFullScreenLoading();
        clearTimeout(timer);
      }
      /*code 0 请求成功 返回正确数据*/
      if (res.code === 0 || res.code === '0') {
        callbacks.success_0 && callbacks.success_0(res.data);
        return;
      }
      /*code 1 请求成功 返回错误数据*/
      if (res.code === 1 || res.code === '1') {
        callbacks.success_1 && callbacks.success_1(res.msg ? res.msg : "请求失败");
        return;
      }
      /*code 3 请求失败*/
      if (res.code === 3 || res.code === '3') {
        callbacks.success_1 && callbacks.success_1(res.msg ? res.msg : "请求失败");
        return;
      }
      /*code 99 token失效*/
      if (res.code === 99 || res.code === '99') {
        U.alert("token失效，请重新登陆");
        return;
      }
      if (res) {
        U.alert(res.message || res.result || AjaxSettings.unknowMsg);
      }
    });
  };

  /**
   * U.cameraCaptureImage() 拍照接口
   * @param callback: 回调方法
   * @param picCount: 目前已拍图片张数
   * @param maxPicCount: 最大拍摄张数 0或者为空时则不限制 为1时默认调用单拍模式 大于1时默认为多拍模式
   * @param option: 拍照参数
   */
  Utils.useCaptureImage = function (option, callback){
    Mobile.useCaptureImage(option, callback);
  };

  /**
   * U.navigateTo() 跳转页面
   * @param page: 跳转App页面
   */
  Utils.navigateTo = function (page){
    Mobile.navigateTo(page);
  }

  /**
   * U.on( eventName, callback ) 判断iTek是否注入
   * @param eventName 触发事件名称
   * @param callback 回调
   */
  Utils.on = function (eventName, callback) {
    if (eventName === 'H5Ready') {
      var Files = ["../lib/bluebird/bluebird.min.js"];
      if (DEBUG) {
        _url_ = typeof _url_ === 'undefined' ? '' : _url_;
        Files.push(_url_ || "../utils/debug.js");
      }
      U.LoadFileList(Files, function () {
        var userInfo = Mobile.getUserInfo();
        window.localStorage.setItem('__userinfo', userInfo);
        callback();
      });
    }
  };

  /**
   * U.Import( [src] ) 已加载文件缓存列表,用于判断文件是否已加载过，若已加载则不再次加载
   * @param _files:文件路径数组,可包括js,css,less文件
   * @param succes:加载成功回调函数
   */
  Utils.LoadFileList = function (_files, succes) {
    var classcodes = [];
    var FileArray = [];
    if (typeof _files === "object") {
      FileArray = _files;
    } else {
      /*如果文件列表是字符串，则用,切分成数组*/
      if (typeof _files === "string") {
        FileArray = _files.split(",");
      }
    }
    if (FileArray != null && FileArray.length > 0) {
      var LoadedCount = 0;
      for (var i = 0; i < FileArray.length; i++) {
        loadFile(FileArray[i], function () {
          LoadedCount++;
          if (LoadedCount == FileArray.length) {
            succes();
          }
        })
      }
    }

    /*加载JS文件,url:文件路径,success:加载成功回调函数*/
    function loadFile(url, success) {
      if (!FileIsExt(classcodes, url)) {
        var ThisType = GetFileType(url);
        var fileObj = null;
        if (ThisType == ".js") {
          fileObj = document.createElement('script');
          fileObj.src = url;
        } else if (ThisType == ".css") {
          fileObj = document.createElement('link');
          fileObj.href = url;
          fileObj.type = "text/css";
          fileObj.rel = "stylesheet";
        } else if (ThisType == ".less") {
          fileObj = document.createElement('link');
          fileObj.href = url;
          fileObj.type = "text/css";
          fileObj.rel = "stylesheet/less";
        }
        success = success || function () {
        };
        fileObj.onload = fileObj.onreadystatechange = function () {
          if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
            success();
            classcodes.push(url);
          }
        };
        document.getElementsByTagName('head')[0].appendChild(fileObj);
      } else {
        success();
      }
    }

    /*获取文件类型,后缀名，小写*/
    function GetFileType(url) {
      if (url != null && url.length > 0) {
        return url.substr(url.lastIndexOf(".")).toLowerCase();
      }
      return "";
    }

    /*文件是否已加载*/
    function FileIsExt(FileArray, _url) {
      if (FileArray != null && FileArray.length > 0) {
        var len = FileArray.length;
        for (var i = 0; i < len; i++) {
          if (FileArray[i] == _url) {
            return true;
          }
        }
      }
      return false;
    }
  }

  /**
   * 使用方法同zepto.ajax
   */

  Ajax = function (options) {
    var opts = {
      type: options.type,
      url: options.url,
      data: options.data,
      timeout: 5 * 1000,
      success: function (data) {
        data = typeof data === 'string' ? JSON.parse(data) : data;
        options.callback(data);
      },
      error: function (xhr, errType) {
        var _message = "";
        switch (errType) {
          case "error":
            _message = "404, 接口地址路径不对";
            break;
          case "abort":
            _message = "跨域或网络无法连接";
            break;
          case "parsererror":
            _message = "解析错误，返回的数据不是json格式";
            break;
          case "timeout":
            _message = "连接超时";
            break;
          default:
            _message = "未知错误" + xhr.status;
            break;
        }
        options.callback({code: 3, msg: _message});
      }
    };
    $.ajax(opts);
  };

  function GET(options, callback) {
    var params = options.params || {};
    params.token = JSON.parse(window.localStorage.getItem('__userinfo')).token;
    var url = U.urlEncode(http + '/' + options.url, params);
    var data = options.data;
    Ajax({
      type: 'GET',
      url: url,
      data: data,
      callback: callback,
      success: function (result) {
        result = typeof result === 'string' ? JSON.parse(result) : result;
        callback(result);
      },
    })
  }

  function POST(options, callback) {
    var params = options.params || {};
    params.token = JSON.parse(window.localStorage.getItem('__userinfo')).token;
    var url = U.urlEncode(http + '/' + options.url, params);
    var data = options.data;
    Ajax({
      type: 'POST',
      url: url,
      data: data,
      callback: callback,
      success: function (result) {
        result = typeof result === 'string' ? JSON.parse(result) : result;
        callback(result);
      },
    })
  }

  return Utils;
})();