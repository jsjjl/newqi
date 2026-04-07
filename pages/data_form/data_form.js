const CONFIG = require('../../config.js')
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
    isSubmitting: false, // 防止重复提交的标志
    no: false,
    switch1Checked: false,
    array: [],
    index: 0,
    isAnonymous: true,
    empno: "",
    name: "",
    phone: "",

    img_arr: [],
    post_image: [],
    image: "",
    voice: '',
    voice_url: '',
    description: "",
    pointId: '',
    location: "",

    video: '', // 存储视频临时路径
    videoUrl: '', // 存储上传后的视频服务器路径
    isUploadingVideo: false,
    
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


  },
  onLoad: function () {
    const that = this
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
        Authorization: wx.getStorageSync('token')
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

  _name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  _phone: function (e) {
    this.setData({
      phone: e.detail.value
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
      url: 'https://medicalgas.lygyy.com.cn/prod-api/wx/point/query/all',
      method: 'get',
      // data: {
      //   Authorization:this.data.tel,
      //   password:this.data.pwd,
      // },
      header: {
        Authorization: wx.getStorageSync('token')
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


  save() {
    let that = this;

    // 必填项校验
    if (!that.data.location) {
      wx.showToast({
        title: '请填写上报位置',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!that.data.description) {
      wx.showToast({
        title: '请填写上报内容',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (that.data.img_arr.length === 0) {
      wx.showToast({
        title: '请上传至少一张图片',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!that.data.isAnonymous) {
      if (!that.data.name) {
        wx.showToast({
          title: '请填写姓名',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (!that.data.empno) {
        wx.showToast({
          title: '请填写工号',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (!that.data.phone) {
        wx.showToast({
          title: '请填写联系方式',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    }

    // 防止重复提交
    if (that.data.isSubmitting) {
      wx.showToast({
        title: '正在提交，请稍后...',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 设置提交状态
    that.setData({
      isSubmitting: true
    });

    wx.showLoading({
      title: '提交中',
    });

    if (that.data.img_arr.length > 0) {
      that.uploadSomeMsg(0);
    } else if (that.data.video) {
      that.uploadVideo();
    } else if (that.data.filePath) {
      that.uploadvoice();
    } else {
      that.submit();
    }
  },
  submit() {
    console.log("submitsubmitsubmit");
    let that = this


    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/paEvent',
      method: 'POST',
      data: {
        // params: {

          // "location": "Lorem non", "pointId": 39, "type": 92, "reporter": 5, image: that.data.image,  "description": "杈群步做组且合具被技作和收面集同四。内八断把话眼手主步许问流位。约加月现技四受着干强往压清专已。速音总持地改立常百边决果东面管!", handler: 39,
          // "status": "id ad sint",
          // "isAnonymous": 1,
          // "name": "同重余角风",
          // "empno": "laborum aute incididunt", "phone": "18675463708"
      
          // pointId:that.data.pointId,
      
          location: that.data.location,
          image: that.data.image,
          video: that.data.videoUrl,
          description: that.data.description,
          voice: that.data.voice,

          isAnonymous: that.data.isAnonymous ? 1 : 0,

          empno: that.data.empno,

          name: that.data.name,

          phone: that.data.phone,

        // }
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      formData: {
        'Authorization': wx.getStorageSync('token'),
      },
      success: function success(res) {

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
            that.setData({
              isSubmitting: false
            });
          }, 2500);
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            isSubmitting: false
          });

        }

      },
      fail: function () {
        wx.showToast({
          title: '提交失败，请稍后重试',
          icon: 'none',
          duration: 2000
        }); that.setData({
          isSubmitting: false
        });
      },
      complete: function () {
        // 重置提交状态
        that.setData({
          isSubmitting: false
        });
      }

    });



  },




  // 上传视频到服务器
  uploadVideo() {
    let that = this;
    wx.uploadFile({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/oss/upload',
      filePath: that.data.video,
      name: 'file',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      formData: {
        'Authorization': wx.getStorageSync('token'),
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let data = JSON.parse(res.data);
          if (data.code === 200) {
            that.setData({
              videoUrl: data.data.url
            });
            // 视频上传成功后，检查是否有语音需要上传，或者直接提交
            if (that.data.filePath) {
              that.uploadvoice();
            } else {
              that.submit();
            }
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '视频上传失败',
              icon: 'none'
            });
            that.setData({ isSubmitting: false });
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '网络错误，视频上传失败',
            icon: 'none'
          });
          that.setData({ isSubmitting: false });
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '视频上传失败',
          icon: 'none'
        });
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
        Authorization: wx.getStorageSync('token')
      },
      formData: {
        'Authorization': wx.getStorageSync('token'),
      },
      success: function success(res) {
        console.log(res);


        if (res.statusCode == 200) {
          let temp = that.data.post_image
          console.log("ddd111", temp);

          if (!JSON.parse(res.data).data) {
            wx.hideLoading()
            // 提示图片上传失败
            wx.showToast({
              title: '图片上传失败',
              icon: 'none',
              duration: 2000
            });
            that.setData({
              isSubmitting: false
            });
            return;
          }
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
              // 检查是否有视频需要上传
              if (that.data.video) {
                that.uploadVideo();
              } else if (that.data.filePath) {
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



  // 预览视频
  previewVideo() {
    let that = this;
    if (that.data.video) {
      wx.previewMedia({
        sources: [{
          url: that.data.video,
          type: 'video'
        }]
      });
    }
  },

  // 删除视频
  deleteVideo() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除此视频吗？',
      success(res) {
        if (res.confirm) {
          that.setData({
            video: '',
            videoUrl: ''
          });
        }
      }
    });
  },

  // 选择视频
  addVideo() {
    let that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res, "---------上传的视频")
        const tempFiles = res.tempFiles
        if (tempFiles[0].size <= 50000000) { // 限制视频大小为 50MB
          that.setData({
            video: tempFiles[0].tempFilePath
          })
        } else {
          wx.showToast({
            title: '上传视频不能大于50M!',
            icon: 'none'
          })
        }
      }
    })
  },

  //添加图片
  addimg() {

    let that = this;
    if (this.data.img_arr.length < 5) {
      wx.chooseImage({
        count: 5 - that.data.img_arr.length, //上传图片的数量 当之前上传了部分图片时 ,总数 - 已上传数 = 剩余数   (限制上传的数量)
        sizeType: ['compressed'],  //可以指定原图或压缩图,默认二者都有
        sourceType: ['camera', 'album'],        //指定图片来源是相机还是相册,默认二者都有
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


});