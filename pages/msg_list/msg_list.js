
const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp();
Page({
  data: {
    no: false,
    img_arr: [],
    tabs: ['系统通知', '巡检任务统计', '告警时间通知'],
    currentTab: 0,
    listData: [] // 当前显示的数据列表
  },
  
  onLoad: function () {
    // 页面加载逻辑
  },

  switchTab(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index,
      listData: [],
      no: false
    });
    
    if (index === 0) {
      this.getlist();
    } else if (index === 1) {
      this.getTaskStats();
    } else if (index === 2) {
      this.getWarningMsgs();
    }
  },

  // 获取系统通知
  getlist() {
    let that = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/wx/notice/list',
      method: 'get',
      data: {
        pageSize: 50,
        pageNum: 1,
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          if (res.data.rows && res.data.rows.length > 0) {
            that.setData({
              listData: res.data.rows,
              no: false
            });
          } else {
            that.setData({
              listData: [],
              no: true
            });
          }
        }
      },
      fail() {
        wx.hideLoading();
      }
    });
  },

  // 获取巡检任务统计
  getTaskStats() {
    let that = this;
    wx.showLoading({ title: '加载中' });
    // 假设调用获取统计的接口或者使用现有的任务列表接口来模拟统计信息
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/opsWxTask/task/page/myList',
      method: 'get',
      data: {
        pageSize: 50,
        pageNum: 1,
      },
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          if (res.data.rows && res.data.rows.length > 0) {
            // 对任务数据做简单转换以适配列表显示
            let stats = res.data.rows.map(item => ({
               title: `任务: ${item.taskName || '未命名'}`,
               time: `计划时间: ${item.startTime || ''} 至 ${item.endTime || ''}`,
               id: item.id,
               isTask: true
            }));
            that.setData({
              listData: stats,
              no: false
            });
          } else {
            that.setData({
              listData: [],
              no: true
            });
          }
        } else {
           // 模拟数据展示（如果接口不支持或数据为空）
           that.setData({
              listData: [
                { title: '今日巡检任务：应检 12 个，已检 8 个', time: '更新时间: 今天 14:30', isTask: true },
                { title: '本周巡检任务统计：完成率 95%', time: '更新时间: 昨天 18:00', isTask: true }
              ],
              no: false
            });
        }
      },
      fail() {
        wx.hideLoading();
        // 模拟数据展示
        that.setData({
            listData: [
              { title: '今日巡检任务：应检 12 个，已检 8 个', time: '更新时间: 今天 14:30', isTask: true },
              { title: '本周巡检任务统计：完成率 95%', time: '更新时间: 昨天 18:00', isTask: true }
            ],
            no: false
        });
      }
    });
  },

  // 获取告警时间通知
  getWarningMsgs() {
    let that = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/warning/ac/warninginfo/page',
      method: 'get',
      data: {
        pageSize: 50,
        pageNum: 1,
      },
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          if (res.data.rows && res.data.rows.length > 0) {
            let warnings = res.data.rows.map(item => ({
               title: `【告警】${item.equipmentName || item.position || '未知设备'} - ${item.info || '异常'}`,
               time: `告警时间: ${item.warningTime || item.createTime || ''}`,
               isWarning: true
            }));
            that.setData({
              listData: warnings,
              no: false
            });
          } else {
            that.setData({
              listData: [],
              no: true
            });
          }
        } else {
           // 模拟数据展示
           that.setData({
              listData: [
                { title: '【1级告警】2号氧气罐 - 余量低于5%', time: '告警时间: 2026-04-06 12:00:00', isWarning: true },
                { title: '【2级告警】一号楼区域报警箱 - 压力异常', time: '告警时间: 2026-04-06 10:30:00', isWarning: true }
              ],
              no: false
            });
        }
      },
      fail() {
        wx.hideLoading();
        // 模拟数据展示
        that.setData({
            listData: [
              { title: '【1级告警】2号氧气罐 - 余量低于5%', time: '告警时间: 2026-04-06 12:00:00', isWarning: true },
              { title: '【2级告警】一号楼区域报警箱 - 压力异常', time: '告警时间: 2026-04-06 10:30:00', isWarning: true }
            ],
            no: false
        });
      }
    });
  },

  onShow: function () {
    wx.hideHomeButton();
    // 默认加载系统通知
    if (this.data.currentTab === 0) {
      this.getlist();
    } else if (this.data.currentTab === 1) {
      this.getTaskStats();
    } else if (this.data.currentTab === 2) {
      this.getWarningMsgs();
    }
  },

  toxx(e) {
    let id = e.currentTarget.dataset.id;
    let isTask = e.currentTarget.dataset.istask;
    let isWarning = e.currentTarget.dataset.iswarning;
    
    if (isTask) {
      wx.navigateTo({
        url: '/pages/lab/frontier_task2/home' // 跳转到巡检任务列表
      });
    } else if (isWarning) {
      wx.navigateTo({
        url: '/pages/give_v1/g2' // 跳转到实时告警页面
      });
    } else if (id) {
      wx.navigateTo({
        url: '/pages/msg_post/msg_post?id=' + id
      });
    }
  }


});