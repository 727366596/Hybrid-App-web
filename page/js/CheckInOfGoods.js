/**
 * 采货单——新增货单
 * Created by Yuffie on 2018/7/16.
 */
var A = (function () {
  var App = {};

  App.init = function () {
    initVue();
  };

  function setData(data) {
    confirmIn(data).then(function (res) {
      view.back();
    }).catch(function (err) {
      U.alert(err || '请求失败')
    })
  }

  /*确认入库*/
  function confirmIn(data){
    return new Promise(function (resolve, reject) {
      var params = {
        url: "psShippment/receive",
        data:data
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
        countUnitSourceShow:false,
        dateSourceShow:false,
        countUnitSource:['吨','斤'],
        form: {
          id:null,
          countUnitText:"吨",
          ScheduledReceipt: '',
          date: '', //实际到货时间
          images: [], //图片
          remark: '', //备注
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
      },
      methods: {
        back: function () {
          window.location.href = 'DetailsOfGoods.html?id='+this.form.id+'&t=' + new Date().getTime()
        },
        rejectUrl() {
        },
        /*选择采货量单位*/
        onCountUnitConfirm: function (params) {
         this.form.countUnitText=params;
         this.countUnitSourceShow=false;
        },
        /*选择日期*/
        onDateConfirm:function (params) {
        this.form.date=U.dateFormat(params, 'YYYY-M-D hh:mm');
        this.dateSourceShow=false
        },
        /*确认入库*/
        confirmIn:function () {
         var flag=null;
          for(var x in this.form){
            if((x==="ScheduledReceipt"||x==="date")&&this.form[x]===""&&!flag){
              flag=x
            }
          }
          if(flag){
            if(flag==="ScheduledReceipt"){
              this.$toast('请输入入库量');
            }else{
              this.$toast('请选择实际到货时间');
            }
          }else if(!(/^([1-9]\d*|0)(\.\d{1,2})?$/.test(this.form.ScheduledReceipt))){
            this.$toast('入库量格式有误,请重新输入');
          }else{
            var params={
              "id":this.form.id,// 主键
              "realQuatity": this.form.ScheduledReceipt,// 入库量
              "realDeliverTime": this.form.date,// 实际到货时间
              "recieverPicIds": this.form.images.map(function (value) {
                return value.url
              }).join(","),// 上传照片
              "recieverRemark": this.form.remark// 备注
            }
            setData(params)
          }
        }
      },
      computed: {},
      watch: {}
    });
  }

  return App;
})();

