var app = getApp();

Page({
  data: {
    modules: []
  },

  onShow() {

    this.getuser();
    // 权限key与页面配置
    const permissions = wx.getStorageSync('permissions') || [];
    const isSuperAdmin = permissions.includes('*:*:*');

    // 资产管理
    const assetBoxesAll = [
      { title: '设备扫码', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_1.svg', bg: '#dbeafe', url: '/pages/sebei/detail', perm: 'business:assets:list' },
      { title: '设备查询', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s1_1.svg', bg: '#dbeafe', url: '/pages/sebei/home', perm: 'business:assets:list' },
      { title: '新增设备', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s1_1.svg', bg: '#dbeafe', url: '/pages/sebei/add_device', perm: 'business:assets:add' },
     
      // { title: '维修记录', icon: '../../images/icon/wxjl.svg', bg: '#f7eed9', url: '/pages/sebei/list_weixiu', perm: 'business:repair:list' },
      // { title: '保养记录', icon: '../../images/icon/byjl.svg', bg: 'rgb(250, 218, 236)', url: '/pages/sebei/list_baoyang', perm: 'business:maintenance:list' }
    ];
    const assetBoxes = isSuperAdmin ? assetBoxesAll : assetBoxesAll.filter(item => permissions.includes(item.perm));

    // 维修扫码/保养扫码
    const repairAddBoxesAll = [
      // { title: '维修扫码', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_1.svg', bg: '#dbeafe', url: '/pages/sebei/weixiu', perm: 'business:repair:add', sm: true },
      // { title: '保养扫码', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_1.svg', bg: '#dbeafe', url: '/pages/sebei/baoyang', perm: 'business:maintenance:add', sm: true }
    ];
    const repairAddBoxes = isSuperAdmin ? repairAddBoxesAll : repairAddBoxesAll.filter(item => permissions.includes(item.perm));

    // 气体借用
    const qiBoxesAll = [
      { title: '新增借用记录', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s2_1.svg', bg: '#d1fae5', url: '/pages/qi/data_form', perm: 'business:assets:list' },
      { title: '借用记录', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s2_2.svg', bg: '#dbeafe', url: '/pages/qi/home', perm: 'business:assets:list' }
    ];
    const qiBoxes = isSuperAdmin ? qiBoxesAll : qiBoxesAll.filter(item => permissions.includes(item.perm));

    // 巡检管理
    const xjBoxesAll = [
      { title: '扫码巡检', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_1.svg', bg: '#dbeafe', url: '/pages/lab/frontier_form/home', perm: 'business:paTask:list' },
      { title: '巡检任务', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_2.svg', bg: '#d1fae5', url: '/pages/lab/frontier_task/home', perm: 'business:paTask:list' },
      { title: '巡检记录', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_3.svg', bg: '#ede9fe', url: '/pages/lab/task_search/task_search', perm: 'business:paRecord:list' },


      // { title: '安全行动日', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_5.svg', bg: '#fef3c7', url: '/pages/safety_action/index', perm: 'business:danger:add' },
      // { title: '节假日安全', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_5.svg', bg: '#e0e7ff', url: '/pages/holiday_safety/index', perm: 'business:danger:add' },
      { title: '隐患上报', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_4.svg', bg: '#fee2e2', url: '/pages/data_form/data_form', perm: 'business:danger:add' },
      // { title: '日常隐患', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_4.svg', bg: '#ffe4e6', url: '/pages/daily_danger/index', perm: 'business:danger:add' },
      // { title: '安全管理检查', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_5.svg', bg: '#fef3c7', url: '/pages/securityCheck/list', perm: 'business:danger:add' }
    ];
    const xjBoxes = isSuperAdmin ? xjBoxesAll : xjBoxesAll.filter(item => permissions.includes(item.perm));

    // 每日任务
    const dailyBoxesAll = [
      // { title: '每日巡检任务', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s5_1.svg', bg: '#fef3c7', url: '/pages/lab/frontier_task2/home', perm: 'business:paTask:list' }
       { title: '安全行动日上报', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_5.svg', bg: '#fef3c7', url: '/pages/safety_action/index', perm: 'business:danger:add' },
      { title: '活动节假日安全上报', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s3_5.svg', bg: '#e0e7ff', url: '/pages/holiday_safety/index', perm: 'business:danger:add' },
    ];
    const dailyBoxes = isSuperAdmin ? dailyBoxesAll : dailyBoxesAll.filter(item => permissions.includes(item.perm));

    // 通知消息（不需要权限）
    const msgBoxes = [
      { title: '系统通知', icon: 'https://medicalgas.lygyy.com.cn/minio/mg-image/wximg/images/new/s4_1.svg', bg: '#fee2e2', url: '/pages/msg_list/msg_list' }
    ];

    // 组装模块
    const modules = [];
    if (assetBoxes.length || repairAddBoxes.length) {
      modules.push({
        title: '资产管理',
        icon: '../../images/icon/ba1.svg',
        className: 'baimg',
        boxes: [...assetBoxes, ...repairAddBoxes]
      });
    }
    // 气体借用（如有需求可放开）
    // if (qiBoxes.length) {
    //   modules.push({
    //     title: '气体借用',
    //     icon: '../../images/icon/ba2.svg',
    //     className: 'baimg2',
    //     boxes: qiBoxes
    //   });
    // }
    if (xjBoxes.length) {
      modules.push({
        title: '巡检管理',
        icon: '../../images/icon/ba3.svg',
        className: 'baimg3',
        boxes: xjBoxes
      });
    }
    if (dailyBoxes.length) {
      // modules.push({
      //   title: '每日任务',
      //   icon: '../../images/icon/ba4.svg',
      //   className: 'baimg4',
      //   boxes: dailyBoxes
      // });
      modules.push({
        title: '安全上报',
        icon: '../../images/icon/ba4.svg',
        className: 'baimg4',
        boxes: dailyBoxes
      });
    }
    modules.push({
      title: '通知消息',
      icon: '../../images/icon/ba5.svg',
      className: 'baimg3',
      boxes: msgBoxes
    });

    this.setData({ modules });

  },


  getuser() {
    console.log(1111);

    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/getInfo',
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


      },

    });
  },

  go(e) {
    let temp = e.currentTarget.dataset.id
    let sm = false;
    if (e.currentTarget.dataset.sm) {
      sm = true;
    }
    if (temp == '/pages/lab/frontier_form/home') {
      this.sm_post(temp)
      return
    }
     if (temp == '/pages/securityCheck/list') {
      this.sm_post(temp)
      return
    }
    if (sm || temp == '/pages/sebei/detail') {
      this.xq_post(temp)
      return
    }
    wx.setStorageSync('treeTypeId', e.currentTarget.dataset.treetypeid)
    wx.navigateTo({
      url: e.currentTarget.dataset.id,
    })
  },

  xq_post(temp) {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: 'barCode',
      success(res) {
        var a = res.result;
        wx.navigateTo({
          url: temp + '?id=' + a,
        })
      }
    })
  },

  sm_post(temp) {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: 'barCode',
      success(res) {
        var a = res.result;
        let b = a.lastIndexOf("=");
        a = a.substring(b + 1, a.length);
        wx.navigateTo({
          url: temp + '?taskId=-1' + '&pointId=' + a,
        })
      }
    })
  },

  onLoad: function () {
    if (!wx.getStorageSync('token')) {
      wx.redirectTo({
        url: '/pages/login/index',
      })
    }
  },

  tc() {
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