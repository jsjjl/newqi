

const CONFIG = require('../../../config.js')
//获取应用实例
var app = getApp();
Page({
  data: {
    list: [],
    groupId: "",
    isGroup: "",
    label: "",
  },

  onLoad: function () {
    let treeTypeId = wx.getStorageSync('treeTypeId')
    this.setData({
      treeTypeId: treeTypeId
    })
  },

  onShow: function () {
    wx.hideHomeButton()
    if (!wx.getStorageSync('token')) {
      wx.redirectTo({
        url: '/pages/login/index',
      })
    }
    if (wx.getStorageSync('tree_groupId')) {
      wx.removeStorageSync('tree_groupId')
      wx.removeStorageSync('tree_isGroup')
      wx.removeStorageSync('tree_label')
    }
    this.getlist()
  },

  save() {

    console.log(this.data.groupId, this.data.isGroup, this.data.label)
    if (this.data.groupId) {
      wx.setStorageSync('tree_groupId', this.data.groupId)
      wx.setStorageSync('tree_isGroup', this.data.isGroup)
      wx.setStorageSync('tree_label', this.data.label)
    }
    //返回上一页
    wx.navigateBack({
      delta: 1
    })
  },

  select(e) {
    let that = this
    let groupId = e.currentTarget.dataset.id
    let isGroup = e.currentTarget.dataset.children
    let label = e.currentTarget.dataset.label
    let level = e.currentTarget.dataset.level
    let index1 = e.currentTarget.dataset.index1
    let index2 = e.currentTarget.dataset.index2 ? e.currentTarget.dataset.index2 : -1
    let index3 = e.currentTarget.dataset.index3 ? e.currentTarget.dataset.index3 : -1
    let index4 = e.currentTarget.dataset.index4 ? e.currentTarget.dataset.index4 : -1
    let list = that.data.list

    console.log(groupId, isGroup, label, level, index1, index2, index3, index4, list)

    // 递归更新 open 状态
    const updateOpenStatus = (list, level, index1, index2, index3, index4) => {
      list.forEach((item, i) => {
        if (level == 1 && i == index1) {
          item.open = !item.open
        } else if (level == 2) {
          item.children.forEach((child, j) => {

            child.open = !child.open

          })
        }
        else if (level == 3 && item.children && item.children.length > 0 
          && item.children[0].children 
          && item.children[0].children[index1] 
          && item.children[0].children[index1].children) {
       
          console.log("ddd111", index1);
          console.log("ddd222", item.children[0].children[index1].children);

          item.children[0].children[index1].children.forEach((child, j) => {
            child.open = !child.open
            console.log("ddd333", child);
            // if (j == index2 && child.children) {
            //   child.children.forEach((subChild, k) => {
            //     if (k == index3) {
            //       subChild.open = !subChild.open
            //     }
            //   })
            // }
          })

        } else if (level == 4 && i == index1 && item.children) {
          item.children.forEach((child, j) => {
            if (j == index2 && child.children) {
              child.children.forEach((subChild, k) => {
                if (k == index3 && subChild.children) {
                  subChild.children.forEach((subSubChild, l) => {
                    if (l == index4) {
                      subSubChild.open = !subSubChild.open
                    }
                  })
                }
              })
            }
          })
        }
      })
    }

    updateOpenStatus(list, level, index1, index2, index3, index4)

    that.setData({
      groupId: groupId,
      isGroup: isGroup,
      label: label,
      list: list
    })

    console.log(that.data.list)
  },

  getlist() {
    let that = this
    wx.request({
      url: CONFIG.subDomain + '/deDeviceGroup/tree?type=' + that.data.treeTypeId,
      method: 'get',
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success: function success(res) {
        if (res.data.code == 401) {
          wx.removeStorageSync('token')
         wx.redirectTo({
        url: '/pages/login/index',
      })
        }
        if (res.data.code == 200) {
          that.setData({
            list: that.addOpenFlag(res.data.data),
          })
          console.log(that.data.list)
        }
      }
    })
  },

  addOpenFlag(data) {
    data.forEach((item, index) => {
      // 第一个元素默认展开
      item.open = index === 0 ? true : false
      if (item.children && item.children.length > 0) {
        this.addOpenFlag(item.children)
      }
    })
    return data
  },

  go(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.id,
    })
  }
})