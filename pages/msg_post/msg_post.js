

//获取应用实例
var app = getApp();
Page({
  data: {
    no:false,
    id:"",
    noticeContent:""
  },
  onLoad:function(e){
    const _this = this
    _this.setData({
      id:e.id
    })
    _this.getlist();
  },

  //获取数量
  getlist(){
    let that = this
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/api/wx/notice/'+that.data.id,
      method: 'get',
      // data: {
      //   pageSize:50,
      //   pageNum:1,
      // },
      header:{
        Authorization:wx.getStorageSync('token')
      },
      success: function success(res) {
 
        
        if(res.data.code == 200){
          console.log("2222",res.data.data.noticeContent);
          that.setData({
            noticeContent:res.data.data.noticeContent
          })
          console.log("noticeContent",that.data.noticeContent);
        }else{
        
        }
       
      },
      
    });
  },
  onShow:function(){
    wx.hideHomeButton()
  },
  toxx(e){
    wx.navigateTo({
      url: '/pages/msg_post/msg_post?id'+e.currentTarget.dataset.id
    })
  },


});