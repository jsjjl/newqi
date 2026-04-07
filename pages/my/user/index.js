

Page({
  data: {
    user: '',
    avatar: '',
    nickName: '',
    newavatar: '',
    deptName: ""
  },

  onShow: function () {
    this.setData({
      nickName: wx.getStorageSync('user').user.nickName,
      avatar: wx.getStorageSync('user').user.avatar,
      deptName: wx.getStorageSync('user').user.dept ? wx.getStorageSync('user').user.dept.deptName : '',
      phonenumber: wx.getStorageSync('user').user.phonenumber,
    })
  },
  xgmm() {
    wx.navigateTo({
      url: '/pages/my/pwd/index',
    })
  },


  onChooseAvatar(e) {
    console.log("avatar11", e);

    this.setData({
      avatar: e.detail.avatarUrl
    })

    console.log("avatar", e.detail.avatarUrl);

    this.uploadtx()
  },

  //上传图片到服务器 
  uploadtx(i) {
    var that = this

    // 上传文件
    wx.uploadFile({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/user/profile/avatar',// 替换为实际的服务器地址
      filePath: that.data.avatar, // 文件的本地路径
      name: 'avatarfile', // 后端接收文件的字段名
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      formData: {}, // 如果有其他表单数据可以在这里添加
      success(res) {
        // 上传成功后的回调
        console.log('上传成功:', res.data);

        if (res.data.code == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })

          setTimeout(function () {

            that.getUser()
          }, 1000)
          // wx.redirectTo({
          //   url: '/pages/index/index',
          // });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

      },
      fail(err) {
        // 上传失败后的回调
        console.error('上传失败:', err);
      }
    });


    // // wx.uploadFile({
    // wx.request({
    //   url: 'https://medicalgas.lygyy.com.cn/prod-api/system/user/profile/avatar',
    //   filePath: that.data.avatar,
    //   name: 'avatarfile',
    //   // post
    //   method: 'POST',

    //   header: {
    //     Authorization: wx.getStorageSync('token'),
    //     clientid: wx.getStorageSync('clientid')
    //   },
    //   data: {
    //     'avatarfile': that.data.avatar,
    //   },
    //   formData: {
    //     'Authorization': wx.getStorageSync('token'),
    //     'content-type': 'multipart/form-data'
    //   },
    //   success: function success(res) {
    //     console.log(res);


    //     if (res.statusCode == 200) {

    //       console.log("ddd", JSON.parse(res.data));
    //       // that.data.post_image.push(JSON.parse(res.data).data.url)
    //       // that.setData({
    //       //   avatar:JSON.parse(res.data).data.imgUrl
    //       // })
    //       // console.log("newavatar", that.data.avatar);

    //       that.getUser()

    //       // that.submit()
    //     }

    //   },
    //   fail: function fail(error) {
    //     console.log(error);
    //     // reject(error);
    //   },
    //   complete: function complete(aaa) {
    //     // 加载完成
    //   }
    // });

  },

  //上传图片到服务器 
  uploadSomeMsg(i) {
    var that = this


    wx.uploadFile({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/resource/oss/upload',
      filePath: that.data.avatar,
      name: 'file',
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      formData: {
        'Authorization': wx.getStorageSync('token'),
      },
      success: function success(res) {
        console.log(res);


        if (res.statusCode == 200) {
          if (!JSON.parse(res.data).data) {
            wx.hideLoading()
            wx.showToast({
              title: JSON.parse(res.data).msg,
              icon: 'none',
            });
            that.setData({ isSubmitting: false }); // 复位提交状态
            return
          }
          console.log("ddd", JSON.parse(res.data).data.url);
          // that.data.post_image.push(JSON.parse(res.data).data.url)
          that.setData({
            newavatar: JSON.parse(res.data).data.url
          })

          that.submit()
        }

      },
      fail: function fail(error) {
        console.log(error);
        // reject(error);
      },
      complete: function complete(aaa) {
        // 加载完成
      }
    });

  },

  getUser() {


    let that = this
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/getInfo',
      method: 'get',
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      // header: header,
      success: function success(res) {
        if (res.data.code == 200) {
          wx.setStorageSync('user', res.data.data.user);
          wx.setStorageSync('roles', res.data.data.roles);
          wx.setStorageSync('permissions', res.data.data.permissions);
          wx.setStorageSync('roles', res.data.data.roles);

          wx.setStorageSync('username', res.data.data.username);
          wx.setStorageSync('deptName', res.data.data.deptName);



          // wx.redirectTo({
          //   url: '/pages/index/index',
          // });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

      },

    });
  },

  submit() {
    console.log("submitsubmitsubmit");
    let that = this

    let temp = {}
    if (this.data.nickName) {
      temp.nickName = this.data.nickName
    }
    if (this.data.deptName) {
      temp.deptName = this.data.deptName
    }
    if (this.data.phonenumber) {
      temp.phonenumber = this.data.phonenumber
    }

    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/user/profile',
      method: 'PUT',
      data: temp,
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success: function success(res) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {

          that.getUser()
        }, 1000)


      },

    });



  },
  bindKeydeptName: function (e) {
    if(this.data.deptName === e.detail.value) return;
    this.setData({
      deptName: e.detail.value
    })

    this.submit()
  },

  bindKeyPhone: function (e) {
    if(this.data.phonenumber === e.detail.value) return;
    this.setData({
      phonenumber: e.detail.value
    })

    this.submit()
  },

  bindKeyInput: function (e) {
    if(this.data.nickName === e.detail.value) return;
    this.setData({
      nickName: e.detail.value
    })

    this.submit()
  },

  exit() {
    wx.showModal({
      title: '提示',
      content: '您确定要退出吗？',
      success(res) {
        if (res.confirm) {


          wx.removeStorage({
            key: 'username',
          })
          wx.removeStorage({
            key: 'deptName',
          })
          wx.removeStorage({
            key: 'token',
          })
          wx.removeStorage({
            key: 'clientid',
          })
          wx.removeStorage({
            key: 'routers',
          })
          wx.removeStorage({
            key: 'permissions',
          })

          wx.removeStorage({
            key: 'roles',
          })

          wx.removeStorage({
            key: 'user',
          })

         wx.redirectTo({
        url: '/pages/login/index',
      })
        } else if (res.cancel) {

        }
      }
    });
  },

})