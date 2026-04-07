Page({
  data: {
    safetyNews: []
  },

  onLoad() {
    // 模拟从接口或首页传递获取数据
    this.setData({
      safetyNews: [
        { title: '冬季特种设备安全使用指南', date: '2026-03-20', thumb: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=%E5%86%AC%E5%AD%A3%E7%89%B9%E7%A7%8D%E8%AE%BE%E5%A4%87%E5%AE%89%E5%85%A8&image_size=landscape_4_3' },
        { title: '医用氧气操作规范与事故预防', date: '2026-03-15', thumb: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=%E5%8C%BB%E7%94%A8%E6%B0%A7%E6%B0%94%E6%93%8D%E4%BD%9C&image_size=landscape_4_3' },
        { title: '新修订安全生产法解读培训', date: '2026-03-05', thumb: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=%E5%AE%89%E5%85%A8%E7%94%9F%E4%BA%A7%E6%B3%95%E5%9F%B9%E8%AE%AD&image_size=landscape_4_3' },
        { title: '医院供氧系统日常巡检注意事项', date: '2026-02-28', thumb: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Hospital+oxygen+supply+system+inspection&image_size=landscape_4_3' },
        { title: '压力容器维护保养常识', date: '2026-02-10', thumb: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Pressure+vessel+maintenance&image_size=landscape_4_3' }
      ]
    })
  },

  goNewsDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/news/detail/index?data=' + encodeURIComponent(JSON.stringify(item)),
    })
  }
})