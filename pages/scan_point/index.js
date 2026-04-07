const CONFIG = require('../../config.js')

Page({
  data: {
    pointId: '',
    pointName: '',
    records: [],
    todayCount: 0,
    totalCount: 0,
    loading: true
  },

  onLoad(options) {
    let pointId = '';
    // 处理微信扫一扫进来的链接参数
    if (options.q) {
      let url = decodeURIComponent(options.q);
      let b = url.lastIndexOf("=");
      if (b !== -1) {
        pointId = url.substring(b + 1);
      }
    } else if (options.pointId) {
      pointId = options.pointId;
    } else if (options.id) {
      pointId = options.id;
    }

    if (!pointId) {
      wx.showToast({
        title: '点位参数丢失',
        icon: 'none'
      });
      return;
    }

    this.setData({ pointId });
    
    // 如果没有token，可能需要先登录
    if (!wx.getStorageSync('token')) {
      wx.setStorageSync('redirectAfterLogin', `/pages/scan_point/index?pointId=${pointId}`);
      wx.redirectTo({
        url: '/pages/login/index'
      });
      return;
    }

    this.getPointInfo();
    this.getHistoryRecords();
  },

  // 获取点位基础信息
  getPointInfo() {
    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/opsWxTask/point/query/inspection',
      method: 'GET',
      data: { pointId: that.data.pointId },
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success(res) {
        if (res.data.code == 200 && res.data.data) {
          that.setData({
            pointName: res.data.data.pointName
          });
        } else {
          // 如果巡检接口查不到，尝试从其他途径获取或忽略
          console.log('未查到点位巡检基础信息');
        }
      }
    });
  },

  // 获取历史记录及统计
  getHistoryRecords() {
    let that = this;
    that.setData({ loading: true });
    
    wx.request({
      url: CONFIG.subDomain + '/opsWxTask/task/detail/mine',
      method: 'GET',
      data: {
        pointId: that.data.pointId
      },
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success(res) {
        that.setData({ loading: false });
        if (res.data.code == 200 && res.data.rows) {
          let rows = res.data.rows;
          
          // 如果之前没取到点位名，从记录里取
          if (!that.data.pointName && rows.length > 0) {
            that.setData({ pointName: rows[0].pointName });
          }

          // 计算今日巡检次数
          let today = that.formatDate(new Date());
          let todayCount = rows.filter(item => item.submitTime && item.submitTime.startsWith(today)).length;

          // 仅展示最近 5 条记录
          that.setData({
            records: rows.slice(0, 5),
            todayCount: todayCount,
            totalCount: rows.length
          });
        }
      },
      fail() {
        that.setData({ loading: false });
      }
    });
  },

  // 格式化为年月日
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  // 跳转详情页查看巡检信息和照片
  toDetail(e) {
    let dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/lab/task_post/task_post?taskId=' + dataset.taskid + '&pointId=' + dataset.pointid
    });
  },

  // 底部立即开始巡检按钮
  startInspection() {
    wx.navigateTo({
      url: '/pages/lab/frontier_form/home?taskId=-1&pointId=' + this.data.pointId
    });
  }
})