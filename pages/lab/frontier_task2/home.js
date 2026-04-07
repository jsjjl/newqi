
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
    zt:1
  },
  onShow: function () {
    if (!wx.getStorageSync('token')) {
    wx.redirectTo({
        url: '/pages/login/index',
      })
    }
    this.setData({
      list:[]
    })
    this.getlist()
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

// 格式化为年月日
 formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要+1
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
},

  //获取数量
  getlist() {
    let that = this

    // 获取当前日期
const now = new Date();

// 当天的开始时间（00:00:00）
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

// 当天的结束时间（23:59:59）
const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);


console.log("开始时间：", this.formatDate(startOfDay)); // 输出：2025-04-28
console.log("结束时间：", this.formatDate(endOfDay));   // 输出：2025-04-28


    wx.request({
      url: CONFIG.subDomain + '/opsWxTask/todayTask/list',
      method: 'get',
      data: {
        //开始和结束时间
        // startTime: this.formatDate(startOfDay),
        // endTime: this.formatDate(endOfDay),

        pageNum: that.data.pageNum,
        pageSize: that.data.pageSize
      },
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
          if (res.data.rows.length == 0) { //请求的数据为空，没有数据
            if (that.data.pageNum == 1) { // 第一页都没有数据，直接显示暂无数据
              that.setData({
                noData: true,
              })
            } else { // 不为第一页时，请求的数据为空，说明没有更多数据了，把pageNum减一，是为了下次触底可以继续请求刷新，万一有了新数据也可以正常显示出来
              that.setData({
                noMor: true,
                pageNum: that.data.pageNum - 1
              })
            }
          } else {  // 请求的结果有数据额
            if (res.data.rows.length == that.data.pageSize) { // 请求的数据为10条，说明下一页可能还有数据，列表添加上新的数据，把其他状态设为不显示
              that.setData({
                list: [...that.data.list, ...res.data.rows],
                noMor: false,
                noData: false
              })
            } else { // 请求的数据没有10条，说明下一页已经暂时没有数据了，列表添加上新的数据，底部显示暂无更多数据
              that.setData({
                list: [...that.data.list, ...res.data.rows],
                noMor: true,
                noData: false
              })
            }
          }

        } else {

          if (that.data.pageNum == 1) { // 第一页都没有数据，直接显示暂无数据
            that.setData({
              noData: true,
            })
          } else {
            that.setData({
              noData: false,
              noMor: true
            })
          }

        }

      },

    });
  },

  go(e) {



    console.log("ff", e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/lab/task_list2/task_list2?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name+'&zt='+this.data.zt,
    })


  },

});