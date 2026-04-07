const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp();
Page({
  data: {
    list: [],
    pageSize: 10,
    pageNum: 1,
    noMor: false,
    noData: false,
    deviceName: undefined,
    beginRecordTime: undefined,
    endRecordTime: undefined,
    ownerContact: undefined,
    ownerName: undefined,
    deviceCode: undefined,

    
  },
  onLoad: function () {
    if (!wx.getStorageSync('token')) {
      wx.redirectTo({
        url: '/pages/login/index',
      })
    }
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

  bindKeyInput: function (e) {
    this.setData({
      deviceName: e.detail.value,
      list: [],
      pageNum: 1
    })
    this.getlist()
  },
  bindKeyInput2: function (e) {
    this.setData({
      deviceCode: e.detail.value,
      list: [],
      pageNum: 1
    })
    this.getlist()
  },


  bindBeginDateChange: function (e) {
    console.log('beginRecordTime', e.detail.value)
    this.setData({
      beginRecordTime: e.detail.value,
      list: [],
      pageNum: 1
    })
    this.getlist()
  },

  bindEndDateChange: function (e) {
    console.log('endRecordTime', e.detail.value)
    this.setData({
      endRecordTime: e.detail.value,
      list: [],
      pageNum: 1
    })
    this.getlist()
  },

  bindBeginDateQK: function (e) {
    this.setData({
      beginRecordTime: '',
      list: [],
      pageNum: 1
    })
    this.getlist()
  },

  bindEndDateQK: function (e) {
    this.setData({
      endRecordTime: '',
      list: [],
      pageNum: 1
    })
    this.getlist()
  },

  viewImage(e) {
    let img = e.currentTarget.dataset.id
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img]// 所有要预览的图片的urls
    })
  },

  bindKeyOwnerContactInput: function (e) {
    this.setData({
      ownerContact: e.detail.value,
      list: [],
      pageNum: 1
    })
    this.getlist()
  },
  bindKeyOwnerNameInput: function (e) {
    console.log(11111);

    this.setData({
      ownerName: e.detail.value,
      list: [],
      pageNum: 1
    })
    this.getlist()
  },


  //获取数量
  getlist() {
    let that = this
    let temp = {
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize
    }
    if (that.data.deviceName) {
      temp.deviceName = that.data.deviceName
    }

    if (that.data.deviceCode) {
      temp.deviceCode = that.data.deviceCode
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
      url: CONFIG.subDomain + '/wx/device/deviceExpireList',
      method: 'get',
      // data: temp,
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
          if (res.data.data.length == 0) { //请求的数据为空，没有数据
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
            if (res.data.data.length == that.data.pageSize) { // 请求的数据为10条，说明下一页可能还有数据，列表添加上新的数据，把其他状态设为不显示
              that.setData({
                list: [...that.data.list, ...res.data.data],
                noMor: false,
                noData: false
              })
            } else { // 请求的数据没有10条，说明下一页已经暂时没有数据了，列表添加上新的数据，底部显示暂无更多数据
              that.setData({
                list: [...that.data.list, ...res.data.data],
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
    console.log(e.currentTarget.dataset.detail);
    wx.setStorageSync('detail', e.currentTarget.dataset.detail);
    wx.navigateTo({
      url: "/pages/sebei/detail?gq=true",
    })
  },

});