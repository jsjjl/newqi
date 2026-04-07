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
    repairSelectType: [
      { name: '定期维护', id: 1 },
      { name: '故障报修', id: 2 },
      { name: '紧急维修', id: 3 }
    ],
    repairSelectTypeIndex: 0,
    repairType: 1,
    repairResult: 1,
    repairSelectResultIndex: 0,
    repairSelectResult: [
      { name: '已修复', id: 1 },
      { name: '待配件', id: 2 },
      { name: '无法修复', id: 3 }
    ],
    statusResult: [
      { name: '开始维修', id: 1 },
      { name: '维修中', id: 2 },
      { name: '维修完成', id: 3 }
    ],
    statusResultIndex: 0,
    status: 1,
    contactNumber: '',

    repairDetails: '',
    deviceId: '',
    repairerId: '',
    info:[],
    infoId: '',


    deviceList: [],
    deviceIndex: null,
    repairTypeList: [],
    repairTypeIndex: null,
    userList: [],
    userIndex: null,
    repairDate: '',
    contact: '',
    faultDescription: '',
    remark: '',
    isSubmitting: false, // 防止重复提交
smsbid: '',
smsbidName:  '',
smsbbh:  '',
   userInput: '', // 输入框内容
  showUserSuggest: false, // 是否显示下拉
  filteredUserList: [], // 筛选后的下拉
  selectedUserId: '', // 选中的userId
  operatorName:'',
  list:[],
    maintenanceTypeList:[]
  },

  // ...existing code...
onUserInput(e) {
  const value = e.detail.value.trim();
  let filtered = [];
  let selectedUserId = '';
  if (value) {
    filtered = this.data.userList.filter(u => u.nickName && u.nickName.indexOf(value) !== -1);
    // 检查是否有完全匹配
    const exact = this.data.userList.find(u => u.nickName === value);
    if (exact) {
      selectedUserId = exact.userId;
    }
  } else {
    filtered = this.data.userList;
  }
  this.setData({
    userInput: value,
    filteredUserList: filtered,
    showUserSuggest: true,
    selectedUserId // 自动设置或清空
  });
},
onUserFocus() {
  // 聚焦时显示全部
  this.setData({
    showUserSuggest: true,
    filteredUserList: this.data.userList
  });
},
onUserBlur() {
  setTimeout(() => {
    this.setData({ showUserSuggest: false });
  }, 200);
},
onUserSelect(e) {
  const idx = e.currentTarget.dataset.index;
  const user = this.data.filteredUserList[idx];
  this.setData({
    userInput: user.nickName,
    selectedUserId: user.userId,
    showUserSuggest: false
  });
},

  operatorNameInput: function (e) {
    this.setData({
      operatorName: e.detail.value
    })
  },

  onLoad: function (e) {
   if(e.id){
    this.setData({
      smsbid: e.id
    });
   }
   this.fetchDeviceList();
    this.fetchRepairTypeList();
    this.fetchUserList();

  },

//     fetchDeviceList() {
//     wx.request({
//       url: 'https://medicalgas.lygyy.com.cn/prod-api/device/info/list',
//       method: 'GET',
//       header: { Authorization: wx.getStorageSync('token') },
//       success: res => {
//         if (res.data.code === 200) {
//           this.setData({ deviceList: res.data.data });
//           if(this.data.smsbid){
//            let tep = res.data.data.filter(item => item.id == this.data.smsbid)[0].deviceName;
// let smsbbh = res.data.data.filter(item => item.id == this.data.smsbid)[0].deviceCode;

// let smstatus =  res.data.data.filter(item => item.id == this.data.smsbid)[0].status;

