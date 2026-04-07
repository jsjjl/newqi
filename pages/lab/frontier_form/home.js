
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
    no: false,
    switch1Checked: false,
    array: ['已完成', '处理中', '未完成'],
    index: null,
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
    taskId: '',
    myxx: true,
    seq: "",
    xc: true,
    ywt: false,
    entries_list: [],

    isSubmitting: false, // 防止重复提交
  },
  onLoad: function (e) {
    const that = this
    that.setData({
      pointId: e.pointId,
      taskId: e.taskId
    })
    that.getlist()


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

  // 选择
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
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
      console.log("录音已停止", res);

      this.setData({
        filePath: res.tempFilePath,
        duration: res.duration
      })
    })
    console.log("lyyy", this.data.filePath);

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
      //  url: 'https://medicalgas.lygyy.com.cn/prod-api/system/oss/upload',
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
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'error',
            duration: 2000
          })
        }

      },
      fail: function fail(error) {
        console.log(error);
        wx.showToast({
          title: '上传失败',
          icon: 'error',
          duration: 2000
        })
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

onEntryValueInput(e) {
  const index = e.currentTarget.dataset.index;
  let value = e.detail.value;

  // 支持负数输入：允许开头一个负号，其余保留数字和小数点规则
  value = value
    .replace(/[^-\d.]/g, '')                // 只保留 负号、数字、小数点
    .replace(/^-+/g, '-')                   // 开头最多保留一个负号（避免 "--123" 这类情况）
    .replace(/^\./g, '')                    // 开头不能是小数点（避免 ".123" ，但允许 "-.123" 后续处理）
    .replace(/\.{2,}/g, '.')                // 多个小数点变一个
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')                    // 只保留第一个小数点
    .replace(/^-\./g, '-0.')                // 处理 "-." 为 "-0."（避免负数小数点开头无整数）
    .replace(/^0+(\d)/, '$1')               // 去除整数部分前导零（如 "00123" → "123"，"-00123" → "-123"）
    .replace(/^-0+(\d)/, '-$1');            // 处理负数前导零（如 "-00123" → "-123"）

  let entries = this.data.entries_list;
  entries[index].value = value;
  this.setData({
    entries_list: entries
  });

  // 判断是否有任意一项超出范围（支持负数区间判断）
  let ywt = false;
  for (let i = 0; i < entries.length; i++) {
    const val = parseFloat(entries[i].value);
    const min = parseFloat(entries[i].minVal);
    const max = parseFloat(entries[i].maxVal);

    // 只有输入有效数字时才判断范围（空值/纯符号不判断）
    if (!isNaN(val)) {
      // 支持负数范围（如 min=-100, max=50 时，-50 合法，-150 非法）
      if (val < min || val > max) {
        ywt = true;
        break; // 发现非法项，立即跳出循环
      }
    }
  }

  this.setData({
    ywt: ywt
  });
},


  // onEntryValueInput(e) {
  //   const index = e.currentTarget.dataset.index;
  //   let value = e.detail.value;
  //   // 只允许输入数字和小数点，且只保留一个小数点
  //   value = value.replace(/[^\d.]/g, '')           // 只保留数字和小数点
  //     .replace(/^\./g, '')              // 开头不能是小数点
  //     .replace(/\.{2,}/g, '.')          // 连续小数点变一个
  //     .replace('.', '$#$').replace(/\./g, '').replace('$#$', '.'); // 只保留第一个小数点
  //   let entries = this.data.entries_list;
  //   entries[index].value = value;
  //   this.setData({
  //     entries_list: entries
  //   });

  //   // 如果超出最大值和最小值则ywt为true,如果其他的数据有超出范围的就不用判断了,先循环判断
  //   for(let i = 0; i < entries.length; i++) {
  //     if (entries[i].value*1 > entries[i].max*1 || entries[i].value < entries[i].min*1) {
  //        this.setData({
  //       ywt: true
  //     });
  //       return;
  //     }
  //   }

  // },
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
    let url = ""
    let jtmep = {}
    if (that.data.taskId == -1) {

      url = 'https://medicalgas.lygyy.com.cn/prod-api/opsWxTask/point/query/inspection',
        jtmep = {

          pointId: that.data.pointId,

        }
    } else {
      url = 'https://medicalgas.lygyy.com.cn/prod-api/opsWxTask/point/detail/add',
        jtmep = {
          taskId: that.data.taskId,
          pointId: that.data.pointId,

        }
    }

    wx.request({
      // url: 'https://medicalgas.lygyy.com.cn/prod-api/wx/point/query/all',
      url: url,
      method: 'get',
      data: jtmep,
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

          // 判断entries_list来显示ywt
          if (that.data.entries_list.length > 0) {
            let temp = that.data.entries_list
            for (let i = 0; i < temp.length; i++) {
              if (temp[i].state == 2) {
                that.setData({
                  ywt: true
                })
              }
            }

          }


        } else {
          wx.showToast({
            title: res.data.msg || '未查询到点位',
            icon: 'none',
            duration: 3000
          })

          // setTimeout(function () {
          //   wx.navigateBack({
          //     delta: 1
          //   })
          // }, 3500);

          that.setData({
            myxx: false
          })
        }



        // if (res.data.code == 200) {
        //   that.setData({
        //     array: res.data.rows,
        //     pointId: res.data.rows[0].id,
        //   })
        // } else {

        // }

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
  toAddPoint() {
    wx.navigateTo({
      url: '/pages/lab/add_point/index?pointId=' + this.data.pointId
    })
  },
  // switch1Change() {
  //   console.log(1111);
  //   this.setData({
  //     isAnonymous: !this.data.isAnonymous
  //   })


  // },

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

    let temp2 = that.data.entries_list
    console.log(temp2);

    for (var i = 0; i < temp2.length; i++) {

      if (temp2[i].state == 2 && temp2[i].type!=3) {
        that.setData({
          ywt: true
        })
        break;
      } else {
        that.setData({
          ywt: false
        })
      }
    }

  },




  bindKeyInput: function (e) {
    this.setData({
      location: e.detail.value
    })
  },


  save(e) {


    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        xc: true
      })
    } else {
      this.setData({
        xc: false
      })
    }



    let that = this;



    if (that.data.img_arr.length == 0) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (that.data.isSubmitting) {
      wx.showToast({
        title: '正在提交，请勿重复操作',
        icon: 'none',
        duration: 2000
      })
      return
    }
    that.setData({
      isSubmitting: true
    });

    wx.showLoading({
      title: '请稍等...',
    })

    if (that.data.img_arr.length > 0) {
      that.uploadSomeMsg(0)
    }
    else if (that.data.filePath) {
      console.log("that.data.filePath:", that.data.filePath);

      that.uploadvoice()
    } else {
      that.submit()
    }

  },
  submit() {
    console.log("submitsubmitsubmit");
    let that = this
    
    if (that.data.xc) {
      let temp =  {
        taskId: that.data.taskId,
        pointId: that.data.pointId,
        image: that.data.image,
        voice: that.data.voice,
        remark: that.data.description,
        entries: that.data.entries_list,
        id: that.data.id,
        seq: that.data.seq,

      }
      wx.setStorageSync('xcData', temp)
      that.setData({ isSubmitting: false });
        wx.hideLoading()

      wx.navigateTo({

        url: '/pages/lab/xc/xc',


      })
      return
    }



    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/opsWxTask/point/inspection',
      method: 'POST',
      data: {
        taskId: that.data.taskId,
        pointId: that.data.pointId,
        image: that.data.image,
        voice: that.data.voice,
        remark: that.data.description,
        entries: that.data.entries_list,
        id: that.data.id,
        seq: that.data.seq,

      },
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success: function success(res) {
        
        wx.hideLoading()

        if (res.data.code == 200) {
          wx.hideLoading()
          that.setData({
            img_arr: [],
            post_image: [],
            image: ""
          });
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 2000
          })

          setTimeout(function () {
            if (that.data.xc) {
              that.setData({ isSubmitting: false });
              wx.navigateTo({

                url: '/pages/lab/xc/xc?id=' + res.data.data,


              })
            } else {
              wx.navigateBack({
                delta: 1
              })
            }
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
                console.log("that.data.filePath222:", that.data.filePath);
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
        sourceType: ['camera', 'album'],        //指定图片来源是相机还是相册,默认二者都有
        success(res) {
          const tempFiles = res.tempFiles;
          let answer = tempFiles.every(item => item.size <= 20000000);
          if (answer) {
            // 防止重复添加同一张图片
            let newImgs = res.tempFilePaths.filter(path => that.data.img_arr.indexOf(path) === -1);
            that.setData({
              img_arr: that.data.img_arr.concat(newImgs),
            });
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
        title: '最多上传三张图片',
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