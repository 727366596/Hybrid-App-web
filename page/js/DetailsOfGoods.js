/**
 * 采货单——新增货单
 * Created by Yuffie on 2018/7/16.
 */
var A = (function () {
  var App = {};

  App.init = function () {
    initVue();
  };

  function getData(id) {
    getGoodsDetail(id).then(function (res) {
      console.log(res.receiverId);
      view.form={
        id:res.id,
        crop: res.catalogName+"-"+res.categoryName, //作物
        unitName:res.unitName,//单位
        count: res.quatity, //采货量
        unitPrice: res.price+"元/斤", //单价
        address: res.farmName+"-"+res.landName, //货源地
        person: res.contact, //联系人
        phone: res.telephone, //手机号
        store: res.storageName, //仓库
        consignee: res.purchaserName, //采货人
        receiver: res.receiverName, //接货人
        date: res.expectDeliverTime, //预计到货时间
         images:res.senderPicIds===""||res.senderPicIds===null?[]:res.senderPicIds.split(",").map(function (value) {
           return {url:value}
         }), //发货时上传照片
         recieverPicIds:res.recieverPicIds===null||res.recieverPicIds===''?[]:res.recieverPicIds.split(",").map(function (value) {
           return {url:value}
         }),//收货时上传照片
        remark: res.senderRemark, //发货备注
        recieverRemark:res.recieverRemark,//收货备注
        status: res.statusName === "等待收货" ? 2 : (res.statusName === "正常入库" ? 0 : 1), //入库状态
        volume: res.realQuatity,
        arrivalDate: res.realDeliverTime,
        reason: view.codde[res.rejectReason],
        reasonText: res.rejectRemark,
        power:(""+res.receiverId)===JSON.parse(window.localStorage.getItem('__userinfo'))['userId']
      }
    }).catch(function (err) {
      U.alert(err || '请求失败')
    })
  }

  /*获取采货单列表*/
  function getGoodsDetail(id){
    return new Promise(function (resolve, reject) {
      var params = {
        url: "psShippment/detail",
        params:{id:id}
      };
      var callbacks = {
        success_0: function (res){
          resolve(res);
        },
        success_1: function (err){
          reject(err);
        }
      };
      U.post(params, callbacks);
    });
  }

  function initVue() {
    new Vue({
      el: "#app",
      data: {
        rejectUrl: '#',
        CheckUrl: '#',
        codde:{
          "0":"未知",
          "1":"未按时",
          "2":"货物质量问题",
          "3":"其他",
        },
        form: {
          power:null,
          id:null,
          crop: null, //作物
          unitName:null,//单位名称
          count: null, //采货量
          unitPrice: null, //单价
          address: null, //货源地
          person: null, //联系人
          phone: null, //手机号
          store: null, //仓库
          consignee: null, //采货人
          receiver: null, //采货人
          date: null, //预计到货时间
          images:[], //图片
          recieverPicIds:[],
          remark: null, //备注
          status:null, //入库状态
          volume: null,
          arrivalDate:null,
          reason: null,
          recieverRemark:null,
          reasonText: null
        }
      },
      created: function () {
        window.view=this;
        var params=window.location.search.substring(1);
        var paramsArr=params.split("&");
        var id=null;
        paramsArr.forEach(function (value) {
          if(value.indexOf("id")>=0){
            id=parseInt(value.split("=")[1])
          }
        });
        this.form.id=id;
        this.rejectUrl='RejectInOfGoods.html?id='+id+'&t=' + new Date().getTime();
        this.CheckUrl= 'CheckInOfGoods.html?id='+id+'&t=' + new Date().getTime();
        getData(id);
      },
      methods: {
        back: function () {
          window.location.href = 'ReceiptOfGoods.html?id='+this.form.id+'&t=' + new Date().getTime()
        },
        rejectFun:function () {
          window.location.href =  this.rejectUrl
        },
        checkFun:function () {
          window.location.href =  this.CheckUrl
        }
      },
      computed: {},
      watch: {}
    });
  }

  return App;
})();

