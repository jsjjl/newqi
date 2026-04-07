//获取应用实例
import * as echarts from '../../components/ec-canvas/echarts';

let chart = null;
var ec1Date = null;




// function initChart4(canvas, width, height, dpr) {
//   chart = echarts.init(canvas, null, {
//     width: width,
//     height: height,
//     devicePixelRatio: dpr // new
//   });
//   canvas.setChart(chart);

//   var option = {
//     tooltip: {
//       trigger: 'item'
//     },
//     legend: {
//       orient: 'vertical',
//       left: 'right'
//     },
//     series: [
//       {
//         type: 'pie',
//         radius: '70%',
//         data: ec1Date,
//         emphasis: {
//           itemStyle: {
//             shadowBlur: 10,
//             shadowOffsetX: 0,
//             shadowColor: 'rgba(0, 0, 0, 0.5)'
//           }
//         }
//       }
//     ]
//   };

//   chart.setOption(option);
//   return chart;
// }


function initChart4(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);

  // 检查 ec1Date 是否为空
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
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: formattedXData,
      // axisLabel: {
      //   rotate: 45,
      //   interval: 0,
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
        type: 'bar'
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

  // 如果 X 轴数据大于7个，则动态设置 dataZoom 的 end 值以默认展示前7个
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
    areaId: '',
    areaName: '',
    tab: 1,
    ec1: '',
    ec5show:false,
    ec4: {
      onInit: initChart4
    },
  },


  _tab(e) {
    this.setData({
      tab: e.currentTarget.dataset.tab,
    });
  },





  getlist1() {
    let that = this;

  
     let turl =  that.data.areaId == '1921753035498872833'?'/kf/report/busbar/warning/statistics':'/report/busbar/warning/statistics';
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
          // let names = [];




          //  // 遍历对象，提取数据
          //   for (let key in obj) {
          //     if (obj.hasOwnProperty(key)) {
          //       names.push({ value: obj[key], name: key })
          //     }
          //   }
          //   console.log("names",names);
          //   ec1Date=names


          let names = [];
          let volumes = [];



          // 遍历对象，提取数据
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              names.push(key);
              volumes.push(obj[key]);
            }
          }

          // 如果数据为空，提供默认值
        if (names.length === 0 || volumes.length === 0) {
          names = ['暂无数据'];
          volumes = [0];
        }


          ec1Date = {
            x: names,
            y: volumes
          }
          console.log("ccc", ec1Date);


          that.setData({
            ec4: {
              onInit: initChart4
            },    ec5show:true,
          });





        } else {
          console.error("请求失败:", res.data.message);
          ec1Date = {
            x: ['暂无数据'],
            y: [0]
          };
          that.setData({
            ec4: {
              onInit: initChart4
            },
          });

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

    if(wx.getStorageSync('areaName')){
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
