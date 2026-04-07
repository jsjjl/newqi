
const CONFIG = require('../../../config.js')
//获取应用实例
var app = getApp();
Page({
  data: {
    list:[{
      name:'二维码扫描',
      // url:'0'
      url:'/pages/lab/frontier_history/home?pointId='+12,
    },{
      name:'二维码巡检',
      // url:'1'
      url: '/pages/lab/frontier_form/home?taskId=-1'+'&pointId='+12,
    },{
      name:'巡检路线',
      url:'/pages/lab/frontier_map/home'
    },{
      name:'巡检任务',
      url:'/pages/lab/frontier_task/home'
    }]
  },

  // 二维码扫描
  sm(){
    console.log(11111);
    
    let that =this
    wx.scanCode({
      
    onlyFromCamera: true,
    scanType:'barCode',
      success(res) {
        console.log(res)

        var a = res.result;

        let b = a.lastIndexOf("="); //截取等号后的内容
    
        a = a.substring(b + 1, a.length);
    
        console.log(a)  //2

        wx.navigateTo({
          url: '/pages/lab/frontier_history/home?pointId='+a,
        })

      }
    })
  },

  sm_post(){
    let that =this
    wx.scanCode({
      
    onlyFromCamera: true,
    scanType:'barCode',
      success(res) {
        console.log(res)

        var a = res.result;

        let b = a.lastIndexOf("="); //截取等号后的内容
    
        a = a.substring(b + 1, a.length);
    
        console.log(a)  //2

        

        wx.navigateTo({
          url: '/pages/lab/frontier_form/home?taskId=-1'+'&pointId='+a,
        })

      }
    })
  },



 


  //获取数量
  getlist(){
    let that = this
    wx.request({
      url: CONFIG.subDomain+'api/wx/task/count',
      method: 'get',
      // data: {
      //   Authorization:this.data.tel,
      //   password:this.data.pwd,
      // },
      header:{
        Authorization:wx.getStorageSync('token'),
        clientid:wx.getStorageSync('clientid')
      },
      success: function success(res) {
 
        if(res.data.code == 401){
          wx.removeStorageSync('token')
         wx.redirectTo({
        url: '/pages/login/index',
      })
        }
        if(res.data.code == 200){
          that.setData({
          array:res.data.data,

        })
        }else{
        
        }
       
      },
      
    });
  },

  go(e){
    if(e.currentTarget.dataset.id==0){
      this.sm();
    }else if(e.currentTarget.dataset.id==1){
      this.sm_post();
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.id,
      })
    }
    
  },

});