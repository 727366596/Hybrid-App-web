/**
 * 图片选择
 * Created by Yuffie on 2017/12/1.
 */

/*var image = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531744557022&di=6e82d2482547e51293b83ca624a7d056&imgtype=jpg&src=http%3A%2F%2Fimg4.imgtn.bdimg.com%2Fit%2Fu%3D704112284%2C47432911%26fm%3D214%26gp%3D0.jpg';
var Mobile = {};
Mobile.useCaptureImage = function (option, cb) {
  /!*var res = JSON.stringify({
    code: 0,
    data: [{url: image}]
  });
  cb(res);*!/
  useSuccess(JSON.stringify([{url: image}]))
};*/

Vue.component('select-image', {
  data: function () {
    return {
      viewType: 'PhotoTaker',
    };
  },
  props: {
    value: {
      type: Array,
      default: function () {
        return []
      },
    },
    type: {
      type: String,
      default: "normal",
    },
    label: {
      type: [String, Number],
      required: true,
    },
    hint: {
      type: [String, Number],
      default: '',
    },
    validate: {
      type: Object,
      value: {},
    },
    canSelect: {
      type: Boolean,
      default: false,
    },
    canModife: {
      type: Boolean,
      default: true,
    },
    maxPicCount: {
      type: Number,
      default: 20,
    },
    imageSize: {
      type: Number,
      default: 4,
    },
    imageTakeText: {
      type: String,
      default: function () {
        return this.canSelect ? "选择图片" : "拍摄图片"
      },
    },
  },
  computed: {
    photoType: function () {
      return this.imageTakeText;
    },
    isReadOnly: function () {
      return this.type !== "readOnly";
    },
  },
  methods: {
    /*图片操作组件*/
    photoTaker: function () {
      if (this.type === "readOnly") {
        return;
      }
      if(this.value.length === this.maxPicCount){
        U.toast('最多只能拍摄' + this.maxPicCount + '张图片');
        return;
      }
      var that = this;
      var captureType = this.canSelect ? 2 : 1;
      var option = {
        captureType: captureType,
      };
      window.useSuccess = function (imgArr) {
        imgArr.map(function (img) {
          that.value.push({url: img.url});
        });
      };
      U.useCaptureImage(option, function (res) {
        res = JSON.parse(res);
        if (res.code === 0){
          res.data.map(function (img) {
            that.value.push({url: img.url});
          });
        }
      });
    },
    downDelPhoto: function (imgIndex) {
      this.value.splice(imgIndex, 1);
    },
    showPhoto: function (image) {
      this.$emit('show-photo', image);
    },
  },
  template:
  '<div class="m-select-image">' +
    '<div class="m-image-label" v-if="label">{{label}}</div>' +
    '<van-row>' +
      '<van-col span="8" class="m-image-item" v-show="isReadOnly">' +
        '<div class="m-image-wrap" @click="photoTaker">' +
          '<div class="m-image-camera">' +
            '<div>{{photoType}}</div>' +
          '</div>' +
        '</div>' +
      '</van-col>' +
      '<van-col span="8" class="m-image-item" v-show="!isReadOnly && value.length === 0">' +
        '<div class="m-image-wrap">' +
          '<div class="m-image-camera">' +
            '<div>无图片</div>' +
          '</div>' +
        '</div>' +
      '</van-col>' +
      '<van-col span="8" class="m-image-item" v-for="(image, index) in value" :key="index">' +
        '<div class="m-image-wrap">' +
          '<div class="m-image-btn-del" v-show="isReadOnly" @click="downDelPhoto(index)"></div>' +
          '<img class="m-image-img" :src="image.url">' +
        '</div>' +
      '</van-col>' +
    '</van-row>' +
  '</div>'
});
