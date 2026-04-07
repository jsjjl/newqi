const CONFIG = require('../../config.js')
var app = getApp();

Page({
  data: {
    isSubmitting: false,
    // 检查项目列表（与后端参数对应）
    checkItems: [
      { name: '压力容器巡查', result: '', imgUrl: '', fileId: '', paramName: 'ylrqCheck', fileParam: 'ylrqCheckFileId' },
      { name: '危险品检查', result: '', imgUrl: '', fileId: '', paramName: 'wxpCheck', fileParam: 'wxpCheckFileId' },
      { name: '汇流排', result: '', imgUrl: '', fileId: '', paramName: 'hlqCheck', fileParam: 'hlqCheckFileId' },
      { name: '机组巡查', result: '', imgUrl: '', fileId: '', paramName: 'zjCheck', fileParam: 'zjCheckFileId' },
      { name: '每周保养', result: '', imgUrl: '', fileId: '', paramName: 'wkbyCheck', fileParam: 'wkbyCheckFileId' },
      { name: '每月保养', result: '', imgUrl: '', fileId: '', paramName: 'mmbyCheck', fileParam: 'mmbyCheckFileId' },
      { name: '维修记录', result: '', imgUrl: '', fileId: '', paramName: 'wxjlCheck', fileParam: 'wxjlCheckFileId' },
      { name: '隐患排查', result: '', imgUrl: '', fileId: '', paramName: 'yhpcCheck', fileParam: 'yhpcCheckFileId' },
      { name: '液氧抄表记录', result: '', imgUrl: '', fileId: '', paramName: 'yycbCheck', fileParam: 'yycbCheckFileId' },
      { name: '交接巡检表', result: '', imgUrl: '', fileId: '', paramName: 'jjbCheck', fileParam: 'jjbCheckFileId' },
      { name: '来访人员登记', result: '', imgUrl: '', fileId: '', paramName: 'lfdjCheck', fileParam: 'lfdjCheckFileId' },
      { name: '培训记录', result: '', imgUrl: '', fileId: '', paramName: 'pxjlCheck', fileParam: 'pxjlCheckFileId' },
      { name: '演练记录', result: '', imgUrl: '', fileId: '', paramName: 'yljlCheck', fileParam: 'yljlCheckFileId' },
      { name: '其他台账', result: '', imgUrl: '', fileId: '', paramName: 'qttzCheck', fileParam: 'qttzCheckFileId' },
      { name: '值班台', result: '', imgUrl: '', fileId: '', paramName: 'zdxwCheck', fileParam: 'zdxwCheckFileId' },
      { name: '现场设备运行状况', result: '', imgUrl: '', fileId: '', paramName: 'xcsbCheck', fileParam: 'xcsbCheckFileId' }
    ],
    currentDate: '', // 当天日期
    remark: '', // 检查说明
    showPreview: false,
    previewUrl: '',
    pointId: '' // 点位ID，根据实际情况获取
  },

  onLoad(options) {
    console.log("ccc", options.pointId);

    // 初始化日期
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    this.setData({
      currentDate: `${year}-${month}-${day}`,
      pointId: options.pointId || '1921753035498872821' // 从页面参数获取点位ID
    });
  },

  // 选择合格/不合格
  handleRadioChange(e) {
    const { index } = e.currentTarget.dataset;
    const result = e.detail.value;
    const checkItems = [...this.data.checkItems];
    checkItems[index].result = result;
    this.setData({ checkItems });
  },

  // 选择图片
  chooseImage(e) {
    const { index } = e.currentTarget.dataset;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        const checkItems = [...this.data.checkItems];
        checkItems[index].imgUrl = tempFilePaths[0];
        this.setData({ checkItems });
        this.uploadImage(index, tempFilePaths[0]);
      }
    });
  },

  // 上传图片到服务器
  uploadImage(index, filePath) {
    let that = this;
    wx.showLoading({ title: '上传图片中...' });

    wx.uploadFile({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/oss/upload',
      filePath: filePath,
      name: 'file',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      formData: {
        'Authorization': wx.getStorageSync('token'),
      },
      success: function success(res) {
        wx.hideLoading();
        console.log('图片上传结果:', res);

        try {
          const data = JSON.parse(res.data);
          if (res.statusCode === 200 && data.code === 200) {
            // 保存图片ID和URL
            const checkItems = [...that.data.checkItems];
            checkItems[index].fileId = data.data.ossId; // 保存图片ID
            checkItems[index].imgUrl = data.data.url; // 保存图片URL
            that.setData({ checkItems });
            wx.showToast({ title: '图片上传成功', icon: 'success', duration: 1500 });
          } else {
            wx.showToast({ title: data.msg || '图片上传失败', icon: 'none' });
            const checkItems = [...that.data.checkItems];
            checkItems[index].imgUrl = '';
            checkItems[index].fileId = '';
            that.setData({ checkItems });
          }
        } catch (e) {
          console.error('解析图片上传结果失败:', e);
          wx.showToast({ title: '图片上传失败', icon: 'none' });
        }
      },
      fail: function fail(error) {
        wx.hideLoading();
        console.error('图片上传失败:', error);
        wx.showToast({ title: '图片上传失败', icon: 'none' });
        const checkItems = [...that.data.checkItems];
        checkItems[index].imgUrl = '';
        checkItems[index].fileId = '';
        that.setData({ checkItems });
      }
    });
  },

  // 预览图片
  previewImage(e) {
    const { index } = e.currentTarget.dataset;
    const imgUrl = this.data.checkItems[index].imgUrl;
    if (imgUrl) {
      wx.previewImage({
        urls: [imgUrl]
      });
    }
  },

  // 输入检查说明
  handleRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  // 提交表单
  submitForm() {
    let that = this;

    // 验证是否所有项目都已选择
    const unChecked = that.data.checkItems.filter(item => !item.result);
    if (unChecked.length > 0) {
      wx.showToast({
        title: `尚有${unChecked.length}项未选择结果`,
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (that.data.isSubmitting) return;
    that.setData({ isSubmitting: true });

    wx.showLoading({ title: '提交中...' });

    // 构建符合后端要求的数据结构
    const formData = {
      checkDate: that.data.currentDate,
      userId: wx.getStorageSync('userId') || 0, // 从缓存获取用户ID
      checkResult: that.data.remark,
      pointId: that.data.pointId // 添加点位ID
    };

    // 映射检查项结果到对应参数
    that.data.checkItems.forEach(item => {
      // 转换结果为1/0
      formData[item.paramName] = item.result === '合格' ? 1 : 0;
      // 设置图片ID
      if (item.fileId) {
        formData[item.fileParam] = item.fileId;
      }
    });

    console.log('提交的数据:', formData);

    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/sc/record/add', // 新的接口地址
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        Authorization: wx.getStorageSync('token')
      },
      data: formData,
      success(res) {
        wx.hideLoading();
        that.setData({ isSubmitting: false });

        if (res.data.code === 200) {
          wx.showToast({ title: '提交成功', icon: 'success' });
          setTimeout(() => wx.navigateBack(), 1500);
        } else {
          wx.showToast({ title: res.data.msg || '提交失败', icon: 'none' });
        }
      },
      fail() {
        wx.hideLoading();
        that.setData({ isSubmitting: false });
        wx.showToast({ title: '网络错误，提交失败', icon: 'none' });
      }
    });
  }
});