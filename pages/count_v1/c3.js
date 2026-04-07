//获取应用实例
import * as echarts from '../../components/ec-canvas/echarts';

let chart = null;
var ec1Date = null;

function initChart3(canvas, width, height, dpr) {

   const dataLength = ec1Date.x.length;
  const minHeight = 300; // 最小高度
  const maxHeight = 600; // 最大高度
  const adjustedHeight = Math.min(Math.max(minHeight, dataLength * 30), maxHeight);

  chart = echarts.init(canvas, null, {
    width: width,
    height: adjustedHeight,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);



  var option = {
    tooltip: {
      trigger: 'axis',
       axisPointer: {
      type: 'shadow'
    }
    },
    grid: {
      top: 20,
      bottom: 30, // 调整底部间距
      left: 20,
      right: 30,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ec1Date.x,
      axisLabel: {
        rotate: 45, // 旋转角度，防止标签重叠
        interval: 0, // 强制显示所有标签
        margin: 10, // 标签与轴线的距离
        fontSize: 10 // 字体大小
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function(value) {
          return Math.round(value); // 去掉小数
        }
      }
    },
    series: [
      {
        data: ec1Date.y,
        type: 'bar'
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
    ec1Date: undefined,
    areaId: '',
    tab: 1,
    ec1: '',
    ec3: {
      onInit: initChart3
    }
  },

  _tab(e) {
    this.setData({
      tab: e.currentTarget.dataset.tab,
    });
  },

getlist1() {
  let that = this;

  let turl = that.data.areaId == '1921753035498872833' ? '/kf/report/vacuumunit/runtime/statistics' : '/report/vacuumunit/runtime/statistics';
  wx.request({
    url: 'https://medicalgas.lygyy.com.cn/prod-api' + turl,
    method: 'get',
    data: {
      areaId: wx.getStorageSync('areaId'),
    },
    header: {
      Authorization: wx.getStorageSync('token')
    },
    success: function(res) {
      if (res.data.code == 200) {
        const obj = res.data.data;
        const names = Object.keys(obj);
        const volumes = Object.values(obj).map(value => Math.round(value));

        ec1Date = {
          x: names,
          y: volumes
        };

        that.setData({
          ec1Date: ec1Date,
          ec3: {
            onInit: initChart3
          }
        });
      }
    },
    fail: function(err) {
      console.error('Request failed', err);
    }
  });
},

  getD() {
    this.getlist1();
  },
  onLoad() {
  },
  onShow() {
    let that = this

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
  }
});