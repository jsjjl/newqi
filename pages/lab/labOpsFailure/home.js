
const CONFIG = require('../../../config.js')
// 创建录音对象
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var init
// ==语音删除、保存接口== 
// import {
//   postRecording,
//   deleteRecording
// } from '../api.js'    
// import {
//   uploadAudio
// } from '../../../../../config/basicConfig' //语音保存地址


//获取应用实例
var app = getApp();
Page({
  data: {
    date:null,
    time:null,
    project: '',
    illegallyType: '',
    location: '',
    recordImage: "",
    reason: "",
    description:"",

    no: false,
    switch1Checked: false,
    array: [],
    index: null,
    isAnonymous: true,
    empno: "",
    name: "",
    phone: "",

    array2: [],
    index2: null,
    array3: [],
    index3: null,
    img_arr: [],
    post_image: [],
    image: "",
    voice: '',
    voice_url: '',
    description: "",
    pointId: '',
    location: "",

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
isSubmitting: false, // 防止重复提交

  },
  onLoad: function () {
    const that = this
    that.getDict()
    // that.getlist()


    // if (options.filePath == "undefined") {
    //   this.setData({
    //     extistRecordShow: false,
    //     noRecordShow: true,
    //   })
    // } else {
    //   this.setData({
    //     exisiFilePath: options.filePath,
    //     extistRecordShow: true,
    //     noRecordShow: false,
    //   })
    // }



  },

  //获取数量
  getDict() {
    let that = this
    wx.request({
      url: CONFIG.subDomain + '/system/dict/data/type/' + 'sl_ops_failure_type',
      method: 'get',
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
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
          that.setData({
            array: res.data.data
          })


        }

      },

    });


    wx.request({
      url: CONFIG.subDomain + '/system/dict/data/type/' + 'sl_ops_failure_degree',
      
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

        if (res.data.code == 401) {
          wx.removeStorageSync('token')
         wx.redirectTo({
        url: '/pages/login/index',
      })
          return
        }
        if (res.data.code == 200) {
          that.setData({
            array2: res.data.data
          })


        }

      },

    });

    
    wx.request({
      url: CONFIG.subDomain + '/system/lab/patrolUser/map',
      
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

        if (res.data.code == 401) {
          wx.removeStorageSync('token')
         wx.redirectTo({
        url: '/pages/login/index',
      })
          return
        }
        if (res.data.code == 200) {

          let originalData =res.data.data;
          let convertedArray = Object.entries(originalData).map(([dictValue, dictLabel]) => ({
            dictLabel,
            dictValue
          }));


          that.setData({
            array3: convertedArray
          })


        }

      },

    });
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e);
    
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChange2: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  // 选择
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  bindPickerChange2: function (e) {
    this.setData({
      index2: e.detail.value
    })
  },
  bindPickerChange3: function (e) {
    this.setData({
      index3: e.detail.value
    })
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
      reason: e.detail.value
    })
  },

  bindTextAreaBlur2(e) {
    this.setData({
      description: e.detail.value
    })
  },

  _project: function (e) {
    this.setData({
      project: e.detail.value
    })
  },

  _location: function (e) {
    this.setData({
      location: e.detail.value
    })
  },

  _empno: function (e) {
    this.setData({
      empno: e.detail.value
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
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/dict/data/type/sl_ops_failure_type',
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


  save() {
    let that = this;
console.log(that.data.date,that.data.time);

    if (that.data.isSubmitting) {
      wx.showToast({
        title: '正在提交，请勿重复操作',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!that.data.index || !that.data.project || !that.data.location) {
      wx.showToast({
        title: '请填写完整',
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
    else {
      that.submit()
    }

  },
  submit() {
    console.log("submitsubmitsubmit");
    let that = this

    // /system/dict/data/type/sl_ops_failure_degree
    // /system/lab/patrolUser/map
    // {
    //   "1868324026639781889": "实验室运维1",
    //   "1868324299676389377": "实验室运维2",
    //   "1871435643766259713": "二组运维2",
    //   "1871435583225675777": "二组运维1"
    // }
    // /lab/opsFailure
    // {
    //   "project": "111",
    //   "location": "333",
    //   "degree": "2",
    //   "type": "1",
    //   "image": "https://oss.yzzhkj.cn:9000/sc-file/2025/02/17/bc623ea6e55141949fa5a448c833e6d1.png",
    //   "reason": "444",
    //   "failureTime": "2025-02-12 10:06:09",
    //   "reporter": "1871435643766259713",
    //   "description": "222"
    // }
    console.log(that.data.date + ' ' + that.data.time+':00');
    
    wx.request({
      url: CONFIG.subDomain + '/opsFailure',
      method: 'POST',
      data: {
        // pointId:that.data.pointId,
        project: that.data.project,
        type: that.data.array[that.data.index].dictValue,
        degree: that.data.array2[that.data.index2].dictValue,
        reporter: that.data.array3[that.data.index3].dictValue,
        location: that.data.location,
        image: that.data.image,
        reason: that.data.reason,
        description: that.data.description,
        failureTime: that.data.date + ' ' + that.data.time+':00',
      },
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success: function success(res) {
that.setData({ isSubmitting: false });
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
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



  },




  //上传图片到服务器 
  uploadSomeMsg(i) {
    var that = this
    let aleng = that.data.img_arr.length - 1

    // for (let i = 0; i < that.data.img_arr.length; i += 1) {



    wx.uploadFile({
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

    let that = this;
    if (this.data.img_arr.length < 3) {
      wx.chooseImage({
        count: 3 - that.data.img_arr.length, //上传图片的数量 当之前上传了部分图片时 ,总数 - 已上传数 = 剩余数   (限制上传的数量)
        sizeType: ['compressed'],  //可以指定原图或压缩图,默认二者都有
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

  go(e) {
    wx.navigateTo({
      url: '/pages/traffic/electric_violation_my/home',
    })
  },
});