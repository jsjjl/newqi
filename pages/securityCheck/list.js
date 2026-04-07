const CONFIG = require('../../config.js')
var app = getApp();

Page({
  data: {
    pointId: '',
    currentNav: 'pressure',
    currentType: 1,
    currentList: [],
    showModal: false,
    modalData: {},
    listData: {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: []
    }
  },

  onLoad(options) {
    console.log("pointId", options.pointId);
    this.setData({
      pointId: options.pointId || '-'
    }, () => {
      this.loadListData(1);
    });
  },

   // 新增：清理字符串（换行符+多余空格）
  cleanStr(str) {
    if (!str || str === '-') return str; // 空值/默认-不处理
    return str
      .replace(/[\n\r]/g, '') // 移除所有换行符（\n \r \r\n）
      .trim() // 移除首尾空格
      .replace(/\s+/g, ' '); // 多个空格合并为1个（保留正常空格）
  },

  go() {
    wx.navigateTo({
      url: '/pages/securityCheck/securityCheck?pointId=' + this.data.pointId
    })
  },

  switchNav(e) {
    const nav = e.currentTarget.dataset.nav;
    const type = parseInt(e.currentTarget.dataset.type);
    this.setData({
      currentNav: nav,
      currentType: type
    }, () => {
      if (this.data.listData[type].length === 0) {
        this.loadListData(type);
      } else {
        this.setData({ currentList: this.data.listData[type] });
      }
    });
  },
loadListData(type) {
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/wx/sc/record/list',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        Authorization: wx.getStorageSync('token')
      },
      data: { pointId: this.data.pointId, type: type },
    success: (res) => {
      wx.hideLoading();
      if (res.data && res.data.code === 200) {
        let formattedList = [];
        switch(type) {
          case 1: case 2: case 3: case 4:
            formattedList = res.data.data.map(item => ({
              id: item.taskId || '-',
              // 👇 清理name字段
              name: this.cleanStr(item.deviceName) || '-',
              time: item.time || '-',
              person: item.inspector || '-',
              result: item.result || '-'
            }));
            break;
          case 5: case 6:
            formattedList = res.data.data.map(item => ({
              id: item.id || '-',
              // 👇 清理name字段
              name: this.cleanStr(item.deviceName) || '-',
              time: item.maintainDate || '-',
              person: item.operatorName || '-',
              result: item.status || '-'
            }));
            break;
          case 7:
            formattedList = res.data.data.map(item => ({
              id: item.id || '-',
              // 👇 清理name字段
              name: this.cleanStr(item.deviceName) || '-',
              time: item.repairDate || '-',
              person: item.repairName || '-',
              result: item.status || '-'
            }));
            break;
          case 8:
            formattedList = res.data.data.map(item => ({
              id: item.id || '-',
              // 👇 清理name字段
              name: this.cleanStr(item.location) || '隐患排查',
              time: item.createTime || '-',
              person: item.reporterName || '-',
              result: this.getHiddenStatusText(item.status) || '-',
              hiddenDanger: item.description || '-',
              rectifyMeasure: '-',
              remark: item.empno ? `工号：${item.empno}` : '-',
              photo: item.image || '',
              reporter: item.reporter || '-',
              handlerName: item.handlerName || '-'
            }));
            break;
        }
        const listData = this.data.listData;
        listData[type] = formattedList;
        this.setData({ listData, currentList: listData[type] });
      }
    },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
        console.error('加载列表失败', err);
      }
    });
  },

  // 图片预览放大
  previewImage(e) {
    const current = e.currentTarget.dataset.src; // 当前点击的图片地址
    const urls = e.currentTarget.dataset.urls || [current]; // 所有图片地址数组

    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    });
  },

  showDetail(e) {
    const item = e.currentTarget.dataset.item;
    const type = this.data.currentType;

    // 8类型：隐患排查（直接用列表数据）
    if (type === 8) {
      this.setData({
        showModal: true,
        modalData: {
          name: item.name || '-',
          hiddenDanger: item.hiddenDanger || '-',
          rectifyMeasure: item.rectifyMeasure || '-',
          reportTime: item.time || '-', // 上报时间
          reporter: item.person || '-', // 上报人
          handler: item.handlerName || '-', // 处理人
          status: item.result || '-', // 处理状态
          remark: item.remark || '-',
          photo: item.photo || ''
        }
      });
      return;
    }

    wx.showLoading({ title: '加载详情...' });
    let url = '';
    if ([1,2,3,4].includes(type)) url = `https://medicalgas.lygyy.com.cn/prod-api/wx/sc/record/s1/details/${item.id}`;
    else if ([5,6].includes(type)) url = `https://medicalgas.lygyy.com.cn/prod-api/wx/sc/record/s2/details/${item.id}`;
    else if (type === 7) url = `https://medicalgas.lygyy.com.cn/prod-api/wx/sc/record/s3/details/${item.id}`;

    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        Authorization: wx.getStorageSync('token')
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data && res.data.code == 200) {
          const detailArray = res.data.data || [];
          const formattedModalData = { name: item.name || '-' };

          // 1-4类型：巡查详情
          if ([1,2,3,4].includes(type)) {
            formattedModalData.checkItems = detailArray.map(item => ({
              name: item.entryName || '检查项',
              standard: item.entryContent || '-', // 标准范围
              actual: item.value !== null ? `${item.value} ${item.unitName || ''}` : '-', // 实际值
              // state 1、正常 2：异常 3：偏高 4：偏低
              status: item.state == 1 ? '正常' : item.state == 2 ? '异常' : item.state == 3 ? '偏高' : item.state == 4 ? '偏低' : '-',
              statusClass: item.state == 1 ? 'normal' : item.state == 2 ? 'abnormal' : item.state == 3 ? 'abnormal' : item.state == 4 ? 'abnormal' : ''
            }));
            formattedModalData.inspectTime = item.time || '-'; // 巡查时间
            formattedModalData.inspector = item.person || '-'; // 巡查人
          }

          // 5-6类型：保养详情
          else if ([5,6].includes(type)) {
            formattedModalData.maintainItems = detailArray.map(item => ({
              content: item.content || '-',
              date: item.detailDate || '-',
              remark: item.remark || '-',
              hasAttachment: !!item.pictures || !!item.video
            }));
            formattedModalData.maintainPerson = item.person || '-'; // 保养人
            formattedModalData.maintainResult = item.result || '-'; // 保养结果
          }

          // 7类型：维修详情
          else if (type === 7) {
            formattedModalData.repairItems = detailArray.map(item => ({
              content: item.content || '-',
              date: item.detailDate || '-',
              remark: item.remark || '-',
              pictures: item.picturesUrl ? item.picturesUrl.split(',') : [], // 图片列表
              videos: item.videoUrl ? item.videoUrl.split(',') : [] // 视频列表
            }));
            formattedModalData.repairPerson = item.person || '-'; // 维修人
            formattedModalData.repairResult = item.result || '-'; // 维修结果
          }

          this.setData({ showModal: true, modalData: formattedModalData });
        } else {
          wx.showToast({ title: '加载详情失败', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
        console.error('加载详情失败', err);
      }
    });
  },


  getHiddenStatusText(status) {
    const statusMap = { '1': '待处理', '2': '处理中', '3': '已整改', '4': '已关闭' };
    return statusMap[status] || status || '-';
  },

  closeModal() {
    this.setData({ showModal: false });
  }
});