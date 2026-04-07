Page({
  data: {
    ctx: null, // Canvas 上下文
    isDrawing: false, // 是否正在绘制
    points: [], // 存储触摸点的坐标
  },

  onLoad() {
    // 获取 Canvas 上下文
    const query = wx.createSelectorQuery();
    query.select('#signatureCanvas').fields({ node: true, size: true }).exec((res) => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      this.setData({ ctx });

      // 设置画布尺寸
      const dpr = wx.getSystemInfoSync().pixelRatio;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);

      // 设置线条样式
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000';
    });
  },

  // 触摸开始
  touchStart(e) {
    this.setData({
      isDrawing: true,
      points: [],
    });
    const { x, y } = e.touches[0];
    this.data.ctx.beginPath();
    this.data.ctx.moveTo(x, y);
  },

  // 触摸移动
  touchMove(e) {
    if (!this.data.isDrawing) return;

    const { x, y } = e.touches[0];
    this.data.ctx.lineTo(x, y);
    this.data.ctx.stroke();
  },

  // 触摸结束
  touchEnd() {
    this.setData({ isDrawing: false });
  },

  // 清除画布
  clearCanvas() {
    const { ctx } = this.data;
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  },

  // 保存签名
  saveSignature() {
    console.log('保存签名', this.data);
  
    // 使用 createSelectorQuery 获取 Canvas 元素
    const query = wx.createSelectorQuery();
    query.select('#signatureCanvas').fields({ node: true, size: true }).exec((res) => {
      const canvas = res[0]?.node; // 获取 Canvas 节点
      if (!canvas) {
        console.error('Canvas 节点未找到');
        return;
      }
  
      // 将 Canvas 转换为临时文件路径
      wx.canvasToTempFilePath({
        canvas: canvas, // 传入 Canvas 节点
        success: (res) => {
          console.log('图片保存成功', res);
  
          // 上传图片到服务器
          wx.uploadFile({
            url: 'https://your-server.com/upload',
            filePath: res.tempFilePath,
            name: 'signature',
            success: (uploadRes) => {
              // 处理上传结果
              console.log('上传成功', uploadRes);
            },
            fail: (uploadErr) => {
              console.error('上传失败', uploadErr);
            }
          });
        },
        fail: (err) => {
          console.error('图片保存失败', err);
        }
      });
    });
  }
});