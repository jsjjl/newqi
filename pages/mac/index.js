//获取应用实例
var app = getApp();

Page({
  data: {
    array: [],
    index: 0,
  },

  // 数据切换
  bindPickerChange: function (e) {
    let that = this;
    console.log('picker发送选择改变，携带值为111', e.detail.value)
    console.log("areaId", that.data.array[e.detail.value].areaId);


    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/common/changeArea',
      method: 'get',
      data: {
        areaId: that.data.array[e.detail.value].areaId,
        userId: that.data.array[e.detail.value].userId,
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {

          wx.setStorageSync("areaId", that.data.array[e.detail.value].areaId);
  wx.setStorageSync("areaName", that.data.array[e.detail.value].areaName);

          that.setData({
            areaId: that.data.array[e.detail.value].areaId,
            index: e.detail.value
          })

          that.setData({
            ec2: false
          })

          // that.getD();
        } else {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/index',
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
         if (res.data.code == 401) {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/index',
          })
          return
        }
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


  onShow() {
    let that = this;
    that.getlist0();
  },

  navindex() {
    console.log(111);
    wx.navigateTo({
      url: '/pages/old_home/index',
    })
  },


  nav1() {
    console.log(111);
    wx.navigateTo({
      url: '/pages/give_v1/g1',
    })
  },

  nav2() {
    wx.navigateTo({
      url: '/pages/give_v1/g2',
    })
  },

  nav3() {
    wx.navigateTo({
      url: '/pages/give_v1/g3',
    })
  },


  dnav1() {
    console.log(111);
    wx.navigateTo({
      url: '/pages/device_v1/d1',
    })
  },

  dnav2() {
    wx.navigateTo({
      url: '/pages/device_v1/d2',
    })
  },

  dnav3() {
    wx.navigateTo({
      url: '/pages/device_v1/d3',
    })
  },

  dnav4() {
    wx.navigateTo({
      url: '/pages/device_v1/d4',
    })
  },


  cnav1() {
    console.log(111);
    wx.navigateTo({
      url: '/pages/count_v1/c1',
    })
  },

  cnav2() {
    wx.navigateTo({
      url: '/pages/count_v1/c2',
    })
  },

  cnav3() {
    wx.navigateTo({
      url: '/pages/count_v1/c3',
    })
  },

  cnav4() {
    wx.navigateTo({
      url: '/pages/count_v1/c4',
    })
  },

  cnav5() {
    wx.navigateTo({
      url: '/pages/count_v1/c5',
    })
  },

  cnav6() {
    wx.navigateTo({
      url: '/pages/count_v1/c6',
    })
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
        if (res.data.code == 401) {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/index',
          })
          return
        }

        if (res.data.code == 200) {
          let temp = res.data.data;
          that.setData({
            array: temp
          });
          // if(!wx.getStorageSync("areaId")){
          //   wx.setStorageSync("areaId", temp[0].areaId);
          //   wx.setStorageSync("areaName", temp[0].areaName);
          // }

            //       that.setData({
          //         index: index
          //       });

          // if (temp.length > 1) {
            that.setData({
              arrayshow: true
            });
            temp.forEach((element, index) => {
              if (element.isDefault == 1) {
                that.setData({
                  index: index
                });
                      if(!wx.getStorageSync("areaId")){
 wx.setStorageSync("areaId", temp[index].areaId);
            wx.setStorageSync("areaName", temp[index].areaName);
                      }

              }
            });
          // } else {
          //   that.setData({
          //     arrayshow: false
          //   });

          // }




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
         wx.redirectTo({
        url: '/pages/login/index',
      })
        }
      }
    })
  },

});

