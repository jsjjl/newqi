//获取应用实例
var app = getApp();

import * as echarts from '../../components/ec-canvas/echarts';
let chart = null;

var ec2Date = null;

function initChart2(canvas, width, height, dpr) {

  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var 
  option = {

    grid: {
      // 外边距（Margin）
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      // 内边距（Padding）
      grid: {
        padding: [0, 0, 0, 0] // 上右下左

      },
      // 确保标签不会被裁剪
      containLabel: true,
    },
    color: ['#C1EBDD', '#FFC851', '#5A5476', '#1869A0', '#FF9393'],
    series: [
      {
        name: 'aaa',
        type: 'pie',
        // radius: ['70%', '90%'],
        radius: '90%',
        label: {
          show: true,
          position: 'center',
          // formatter: '{value|{c}} \n {name|{b}} \n {percent|{d}}%',
          formatter: '{percent|{d}}%',
          rich: {
            name: {
              color: '#ffffff',
              lineHeight: 28,
              fontSize: 22,
              fontWeight: 'bold'
            }
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize:30,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: [
          { value: 1048, name: '正常'},
          { value: 735, name: '告警' },
        ]
      }
    ]
  };
  
  
  
       
    

  chart.setOption(option);
  return chart;
}

Page({
  data: {
    jzz:true,
    zwsj: false,
    array: '',
    ec2: {
      onInit: initChart2
    },
    searchText:'',
    kqjz:[]
  },



  //获取数量
  getlist1() {
    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/warning/his/list',
      method: 'get',
      data: {
        areaId:wx.getStorageSync('areaId'),
        pageSize:70,
        pageNum:1,
        position:that.data.searchText,
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        // if (res.data.code == 200) {
let ts = Object.values(res.data);
// 获取前100条数据
ts = ts.slice(0,500);
        
        //  console.log("kkkkkkkkkkkk",temp);
          that.setData({
            kqjz:ts,
            jzz:false,
          });
          if(ts.length==0){
            that.setData({
              zwsj:true,
            });
          }

        // } else {

        // }

      },

    });
  },

  getD() {
    this.getlist1();
  },

  bindKeyInput(e) {
    this.setData({
      searchText: e.detail.value,
    });
  },
  
  onLoad() {
  },
  onShow(){
    let that = this
    // that.setData({
    //   interval: setInterval(() => { that.getD() }, 5000)
    // })
    that.getD();
  },
  onHide() {
    let that = this
    // clearInterval(that.data.interval)
  }

});