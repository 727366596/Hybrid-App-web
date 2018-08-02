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
    rejectInAjax(data).then(function (res) {
      view.back();
    }).catch(function (err) {
      U.alert(err || '请求失败')
    })
  }

  /*确认入库*/
  function rejectInAjax(data){
    return new Promise(function (resolve, reject) {
      var params = {
        url: "psShippment/reject",
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
        reasonFlag: false,
        form: {
          id:'',
          reason: "",
          reasonText: '',
          ScheduledReceipt: '',
          date: '', //预计到货时间
          images: [], //图片
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
        /*选择原因*/
        reasonChange: function (reason) {
          if (reason === '3') {
            this.reasonFlag = true
          } else {
            this.reasonFlag = false
          }
        },
        rejectIn:function () {
          if(!this.form.reason){
            this.$toast('请选择拒绝原因');
          }else if(!this.form.reasonText&&this.form.reason==='3'){
            this.$toast('请输入具体拒绝原因');
          }else{
            var params={
              "id": this.form.id,// 主键
              "recieverPicIds": this.form.images.map(function (value) {
                return value.url
              }).join(','),// 上传照片
              "rejectReason":parseInt(this.form.reason),// 拒绝原因code 1 未按时 2 货物质量问题 3 其他
              "rejectRemark":this.form.reason==='3'?this.form.reasonText:"",// 其他原因备注
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

