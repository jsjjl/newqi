//获取应用实例
var app = getApp();

import * as echarts from '../../components/ec-canvas/echarts';
let chart = null;

var ec2Date = null;
var e1c2Date = null;
var e2c2Date = null;
var e3c2Date = null;
var e4c2Date = null;
var e5c2Date = null;

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
            show: false,
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
              fontSize: 30,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: ec2Date.normalCount, name: '正常' },
            { value: ec2Date.warningCount, name: '告警' },
          ]
        }
      ]
    };






  chart.setOption(option);
  return chart;
}


function init1Chart2(canvas, width, height, dpr) {

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
            show: false,
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
              fontSize: 30,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: e1c2Date.normalCount, name: '正常' },
            { value: e1c2Date.warningCount, name: '告警' },
          ]
        }
      ]
    };






  chart.setOption(option);
  return chart;
}

function init2Chart2(canvas, width, height, dpr) {

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
            show: false,
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
              fontSize: 30,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: e2c2Date.normalCount, name: '正常' },
            { value: e2c2Date.warningCount, name: '告警' },
          ]
        }
      ]
    };






  chart.setOption(option);
  return chart;
}

function init3Chart2(canvas, width, height, dpr) {

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
            show: false,
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
              fontSize: 30,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: e3c2Date.normalCount, name: '正常' },
            { value: e3c2Date.warningCount, name: '告警' },
          ]
        }
      ]
    };






  chart.setOption(option);
  return chart;
}

function init4Chart2(canvas, width, height, dpr) {

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
            show: false,
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
              fontSize: 30,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: e4c2Date.normalCount, name: '正常' },
            { value: e4c2Date.warningCount, name: '告警' },
          ]
        }
      ]
    };






  chart.setOption(option);
  return chart;
}

function init5Chart2(canvas, width, height, dpr) {

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
            show: false,
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
              fontSize: 30,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: e5c2Date.normalCount, name: '正常' },
            { value: e5c2Date.warningCount, name: '告警' },
          ]
        }
      ]
    };






  chart.setOption(option);
  return chart;
}

Page({
  data: {

     deviceList: [], // 动态设备列表
    ecList: [],     // 动态echarts配置

    array: '',
    ec2: {
      onInit: initChart2
    },
    e1c2: {
      onInit: init1Chart2
    },
    e2c2: {
      onInit: init2Chart2
    },
    e3c2: {
      onInit: init3Chart2
    },
    e4c2: {
      onInit: init4Chart2
    },
    e5c2: {
      onInit: init5Chart2
    },
  },



  //获取数量
  //调用接口获取数据
  // getlist1() {
  //   let that = this;
  //   wx.request({
  //     url: 'https://medicalgas.lygyy.com.cn/prod-api/warning/ac/warninginfo',
  //     method: 'get',
  //     data: {
  //       areaId: wx.getStorageSync('areaId'),
  //     },
  //     header: {
  //       Authorization: wx.getStorageSync('token')
  //     },
  //     success: function success(res) {
  //       if (res.data.code == 200) {

  //         const originalData = res.data.data;


  //         ec2Date = { normalCount: originalData['氧气储蓄罐'].normalCount, warningCount: originalData['氧气储蓄罐'].warningCount };
  //         console.log("ec2Dateec2Date", ec2Date);

  //         e1c2Date = { normalCount: originalData['空气机组'].normalCount, warningCount: originalData['空气机组'].warningCount };


  //         if (originalData['负压机组']) {
  //           e2c2Date = { normalCount: originalData['负压机组'].normalCount, warningCount: originalData['负压机组'].warningCount };
  //         } else {
  //           e2c2Date = { normalCount: 0, warningCount: 0 };
  //         }


  //         e3c2Date = { normalCount: originalData['汇流排'].normalCount, warningCount: originalData['汇流排'].warningCount };
  //         e4c2Date = { normalCount: originalData['主管网'].normalCount, warningCount: originalData['主管网'].warningCount };
  //         e5c2Date = { normalCount: originalData['区域报警箱'].normalCount, warningCount: originalData['区域报警箱'].warningCount };

  //         that.setData({
  //           ec2: {
  //             onInit: initChart2
  //           },
  //         });




  //       } else {
  //         wx.removeStorageSync('token')
  //         wx.navigateTo({
  //           url: '/pages/login/index',
  //         })

  //       }

  //     },

  //   });
  // },

  getlist1() {
    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/warning/ac/warninginfo',
      method: 'get',
      data: {
        areaId: wx.getStorageSync('areaId'),
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 200) {
          const originalData = res.data.data;
          // 动态生成设备列表和echarts配置
          let deviceList = [];
          let ecList = [];
          Object.keys(originalData).forEach((key, idx) => {
            const item = originalData[key];
            deviceList.push({
              name: key,
              displayName: item.typeName || key,
              normalCount: item.normalCount,
              warningCount: item.warningCount
            });
            // 每个设备一个echarts配置
            ecList.push({
              onInit: function(canvas, width, height, dpr) {
                let chart = echarts.init(canvas, null, {
                  width: width,
                  height: height,
                  devicePixelRatio: dpr
                });
                canvas.setChart(chart);
                let option = {
                  grid: {
                    top: 0, bottom: 0, left: 0, right: 0,
                    containLabel: true,
                  },
                  color: ['#C1EBDD', '#FFC851'],
                  series: [{
                    name: item.typeName || key,
                    type: 'pie',
                    radius: '90%',
                    label: { show: false, position: 'center', formatter: '{d}%' },
                    emphasis: { label: { show: true, fontSize: 30, fontWeight: 'bold' } },
                    labelLine: { show: true },
                    data: [
                      { value: item.normalCount, name: '正常' },
                      { value: item.warningCount, name: '告警' }
                    ]
                  }]
                };
                chart.setOption(option);
                return chart;
              }
            });
          });
          that.setData({
            deviceList,
            ecList
          });
        } else {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/index',
          })
        }
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