//     if(smstatus==1){
//      this.getlist();
//     }
//     else if(smstatus==3){
//     //  提示设备已报废
//     wx.showModal({
//       title: '提示',
//       content: '设备已报废',
//       success: function (res) {
//         if (res.confirm) {
//           wx.navigateBack({
//             delta: 1
//           })
//         }
//       }
//     })
//     }
//     else{
// this.setData({ smsbidName: tep ,smsbbh});
//     }

    
        

           
//           }
//         }
//       }
//     });
//   },


   fetchDeviceList() {
      console.log("ccc");
      
      wx.request({
   url: CONFIG.subDomain + '/device/info/info?id='+this.data.smsbid,
      
        method: 'GET',
        header: { Authorization: wx.getStorageSync('token') },
        success: res => {
          if (res.data.code === 200) {
 
  
            // this.setData({ deviceList: res.data.data });
            if(this.data.smsbid){
  //            let tep = res.data.data.filter(item => item.id == this.data.smsbid)[0].deviceName;
  // let smsbbh =  res.data.data.filter(item => item.id == this.data.smsbid)[0].deviceCode;
  
  // let smstatus =  res.data.data.filter(item => item.id == this.data.smsbid)[0].status;
  
    if(res.data.data.status==1  ||  res.data.data.status == 4){

       wx.request({
        url: 'https://medicalgas.lygyy.com.cn/prod-api/system/dict/data/type/device_repair_type',
        method: 'GET',
        header: { Authorization: wx.getStorageSync('token') },
        success: res => {
          if (res.data.code === 200) {
            this.setData({ repairTypeList: res.data.data }); 
              this.getwx();
          }
        }
      });
      }

      //  else if(res.data.data.status==2){
  
      //    wx.request({
      //   url: 'https://medicalgas.lygyy.com.cn/prod-api/system/dict/data/type/device_maintenance_type',
      //   method: 'GET',
      //   header: { Authorization: wx.getStorageSync('token') },
      //   success: res => {
      //     if (res.data.code === 200) {
      //       this.setData({ maintenanceTypeList: res.data.data }); 
      //         this.getby();
      //     }
      //   }
      // });
  
    
      
      
       else if(res.data.data.status==3){
      //  提示设备已报废
      wx.showModal({
        title: '提示',
        content: '设备已报废',
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
      }else{
    this.setData({ smsbidName: res.data.data.deviceName,smsbbh:res.data.data.deviceCode });
      }
           
         
            }
  
           
          }
        }
      });
    },


         getwx() {
            let that = this
           
            wx.request({
              url: CONFIG.subDomain + '/device/repair/'+that.data.smsbid+'/info',
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
     let temp = that.data.repairTypeList
       let templ = res.data.data
               
    
    
                // 通过repairType来显示name maintenanceTypeList
               
                  for (let j = 0; j < temp.length; j++) {
                    if (templ.repairType == temp[j].dictValue) {
                     templ.repairTypeName = temp[j].dictLabel
                    }
                  }
                
      wx.setStorageSync('detail', templ);
      
      wx.redirectTo({
              url: '/pages/sebei/detail_weixiu',
            })
               
            
        
                }
        
              },
        
            });
          },
    
       
    
          getby() {
            let that = this
           
            wx.request({
              url: CONFIG.subDomain + '/device/maintenance/'+that.data.smsbid+'/info',
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
       let temp = that.data.maintenanceTypeList
       let templ = res.data.data
               
    
    
                // 通过repairType来显示name maintenanceTypeList
               
                  for (let j = 0; j < temp.length; j++) {
                    if (templ.maintenanceType == temp[j].dictValue) {
                     templ.maintenanceTypeName = temp[j].dictLabel
                    }
                  }
                
      wx.setStorageSync('detail', templ);
      
      wx.redirectTo({
              url: '/pages/sebei/detail_baoyang',
            })
               
            
        
                }
        
              },
        
            });
          },

   getlist() {
      let that = this
      let temp = {
        pageNum: 1,
        pageSize: 500
      }
      if (that.data.sn) {
        temp.sn = that.data.sn

       
      }
      // if (that.data.ownerContact) {
      //   temp.ownerContact = that.data.ownerContact
      // }
      // if (that.data.ownerName) {
      //   temp.ownerName = that.data.ownerName
      // }
      // if (that.data.beginRecordTime && that.data.endRecordTime) {
      //   temp['params[beginRecordTime]'] = that.data.beginRecordTime
      //   temp['params[endRecordTime]'] = that.data.endRecordTime
      // }
      wx.request({
        url: CONFIG.subDomain + '/device/maintenance/page',
        method: 'get',
        data: temp,
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
let temp = res.data.rows;
for (let i = 0; i < temp.length; i++) {
  if(temp[i].deviceId == that.data.smsbid && temp[i].status == 1){
     wx.setStorageSync('detail', temp[i]);
        // 关闭当前页跳转到
      wx.redirectTo({
        url: '/pages/sebei/detail_weixiu',
      })


  }
}
          
      
  
          }
  
        },
  
      });
    },
  fetchRepairTypeList() {
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/dict/data/type/device_repair_type',
      method: 'GET',
      header: { Authorization: wx.getStorageSync('token') },
      success: res => {
        if (res.data.code === 200) {
          this.setData({ repairTypeList: res.data.data });
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
    this.setData({ deviceIndex: e.detail.value });
  },
  onRepairTypeChange(e) {
    this.setData({ repairTypeIndex: e.detail.value });
  },
  onUserChange(e) {
    this.setData({ userIndex: e.detail.value });
  },
  onDateChange(e) {
    this.setData({ repairDate: e.detail.value });
  },
  onContactInput(e) {
    this.setData({ contact: e.detail.value });
  },

 
  onFaultInput(e) {
    this.setData({ faultDescription: e.detail.value });
  },
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  onSubmit() {
  if (this.data.isSubmitting) {
    wx.showToast({ title: '正在提交，请勿重复操作', icon: 'none' });
    return;
  }
  const { deviceList, deviceIndex, repairTypeList, repairTypeIndex, userList, userIndex, repairDate, contact, faultDescription, remark,userInput, selectedUserId,operatorName } = this.data;
  if ( repairTypeIndex === null || !repairDate || !contact || !faultDescription||
    !operatorName) {
    wx.showToast({ title: '请填写完整信息', icon: 'none' });
    return;
  }
  console.log('提交数据', this.data.deviceIndex,this.data.deviceList);
  
  this.setData({ isSubmitting: true });
  wx.showLoading({ title: '提交中', mask: true });
  wx.request({
    url: 'https://medicalgas.lygyy.com.cn/prod-api/device/repair/add',
    method: 'POST',
    header: { Authorization: wx.getStorageSync('token') },
    data: {
      deviceId: this.data.smsbid?this.data.smsbid:deviceList[deviceIndex].id,
      repairType: repairTypeList[repairTypeIndex].dictValue,
      // repairId: userList[userIndex].userId,
      // repairId: selectedUserId, // 选中的userId
      repairDate,
      repairName:operatorName,
      contact,
      faultDescription,
      remark,
      status: '1'
    },
    success: res => {
      wx.hideLoading();
      this.setData({ isSubmitting: false });
      if (res.data.code === 200) {
        this.getwx()
        // wx.showToast({ title: '提交成功', icon: 'success' });
        // setTimeout(() => wx.navigateBack(), 1500);
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
      repairDate: e.detail.value
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
      url: 'https://uc.bm-intelligent.com:7034/system/oss/upload',
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

  _faultDescription: function (e) {
    this.setData({
      faultDescription: e.detail.value
    })
  },

  _contactNumber: function (e) {
    this.setData({
      contactNumber: e.detail.value
    })
  },

  _repairDetails: function (e) {
    this.setData({
      repairDetails: e.detail.value
    })
  },
  _deviceId: function (e) {
    this.setData({
      deviceId: e.detail.value
    })
  },
  infoType: function (e) {
    console.log('自定义选择器点击的下标', e.detail.value)
    this.setData({
      infoId: e.detail.value,
      deviceId: this.data.info[e.detail.value].id
    })
  },

  bindRepairSelectType: function (e) {
    console.log('自定义选择器点击的下标', e.detail.value)
    this.setData({
      repairSelectTypeIndex: e.detail.value,
      repairType: this.data.repairSelectType[e.detail.value].id
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
  // getlist() {
  //   let that = this
  //   wx.request({
  //     url: 'https://uc.bm-intelligent.com:7034/wx/point/query/all',
  //     method: 'get',
  //     // data: {
  //     //   Authorization:this.data.tel,
  //     //   password:this.data.pwd,
  //     // },
  //     header: {
  //       Authorization: wx.getStorageSync('token')
  //     },
  //     success: function success(res) {

  //       if (res.data.code == 200) {
  //         that.setData({
  //           array: res.data.rows,
  //           pointId: res.data.rows[0].id,
  //         })
  //       } else {

  //       }

  //     },

  //   });
  // },

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

    // if(that.data.location == '' || that.data.description == '' || that.data.img_arr == ''){

    //   wx.showToast({
    //     title: '请填写完整',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // }





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
    const dateString = that.data.repairDate + ' 00:00';


    wx.request({
      url: 'https://uc.bm-intelligent.com:7034/device/repair/add',
      method: 'POST',
      data: {

        pictures: that.data.image,

        status: that.data.status,

        repairDetails: that.data.repairDetails,

        contactNumber: that.data.contactNumber,

        repairerId: wx.getStorageSync('user').user.userId,

        repairDate: dateString,

        repairResult: that.data.repairResult,
        faultDescription: that.data.faultDescription,
        repairType: that.data.repairType,
        deviceId: that.data.deviceId

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


        }

      },

    });



  },




  //上传图片到服务器 
  uploadSomeMsg(i) {
    var that = this
    let aleng = that.data.img_arr.length - 1

    // for (let i = 0; i < that.data.img_arr.length; i += 1) {



    wx.uploadFile({
      url: 'https://uc.bm-intelligent.com:7034/system/oss/upload',
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