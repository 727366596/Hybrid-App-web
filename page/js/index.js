/**
 * HOME页
 * Created by ChengLong on 2018/7/17.
 */
var A = (function () {
  var App = {};

  App.init = function () {
    initVue();
  };

  function initVue() {
    new Vue({
      el: "#app",
      data: {
        active: 0,
        bannerList: [
          '../style/images/banner1.jpg'
        ],
        menuList: [
          { title: '基地管理', icon: 'points', url: '', navigateType: 'app'},
          { title: '采货单', icon: 'logistics', url: 'ReceiptOfGoods.html', navigateType: 'h5'},
        ],
      },
      created: function () {
        window.view = this;
      },
      methods: {
        menuNavigateTo: function (menu) {
          if(menu.navigateType === 'app'){
            U.navigateTo('baseMgmt');
          } else if(menu.navigateType === 'h5'){
            window.location.href = menu.url + '?t=' + new Date().getTime()
          }
        },
        navigateToOrderModule: function () {
          window.location.href = 'AddOrder.html?t=' + new Date().getTime()
        },
      },
      computed: {},
      watch: {
        active: function (newValue, oldValue) {
          if(newValue === 1){
            this.navigateToOrderModule();
          } else if (newValue === 2) {
            window.location.href = 'myInfo.html?t=' + new Date().getTime()
          }

        }
      }
    });
  }

  return App;
})();

