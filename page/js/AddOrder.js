/**
 * 采货单——新增货单
 * Created by Yuffie on 2018/7/16.
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
        form: {
          catName: '', //作物
          catId: '', //作物id
          categoryName: '', //品种
          categoryId: '', //品种id

          quatity: '', //采货量
          quatityUnitName: '吨', //采货量单位
          quatityUnitId: 1, //采货量单位CODE  1:吨，2：斤
          price: '', //单价

          sourceFarmName: '', //货源地基地名称
          sourceFarmId: '', //货源地基地id
          sourceLandName: '', //货源地地块名称
          sourceLandId: '', //货源地地块id
          contact: '', //联系人
          telephone: '', //手机号

          storageName: '', //仓库name
          storageId: '', //仓库id
          receiverName: '', //接货人name
          receiverId: '', //id
          expectDeliverTime: '', //预计到货时间

          senderPicIds: [], //图片

          senderRemark: '', //备注
        },
        cropSourceShow: false,
        cropSource: {
          /*'马铃薯': [{text: '马铃薯一号', id: 'a', parentId: 1}, {text: '马铃薯二号', id: 'b', parentId: 1}],
          '西蓝花': [{text: '西蓝花一号', id: 'c', parentId: 2}, {text: '西蓝花二号', id: 'd', parentId: 2}]*/
        },

        quatityUnitSourceShow: false,
        quatityUnitSource: [
          {text: '吨', id: 1},
          {text: '斤', id: 2},
        ],

        sourceFarmActiveNames: [],
        sourceFarmSearchValue: '',
        sourceFarmShow: false,
        sourceFarmSource: [],
        sourceFarmName: '',
        sourceFarmPage: 1,
        sourceFarmPageSize: 15,
        sourceFarmLoading: false,
        sourceFarmFinished: false,

        storageSearchValue: '',
        storageSourceShow: false,
        storageSource: [],
        storageName: '',
        storagePage: 1,
        storagePageSize: 10,
        storageLoading: false,
        storageFinished: false,

        receiverSourceValue: '',
        receiverSourceShow: false,
        receiverSource: [],
        receiverName: '',
        receiverSourceFilter: [],

        dateSourceShow: false,
        currentDate: new Date(),
        showAction: false
      },
      mounted: function (){
        window.view = this;
        var that = this;
        Promise.all([this.getCropList(),this.getStorageList(), this.getUserList(), this.getFarmLandList()]).then(function (res) {
          that.cropSource = res[0];
          that.storageSource = that.storageSource.concat(res[1]);
          that.receiverSourceFilter = that.receiverSource = res[2];
          that.sourceFarmSource = that.sourceFarmSource.concat(res[3]);
        }).catch(function (err) {
          U.alert(err || '请求失败')
        });
      },
      methods: {
        /*选择作物*/
        onCropConfirm: function (values, index) {
          this.form.catName = values[0];
          this.form.catId = values[1].parentId;
          this.form.categoryName = values[1].text;
          this.form.categoryId = values[1].id;
          this.cropSourceShow = false;
        },
        onCropChange(picker, values) {
          picker.setColumnValues(1, this.cropSource[values[0]]);
        },

        /*选择采货量单位*/
        onCountUnitConfirm: function (item) {
          this.form.quatityUnitName = item.text;
          this.form.quatityUnitId = item.id;
          this.quatityUnitSourceShow = false;
        },

        /*搜索基地|选择基地和地块*/
        loadingSourceFarm: function(){
          var that = this;
          setTimeout(function () {
            that.getFarmLandList().then(function (res) {
              that.sourceFarmLoading = false;
              that.sourceFarmSource = that.sourceFarmSource.concat(res);
            }).catch(function (err) {
              U.alert(err || '请求失败')
            })
          }, 500);
        },
        searchSourceFarm: function (){
          var that = this;
          this.sourceFarmPage = 1;
          this.sourceFarmFinished = false;
          this.sourceFarmSource = [];
          this.sourceFarmName = this.sourceFarmSearchValue;
          this.getFarmLandList().then(function (res) {
            that.sourceFarmSource = that.sourceFarmSource.concat(res);
          }).catch(function (err) {
            U.alert(err || '请求失败')
          })
        },
        onAddressConfirm: function (base, field){
          this.form.sourceFarmName = base.name || '';
          this.form.sourceFarmId = base.id || '';
          this.form.sourceLandName = field.name || '';
          this.form.sourceLandId = field.id || '';
          this.form.contact = base.contact || '';
          this.form.telephone = base.telephone || '';
          this.sourceFarmShow = false;
        },

        /*加载仓库|搜索仓库|选择仓库*/
        loadingStorage: function(){
          var that = this;
          setTimeout(function () {
            that.getStorageList().then(function (res) {
              that.storageLoading = false;
              that.storageSource = that.storageSource.concat(res);
            }).catch(function (err) {
              U.alert(err || '请求失败')
            })
          }, 500);
        },
        searchStorage: function(){
          var that = this;
          this.storagePage = 1;
          this.storageFinished = false;
          this.storageSource = [];
          this.storageName = this.storageSearchValue;
          this.getStorageList().then(function (res) {
            that.storageSource = that.storageSource.concat(res);
          }).catch(function (err) {
            U.alert(err || '请求失败')
          })
        },
        onStorageConfirm: function (storage){
          this.form.storageName = storage.name;
          this.form.storageId = storage.id;
          this.storageSourceShow = false;
        },

        /*选择收货人*/
        onReceiverConfirm: function (receiver){
          this.form.receiverName = receiver.name;
          this.form.receiverId = receiver.id;
          this.receiverSourceShow = false;
        },
        searchReceiver: function(){
          this.receiverName = this.receiverSourceValue;
        },

        /*选择预计到货时间*/
        onDateConfirm: function (value, index) {
          this.form.expectDeliverTime = U.dateFormat(value, "YYYY-MM-DD hh:mm");
          this.dateSourceShow = false;
        },

        /*提交*/
        submit: function () {
          var that = this;
          var params = {
            catId: this.form.catId,// 作物大类ID
            categoryId: this.form.categoryId,// 作物小类ID

            quatity: this.form.quatity,// 采货量
            quatityUnitId: this.form.quatityUnitId,// 采货量单位CODE  1:吨，2：斤
            price: this.form.price,// 单价

            sourceFarmId: this.form.sourceFarmId,// 货源基地ID
            sourceLandId: this.form.sourceLandId,// 货源地块ID
            contact: this.form.contact,// 联系人名字
            telephone: this.form.telephone,// 联系人电话

            storageId: this.form.storageId,// 仓库ID
            receiverId: this.form.receiverId,// 接货人ID
            expectDeliverTime: this.form.expectDeliverTime,//预计到货时间
            senderPicIds:'',
            senderRemark: this.form.senderRemark,// 发货备注
          };
          params.senderPicIds = this.form.senderPicIds.map(function (pic) {
            return pic.url;
          }).join(',');

          var flag = this.verification(params);
          if(typeof flag === 'string'){
            U.toast(flag);
            return;
          }
          this.saveOrder(params).then(function (res) {
            U.alert('保存成功', function () {
              that.back();
            });
          }).catch(function (err) {
            U.alert(err);
          })
        },
        /*验证*/
        verification: function(data){
          var v = {
            catId: {required: true, requiredMsg: '请选择作物'},// 作物大类ID
            categoryId: {required: true, requiredMsg: '请选择作物'},// 作物小类ID

            quatity: {required: true, requiredMsg: '请填写采货量'},// 采货量
            quatityUnitId: {required: true, requiredMsg: '请填写采货量单位'},// 采货量单位CODE  1:吨，2：斤
            price: {required: true, requiredMsg: '请填写单价'},// 单价

            sourceFarmId: {required: true, requiredMsg: '请选择货源地'},// 货源基地ID
            sourceLandId: {required: true, requiredMsg: '请选择货源地'},// 货源地块ID
            contact: {required: true, requiredMsg: '请填写联系人'},// 联系人名字
            telephone: {required: true, requiredMsg: '请填写手机号'},// 联系人电话

            storageId: {required: true, requiredMsg: '请选择仓库'},// 仓库ID
            receiverId: {required: true, requiredMsg: '请选择接货人'},// 接货人ID
            expectDeliverTime: {required: true, requiredMsg: '请选择到货时间'},//预计到货时间
          };
          var flag = true;
          for(var key in v){
            var value = data[key];
            if(v[key].required && value === ''){
              flag = v[key].requiredMsg;
              return flag;
            }
            if(key === 'quatity' || key === 'price' ){
              /*数字类型，正数，整数部分8位+小数部分2位*/
              if(!(isvalidNumberInteger(value, 8) && isvalidNumberDecimal(value))){
                flag = (key === 'quatity' ? '采货量': '单价') + '整数不得大于8位，支持保留两位小数';
                return flag;
              }
            }
            if(key === 'telephone' && !isvalidPhone(value)){
              flag = '请输入正确的手机号';
              return flag;
            }
          }
          return flag;
        },
        /*返回*/
        back: function () {
          window.location.href = 'index.html?t=' + new Date().getTime();
        },

        /*获取作物种类列表*/
        getCropList: function () {
          return new Promise(function (resolve, reject) {
            var params = {
              url: "psDicCategory/cropList",
            };
            var callbacks = {
              success_0: function (res) {
                var arr = {};
                res.map(function (cat) {
                  var children = cat.categories.map(function (category) {
                    return {
                      text: category.catName,
                      id: category.id,
                      parentId: cat.id
                    }
                  });
                  arr[cat.catName] = children;
                });
                resolve(arr);
              },
              success_1: function (err) {
                reject(err);
              }
            };
            U.post(params, callbacks);
          });
        },
        /*获取仓库列表*/
        getStorageList: function (data) {
          var that = this;
          return new Promise(function (resolve, reject) {
            var params = {
              url: "psStorage/storageList",
              showLoading: false,
              data: {
                page: that.storagePage,
                pageSize: that.storagePageSize
              }
            };
            if(that.storageName){
              params.data.name = that.storageName;
            }
            that.storagePage++;
            var callbacks = {
              success_0: function (res){
                if(res.rows.length === 0) {
                  that.storageFinished = true;
                }
                resolve(res.rows);
              },
              success_1: function (err){
                reject(err);
              }
            };
            U.post(params, callbacks);
          });
        },
        /*获取货源地*/
        getFarmLandList: function (data) {
          var that = this;
          return new Promise(function (resolve, reject) {
            var params = {
              url: "psDelimitLand/farmLandList",
              showLoading: false,
              data: {
                page: that.sourceFarmPage,
                pageSize: that.sourceFarmPageSize
              }
            };
            if(that.sourceFarmName){
              params.data.name = that.sourceFarmName;
            }
            that.sourceFarmPage++;
            var callbacks = {
              success_0: function (res){
                if(res.rows.length === 0) {
                  that.sourceFarmFinished = true;
                }
                res.rows = res.rows.map(function (farm) {
                  var land = farm.landdtos.map(function (land) {
                    return {
                      id: land.id,
                      name: land.name
                    }
                  });
                  return {
                    id: farm.id,
                    name: farm.name,
                    contact: farm.contact,
                    telephone: farm.telephone,
                    children: land
                  }
                });
                resolve(res.rows);
              },
              success_1: function (err){
                reject(err);
              }
            };
            U.post(params, callbacks);
          });
        },
        /*获取接货人列表*/
        getUserList: function () {
          return new Promise(function (resolve, reject) {
            var params = {
              url: "psSysUser/selectUserList"
            };
            var callbacks = {
              success_0: function (res){
                res = res.map(function (item) {
                  return {name: item.name, id: item.id}
                });
                resolve(res);
              },
              success_1: function (err){
                reject(err);
              }
            };
            U.post(params, callbacks);
          });
        },
        /*提交表单接口*/
        saveOrder: function (data) {
          return new Promise(function (resolve, reject) {
            var params = {
              url: "psShippment/add",
              data: data
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
        },
      },
      computed: {
        /*货源地*/
        sourceSupply: function (){
          if(this.form.sourceFarmId && this.form.sourceLandId){
            return this.form.sourceFarmName + ' - ' + this.form.sourceLandName;
          }
          return '';
        },
        crop: function () {
          if(this.form.catId && this.form.categoryId){
            return this.form.catName + ' - ' + this.form.categoryName;
          }
          return '';
        },
        cropSourceColumns: function () {
          return [
            {
              values: Object.keys(this.cropSource),
            },
            {
              values: this.cropSource[Object.keys(this.cropSource)[0]]
            },
          ]
        }
      },
      watch: {
        receiverName: {
          handler: function (val, oldVal) {
            if(val === oldVal) return;
            if(val === ''){
              this.receiverSourceFilter = this.receiverSource;
            }
            this.receiverSourceFilter = this.receiverSource.filter(function (item){
              return (item["name"].indexOf(val) !== -1);
            });
          },
          deep: true
        },
        'form.contact': {
          handler: function (val) {
            if(val.length > 10){
              this.form.contact = val.slice(0, 10);
            }
          },
          deep: true
        },
        'form.senderRemark': {
          handler: function (val) {
            if(val.length > 100){
              this.form.senderRemark = val.slice(0, 100);
            }
          },
          deep: true
        },
        'form.quatity': {
          handler: function (val) {
            if(isNaN(val)){
              this.form.quatity = '';
            }
          },
          deep: true
        },
        'form.price': {
          handler: function (val) {
            if(isNaN(val)){
              this.form.price = '';
            }
          },
          deep: true
        },
        'form.telephone': {
          handler: function (val) {
            if(isNaN(val)){
              this.form.telephone = '';
            }
          },
          deep: true
        },
      }
    });
  }

  /*不大于n位整数*/
  function isvalidNumberInteger(value, n) {
    var reg = new RegExp("^\\d+$");
    value = value + '';
    value = value.split('.')[0];
    if (!value || !value.length) {
      return true
    } else {
      return (value.match(reg) && value.length <= n);
    }
  }

  /*不大于n位小数*/
  function isvalidNumberDecimal(value, n) {
    if (typeof n === 'undefined' || n === 0) {
      n = 2;
    }
    var regstr = '/(^\\d+(?:\\.\\d{1,' + n + '})?$)|(^\\d+(?:\\.)?$)/';
    var regexp = eval(regstr);
    return (!isNaN(value) && regexp.test(value));
  }

  /*手机号*/
  function isvalidPhone(value) {
    var reg = /^1[0-9]\d{9}$/;
    return reg.test(value);
  }

  return App;
})();

