Page({
  data: {
    username: '',//loadmin
    password: '',//MG@loadmin2024
    xs: false,
    isLogining: false, // 新增
  },

  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    });
  },


  onShow: function () {
    if (wx.getStorageSync('token')) {

      wx.request({
        url: 'https://medicalgas.lygyy.com.cn/prod-api/home/oxygen/show',
        method: 'get',
        data: {
          areaId: wx.getStorageSync('areaId'),
        },
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success: function success(res) {
          if (res.data.code == 200) {
            let redirectUrl = wx.getStorageSync('redirectAfterLogin');
            if (redirectUrl) {
              wx.removeStorageSync('redirectAfterLogin');
              wx.navigateTo({
                url: redirectUrl,
                fail: () => {
                  wx.switchTab({ url: '/pages/home/index' });
                }
              });
            } else {
              wx.switchTab({
                url: '/pages/home/index'
              });
            }
          } else {
            wx.removeStorageSync('token')
            this.setData({
              xs: true
            })
          }
        }
      })
    } else {
      this.setData({
        xs: true
      })
    }
  },


  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },


  onLoginTap() {
    if (this.data.isLogining) return;
    if (!this.data.username || !this.data.password) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none'
      });
      return;
    }
    // 这里应该是调用后端接口进行登录验证
    // 例如: this.login(this.data.username, this.data.password)
    console.log('尝试登录:', this.data.username, this.data.password);
    this.setData({ isLogining: true });
    let that = this;
    wx.showLoading({
      title: '登录中',
      mask: true
    });
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/login',
      method: 'POST',
      data: {
        username: that.data.username,
        password: that.data.password,
      },
      // header: header,
      success: function success(res) {
        wx.hideLoading();
        that.setData({ isLogining: false });
        if (res.data.code == 200) {

          wx.setStorageSync('token', 'Bearer ' + res.data.data.token);

          that.getAreas();
          // wx.showToast({
          //   title: '登录成功'
          // })
          // setTimeout(() => {

          //   wx.switchTab({
          //     url: '/pages/home/index',
          //     success: function (e) {
          //      page.onLoad();
          //     }
          //   })
          // }, 1000);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail() {
        wx.hideLoading();
        that.setData({ isLogining: false });
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }

    });
    
  },
  getAreas() {
    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/common/getAreas',
      method: 'get',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {
          let defaultAreaIds = res.data.data
            .filter(area => area.isDefault == 1)
            .map(area => area.areaId);
             let defaultAreaName = res.data.data
            .filter(area => area.isDefault == 1)
            .map(area => area.areaName);
          defaultAreaIds = defaultAreaIds[0];
          wx.setStorageSync('areaId', defaultAreaIds);
          wx.setStorageSync('areaName', defaultAreaName[0]);

          that.getuser();


        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
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
        if (res.data.code == 200) {

          wx.setStorageSync('user', res.data.data);

          wx.setStorageSync('permissions', res.data.data.permissions);
          wx.setStorageSync('roles', res.data.data.roles);

          wx.showToast({
            title: '登录成功'
          })
          setTimeout(() => {
            let redirectUrl = wx.getStorageSync('redirectAfterLogin');
            if (redirectUrl) {
              wx.removeStorageSync('redirectAfterLogin');
              wx.navigateTo({
                url: redirectUrl,
                fail: () => {
                  wx.switchTab({ url: '/pages/home/index' });
                }
              });
            } else {
              wx.switchTab({
                url: '/pages/home/index'
              });
            }
          }, 1000);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },

    });
  }
});


