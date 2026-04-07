const CONFIG = require('../../config.js');
var app = getApp();

Page({
  data: {
    deviceName: '',
    deviceCode: '',
    floor: '',
    position: '',
    isSubmitting: false
  },

  onLoad: function (options) {
  },

  onNameInput(e) {
    this.setData({ deviceName: e.detail.value });
  },

  onCodeInput(e) {
    this.setData({ deviceCode: e.detail.value });
  },

  onFloorInput(e) {
    this.setData({ floor: e.detail.value });
  },

  onPositionInput(e) {
    this.setData({ position: e.detail.value });
  },

  onSubmit() {
    if (this.data.isSubmitting) return;

    if (!this.data.deviceName) {
      return wx.showToast({ title: '请输入设备名称', icon: 'none' });
    }
    if (!this.data.deviceCode) {
      return wx.showToast({ title: '请输入设备编号', icon: 'none' });
    }
    if (!this.data.floor) {
      return wx.showToast({ title: '请输入楼层', icon: 'none' });
    }
    if (!this.data.position) {
      return wx.showToast({ title: '请输入区域位置', icon: 'none' });
    }

    this.setData({ isSubmitting: true });
    wx.showLoading({ title: '提交中' });

    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/device/info',
      method: 'POST',
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      data: {
        deviceName: this.data.deviceName,
        deviceCode: this.data.deviceCode,
        floor: this.data.floor,
        position: this.data.position
      },
      success: (res) => {
        wx.hideLoading();
        this.setData({ isSubmitting: false });
        if (res.data.code == 200) {
          wx.showToast({ title: '新增成功', icon: 'success' });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({ title: res.data.msg || '新增失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        this.setData({ isSubmitting: false });
        wx.showToast({ title: '请求失败', icon: 'none' });
      }
    });
  }
});
