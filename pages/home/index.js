const CONFIG = require('../../config.js')
var app = getApp();

Page({
  data: {
    topmsg: {
      top: '',
      bottom: '',
    },
    tx: undefined,
    list: [],
    opsWxTaskCount: "",
    gasLendCount: "",
    deviceExpireCount: "",
    now: new Date(),
    showTodo: false,
    quickActions: [], // 新增：快速操作卡片
    statusCards: [],   // 新增：平台状态卡片
    carouselImages: [
      'https://img0.baidu.com/it/u=3442821327,3325401128&fm=253&fmt=auto&app=138&f=JPEG?w=664&h=500',
      'https://img0.baidu.com/it/u=3442821327,3325401128&fm=253&fmt=auto&app=138&f=JPEG?w=664&h=500'
    ],
    quickServices: [
      { title: '安全行动日', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_5.svg', bg: '#fef3c7', url: '/pages/safety_action/index', count: 1 },
      { title: '节假日安全', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_5.svg', bg: '#e0e7ff', url: '/pages/holiday_safety/index', count: 1 },
      { title: '报修申请', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_1.svg', bg: '#fee2e2', url: '/pages/sebei/weixiu', sm: true, count: 3 },
      { title: '隐患上报', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_4.svg', bg: '#fef3c7', url: '/pages/data_form/data_form', count: 2 },
      { title: '日常隐患', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_4.svg', bg: '#ffe4e6', url: '/pages/daily_danger/index', count: 5 }
    ],
    safetyNews: [
      { title: '冬季特种设备安全使用指南', date: '2026-03-20', thumb: 'https://img0.baidu.com/it/u=3442821327,3325401128&fm=253&fmt=auto&app=138&f=JPEG?w=664&h=500' },
      { title: '医用氧气操作规范与事故预防', date: '2026-03-15', thumb: 'https://img0.baidu.com/it/u=3442821327,3325401128&fm=253&fmt=auto&app=138&f=JPEG?w=664&h=500' },
      { title: '新修订安全生产法解读培训', date: '2026-03-05', thumb: 'https://img0.baidu.com/it/u=3442821327,3325401128&fm=253&fmt=auto&app=138&f=JPEG?w=664&h=500' }
    ]
  },


  onShow() {
    let that = this;
    // ...原有 greeting 代码...

    // 权限控制
    const permissions = wx.getStorageSync('permissions') || [];
    const isSuperAdmin = permissions.includes('*:*:*');

    // 快速操作卡片
    const quickActionsAll = [
      {
        title: '设备扫码',
        icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_1.svg',
        bg: '#dbeafe',
        url: '/pages/sebei/detail',
        perm: 'business:assets:list',
        count: 0
      },
      {
        title: '扫码巡检',
        icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_1.svg',
        bg: '#dbeafe',
        url: '/pages/lab/frontier_form/home',
        perm: 'business:paTask:list',
        sm: true,
        count: 12
      },

      {
        title: '设备保养',
        icon: '../../images/icon/byjl.svg',
        bg: 'rgb(250, 218, 236)',
        url: '/pages/sebei/baoyang',
        perm: 'business:maintenance:add',
        sm: true,
        count: 4
      },
      {
        title: '设备维修',
        icon: '../../images/icon/wxjl.svg',
        bg: '#f7eed9',
        url: '/pages/sebei/weixiu',
        perm: 'business:repair:add',
        sm: true,
        count: 7
      }
    ];
    const quickActions = isSuperAdmin
      ? quickActionsAll
      : quickActionsAll.filter(item => permissions.includes(item.perm));

    // 平台状态卡片
    const statusCardsAll = [
      {
        title: '今日巡检',
        valueKey: 'opsWxTaskCount',
        color: '#3b82f6',
        bg: '#dbeafe',
        url: '/pages/lab/frontier_task2/home',
        perm: 'business:paTask:list'
      },
      {
        title: '资产状态',
        valueKey: 'deviceExpireCount',
        color: '#10b981',
        bg: '#d1fae5',
        url: '/pages/sebei/home2',
        perm: 'business:assets:list'
      }
      // 如需加气体借用数量等，按需添加
    ];
    const statusCards = isSuperAdmin
      ? statusCardsAll
      : statusCardsAll.filter(item => permissions.includes(item.perm));

    // 待办任务权限控制
    const showTodo = isSuperAdmin || permissions.includes('business:paTask:list');
    that.setData({
      quickActions,
      statusCards,
      showTodo // 新增
    });
    console.log("showTodo", that.data.showTodo);




    // ...原有 greeting 代码...
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    let greeting = '';
    if (hours < 12) {
      greeting = '早上好';
    } else if (hours < 18) {
      greeting = '下午好';
    } else {
      greeting = '晚上好';
    }

    let name = wx.getStorageSync('user').user.nickName?wx.getStorageSync('user').user.nickName:'';
    let tx = wx.getStorageSync('user').user.avatar || '';
    that.setData({
      topmsg: {
        top: `${greeting}，${name}`,
        bottom: `今天是 ${year}年${month}月${day}日 星期${week}`,
      },
      tx: tx
    });
    if (wx.getStorageSync('user').user.avatar) {
      that.setData({
        avatar: wx.getStorageSync('user').user.avatar
      });
    }
    that.getflist();
    that._opsWxTask_count();
    that._gasLendCount();
    that._deviceExpireCount();
  },

  _opsWxTask_count() {

    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/opsWxTask/todayTask/count',
      method: 'get',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 401) {
          wx.removeStorageSync('token')
         wx.redirectTo({
        url: '/pages/login/index',
      })
          return
        }
        if (res.data.code == 200) {

          console.log(res.data.data);
          that.setData({
            opsWxTaskCount: res.data.data
          })

        }
      },

    });
  },
  _deviceExpireCount() {

    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/wx/device/deviceExpireCount',
      method: 'get',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 401) {
          wx.removeStorageSync('token')
         wx.redirectTo({
        url: '/pages/login/index',
      })
          return
        }
        if (res.data.code == 200) {

          console.log(res.data.data);
          that.setData({
            deviceExpireCount: res.data.data
          })

        }
      },

    });
  },
  _gasLendCount() {

    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/wx/device/gasLendCount',
      method: 'get',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 401) {
          wx.removeStorageSync('token')
         wx.redirectTo({
        url: '/pages/login/index',
      })
          return
        }
        if (res.data.code == 200) {

          console.log(res.data.data);
          that.setData({
            gasLendCount: res.data.data
          })

        }
      },

    });
  },
  // 格式化为年月日
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要+1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },
  //获取数量
  getflist() {
    let that = this

    // 获取当前日期
    const now = new Date();

    // 当天的开始时间（00:00:00）
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 当天的结束时间（23:59:59）
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);


    console.log("开始时间：", this.formatDate(startOfDay)); // 输出：2025-04-28
    console.log("结束时间：", this.formatDate(endOfDay));   // 输出：2025-04-28


    wx.request({
      url: CONFIG.subDomain + '/opsWxTask/todayTask/list',
      method: 'get',
      data: {
        //开始和结束时间
        // startTime: this.formatDate(startOfDay),
        // endTime: this.formatDate(endOfDay),

        // pageNum: 10,
        // pageSize: 1
      },
      header: {
        Authorization: wx.getStorageSync('token'),
        clientid: wx.getStorageSync('clientid')
      },
      success: function success(res) {
        console.log("ccccccccc", res);

        if (res.data.code == 401) {
           console.log("401401401",);
          wx.removeStorageSync('token')
         wx.redirectTo({
        url: '/pages/login/index',
      })
          return
        }
        if (res.data.code == 200) {

          if (res.data.rows.length == 0) { //请求的数据为空，没有数据

            that.setData({
              noData: true,
            })

          } else {
            that.setData({
              list: res.data.rows,
              noMor: true,
              noData: false
            })
            console.log("list", that.data.list);
          }
        } else {

          if (that.data.pageNum == 1) { // 第一页都没有数据，直接显示暂无数据
            that.setData({
              noData: true,
            })
          } else {
            that.setData({
              noData: false,
              noMor: true
            })
          }

        }

      },

    });
  },



  getlist0() {
    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/common/getAreas',
      method: 'get',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 401) {
          wx.removeStorageSync('token')
         wx.redirectTo({
        url: '/pages/login/index',
      })
          return
        }
        if (res.data.code == 200) {
          let temp = res.data.data;
          that.setData({
            array: temp
          });

          if (temp.length > 1) {
            that.setData({
              arrayshow: true
            });
            temp.forEach((element, index) => {
              if (element.isDefault == 1) {
                that.setData({
                  index: index
                });
              }
            });
          } else {
            that.setData({
              arrayshow: false
            });
          }




        }

      },

    });
  },

  goNewsList() {
    wx.navigateTo({
      url: '/pages/news/list/index',
    })
  },
  
  goNewsDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/news/detail/index?data=' + encodeURIComponent(JSON.stringify(item)),
    })
  },

  gorw(e) {



    console.log("ff", e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/lab/task_list2/task_list2?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name + '&zt=' + this.data.zt,
    })


  },

  onLoad: function () {


    // this.setData({
    //   today: `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`
    // });
    const _this = this
    // console.log("dddd", wx.getStorageSync('token'));
    if (!wx.getStorageSync('token')) {
      wx.redirectTo({
        url: '/pages/login/index',
      })
    }
    // that.getD();
  },



  go(e) {
    let temp = e.currentTarget.dataset.id
    let sm = false;
    if (e.currentTarget.dataset.sm) {
      sm = true;
    }
    // 巡检扫码
    if (temp == '/pages/lab/frontier_form/home') {
      this.sm_post(temp)
      return
    }
    // 设备保养扫码
    if (temp == '/pages/sebei/baoyang') {
      this.scanAndGo(temp, 'baoyang');
      return;
    }
    // 设备维修扫码
    if (temp == '/pages/sebei/weixiu') {
      this.scanAndGo(temp, 'weixiu');
      return;
    }
    // 设备详情扫码
    if (sm || temp == '/pages/sebei/detail') {
      this.xq_post(temp)
      return
    }
    wx.setStorageSync('treeTypeId', e.currentTarget.dataset.treetypeid)
    wx.navigateTo({
      url: e.currentTarget.dataset.id,
    })
  },

  // 新增方法
  scanAndGo(page, type) {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: 'barCode',
      success(res) {
        var a = res.result;
        // 你可以根据扫码内容处理参数
        wx.navigateTo({
          url: `${page}?id=${a}&type=${type}`,
        })
      }
    })
  },
  xq_post(temp) {
    let that = this
    wx.scanCode({

      onlyFromCamera: true,
      scanType: 'barCode',
      success(res) {
        console.log("cccccxxx", res)

        var a = res.result;

        // let b = a.lastIndexOf("="); //截取等号后的内容

        // a = a.substring(b + 1, a.length);

        console.log(a)  //2

        wx.navigateTo({
          url: temp + '?id=' + a,
        })

      }
    })
  },
  sm_post(temp) {
    let that = this
    wx.scanCode({
      onlyFromCamera: true,
      scanType: 'barCode',
      success(res) {
        console.log('扫码结果：', res.result);
        var a = res.result;
        let b = a.lastIndexOf("=");
        a = a.substring(b + 1, a.length);
        console.log('跳转参数pointId:', a);
        wx.navigateTo({
          url: temp + '?taskId=-1' + '&pointId=' + a,
        })
      },
      fail(e) {
        console.log("sbbb", e);

        wx.showToast({
          title: '扫码失败',
          icon: 'none'
        });
      }
    })
  },
  tc() {
    //提示退出确定后
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('token')
         wx.redirectTo({
        url: '/pages/login/index',
      })
        }
      }
    })
  },

});

