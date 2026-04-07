
const CONFIG = require('../../../config.js')
//获取应用实例
var app = getApp();
Page({
  data: {
    no: false,
    date: '',
    pointId: '',
    array: [],
    index: 0,
    deviceId:''
  },
  onLoad: function (e) {
    const that = this
    if (e.deviceId) {
      that.setData({
        deviceId: e.deviceId
      })

    }
    that.getlist2()
    
    // if(e.pointId){
    //   that.setData({
    //     pointId: e.pointId
    //   })
    //    that.getlist();
    // }else{

    // var d = new Date();
    // let y = d.getMonth() + 1

    // that.getlist(d.getFullYear() + '-' + y + '-' + d.getDate())
    // that.setData({
    //   date: d.getFullYear() + '-' + y + '-' + d.getDate()
    // })
    // }



  },


  onShow: function () {

    wx.hideHomeButton()
  },


  bindPickerChangeCity: function (e) {
    console.log('自定义选择器点击的下标', e.detail.value)
    console.log('这一条的值', this.data.array[e.detail.value])


    this.setData({
      index: e.detail.value,
      pointId: this.data.array[e.detail.value].id
    })

    this.getlist(this.data.date)
  },




  //获取下拉
  getlist2() {
    let that = this
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/paPointInfo/list?pageNum=1&pageSize=1000',
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
            // pointId:res.data.rows[0].id,
          })
          

          if (that.data.deviceId) {
          //  获得index
            for (var i = 0; i < that.data.array.length; i++) {
              if (that.data.array[i].deviceId == that.data.deviceId) {
                that.setData({
                  index: i,
                  pointId: that.data.array[i].id
                })
              }
            }
            console.log("iii",that.data.index,that.data.pointId);
            
          
            that.getlist();
          } else {

            var d = new Date();
            let y = d.getMonth() + 1

            that.getlist(d.getFullYear() + '-' + y + '-' + d.getDate())
            that.setData({
              date: d.getFullYear() + '-' + y + '-' + d.getDate()
            })
          }
        } else {

        }

      },

    });
  },


  toform(e) {
    let that = this
    console.log(e);
    wx.navigateTo({
      url: '/pages/lab/task_post/task_post?taskId=' + e.currentTarget.dataset.taskid + '&pointId=' + e.currentTarget.dataset.pointid,
    })
  },


  getlist(e) {
    let that = this
    wx.request({

      url: CONFIG.subDomain + '/opsWxTask/task/detail/mine',

      method: 'get',
      data: {
        date: e ? e : '',
        pointId: that.data.pointId
      },
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success: function success(res) {


        if (res.data.code == 200) {

          if (res.data.rows.length > 0) {
            that.setData({
              img_arr: res.data.rows,
              no: false
            })
          } else {
            that.setData({
              img_arr: [],
              no: true
            })
          }




        } else {
        }

      },

    });
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })

    this.getlist(e.detail.value)
  },
  topost() {
    wx.navigateTo({
      url: '/pages/task_post/task_post',
    })
  },


});