//获取应用实例
import * as echarts from '../../components/ec-canvas/echarts';

let chart = null;
var ec1Date = null;
var ec2Date = null;

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
    grid: {
      // 外边距（Margin）
      top: 0,
      bottom: 10,
      left: 0,
      right: 0,
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
        data: ec1Date
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
    ec2: undefined,
  },





  getlist1() {

        // 
        let that = this;
        wx.request({
          url: 'https://medicalgas.lygyy.com.cn/prod-api/equipment/info/type/statistics',
          method: 'get',
          data: {
            areaId:wx.getStorageSync('areaId'),
          },
          header: {
            Authorization: wx.getStorageSync('token')
          },
          success: function success(res) {
            if (res.data.code == 200) {
         let obj = res.data.data;

        let transformedData = Object.entries(obj).map(([key, value]) => ({
          value: parseInt(value),
          name: key
        }));

          // 获取对象的键和值
          const keys = Object.keys(obj);
          const values = Object.values(obj);

          // 将键和值组合成新的数组结构
          const result = [keys, values];


              // ec1Date = {
              //   x: result[0],
              //   y: result[1]
              // }
              ec1Date = transformedData
              that.setData({
                ec2: {
                  onInit: initChart2
                },
              });

             let temp = Object.values(res.data.data);
            //  console.log("kkkkkkkkkkkk",temp);
              that.setData({
                // kqjz:temp
                top:res.data.data
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
