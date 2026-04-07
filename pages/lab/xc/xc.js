
const CONFIG = require('../../../config.js')

// 创建录音对象
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var init


//获取应用实例
var app = getApp();
Page({
  data: {
    myxx: true,
    no: false,
    switch1Checked: false,
    taskId: '',
    pointId: '',
    name: "",
    entries_list: [],
    id: "",
    seq: "",
    xc: true,


    img_arr: [],
    post_image: [],
    image: "",
    image2: "",
    voice: '',
    voice_url: '',
    description: "",
    description2: "",
    pointId: '',

    noRecordShow: true, //初始显示
    recordLuzhiShow: false, //控制录制
    finishRecordShow: false, //完成录音
    extistRecordShow: false, //已存在录音
    playAudioShow: false, //播放按钮
    exisiFilePath: '', //已经存在的录音
    countNume: 0, // 倒计时
    filePath: '', // 临时语音录制文件
    duration: 0, // 录制时间
    userId: 0, //用户id
    id: 0, //语音id
    zgid: 0,

    img_arr2: [],
    post_image2: [],
    isSubmitting: false, // 防止重复提交
  },
  onLoad: function (e) {



    const that = this
    if (e.id) {
      that.setData({
        zgid: e.id,
        // pointId: e.pointId,
      })
    }

    // that.getlist()


  },



  // 语音授权
  authorize() {
    var that = this
    wx.authorize({
      scope: 'scope.record',
      success() {
        that.stratRecordAudio()
      },
      fail() {
        wx.showModal({
          title: '提示',
          content: '您未授权录音，功能将无法使用',
          showCancel: true,
          confirmText: "授权",
          confirmColor: "#2D59DF",
          success: function (res) {
            if (res.confirm) {
              //确认则打开设置页面（重点）
              wx.openSetting({
                success: (res) => {
                  if (!res.authSetting['scope.record']) {
                    //未设置录音授权
                    wx.showModal({
                      title: '提示',
                      content: '您未授权录音，功能将无法使用',
                      showCancel: false,
                      success: function (res) { },
                    })
                  } else {
                    that.stratRecordAudio()
                  }
                },
                fail: function () {
                  console.log("授权设置录音失败");
                }
              })
            } else if (res.cancel) {
              console.log("cancel");
            }
          },
          fail: function () {
            console.log("openfail");
          }
        })
      }
    })
  },
  //录音计时器
  recordingTimer: function (time) {
    var that = this
    if (time == undefined) {
      //将计时器赋值给init
      init = setInterval(function () {
        var time = that.data.countNume + 1;
        that.setData({
          countNume: time
        })
      }, 1000);
    } else {
      clearInterval(init)
    }
  },
  // 开始录音
  stratRecordAudio() {
    clearInterval(init) //清除定时器
    // 监听音频开始事件
    this.setData({
      noRecordShow: false,
      recordLuzhiShow: true
    })
    recorderManager.onStart((res) => { })
    recorderManager.onStop((res) => {
      this.setData({
        recordLuzhiShow: false,
        finishRecordShow: true,
        filePath: res.tempFilePath,
        duration: res.duration
      })
      this.recordingTimer(this.data.countNume)
    })
    const options = {
      duration: this.data.duration, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    this.recordingTimer()
    recorderManager.start(options)
  },
  // 停止录音
  stopRecordAudio() {
    this.setData({
      recordLuzhiShow: false,
      finishRecordShow: true,
    })
    recorderManager.onStop((res) => {
      this.setData({
        filePath: res.tempFilePath,
        duration: res.duration
      })
    })
    this.recordingTimer(this.data.countNume)
    recorderManager.stop()
  },
  // 播放录音
  playRecordAudio(e) {
    //在ios下静音时播放没有声音，默认为true，改为false就好了。
    innerAudioContext.obeyMuteSwitch = false
    var filPathType = e.currentTarget.dataset.type
    if (filPathType == 1) {
      this.setData({
        playAudioShow: true,
        finishRecordShow: false
      })
      innerAudioContext.src = this.data.filePath
      innerAudioContext.play()
      innerAudioContext.onEnded(() => {
        this.setData({
          playAudioShow: false,
          finishRecordShow: true
        })
      })
    } else {
      this.setData({
        playAudioShow: true,
        extistRecordShow: false
      })
      innerAudioContext.src = this.data.exisiFilePath
      innerAudioContext.play()
      innerAudioContext.onEnded(() => {
        this.setData({
          playAudioShow: false,
          extistRecordShow: true
        })
      })
    }

  },

  // 重新录音
  recycleRecordAudio() {
    var that = this
    wx.showModal({
      title: "重新录音",
      content: "是否重新录制?",
      success(res) {
        if (res.confirm) {
          that.setData({
            noRecordShow: true, //初始显示
            recordLuzhiShow: false, //控制录制
            finishRecordShow: false, //完成录音
            extistRecordShow: false, //已存在录音
            playAudioShow: false, //播放按钮
            filePath: '',
            countNume: 0,
            duration: 0
          })
          innerAudioContext.stop()
        }
      }
    })
  },


  // 保存录音
  uploadvoice() {
    // wx.showLoading({
    //   title: '保存中...',
    // })
    var filePath = "",
      that = this


    wx.uploadFile({

      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/oss/upload',
      filePath: that.data.filePath,
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
          console.log("ddd", JSON.parse(res.data).data.url);
          that.setData({
            voice: JSON.parse(res.data).data.url
          })
          that.submit()
        }

      },
      fail: function fail(error) {
        console.log(error);
      },
      complete: function complete(aaa) {
        // 加载完成
      }
    });



    // wx.uploadFile({
    //   url: uploadAudio.uploadAudio,
    //   filePath: that.data.filePath,
    //   name: 'file',
    //   success(res) {
    //     filePath = JSON.parse(res.data).data[0]
    //     var params = {
    //       userId: that.data.userId,
    //       url: filePath,
    //       duration: that.data.duration,
    //       type: 2
    //     }
    //     // postRecording(params).then(res => {
    //     //   wx.hideLoading()
    //     //   wx.showToast({
    //     //     title: '保存成功',
    //     //     icon: 'success',
    //     //     duration: 2000
    //     //   })
    //     //   wx.navigateTo({
    //     //     url: '/pages/card/package-1st/pages/card-change/cardChange?userId=' + that.data.userId,
    //     //   })
    //     // })
    //   }
    // })

  },


  // 删除语音
  deleteRecord() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除语音吗?',
      success(res) {
        if (res.confirm) {
          // deleteRecording(that.data.id).then(res => {
          //   wx.showToast({
          //     title: '删除成功',
          //     icon: 'success',
          //     duration: 2000
          //   })
          //   wx.navigateTo({
          //     url: '/pages/card/package-1st/pages/card-change/cardChange?userId=' + that.data.userId,
          //   })
          // })
        }
      }
    })
  },




  bindTextAreaBlur(e) {
    this.setData({
      description: e.detail.value
    })
  },

  bindTextAreaBlur2(e) {
    this.setData({
      description2: e.detail.value
    })
  },


  save(e) {
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        xc: true
      })
    }

    let that = this;

    if (that.data.isSubmitting) {
      wx.showToast({
        title: '正在提交，请勿重复操作',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (that.data.img_arr.length == 0 || that.data.img_arr2.length == 0 || that.data.description == '' || that.data.description2 == '') {
      wx.showToast({
        title: '请填写完整整改内容',
        icon: 'none',
        duration: 2000
      })
      return
    }
    that.setData({
      isSubmitting: true
    });

    wx.showLoading({
      title: '提交中',
    })

    if (that.data.img_arr.length > 0) {
      that.uploadSomeMsg(0)
    }
    else if (that.data.filePath) {
      that.uploadvoice()
    } else {
      that.submit()
    }

  },

  submit() {
    console.log("submitsubmitsubmit");
    let that = this
    let url = ""
    let xcData = wx.getStorageSync('xcData')


    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/opsWxTask/point/inspection',
      method: 'POST',
      data: xcData,
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success: function success(res) {


        if (res.data.code == 200) {





          url = 'https://medicalgas.lygyy.com.cn/prod-api/opsWxTask/point/rectification';
          let params = {

            detailId: res.data.data,

            type: "1",
            beforeImage: that.data.image,

            resultImage: that.data.image2,

            description: that.data.description,

            remark: that.data.description2,
          }
          // }
          wx.request({
            url: url,
            method: 'POST',
            data: params,
            header: {
              Authorization: wx.getStorageSync('token'),
              clientid: wx.getStorageSync('clientid')
            },
            success: function success(resx) {
              that.setData({ isSubmitting: false });
              wx.hideLoading();
              if (resx.data.code == 200) {
                wx.hideLoading()
                wx.showToast({
                  title: '提交成功',
                  icon: 'none',
                  duration: 2000
                })
                setTimeout(function () {

                  wx.navigateBack({
                    delta: 2
                  })

                }, 2500);
              } else {

                wx.hideLoading()
                wx.showToast({
                  title: resx.data.msg,
                  icon: 'none',
                  duration: 2000
                })

              }

            },
            fail: function () {
              that.setData({ isSubmitting: false });
              wx.hideLoading();
              wx.showToast({
                title: '提交失败，请重试',
                icon: 'none',
                duration: 2000
              });
            },
            complete: function () {
              that.setData({ isSubmitting: false });
            }

          });





        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })


        }

      },
      fail: function () {
        wx.hideLoading()
        that.setData({ isSubmitting: false });
        wx.showToast({
          title: '提交失败，请重试',
          icon: 'none',
          duration: 2000
        })
      },
      complete: function () {
        that.setData({ isSubmitting: false });
      }

    });




    // if(that.data.taskId == -1){
    //   url =  'https://wechat.ssgdwisdom.com:8086/api/wx/task/point/query/inspection',
    //    jtmep = {

    //     pointId:that.data.pointId,
    //     image:that.data.image,
    //     voice:that.data.voice,
    //     remark:that.data.description,
    //     entries:that.data.entries_list,
    //     id:that.data.id,
    //     seq:that.data.seq,
    //   }
    // }else{




  },


  //上传图片到服务器 
  async uploadSomeMsg(i) {
    var that = this
    let aleng = that.data.img_arr.length - 1
    // for (let i = 0; i < that.data.img_arr.length; i += 1) {

    await wx.uploadFile({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/oss/upload',
      filePath: that.data.img_arr[i],
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
          let temp = that.data.post_image
          console.log("ddd111", temp);
          console.log("ddd", JSON.parse(res.data).data.url);
          that.data.post_image.push(JSON.parse(res.data).data.url)
          // that.setData({
          //   post_image:temp
          // })
          console.log(aleng, i);
          if (aleng == i) {
            that.data.image = that.data.post_image.join()

            setTimeout(function () {

              if (that.data.img_arr2.length > 0) {
                that.uploadSomeMsg2(0)
              } else {
                that.submit()
              }
            }, 100);

          } else {
            that.uploadSomeMsg(i + 1)
          }
        }

      },
      fail: function fail(error) {
        reject(error);
      },
      complete: function complete(aaa) {
        // 加载完成
      }
    });

    // }
  },



  //添加图片
  addimg() {

    let that = this;
    if (this.data.img_arr.length < 5) {
      wx.chooseImage({
        count: 5 - that.data.img_arr.length, //上传图片的数量 当之前上传了部分图片时 ,总数 - 已上传数 = 剩余数   (限制上传的数量)
        sizeType: ['original', 'compressed'],  //可以指定原图或压缩图,默认二者都有
        sourceType: ['camera'],        //指定图片来源是相机还是相册,默认二者都有
        success(res) {
          console.log(res, "---------上传的图片")

          const tempFiles = res.tempFiles //包含图片大小的数组

          let answer = tempFiles.every(item => {   //限制上传图片大小为20M,所有图片少于20M才能上传
            return item.size <= 20000000
          })

          if (answer) {
            that.setData({
              img_arr: that.data.img_arr.concat(res.tempFilePaths),
            })
          } else {
            wx.showToast({
              title: '上传图片不能大于20M!',
              icon: 'none'
            })
          }

        }
      })

    } else {
      wx.showToast({  //超过图片张数限制提示
        title: '最多上传五张图片',
        icon: 'none',
        duration: 2000
      })
    }


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








  //上传图片到服务器 
  async uploadSomeMsg2(i) {
    var that = this
    let aleng = that.data.img_arr2.length - 1
    // for (let i = 0; i < that.data.img_arr.length; i += 1) {

    await wx.uploadFile({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/oss/upload',
      filePath: that.data.img_arr2[i],
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
          let temp = that.data.post_image2
          console.log("ddd111", temp);
          console.log("ddd", JSON.parse(res.data).data.url);
          that.data.post_image2.push(JSON.parse(res.data).data.url)
          // that.setData({
          //   post_image:temp
          // })
          console.log(aleng, i);
          if (aleng == i) {
            that.data.image2 = that.data.post_image2.join()

            setTimeout(function () {


              that.submit()

            }, 100);

          } else {
            that.uploadSomeMsg2(i + 1)
          }
        }

      },
      fail: function fail(error) {
        reject(error);
      },
      complete: function complete(aaa) {
        // 加载完成
      }
    });

    // }
  },


  //添加图片
  addimg2() {

    let that = this;
    if (this.data.img_arr2.length < 5) {
      wx.chooseImage({
        count: 5 - that.data.img_arr2.length, //上传图片的数量 当之前上传了部分图片时 ,总数 - 已上传数 = 剩余数   (限制上传的数量)
        sizeType: ['original', 'compressed'],  //可以指定原图或压缩图,默认二者都有
        sourceType: ['camera'],        //指定图片来源是相机还是相册,默认二者都有
        success(res) {
          console.log(res, "---------上传的图片")

          const tempFiles = res.tempFiles //包含图片大小的数组

          let answer = tempFiles.every(item => {   //限制上传图片大小为20M,所有图片少于20M才能上传
            return item.size <= 20000000
          })

          if (answer) {
            that.setData({
              img_arr2: that.data.img_arr2.concat(res.tempFilePaths),
            })
          } else {
            wx.showToast({
              title: '上传图片不能大于20M!',
              icon: 'none'
            })
          }

        }
      })

    } else {
      wx.showToast({  //超过图片张数限制提示
        title: '最多上传五张图片',
        icon: 'none',
        duration: 2000
      })
    }


  },


  //删除照片功能与预览照片功能 
  deleteImg2(e) {
    let that = this;
    let img_arr = that.data.img_arr2;
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
          img_arr2: img_arr
        });
      }
    })
  },

  //预览图片
  previewImg2(e) {
    let index = e.currentTarget.dataset.index;
    let img_arr = this.data.img_arr2;
    wx.previewImage({
      current: img_arr[index],
      urls: img_arr
    })
  },









  delChange(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let temp = that.data.entries_list
    temp[index].state = 3
    that.setData({
      entries_list: temp
    })

  },

  huiChange(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let temp = that.data.entries_list
    temp[index].state = 1
    that.setData({
      entries_list: temp
    })

  },


  switch1Change(e) {
    console.log(e);
    let that = this
    let index = e.currentTarget.dataset.index
    let temp = that.data.entries_list
    // if(temp[index].state == 1){
    temp[index].state = parseInt(e.detail.value)
    // }else{
    //   temp[index].state = 1
    // }

    that.setData({
      entries_list: temp
    })
  },




  //获取数量
  getlist() {
    let that = this
    let url = ""
    let jtmep = {}
    if (that.data.taskId == -1) {
      url = 'https://wechat.ssgdwisdom.com:8086/api/wx/task/point/query/inspection',
        jtmep = {

          pointId: that.data.pointId,

        }
    } else {
      url = 'https://wechat.ssgdwisdom.com:8086/api/wx/task/point/detail/add',
        jtmep = {
          taskId: that.data.taskId,
          pointId: that.data.pointId,

        }
    }


    wx.request({
      url: url,
      method: 'get',
      data: jtmep,
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success: function success(res) {


        if (res.data.code == 200) {
          if (res.data.data.state == 1) {
            wx.showToast({
              title: '该点位已巡检，再次提交将覆盖源记录',
              icon: 'none',
              duration: 3000
            })
          }

          that.setData({
            taskId: res.data.data.taskId,
            id: res.data.data.id,
            seq: res.data.data.seq,
            name: res.data.data.pointName,
            entries_list: res.data.data.entries
          })


        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          })

          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 3500);



          that.setData({
            myxx: false
          })
        }

      },

    });
  },


  onShow: function () {
    wx.hideHomeButton()
  },
  nav1() {
    wx.navigateTo({
      url: '/pages/task_list/task_list',
    })
  },




});