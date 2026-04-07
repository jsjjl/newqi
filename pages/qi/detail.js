const CONFIG = require('../../config.js')
// 创建录音对象
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var init



//获取应用实例
var app = getApp();
Page({
  data: {
    deviceList: [],
    deviceIndex: null,
    maintenanceTypeList: [],
    maintenanceTypeIndex: null,
    userList: [],
    userIndex: null,
    partList: [],
    partIndex: null,
    type: 1, // 1=设备，2=零部件
    maintainDate: '',
    contact: '',
    remark: '',
    isSubmitting: false,
    detail: {},
    list: {}
  },
  onLoad: function (e) {

    this.fetchDeviceList();
    this.fetchMaintenanceTypeList();
    this.fetchUserList();
    if (e.id) {
      this.fetchDetail(e.id)
      this.setData({
        detail: {
          id: e.id
        }
      })
    } else {
      this.setData({
        detail: wx.getStorageSync('detail')
      })

    }


  },
  onShow() {
    this.getList(this.data.detail.id);
  },

  fetchDetail(e) {
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/user/list',
      method: 'GET',
      header: { Authorization: wx.getStorageSync('token') },
      success: res => {
        if (res.data.code === 200) {
          this.setData({
            userList: res.data.data
          });

          wx.request({
            url: 'https://medicalgas.lygyy.com.cn/prod-api/area/info/list',
            method: 'GET',
            header: { Authorization: wx.getStorageSync('token') },
            success: res => {
              if (res.data.code === 200) {
                this.setData({
                  areaList: res.data.data
                });
                wx.request({
                  url: 'https://medicalgas.lygyy.com.cn/prod-api/device/type/list',
                  method: 'GET',
                  header: { Authorization: wx.getStorageSync('token') },
                  success: res => {
                    if (res.data.code === 200) {
                      this.setData({
                        typeList: res.data.data
                      });
                      wx.request({
                        url: 'https://medicalgas.lygyy.com.cn/prod-api/device/info/info?id=' + e,
                        method: 'GET',
                        header: { Authorization: wx.getStorageSync('token') },
                        success: res => {
                          if (res.data.code === 200) {
                            let temp = res.data.data;
            
                            let temps = this.data.userList;
                            let temps2 = this.data.areaList;
                            let temps3 = this.data.typeList;
                            console.log(temps);
            
            
                            // // 通过repairType来显示name repairTypeList
            
                            for (let j = 0; j < temps.length; j++) {
                              if (temp.responsible == temps[j].userId) {
                                console.log(temps[j]);
                                temp.responsibleName = temps[j].nickName
                              }
                            }
            
                             for (let j = 0; j < temps2.length; j++) {
                              if (temp.areaId == temps2[j].id) {
                                console.log(temps2[j]);
                                temp.areaName = temps2[j].name
                              }
                            }
            
                            for (let j = 0; j < temps3.length; j++) {
                              if (temp.type == temps3[j].id) {
                                console.log(temps3[j]);
                                temp.typeName = temps3[j].name
                              }
                            }
            
                            this.setData({ detail: temp });
                          }
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        
        }
      }
    });


  },


  fetchDeviceList() {
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/device/info/list',
      method: 'GET',
      header: { Authorization: wx.getStorageSync('token') },
      success: res => {
        if (res.data.code === 200) {
          this.setData({ deviceList: res.data.data });
        }
      }
    });
  },
  fetchMaintenanceTypeList() {
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/dict/data/type/device_maintenance_type',
      method: 'GET',
      header: { Authorization: wx.getStorageSync('token') },
      success: res => {
        if (res.data.code === 200) {
          this.setData({ maintenanceTypeList: res.data.data });
        }
      }
    });
  },
  fetchUserList() {
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/user/list',
      method: 'GET',
      header: { Authorization: wx.getStorageSync('token') },
      success: res => {
        if (res.data.code === 200) {
          this.setData({ userList: res.data.data });
        }
      }
    });
  },
  onDeviceChange(e) {
    this.setData({ deviceIndex: e.detail.value, partList: [], partIndex: null });
    // 如果当前类型为零部件，自动拉取零部件列表
    if (this.data.type == 2) {
      const deviceId = this.data.deviceList[e.detail.value].id;
      this.fetchPartList(deviceId);
    }
  },
  onMaintenanceTypeChange(e) {
    this.setData({ maintenanceTypeIndex: e.detail.value });
  },
  onUserChange(e) {
    this.setData({ userIndex: e.detail.value });
  },
  onDateChange(e) {
    this.setData({ maintainDate: e.detail.value });
  },
  onTypeChange(e) {
    const type = Number(e.detail.value);
    this.setData({ type, partList: [], partIndex: null });
    // 切换为零部件时，如果已选设备，拉取零部件
    if (type === 2 && this.data.deviceIndex !== null) {
      const deviceId = this.data.deviceList[this.data.deviceIndex].deviceId;
      this.fetchPartList(deviceId);
    }
  },
  fetchPartList(deviceId) {
    wx.request({
      url: `https://medicalgas.lygyy.com.cn/prod-api/device/info/${deviceId}/parts/list`,
      method: 'GET',
      header: { Authorization: wx.getStorageSync('token') },
      success: res => {
        if (res.data.code === 200) {
          this.setData({ partList: res.data.data });
        }
      }
    });
  },
  onPartChange(e) {
    this.setData({ partIndex: e.detail.value });
  },
  onContactInput(e) {
    this.setData({ contact: e.detail.value });
  },
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },
  onSubmit() {
    if (this.data.isSubmitting) {
      wx.showToast({ title: '正在提交，请勿重复操作', icon: 'none' });
      return;
    }
    const { deviceList, deviceIndex, maintenanceTypeList, maintenanceTypeIndex, userList, userIndex, partList, partIndex, type, maintainDate, contact, remark } = this.data;
    if (deviceIndex === null || maintenanceTypeIndex === null || userIndex === null || !maintainDate || !contact) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    if (type === 2 && (partIndex === null || !partList[partIndex])) {
      wx.showToast({ title: '请选择零部件', icon: 'none' });
      return;
    }
    this.setData({ isSubmitting: true });
    wx.showLoading({ title: '提交中', mask: true });
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/device/maintenance/add',
      method: 'POST',
      header: { Authorization: wx.getStorageSync('token') },
      data: {
        deviceId: deviceList[deviceIndex].id,
        maintenanceType: maintenanceTypeList[maintenanceTypeIndex].dictValue,
        operatorId: userList[userIndex].userId,
        maintainDate,
        contact,
        remark,
        type,
        partId: type === 2 ? partList[partIndex].id : undefined
      },
      success: res => {
        wx.hideLoading();
        this.setData({ isSubmitting: false });
        if (res.data.code === 200) {
          wx.showToast({ title: '提交成功', icon: 'success' });
          setTimeout(() => wx.navigateBack(), 1500);
        } else {
          wx.showToast({ title: res.data.msg || '提交失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        this.setData({ isSubmitting: false });
        wx.showToast({ title: '提交失败', icon: 'none' });
      },
      complete: () => {
        this.setData({ isSubmitting: false });
      }
    });
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e);

    this.setData({
      maintainDate: e.detail.value
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

  _details: function (e) {
    this.setData({
      details: e.detail.value
    })
  },

  _contact: function (e) {
    this.setData({
      contact: e.detail.value
    })
  },

  _remarks: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  _deviceId: function (e) {
    this.setData({
      deviceId: e.detail.value
    })
  },
  _sn: function (e) {
    this.setData({
      sn: e.detail.value
    })
  },
  bindRepairSelectType: function (e) {
    console.log('自定义选择器点击的下标', e.detail.value)
    this.setData({
      repairSelectTypeIndex: e.detail.value,
      maintenanceType: this.data.repairSelectType[e.detail.value].id
    })
  },

  bindRepairSelectResult: function (e) {
    console.log('自定义选择器点击的下标', e.detail.value)
    this.setData({
      repairSelectResultIndex: e.detail.value,
      repairResult: this.data.repairSelectResult[e.detail.value].id
    })
  },
  bindStatusResult: function (e) {
    console.log('自定义选择器点击的下标', e.detail.value)
    this.setData({
      statusResultIndex: e.detail.value,
      status: this.data.statusResult[e.detail.value].id
    })
  },




  //获取下拉
  getList(e) {
    let that = this
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/device/maintenance/' + e + '/details/list',
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
            list: res.data.data
          })
        } else {

        }

      },

    });
  },


  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  addmx() {
    wx.navigateTo({
      url: '/pages/sebei/add_baoyang?id=' + this.data.detail.id,
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
    if (!that.data.deviceId) {
      wx.showToast({
        title: '请填写设备编号',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!that.data.sn) {
      wx.showToast({
        title: '请填写保养单号',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!that.data.maintenanceType) {
      wx.showToast({
        title: '请选择保养类型',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!that.data.maintainDate) {
      wx.showToast({
        title: '请选择保养开始时间',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!that.data.details) {
      wx.showToast({
        title: '请填写保养详情',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!that.data.contact) {
      wx.showToast({
        title: '请填写联系方式',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!that.data.status) {
      wx.showToast({
        title: '请选择保养状态',
        icon: 'none',
        duration: 2000
      });
      return;
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
    } else if (that.data.filePath) {
      that.uploadvoice();
    } else {
      that.submit();
    }
  },
  submit() {
    console.log("submitsubmitsubmit");
    let that = this
    const dateString = that.data.maintainDate + ' 00:00';


    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/device/maintenance/add',
      method: 'POST',
      data: {

        pictures: that.data.image,

        status: that.data.status,

        remarks: that.data.remarks,

        contact: that.data.contact,

        operatorId: wx.getStorageSync('user').user.userId,

        maintainDate: dateString,


        details: that.data.details,
        maintenanceType: that.data.maintenanceType,
        deviceId: that.data.deviceId,
        sn: that.data.sn

      },
      header: {
        Authorization: wx.getStorageSync('token')
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
        that.setData({
          isSubmitting: false
        });

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
    if (this.data.img_arr.length < 5) {
      wx.chooseImage({
        count: 5 - that.data.img_arr.length, //上传图片的数量 当之前上传了部分图片时 ,总数 - 已上传数 = 剩余数   (限制上传的数量)
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
    console.log("previewImg",this.data.detail.signImgUrl);
    
   
    // wx.previewImage({
    //   current: this.data.detail.signImgUrl,
    //   urls: [this.data.detail.signImgUrl]
    // })
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