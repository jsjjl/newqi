//获取应用实例
var app = getApp();

Page({
  data: {
    user: {},
    getlast: '',
    gasLendCount: 0,
    opsWxTaskCount: 0,
  },


  onShow() {
    let that = this;
    that.getuser();
    this._gasLendCount();
    this._opsWxTask_count();
  },
  go(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: e.currentTarget.dataset.id
    })

  },

  _opsWxTask_count() {

    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/opsWxTask/todayTask/count',
      method: 'get',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {

          console.log(res.data.data);
          that.setData({
            opsWxTaskCount: res.data.data
          })

        }
      },

    });
  },


  _gasLendCount() {

    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/wx/device/gasLendCount',
      method: 'get',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {

          console.log(res.data.data);
          that.setData({
            gasLendCount: res.data.data
          })

        }
      },

    });
  },

  getuser() {
    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/getInfo',
      method: 'get',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {

        if (res.data.code == 401) {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/index',
          })
          return
        }

        if (res.data.code == 200) {

          wx.setStorageSync('user', res.data.data);
          let temp = res.data.data.user.userId;
          //  显示后四位
          temp = temp.toString().substr(temp.length - 4);
          console.log(res.data.data);
          that.setData({
            user: res.data.data,
            getlast: temp
          })




        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },

    });
  },



  getlist0() {
    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/common/getAreas',
      method: 'get',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {
          let temp = res.data.data;
          that.setData({
            array: temp
          });

          if (temp.length > 1) {
            that.setData({
              arrayshow: true
            });
            temp.forEach((element, index) => {
              if (element.isDefault == 1) {
                that.setData({
                  index: index
                });
              }
            });
          } else {
            that.setData({
              arrayshow: false
            });
          }




        }

      },

    });
  },



  onLoad: function () {
    const _this = this
    // console.log("dddd", wx.getStorageSync('token'));
    if (!wx.getStorageSync('token')) {
      wx.redirectTo({
        url: '/pages/login/index',
      })
    }
    // that.getD();
  },



  tc() {
    //提示退出确定后
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('user')
          wx.removeStorageSync('permissions')
          wx.removeStorageSync('roles')


          if (wx.getStorageSync('areaId')) {
            wx.removeStorageSync('areaId')
          }

          if (wx.getStorageSync('areaName')) {
            wx.removeStorageSync('areaName')
          }


          wx.redirectTo({
            url: '/pages/login/index',
          })
        }
      }
    })
  },

});

