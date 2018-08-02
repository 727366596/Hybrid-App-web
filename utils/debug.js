/**
 * web下接口调试 引用
 * Created by Yuffie on 2017/7/25.
 * 针对手机端 依赖 vant && （zepto || jquery） && utils.js
 */

/*模拟手机端接口*/
var Mobile = {
  useCaptureImage: function (option, cb) {
    window.useSuccess(JSON.stringify([{
      imgName: "a.jpg",
      url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531744557022&di=6e82d2482547e51293b83ca624a7d056&imgtype=jpg&src=http%3A%2F%2Fimg4.imgtn.bdimg.com%2Fit%2Fu%3D704112284%2C47432911%26fm%3D214%26gp%3D0.jpg',
    }]));
  },
  getUserInfo: function () {
    return JSON.stringify({
      token: 'f5d0f2b9b53513b4fd6d53a8c376f560'
    })
  },
  navigateTo: function (page) {
    U.alert('跳转页面' + page)
  },
};


