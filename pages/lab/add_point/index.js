const CONFIG = require('../../../config.js')

Page({
  data: {
    pointSn: '',
    floor: '',
    area: '',
    isSubmitting: false
  },

  onLoad(options) {
    if (options.pointId && options.pointId !== 'undefined') {
      this.setData({
        pointSn: options.pointId
      })
    }
  },

  submit() {
    if (this.data.isSubmitting) return;

    if (!this.data.pointSn) {
      return wx.showToast({ title: '请输入编号', icon: 'none' })
    }
    if (!this.data.floor) {
      return wx.showToast({ title: '请输入楼层', icon: 'none' })
    }
    if (!this.data.area) {
      return wx.showToast({ title: '请输入区域', icon: 'none' })
    }

    this.setData({ isSubmitting: true });
    wx.showLoading({ title: '提交中' });

    wx.request({
      url: CONFIG.subDomain + '/opsWxTask/point/add',
      method: 'POST',
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      data: {
        pointSn: this.data.pointSn,
        floor: this.data.floor,
        area: this.data.area
      },
      success: (res) => {
        wx.hideLoading();
        this.setData({ isSubmitting: false });
        if (res.data.code == 200) {
          // 同步调用新增设备资产接口，保持两边一致
          this.addDeviceAsset(this.data.pointSn, this.data.floor, this.data.area);
          wx.showToast({ title: '添加成功', icon: 'success' });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({ title: res.data.msg || '添加失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        this.setData({ isSubmitting: false });
        wx.showToast({ title: '请求失败', icon: 'none' });
      }
    })
  },

  // 同步新增设备资产
  addDeviceAsset(deviceCode, floor, area) {
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/device/info',
      method: 'POST',
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      data: {
        deviceCode: deviceCode,
        deviceName: '未知设备（巡检新增）',
        floor: floor,
        position: area
      },
      success: (res) => {
        console.log('同步新增设备资产结果：', res.data);
      },
      fail: (err) => {
        console.error('同步新增设备资产失败：', err);
      }
    });
  }
})