//获取应用实例
import * as echarts from '../../components/ec-canvas/echarts';

let chart = null;
var ec1Date = null;
var ec2Date = null;
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

function initChart22(canvas, width, height, dpr) {

  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    grid: {
      // 外边距（Margin）
      top: 0,
      bottom: 10,
      left: 20,
      right: 30,
      // 内边距（Padding）
      grid: {
        padding: [0, 0, 0, 0] // 上右下左
      },
      // 确保标签不会被裁剪
      containLabel: true,
    },
    tooltip: {
      trigger: 'item',
      //  position: ['50%', '50%']
      position: function (pos, params, dom, rect, size) {
        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
        var obj = { top: 60 };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        return obj;
      }
    },
    legend: {
      bottom: '0%',
      left: 'center'
    },
    series: [
      {
        type: 'pie',
        center: ['50%', '40%'], // 饼图的中心（圆心）坐标，默认为地图中心点
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '负压记住很额度' },
          { value: 735, name: '负压记住很额五' },
          { value: 580, name: '负压记住很额位' },
          { value: 484, name: '负压记住很额人' },
          { value: 300, name: '负压记住很额党' }
        ]
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
    interval: "",
    ec1: undefined,
    ec2: {
      onInit: initChart22
    },
  },





  getlist1() {
    let that = this;



    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/equipment/info/online/week/map',
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
          let obj = res.data.data
          const keys = Object.keys(obj);
          const values = Object.values(obj);

          // 将键和值组合成新的数组结构
          const result = [keys, values];


          ec1Date = {
            x: result[0],
            y: result[1]
          }
          console.log("ddddd", ec1Date);
          that.setData({
            ec1: {
              onInit: initChart
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
    that.getD();
  },
  onHide() {
    let that = this
    // clearInterval(that.data.interval)
  }
});
