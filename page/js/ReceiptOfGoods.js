/**
 * 工作上报菜单
 * Created by Yuffie on 2017/9/11.
 */
var A = (function () {
  var App = {};

  App.init = function () {
    initVue();
  };

  function getData(data) {
    getGoodsList(data).then(function (res) {
      view.page=res.page;
      view.loading=false;
      if(res.page===res.totalPage||res.totalPage===0){
        view.finished=true;
      }
      var list=res.rows.map(function (value) {
        return {
          id: value.id,
          cropName: value.catalogName+'-' + value.categoryName,
          goodsVolume: value.quatity + value.unitName,
          consignee: value.purchaserName,
          warehouse: value.storageName,
          realTime: value.statusName === "正常入库" ? value.realDeliverTime: value.expectDeliverTime,
          status: value.statusName === "等待收货" ? 2 : (value.statusName === "正常入库" ? 0 : 1)
        }
      })
        if(res.page===1){
          view.goodsList=list;
        }else{
          view.goodsList =view.goodsList.concat(list)
        }

   }).catch(function (err) {
      U.alert(err || '请求失败')
   })
  }

  /*获取采货单列表*/
  function getGoodsList(data){
    return new Promise(function (resolve, reject) {
      var params = {
        url: "psShippment/list",
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
        loading: false,
        finished: false,
        keyword:"",
        flag:true,
        pageSize:10,
        page:0,
        status: {
          1: "bg-color-red",
          0: "bg-color-green",
          2: "bg-color-orange",
        },
        goodsList: [],

      },
     created:function(){
       window.view=this;
     },
      methods: {
        //加载采货数据
        onLoad: function () {
               this.page++;
          getData({keyword:this.keyword,page:this.page,pageSize:this.pageSize})
        },
        goTo: function (index) {
          window.location.href = 'DetailsOfGoods.html?id=' + index + '&t=' + new Date().getTime()
        },
        back: function () {
          window.location.href = 'index.html?t=' + new Date().getTime()
        }
      },
      computed: {},
      watch: {
        keyword:function (newValue,oldValue) {
          this.page=1;
          this.keyword=newValue;
          getData({keyword:newValue,page:1,pageSize:10})
        }
      }
    });
  }

  return App;
})();


