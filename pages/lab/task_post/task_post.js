
const CONFIG = require('../../../config.js')
//获取应用实例
var app = getApp();


// 创建录音对象
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var init




Page({
  data: {
    no:false,
    taskId:"",
    pointId:'',
    all:{pointName:'',submitTime:''},
    pointName:'',
    submitTime:'',
    image:[],
    voice:'',
    remark:'',
    entries:[],
    results:undefined, 
    beforeImage: undefined, 
    resultImage:  undefined,
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


  },
  onLoad:function(e){
    const that = this
    that.setData({
      taskId:e.taskId,
      pointId:e.pointId
    })
    that.getlist()
  },
  onShow:function(){
    wx.hideHomeButton()
  },
  nav1(){
    wx.navigateTo({
      url: '/pages/task_list/task_list',
    })
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
          innerAudioContext.src = this.data.voice
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
          innerAudioContext.src = this.data.voice
          innerAudioContext.play()
          innerAudioContext.onEnded(() => {
            this.setData({
              playAudioShow: false,
              extistRecordShow: true
            })
          })
        }
       
      },

      
   //预览图片
 topic_preview: function(e){

  let index = e.currentTarget.dataset.index;
  let img_arr = this.data.image;
  wx.previewImage({
    current: img_arr[index],
    urls: img_arr
  })
},

topic_preview2: function(e){

  let index = e.currentTarget.dataset.index;
  let img_arr = this.data.beforeImage;
  wx.previewImage({
    current: img_arr[index],
    urls: img_arr
  })
},


topic_preview3: function(e){

  let index = e.currentTarget.dataset.index;
  let img_arr = this.data.resultImage;
  wx.previewImage({
    current: img_arr[index],
    urls: img_arr
  })
},


  getlist(){
    let that = this
    wx.request({
 

      url: CONFIG.subDomain + '/opsWxTask/point/detail',
      method: 'get',
      data: {
        taskId:that.data.taskId,
        pointId:that.data.pointId
      },
      header:{
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success: function success(res) {
 console.log("res.data.data",res.data.data);
 
        
        if(res.data.code == 200){
          if(res.data.data.image){
            let a = res.data.data.image.split(',')
            that.setData({

   
              image:a,

    
            })
          }
let temp = res.data.data.results
          if(temp.length>0){
            let b= res.data.data.results[temp.length-1].beforeImage.split(',')
            let r= res.data.data.results[temp.length-1].resultImage.split(',')
            that.setData({
              results:res.data.data.results[temp.length-1],
              beforeImage:b,
              resultImage:r
            })
          }

          that.setData({
            all:res.data.data,
          pointName:res.data.data.pointName,
          submitTime:res.data.data.submitTime,

          voice:res.data.data.voice,
          remark:res.data.data.remark,
          entries:res.data.data.entries,
         

        })
        }else{
        
        }
       
      },
      
    });
},


});