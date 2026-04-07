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
    opsWxTaskCount:"",
    gasLendCount:"",
    deviceExpireCount:"",
      now : new Date()
  },


  onShow() {
    let that = this;
    // <span>早上好，张工程师</span>
    // <p>今天是 2023年11月15日 星期三</p>
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let day = date.getDate();
    let month = date.getMonth() + 1; // 月份从0开始，所以要加1
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


    let name = wx.getStorageSync('user').user.nickName || ''; // 默认值为张工程师
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
    this.getflist();
    this._opsWxTask_count();
    this._gasLendCount();
    this._deviceExpireCount();
  },

  _opsWxTask_count(){
    
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
       if(res.data.code == 200){

         console.log(res.data.data);
         that.setData({
          opsWxTaskCount:res.data.data
         })
         
       }
     },
     
   });
  },
_deviceExpireCount(){
    
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
       if(res.data.code == 200){

         console.log(res.data.data);
         that.setData({
          deviceExpireCount:res.data.data
         })
         
       }
     },
     
   });
  },
  _gasLendCount(){
    
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
       if(res.data.code == 200){

         console.log(res.data.data);
         that.setData({
          gasLendCount:res.data.data
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
          console.log("list",that.data.list);
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

gorw(e) {



    console.log("ff", e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/lab/task_list2/task_list2?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name+'&zt='+this.data.zt,
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

    let sm =false;
    if(e.currentTarget.dataset.sm){
      sm = true;
    }
    console.log("go",temp);
    
    if(temp=='/pages/lab/frontier_form/home'){
      this.sm_post(temp)
      return
    }

    if(sm||temp=='/pages/sebei/detail'){
      this.xq_post(temp)
      return
    }
    


    console.log(e.currentTarget.dataset.id);
    wx.setStorageSync('treeTypeId', e.currentTarget.dataset.treetypeid)
    wx.navigateTo({
      url: e.currentTarget.dataset.id,
    })
    console.log(22222);
  },
  xq_post(temp){
    let that =this
    wx.scanCode({
      
    onlyFromCamera: true,
    scanType:'barCode',
      success(res) {
        console.log(res)

        var a = res.result;

        // let b = a.lastIndexOf("="); //截取等号后的内容
    
        // a = a.substring(b + 1, a.length);
    
        console.log(a)  //2

        wx.navigateTo({
          url: temp+'?id='+a,
        })

      }
    })
  },
  sm_post(temp){
    let that =this
    wx.scanCode({
      
    onlyFromCamera: true,
    scanType:'barCode',
      success(res) {
        console.log(res)

        var a = res.result;

        let b = a.lastIndexOf("="); //截取等号后的内容
    
        a = a.substring(b + 1, a.length);
    
        console.log(a)  //2

        

        wx.navigateTo({
          url: temp+'?taskId=-1'+'&pointId='+a,
        })

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

