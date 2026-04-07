//获取应用实例
import * as echarts from '../../components/ec-canvas/echarts';

let chart = null;
var ec1Date = null;
var ec1Date2 = null;

function initChart1(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  // 检查 ec1Date 是否为空
  if (!ec1Date || !ec1Date.x) {
    ec1Date = {
      x: ['暂无数据'],

    };
  }

  // 格式化 X 轴日期：例如 "2025-05-01" → "05-01"
  let formattedXData = ec1Date.x.map(dateStr => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // 非法日期不处理
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  });

  var option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 30,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: formattedXData,
      boundaryGap: false, // 确保折线从X轴开始
      // axisLabel: {
      //   rotate: 45, // 旋转角度，防止标签重叠
      //   interval: 0, // 强制显示所有标签，可能会导致重叠，根据情况调整
      // }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return Math.round(value); // 去掉小数
        },
        interval: 1 // 确保每个整数只显示一次，避免重复
      }
    },
    series: ec1Date2,
    // series: [
    //   {
    //     data: ec1Date.y1,
    //     type: 'line',
    //     name: '液氧灌1'
    //   },
    //   {
    //     data: ec1Date.y2,
    //     type: 'line',
    //     name: '液氧灌2'
    //   },
    //   {
    //     data: ec1Date.y3,
    //     type: 'line',
    //     name: '液氧灌3'
    //   }
    // ],
    dataZoom: [{
      type: 'slider',
      start: 0,
      end: 100,
      height: 12,
      bottom: 5,
      handleSize: '80%',
      handleStyle: {
        color: '#666',
        borderWidth: 0,
        borderRadius: 2
      },
      fillerColor: 'rgba(160,160,160,0.2)',
      backgroundColor: '#fff',
      borderColor: '#ddd',
      borderWidth: 1,
      showDetail: false,
      filterMode: 'filter'
    }]
  };

  // 如果 X 轴数据大于7个，则动态设置 dataZoom 的 end 值以默认展示前7个
  if (formattedXData.length > 7) {
    option.dataZoom[0].end = Math.min(7 / formattedXData.length * 100, 100);
  }

  chart.setOption(option);
  return chart;
}

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);

  // 默认数据兜底
  if (!ec1Date || !ec1Date.x || !ec1Date.y) {
    ec1Date = {
      x: ['暂无数据'],
      y: [0]
    };
  }

  // 格式化 X 轴日期：例如 "2025-05-01" → "05-01"
  let formattedXData = ec1Date.x.map(dateStr => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // 非法日期不处理
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  });

  var option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 30,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: formattedXData,
      boundaryGap: false,
      // axisLabel: {
      //   rotate: 45,
      //   interval: 0
      // }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return Math.round(value); // 去掉小数
        }
      },
      interval: 1 // 确保每个整数只显示一次，避免重复
    },
    series: [
      {
        data: ec1Date.y,
        type: 'line'
      }
    ],
    dataZoom: [{
      type: 'slider',
      start: 0,
      end: 100,
      height: 12,
      bottom: 5,
      handleSize: '80%',
      handleStyle: {
        color: '#666',
        borderWidth: 0,
        borderRadius: 2
      },
      fillerColor: 'rgba(160,160,160,0.2)',
      backgroundColor: '#fff',
      borderColor: '#ddd',
      borderWidth: 1,
      showDetail: false,
      filterMode: 'filter'
    }]
  };

  // 如果 X 轴数据大于7个，则默认展示前7个
  if (formattedXData.length > 7) {
    option.dataZoom[0].end = Math.min(7 / formattedXData.length * 100, 100);
  }

  chart.setOption(option);
  return chart;
}

Page({
  onShareAppMessage: function (res) {
  },

  data: {
    canvasIsShow: false,
    tab: 1,
    areaName: '',
    areaId: '',
    // ec1: {
    //   onInit: initChart
    // }
  },


  _tab(e) {
    this.setData({
      tab: e.currentTarget.dataset.tab,
      ec1: undefined,
      canvasIsShow: false,
    });
    this.getlist1();
  },



  getlist1() {
    let that = this;
    let turl = ""
    if (that.data.tab == 1) {
      turl = '/report/oxygen/remaining/single/statistics';
    }
    if (that.data.tab == 2) {
      turl = '/report/oxygen/remaining/statistics';
    }
    if (that.data.tab == 3) {
      turl = '/report/oxygen/usage/statistics';
    }
    if (that.data.tab == 4) {
      turl = '/report/oxygen/filling/statistics';
    }
    wx.request({
      url: that.data.areaId == '1921753035498872833' ? 'https://medicalgas.lygyy.com.cn/prod-api/kf' + turl : 'https://medicalgas.lygyy.com.cn/prod-api' + turl,
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

          if (that.data.tab == 1) {
            console.log("xxxx");
            let res = obj;
            // 1. 提取所有动态key（排除dates）
            const seriesKeys = Object.keys(res).filter(key => key !== 'dates');

            // 2. 构造series数组
            const series = seriesKeys.map(key => ({
              name: key,
              type: 'line',
              data: res[key]
            }));

            ec1Date = {
              x: obj.dates,
            }
            ec1Date2 = series

            console.log("ccc", ec1Date);

            that.setData({
              canvasIsShow: true,
            });

            that.setData({
              ec1: {
                onInit: initChart1
              },
            });

            // x:['wqe','qweq','werw'],
            // y:[1,2,3]


          } else {


            const keys = Object.keys(obj);
            const values = Object.values(obj);


            console.log("xxxxx1111", keys, values);

            ec1Date = {
              x: keys,
              y: values
            }

            that.setData({
              canvasIsShow: true,
            });

            that.setData({
              ec1: {
                onInit: initChart
              },
            });

          }
          // that.setData({
          //   ec1: {
          //     onInit: initChart
          //   },
          // });





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
    if (wx.getStorageSync('areaName')) {
      that.setData({
        areaName: wx.getStorageSync('areaName')
      })
    }
    that.setData({
      areaId: wx.getStorageSync('areaId')
    })


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
