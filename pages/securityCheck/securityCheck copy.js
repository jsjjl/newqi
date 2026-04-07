const CONFIG = require('../../config.js')
// 获取应用实例
var app = getApp();

Page({
  data: {
    isSubmitting: false,
    // 检查项目列表（16项）
    checkItems: [
      { name: '压力容器巡查', result: '', imgUrl: '', imgUrl: '' }, // 新增imgUrl用于存储上传后的图片ID
      { name: '危险品检查', result: '', imgUrl: '', imgUrl: '' },
      { name: '汇流排', result: '', imgUrl: '', imgUrl: '' },
      { name: '机组巡查', result: '', imgUrl: '', imgUrl: '' },
      { name: '每周保养', result: '', imgUrl: '', imgUrl: '' },
      { name: '每月保养', result: '', imgUrl: '', imgUrl: '' },
      { name: '维修记录', result: '', imgUrl: '', imgUrl: '' },
      { name: '隐患排查', result: '', imgUrl: '', imgUrl: '' },
      { name: '液氧抄表记录', result: '', imgUrl: '', imgUrl: '' },
      { name: '交接巡检表', result: '', imgUrl: '', imgUrl: '' },
      { name: '来访人员登记', result: '', imgUrl: '', imgUrl: '' },
      { name: '培训记录', result: '', imgUrl: '', imgUrl: '' },
      { name: '演练记录', result: '', imgUrl: '', imgUrl: '' },
      { name: '其他台账', result: '', imgUrl: '', imgUrl: '' },
      { name: '值班台', result: '', imgUrl: '', imgUrl: '' },
      { name: '现场设备运行状况', result: '', imgUrl: '', imgUrl: '' }
    ],
    currentDate: '', // 当天日期
    remark: '', // 检查说明
    showPreview: false, // 图片预览状态
    previewUrl: '' // 预览图片地址
  },

  onLoad() {
    // 初始化当天日期（格式：YYYY-MM-DD）
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    this.setData({
      currentDate: `${year}-${month}-${day}`
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
      count: 1, // 只允许上传1张
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        const checkItems = [...this.data.checkItems];
        checkItems[index].imgUrl = tempFilePaths[0]; // 保存临时路径
        this.setData({ checkItems });
        // 选择图片后自动上传
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
        
        // 解析上传结果
        try {
          const data = JSON.parse(res.data);
          if (res.statusCode === 200 && data.code === 200) {
            // 假设接口返回的数据格式为 {code:200, data: {id: '图片ID', url: '图片地址'}}
            const checkItems = [...that.data.checkItems];
            checkItems[index].imgUrl = data.data.url; // 保存图片ID
            that.setData({ checkItems });
            wx.showToast({ title: '图片上传成功', icon: 'success', duration: 1500 });
          } else {
            wx.showToast({ title: data.msg || '图片上传失败', icon: 'none' });
            // 上传失败清除临时图片
            const checkItems = [...that.data.checkItems];
            checkItems[index].imgUrl = '';
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
        // 上传失败清除临时图片
        const checkItems = [...that.data.checkItems];
        checkItems[index].imgUrl = '';
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

    // 检查是否正在提交
    if (that.data.isSubmitting) return;
    that.setData({ isSubmitting: true });

    wx.showLoading({ title: '提交中...' });

    // 准备提交的数据
    const formData = {
      checkDate: that.data.currentDate,
      remark: that.data.remark,
      items: that.data.checkItems.map(item => ({
        name: item.name,
        result: item.result,
        imgUrl: item.imgUrl || '' // 图片ID，没有则为空
      }))
    };

    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/device/maintenance/details/add',
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