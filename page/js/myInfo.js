/**
 * 工作上报菜单
 * Created by Yuffie on 2017/9/11.
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
        active: 2,
        info: {
          avatar: '../style/images/avatar.png',
          name: JSON.parse(window.localStorage.getItem('__userinfo'))['userName'],
          company: JSON.parse(window.localStorage.getItem('__userinfo'))['companyName'],
        }
      },
      created: function () {
        window.view = this;
      },
      methods: {
        /*修改密码*/
        changePassword: function () {
          U.navigateTo('changePsw');
        },
        /*重新登陆*/
        /*login:function(){
          U.navigateTo('login');
        },*/
        goToAdd: function () {
          window.location.href = 'AddOrder.html?t=' + new Date().getTime()
        },
      },
      computed: {},
      watch: {
        active: function (newValue, oldValue) {
          if (newValue === 1) {
            this.mavigateToOrderModule();
          } else if (newValue === 0) {
            window.location.href = 'index.html?t=' + new Date().getTime()
          }

        }
      }
    });
  }

  return App;
})();

