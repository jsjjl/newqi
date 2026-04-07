//获取应用实例
import * as echarts from '../../components/ec-canvas/echarts';

let chart = null;
var ec1Date= null;
var ec2Date= null;
var ec3Date= null;
var ec4Date= null;
var ec5Date= null;
var ec6Date= null;
function initChart(canvas, width, height, dpr) {

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


function initChart2(canvas, width, height, dpr) {
 
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


function initChart3(canvas, width, height, dpr) {
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
      data: ['1号设备', '2号设备', '3号设备', '4号设备', '5号设备', '6号设备', '7号设备'],
     
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
        data: [
          120,
          {
            value: 200,
            itemStyle: {
              color: '#a90000'
            }
          },
          150,
          80,
          70,
          110,
          130
        ],
        type: 'bar'
      }
    ]
  };

  chart.setOption(option);
  return chart;
}


function initChart4(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'right'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { value: 1048, name: '氧气汇流排' },
          { value: 735, name: '二氧化碳汇流排' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  chart.setOption(option);
  return chart;
}


function initChart5(canvas, width, height, dpr) {
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
      padding: [0, 0, 0, 0], // 上右下左
      // 确保标签不会被裁剪
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['1号设备', '2号设备', '3号设备', '4号设备', '5号设备', '6号设备', '7号设备'],
     
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
        data: [
          120,
          {
            value: 200,
            itemStyle: {
              color: '#a90000'
            }
          },
          150,
          80,
          70,
          110,
          130
        ],
        type: 'bar'
      }
    ]
  };

  chart.setOption(option);
  return chart;
}


function initChart6(canvas, width, height, dpr) {
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
      left: 0,
      right: 30,
      // 内边距（Padding）
      padding: [0, 0, 0, 0], // 上右下左
      // 确保标签不会被裁剪
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      
      axisLabel: {
        rotate: 45, // 旋转角度，防止标签重叠
        interval: 0, // 强制显示所有标签，可能会导致重叠，根据情况调整
      },
    },
    yAxis: {
      type: 'category',
      data: ['1号楼-01设备', '1号楼-01设备', '1号楼-01设备', '1号楼-01设备', '1号楼-01设备', '1号楼-01设备','1号楼-01设备', '1号楼-01设备', '1号楼-01设备', '1号楼-01设备', '1号楼-01设备', '1号楼-01设备', '1号楼-01设备','1号楼-01设备', '1号楼-01设备', '1号楼-01设备', '1号楼-01设备', '1号楼-01设备', '1号楼-01设备']
    },
    series: [
      {
        name: '2011',
        type: 'bar',
        data: [18203, 23489, 29034, 104970, 131744, 131744,18203, 23489, 29034, 104970, 131744, 131744,18203, 23489, 29034, 104970, 131744, 131744]
      },
    ]
  };

  chart.setOption(option);
  return chart;
}



Page({
  onShareAppMessage: function (res) {
  },
  data: {
    tab:1,
    ec1:'',
    ec2: {
      onInit: initChart2
    },
    ec3: {
      onInit: initChart3
    },
    ec4: {
      onInit: initChart4
    },
    ec5: {
      onInit: initChart5
    },
    ec6: {
      onInit: initChart6
    }
  },

  
  _tab(e){
    this.setData({
      tab: e.currentTarget.dataset.tab,
    });
  },



  getlist1() {
    let that = this;
    ec1Date={
      x:['1号设备', '2号设备', '3号设备', '4号设备', '5号设备', '6号设备', '7号设备'],
      y:[150, 230, 224, 218, 135, 147, 260]
    }
    that.setData({
      ec1: {
        onInit: initChart
      },
    });

    return;
    wx.request({
      url: 'https://wechat.ssgdwisdom.com:8086/api/wx/task/count',
      method: 'get',
      // data: {
      //   Authorization:this.data.tel,
      //   password:this.data.pwd,
      // },
      header: {
        Authorization: wx.getStorageSync('token')
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
            array: res.data.data,

          })
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
  },

  nav1() {
    console.log(111);
    wx.navigateTo({
      url: '/pages/count/c1',
    })
  },

  nav2() {
    wx.navigateTo({
      url: '/pages/count/c2',
    })
  },

  nav3() {
    wx.navigateTo({
      url: '/pages/count/c3',
    })
  },

  nav4() {
    wx.navigateTo({
      url: '/pages/count/c4',
    })
  },

  nav5() {
    wx.navigateTo({
      url: '/pages/count/c5',
    })
  },

  nav6() {
    wx.navigateTo({
      url: '/pages/count/c6',
    })
  },

});
