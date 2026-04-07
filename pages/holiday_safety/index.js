const CONFIG = require('../../config.js')

Page({
  data: {
    loading: true,
    tasks: []
  },

  onShow() {
    this.fetchTasks();
  },

  fetchTasks() {
    let that = this;
    that.setData({ loading: true });
    
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/holidaySafety/task/myList', // 假设的节假日安全任务接口
      method: 'GET',
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success(res) {
        that.setData({ loading: false });
        if (res.data.code == 200 && res.data.data) {
          that.setData({
            tasks: res.data.data || res.data.rows || []
          });
        } else {
          that.mockTasks(); 
        }
      },
      fail() {
        that.setData({ loading: false });
        that.mockTasks();
      }
    });
  },

  mockTasks() {
    // 模拟数据：重大活动/节假日专项任务，定向给科主任/护士长
    this.setData({
      tasks: [
        { id: 101, taskName: '国庆节前重点区域安全排查', actionDate: new Date().toISOString().split('T')[0], status: 0, requirement: '由科主任、护士长牵头，排查本科室重大活动/节假日前安全隐患，确保设备及管路安全。' }
      ]
    });
  },

  goToForm(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `/pages/holiday_safety/form?taskId=${id}&taskName=${name}`
    });
  },

  viewDetail(e) {
    wx.showToast({ title: '已填报详情开发中', icon: 'none' });
  }
})