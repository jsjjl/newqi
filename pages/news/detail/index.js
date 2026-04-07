Page({
  data: {
    news: {}
  },

  onLoad(options) {
    if (options.data) {
      try {
        const newsData = JSON.parse(decodeURIComponent(options.data));
        this.setData({
          news: newsData
        });
        wx.setNavigationBarTitle({
          title: '资讯详情'
        });
      } catch (e) {
        console.error('解析资讯数据失败', e);
      }
    }
  }
})