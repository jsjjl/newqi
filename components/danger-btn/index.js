Component({
  methods: {
    goToDanger() {
      wx.navigateTo({
        url: '/pages/daily_danger/index',
        fail: () => {
          // Fallback if the navigation stack is full
          wx.redirectTo({
            url: '/pages/daily_danger/index'
          });
        }
      });
    }
  }
});