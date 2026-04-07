
const CONFIG = require('../../../config.js')
//获取应用实例
var app = getApp();
Page({
  data: {
    list: [],
    pageSize: 10,
    pageNum: 1,
    noMor: false,
    noData: false,
    tag:[],
    id:undefined,
  },

  onLoad: function (options) {
   if(options.id){
    this.setData({
      id:options.id
    })
    this.getlist()
   }
  },


  onReachBottom: function () {
    if (this.data.pageNum * this.data.pageSize == this.data.list.length) {
      // 数据列表的数量刚好等于页数*每页条数，可以请求下一页
      this.setData({
        pageNum: this.data.pageNum + 1, // 一般上拉触底是为了加载更多分页数据，所以这里页数自增
      });
      this.getlist() // 查询列表方法
    } else {
      // 数据列表的数量不等于页数*每页条数，说明当前页数据不足10条，已经没有更多数据了
      this.setData({
        noMor: true  // 这里在页面最底部显示一排文字，没有更多数据了
      })
    }
  },
  viewImage(e) {
    let img = e.currentTarget.dataset.id
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img]// 所有要预览的图片的urls
    })
  },
  select(e){
    this.setData({
      id:e.currentTarget.dataset.id,
      pageNum:1,
      list:[],
    })
    this.getlist()
  },


  gettag() {
    let that = this
    wx.request({
      url: CONFIG.subDomain + '/klFileDir/list',
      method: 'get',
  
      header: {
        Authorization:wx.getStorageSync('token'),
        clientid:wx.getStorageSync('clientid')
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
            tag: res.data.rows,
          })
         
        } else {

          that.setData({
            tag: [],
          })

        }

      },

    });
  },
  //获取数量
  getlist() {
    let that = this
    let temp ={
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize
    }
    if(this.data.id){
      temp.dirId = this.data.id
    }
    wx.request({
      url: CONFIG.subDomain + '/klFileInfo/'+this.data.id,
      method: 'get',

      header: {
        Authorization:wx.getStorageSync('token'),
        clientid:wx.getStorageSync('clientid')
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
            list: res.data.data,
          })
          console.log("ddd",that.data.list);
        
         
        } else {

        

        }

      },

    });
  },

  go(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.id,
    })
  },

});