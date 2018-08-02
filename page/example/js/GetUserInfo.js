/**
 * 采货单——新增货单
 * Created by Yuffie on 2018/7/16.
 */
function initVue() {
  window.view = new Vue({
    el: "#app",
    data: {
      images1: [{url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531744557022&di=6e82d2482547e51293b83ca624a7d056&imgtype=jpg&src=http%3A%2F%2Fimg4.imgtn.bdimg.com%2Fit%2Fu%3D704112284%2C47432911%26fm%3D214%26gp%3D0.jpg'}], //图片
      images2: []
    },
    created: function () {

    },
    methods: {
      submit: function () {
        console.log('submit');
      }
    },
    computed: {

    },
    watch: {

    }
  });
}

