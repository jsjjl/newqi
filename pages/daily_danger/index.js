Page({
  data: {
    description: '',
    img_arr: [],
    post_image: [],
    isSubmitting: false
  },

  onDescriptionInput(e) {
    this.setData({
      description: e.detail.value
    });
  },

  addImg() {
    let that = this;
    if (this.data.img_arr.length >= 5) {
      return wx.showToast({ title: '最多上传5张照片', icon: 'none' });
    }
    
    wx.chooseImage({
      count: 5 - that.data.img_arr.length,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      success(res) {
        let tempFiles = res.tempFiles;
        let valid = tempFiles.every(item => item.size <= 20000000); // 限制20M
        if (valid) {
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          });
        } else {
          wx.showToast({ title: '图片大小不能超过20M', icon: 'none' });
        }
      }
    });
  },

  deleteImg(e) {
    let index = e.currentTarget.dataset.index;
    let img_arr = this.data.img_arr;
    img_arr.splice(index, 1);
    this.setData({ img_arr });
  },

  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.img_arr[index],
      urls: this.data.img_arr
    });
  },

  submit() {
    let that = this;
    
    if (!that.data.description.trim()) {
      return wx.showToast({ title: '请详细描述隐患问题', icon: 'none' });
    }
    if (that.data.img_arr.length === 0) {
      return wx.showToast({ title: '请至少上传一张现场照片', icon: 'none' });
    }
    if (that.data.isSubmitting) {
      return;
    }

    that.setData({ 
      isSubmitting: true,
      post_image: [] 
    });
    
    wx.showLoading({ title: '正在提交...', mask: true });
    that.uploadImage(0);
  },

  uploadImage(i) {
    let that = this;
    let totalLength = that.data.img_arr.length;

    wx.uploadFile({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/system/oss/upload',
      filePath: that.data.img_arr[i],
      name: 'file',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function(res) {
        if (res.statusCode == 200) {
          let data = JSON.parse(res.data);
          if (data.code === 200 && data.data && data.data.url) {
            that.data.post_image.push(data.data.url);
            if (i === totalLength - 1) {
              that.submitData();
            } else {
              that.uploadImage(i + 1);
            }
          } else {
            that.handleUploadFail('部分图片上传失败');
          }
        } else {
          that.handleUploadFail('网络异常，图片上传失败');
        }
      },
      fail: function() {
        that.handleUploadFail('图片上传失败，请重试');
      }
    });
  },

  handleUploadFail(msg) {
    wx.hideLoading();
    wx.showToast({ title: msg, icon: 'none' });
    this.setData({ isSubmitting: false });
  },

  submitData() {
    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/paEvent',
      method: 'POST',
      data: {
        description: that.data.description,
        image: that.data.post_image.join(','),
        isAnonymous: 1 // 简化上报通常采用匿名或简化身份信息
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({ title: '提交成功', icon: 'success' });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({ title: res.data.msg || '提交失败', icon: 'none' });
          that.setData({ isSubmitting: false });
        }
      },
      fail: function() {
        wx.hideLoading();
        wx.showToast({ title: '网络异常，提交失败', icon: 'none' });
        that.setData({ isSubmitting: false });
      }
    });
  }
})