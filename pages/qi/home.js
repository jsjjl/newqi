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
    borrowerName: undefined,
    beginRecordTime: undefined,
    endRecordTime: undefined,
    ownerContact: undefined,
    ownerName: undefined,

    gasTypeList: [], // 气体类型列表
    selectedGasTypeIndexs: [],
    selectedGasTypeNames: [],
    wardList: [], // 病区列表
    selectedWardIndexs: [],
    selectedWardNames: [],



    selectedGasTypeIndex: null,
    areaList: [],
    selectedAreaIndex: null,
    wardList: [],
    selectedWardIndex: null,

    userList: [],
    selectedUserIndex: null,

  },
  onLoad: function () {
    if (!wx.getStorageSync('token')) {
     wx.redirectTo({
        url: '/pages/login/index',
      })
    }
    this.getlist()
    this.fetchUserList();
    this.fetchGasTypeList();
    this.fetchAreaList();
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

  fetchGasTypeList() {
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/dict/data/type/gas_type',
      method: 'GET',
      header: { Authorization: wx.getStorageSync('token') },
      success: res => {
        if (res.data.code === 200) {
          this.setData({ gasTypeList: res.data.data });
        }
      }
    });
  },

  fetchAreaList() {
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/area/info/list',
      method: 'GET',
      header: { Authorization: wx.getStorageSync('token') },
      success: res => {
        if (res.data.code === 200) {
          this.setData({ areaList: res.data.data });
        }
      }
    });
  },


  fetchWardList(areaId) {
    wx.request({
      url: `https://medicalgas.lygyy.com.cn/prod-api/hospital/ward/list?areaId=${areaId}`,
      method: 'GET',
      header: { Authorization: wx.getStorageSync('token') },
      success: res => {
        if (res.data.code === 200) {
          this.setData({ wardList: res.data.rows });
        }
      }
    });
  },
  onUserChange(e) {
    this.setData({
      selectedUserIndex: e.detail.value,
      list: [],
      pageNum: 1
    });
    this.getlist();
  },
  onGasTypeChange(e) {
    this.setData({
      selectedGasTypeIndex: e.detail.value,
      list: [],
      pageNum: 1
    });
    this.getlist();
  },
  onAreaChange(e) {
    const idx = e.detail.value;
    this.setData({
      selectedAreaIndex: idx,
      wardList: [],
      selectedWardIndex: null,
      list: [],
      pageNum: 1
    });
    const areaId = this.data.areaList[idx].id;
    this.fetchWardList(areaId);
    this.getlist();
  },
  onWardChange(e) {
    this.setData({
      selectedWardIndex: e.detail.value,
      list: [],
      pageNum: 1
    });
    this.getlist();
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

  bindKeyInput(e) {
    this.setData({
      borrowerName: e.detail.value,
      list: [],
      pageNum: 1
    });
    this.getlist();
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
    // if (this.data.selectedUserIndex !== null) {
    //   temp.borrowerId = this.data.userList[this.data.selectedUserIndex].userId;
    // }
    if (this.data.selectedGasTypeIndex !== null) {
      temp.gasType = this.data.gasTypeList[this.data.selectedGasTypeIndex].dictValue;
    }
    if (this.data.selectedAreaIndex !== null) {
      temp.areaId = this.data.areaList[this.data.selectedAreaIndex].id;
    }
    if (this.data.selectedWardIndex !== null) {
      temp.wardId = this.data.wardList[this.data.selectedWardIndex].id;
    }

     temp.borrowerId = wx.getStorageSync("user").user.userId;
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
      url: CONFIG.subDomain + '/gas/borrow/page',
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
    console.log(e.currentTarget.dataset.detail);
    wx.setStorageSync('detail', e.currentTarget.dataset.detail);
    wx.navigateTo({
      url: "/pages/qi/detail",
    })
  },


});