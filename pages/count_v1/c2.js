//获取应用实例
import * as echarts from '../../components/ec-canvas/echarts';

let chart = null;
var ec1Date = null;


function initChart2(canvas, width, height, dpr) {
  console.log(2222);
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      // 外边距（Margin）
      top: 20,
      bottom: 20,
      left: 20,
      right: 30,
      // 内边距（Padding）
      grid: {
        padding: [0, 0, 0, 0] // 上右下左
      },
      // 确保标签不会被裁剪
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ec1Date.x,
      boundaryGap: false, // 确保折线从X轴开始
      axisLabel: {
        rotate: 45, // 旋转角度，防止标签重叠
        interval: 0, // 强制显示所有标签，可能会导致重叠，根据情况调整
      },
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: ec1Date.y,
        type: 'line'
      }
    ]
  };

  chart.setOption(option);
  return chart;
}





Page({
  onShareAppMessage: function (res) {
  },
  data: {
    ec1Date:undefined,
    areaId: '',
    areaName: '',
    tab: 1,
    ec1: '',
    ec2: {
      onInit: initChart2
    },
  },


  _tab(e) {
    this.setData({
      tab: e.currentTarget.dataset.tab,
    });
  },


  getlist1() {
    let that = this;

    let turl = that.data.areaId == '1921753035498872833' ? '/kf/report/airunit/runtime/statistics' : '/report/airunit/runtime/statistics';
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api' + turl,
      method: 'get',
      data: {
        areaId: wx.getStorageSync('areaId'),
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {

          const obj = res.data.data;

          // 获取对象的键和值
          // 初始化两个数组，一个用于存储名称，一个用于存储remainingVolume
          let names = [];
          let volumes = [];



          // 遍历对象，提取数据
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              names.push(key);
              volumes.push(obj[key]);
            }
          }



           console.log("cccc",names,volumes); 



          ec1Date = {
            x: names,
            y: volumes
          }
          that.setData({
            ec1Date: ec1Date, 
            ec2: {
              onInit: initChart2
            },
          });



        } else {


        }

      },

    });




  },



  getD() {
    this.getlist1();
  },
  onLoad() {
  },
  onShow() {
    let that = this
    // that.setData({
    //   interval: setInterval(() => { that.getD() }, 5000)
    // })

    if (wx.getStorageSync('areaName')) {
      that.setData({
        areaName: wx.getStorageSync('areaName')
      })
    }
    that.setData({
      areaId: wx.getStorageSync('areaId')
    })

    that.getD();
  },
  onHide() {
    let that = this
    // clearInterval(that.data.interval)
  }

});
