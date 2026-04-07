
const CONFIG = require('../../../config.js')
//获取应用实例
var app = getApp();
Page({
  data: {
    no: false,
    taskId: '',
    name: "",
    zt: 1,
    showTransferDialog: false,
    userInput: '',
    showUserSuggest: false,
    filteredUserList: [],
    selectedUserId: '',
    userList: [],
    transfering: false,
    result:''
  },
  onLoad: function (e) {
    const that = this
    that.setData({
      result:e.result,
      taskId: e.id,
      name: e.name,
      zt: e.zt
    })
    // that.getlist()

    this.fetchUserList();
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
  openTransferDialog() {
    this.setData({
      showTransferDialog: true,
      userInput: '',
      filteredUserList: this.data.userList,
      showUserSuggest: false,
      selectedUserId: ''
    });
  },
  closeTransferDialog() {
    this.setData({ showTransferDialog: false });
  },
  onUserInput(e) {
    const value = e.detail.value.trim();
    let filtered = [];
    let selectedUserId = '';
    if (value) {
      filtered = this.data.userList.filter(u => u.nickName && u.nickName.indexOf(value) !== -1);
      const exact = this.data.userList.find(u => u.nickName === value);
      if (exact) selectedUserId = exact.userId;
    } else {
      filtered = this.data.userList;
    }
    this.setData({
      userInput: value,
      filteredUserList: filtered,
      showUserSuggest: true,
      selectedUserId
    });
  },
  onUserFocus() {
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
  confirmTransfer() {
    if (this.data.transfering) return; // 防止重复点击

    if (!this.data.selectedUserId) {
      wx.showToast({ title: '请选择人员', icon: 'none' });
      return;
    }    this.setData({ transfering: true });
    wx.showLoading({ title: '转单中', mask: true });
    wx.request({
      // ?userId=${this.data.selectedUserId}
      url: `https://medicalgas.lygyy.com.cn/prod-api/paTask/transfer`,
      method: 'POST',
      header: {   Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid') },
      data: { userId: this.data.selectedUserId,taskId: this.data.taskId },
      success: res => {
        wx.hideLoading();
        if (res.data.code === 200) {
          wx.showToast({ title: '转单成功', icon: 'success' });
          setTimeout(() => {
            wx.navigateBack();this.setData({ transfering: false });
          }, 1000);
          this.setData({ showTransferDialog: false });
        } else {this.setData({ transfering: false });
          wx.showToast({ title: res.data.msg || '转单失败', icon: 'none' });
        }
      },
      fail: () => {this.setData({ transfering: false });
        wx.hideLoading();
        wx.showToast({ title: '转单失败', icon: 'none' });
      }
    });
  },

  // /prod-api/lab/opsWxTask/point/rectification
  //获取数量
  getlist() {
    let that = this
    wx.request({
      url: CONFIG.subDomain + '/opsWxTask/point/list',
      method: 'get',
      data: {
        taskId: that.data.taskId,
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

  scanCode() {
    let that = this



    wx.scanCode({
      onlyFromCamera: true,
      scanType: 'barCode',
      success(res) {
        console.log(res)

        var a = res.result;

        let b = a.lastIndexOf("="); //截取等号后的内容

        a = a.substring(b + 1, a.length);

        console.log(a)  //2



        wx.navigateTo({
          // url: '?taskId='+that.data.taskId+'&pointId='+a,
          url: '/pages/lab/frontier_form/home?taskId=-1' + '&pointId=' + a,
        })

      }
    })
  },

  onShow: function () {
    wx.hideHomeButton()
    this.getlist()
  },
  toform(e) {
    let that = this
    if (this.data.zt == 2) {
      wx.navigateTo({
        url: '/pages/task_post/task_post?taskId=' + that.data.taskId + '&pointId=' + e.currentTarget.dataset.pointid,
      })
    }
  },


});