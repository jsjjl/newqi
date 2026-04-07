//获取应用实例
var app = getApp();
Page({
  data: {
    oldPassword:'',
    newPassword:'',
    newPassword2:'',
    companyName: "",
        address:  "",
        contact:  "",
        contactPhone:  "",
        introduction:  "",
        bankAddress:  "",
        bankAccount:  "",
        bankName:  "",
        legalPerson:  "",
        email:  "",
        businessLicense: "",

        newpictureIds: "",
        newpictureIds_id:'',
        pictureIds: "",
        array: '',

        img_arr: [],
        post_image: [],
        post_ossId: [],
    
        old_array: [], isLogining: false, // 新增
  },
  onLoad: function () {
    const that = this
    


  },

  // 选择
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })

  },


  contactInput(e) {
    this.setData({
      oldPassword: e.detail.value
    })
  },
  contactInput2(e) {
    this.setData({
      newPassword: e.detail.value
    })
  },
  contactInput3(e) {
    this.setData({
      newPassword2: e.detail.value
    })
  },

  contactPhoneInput: function (e) {
    this.setData({
      contactPhone: e.detail.value
    })
  },

  companyNameInput: function (e) {
    this.setData({
      companyName: e.detail.value
    })
  },

  addressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
  },


  emailInput: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  legalPersonInput: function (e) {
    this.setData({
      legalPerson: e.detail.value
    })
  },
  bankNameInput: function (e) {
    this.setData({
      bankName: e.detail.value
    })
  },
  bankAccountInput: function (e) {
    this.setData({
      bankAccount: e.detail.value
    })
  },

  bankAddressInput: function (e) {
    this.setData({
      bankAddress: e.detail.value
    })
  },
  introductionTextAreaBlur: function (e) {
    this.setData({
      introduction: e.detail.value
    })
  },

  bindPickerChangeCity: function (e) {
    console.log('自定义选择器点击的下标', e.detail.value)
    console.log('这一条的值', this.data.array[e.detail.value])


    this.setData({
      index: e.detail.value,
      pointId: this.data.array[e.detail.value].id
    })
  },






  //获取下拉
  getlist() {
    let that = this
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/wx/point/query/all',
      method: 'get',
      // data: {
      //   Authorization:this.data.tel,
      //   password:this.data.pwd,
      // },
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success: function success(res) {

        if (res.data.code == 200) {
          that.setData({
            array: res.data.rows,
            pointId: res.data.rows[0].id,
          })
        } else {

        }

      },

    });
  },

  onShow: function () {
    wx.hideHomeButton()
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  nav1() {
    wx.navigateTo({
      url: '/pages/task_list/task_list',
    })
  },
  switch1Change() {
    console.log(1111);
    this.setData({
      isAnonymous: !this.data.isAnonymous
    })


  },

  bindKeyInput: function (e) {
    this.setData({
      location: e.detail.value
    })
  },


  save() {  if (this.data.isLogining) return;

    let that = this;

    if (that.data.oldPassword == '' ) {

      wx.showToast({
        title: '请填写旧密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.newPassword == '' || that.data.newPassword2 == '' ) {

      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.newPassword != that.data.newPassword2 ) {

      wx.showToast({
        title: '2次新密码输入不同，请重新输入',
        icon: 'none',
        duration: 2000
      })
      return
    }

 


  that.setData({ isLogining: true });



    wx.showLoading({
      title: '提交中',
    })

    if (that.data.img_arr.length > 0) {
      that.uploadSomeMsg(0)
    }
     else {
      that.submit()
    }
    

  },
  submit() {
    let that = this

    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/user/profile/updatePwd?oldPassword='+that.data.oldPassword+'&newPassword='+that.data.newPassword,
      method: 'put',
      data: {
        // img_arr:
        // pointId:that.data.pointId,
        oldPassword: that.data.oldPassword,
        newPassword: that.data.newPassword,
      },
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success: function success(res) {
 wx.hideLoading();
      that.setData({ isLogining: false });
        if (res.data.code == 200) {
          wx.hideLoading()
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2500);
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })


        }

      },
    fail: () => {
      wx.hideLoading();
      that.setData({ isLogining: false });
      wx.showToast({ title: '网络错误', icon: 'none' });
    }

    });



  },




 
  //上传图片到服务器 
  uploadSomeMsg(i) {
    var that = this
    let aleng = that.data.img_arr.length - 1

    // for (let i = 0; i < that.data.img_arr.length; i += 1) {

    console.log("that.data.img_arr[i]", that.data.img_arr[i]);

    wx.uploadFile({
      url: 'https://kq.nenyacorp.com/prod-api/resource/oss/upload',
      filePath: that.data.img_arr[i].tempFilePath,
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
           if(!JSON.parse(res.data).data){
            wx.hideLoading()
           wx.showToast({
             title: JSON.parse(res.data).msg,
             icon: 'none',
           });
           
           that.setData({ isSubmitting: false }); // 复位提交状态
           return
          }
          let temp = that.data.post_image
          console.log("ddd111", temp);
          console.log("ddd", JSON.parse(res.data).data.url);
          that.data.post_image.push(JSON.parse(res.data).data.url)

          that.data.post_ossId.push(JSON.parse(res.data).data.ossId)


          // that.setData({
          //   post_image:temp
          // })
          console.log(aleng, i);
          if (aleng == i) {
            that.data.image = that.data.post_image.join()
            console.log("that.data.image", that.data.image);
            setTimeout(function () {

              if (that.data.filePath) {
                that.uploadvoice()
              } else {
                that.submit()
              }

            }, 50);

          } else {
            that.uploadSomeMsg(i + 1)
          }
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





    // }
  },





  //添加图片

  addimg() {
    let that = this
    wx.chooseMedia({
      count: 3 - that.data.img_arr.length, //上传图片的数量 当之前上传了部分图片时 ,总数 - 已上传数 = 剩余数   (限制上传的数量)
        mediaType: ['image',],
        sourceType: ['camera'],
        sizeType: ['compressed'], //压缩图片
      success: async res => {
        wx.showLoading({
          title: '上传中...',
          mask: true,
        });


        const address = wx.getStorageSync('username');;
        var now = new Date(); // 创建一个包含当前日期和时间的新Date对象

        var year = now.getFullYear(); // 获取完整的年份
        var month = ("0" + (now.getMonth() + 1)).slice(-2); // 获取月份（注意：月份是从0开始计数的）
        var day = ("0" + now.getDate()).slice(-2); // 获取一个月中的哪一天
        var hours = ("0" + now.getHours()).slice(-2); // 获取小时数
        var minutes = ("0" + now.getMinutes()).slice(-2); // 获取分钟数
        var seconds = ("0" + now.getSeconds()).slice(-2); // 获取秒数
        var daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        var dayOfWeek = daysOfWeek[now.getDay()]; // 获取星期几
    
        // 返回格式化后的字符串
        const currentTime = year + "年" + month + "月" + day + "日 " + hours + ":" + minutes + ":" + seconds + " " + dayOfWeek;
        const data = res.tempFiles[0];
        try {
          const ctx = wx.createCanvasContext('myCanvas');
          // 获取图片真实的宽度和高度
          const res = await wx.getImageInfo({
            src: data.path ? data.path : data.tempFilePath ? data.tempFilePath : '',
          });
          console.log('获取图片真实的宽度和高度=>', res);
          that.setData({
            canvasWidthValue: res.width,
            canvasHeightValue: res.height,
          });
          // 绘制图片
          ctx.drawImage(data.tempFilePath, 0, 0, res.width, res.height);
          // 添加水印
          ctx.setFontSize(20);
          ctx.fillText(address, 10, res.height - 50); // 地址水印
          ctx.fillText(currentTime, 10, res.height - 20); // 时间水印
          ctx.draw();
          setTimeout(async () => {

            wx.canvasToTempFilePath({
            
              canvasId: 'myCanvas',
              quality: 0.7,
              destWidth: that.data.canvasWidthValue/2,
              destHeight: that.data.canvasHeightValue/2,
              success(res) {
                console.log("canvasToTempFilePath",res)
                that.setData({
                  src: temp.tempFilePath,
                });
    
                that.setData({
                  // img_arr: that.data.img_arr.concat(res.tempFiles),
                  img_arr: that.data.img_arr.concat(temp),
    
                })
                console.log("canvasToTempFilePath",that.data.img_arr)
    
                wx.hideLoading();

              }
            })

            // const temp = await wx.canvasToTempFilePath({
            //   canvasId: 'myCanvas',
            //   fileType: 'jpg',
            //   quality: 0.7, 
            // });
            // // **上传水印图片到服务器（真实项目中需要考虑上传后台，还是直传等）**
            // // const result = await request.uploadFile(temp.tempFilePath);
            // this.setData({
            //   src: temp.tempFilePath,
            // });

            // this.setData({
            //   // img_arr: that.data.img_arr.concat(res.tempFiles),
            //   img_arr: this.data.img_arr.concat(temp),

            // })
            // console.log(this.data.img_arr)


            wx.hideLoading();
          }, 700);
        } catch (error) {
          console.log('error=>', error);
        }
      },
    });
  },



  //删除照片功能与预览照片功能 
  deleteImg(e) {
    let that = this;
    let img_arr = that.data.img_arr;
    let index = e.currentTarget.dataset.index;  //获取长按删除图片的index
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success(res) {
        if (res.confirm) {
          // console.log('点击确定了');
          img_arr.splice(index, 1);
        } else if (res.cancel) {
          // console.log('点击取消了');
          return false;
        }
        that.setData({
          img_arr: img_arr
        });
      }
    })
  },

  //预览图片
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let img_arr = this.data.img_arr;
    wx.previewImage({
      current: img_arr[index],
      urls: img_arr
    })
  },






  //预览图片
  topic_preview: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var url = e.currentTarget.dataset.url;
    var previewImgArr = [];
    //通过循环在数据链里面找到和这个id相同的这一组数据，然后再取出这一组数据当中的图片
    var data = that.data.topic_recomData;
    for (var i in data) {
      if (id == data[i].id) {
        previewImgArr = data[i].pic;
      }
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: previewImgArr // 需要预览的图片http链接列表
    })
  },


});