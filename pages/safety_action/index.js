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
    
    // 假设后端提供了一个查询当前用户安全行动日任务的接口
    // 如果没有，可以由前端模拟或直接调用真实的
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/safetyAction/task/myList', // 假设的接口
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
          // 为了演示效果，如果接口404或者不存在，暂时提供一个友好的模拟数据
          // 如果想展示"非任务期间无任务"，可以将下面这行注释掉
          that.mockTasks(); 
          // that.setData({ tasks: [] });
        }
      },
      fail() {
        that.setData({ loading: false });
        // 模拟数据展示
        that.mockTasks();
        // that.setData({ tasks: [] });
      }
    });
  },

  mockTasks() {
    // 这里提供一个模拟的任务，帮助用户理解UI和逻辑。真实上线时后端开发只需调通接口即可。
    this.setData({
      tasks: [
        { id: 1, taskName: '当月安全行动日专项排查', actionDate: new Date().toISOString().split('T')[0], status: 0, requirement: '排查全院重点设备区域，落实相关工作。' }
      ]
    });
  },

  goToForm(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `/pages/safety_action/form?taskId=${id}&taskName=${name}`
    });
  },

  viewDetail(e) {
    wx.showToast({ title: '已填报详情开发中', icon: 'none' });
  }
})