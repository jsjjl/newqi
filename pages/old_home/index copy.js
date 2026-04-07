//获取应用实例
var app = getApp();
import * as echarts from '../../components/ec-canvas/echarts';
let chart = null;

// 柱状图数据
var ec2Date = null;
// 柱状图
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
      top: 20,
      bottom: 20,
      left: 0,
      right: 0,
      // 内边距（Padding）
      grid: {
        padding: [0, 0, 0, 0] // 上右下左
      },
      // 确保标签不会被裁剪
      containLabel: true,
    },

    legend: { show: false, },

    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        // 提取seriesIndex为0（总数量）和1（未使用数量）的数据
        var total = params[0].value;
        var remaining = params[1].value;
        var used = total - remaining; // 计算已使用数量
        return '{a|总数量: ' + total + '}\n{c|未使用: ' + remaining + '}';
      },
    },

    xAxis: {
      type: 'category',
      data: ec2Date.x,
      //  boundaryGap: false, // 确保折线从X轴开始

      axisLine: {
        lineStyle: {
          show: true,//是否显示坐标轴轴线，
          color: '#1a1a1a',//x轴轴线的颜色
          width: 1,//x轴粗细
        }
      },

      axisTick: {
        show: true,//是否显示刻度
        lineStyle: { color: '#1a1a1a' }    // x轴刻度的颜色
      },
      axisLabel: {
        // rotate: 45, // 旋转角度，防止标签重叠
        // interval: 0, // 强制显示所有标签，可能会导致重叠，根据情况调整
        color: '#1a1a1a',// x轴字体颜色
        lineStyle: {
          show: true,//是否显示坐标轴轴线，
          color: '#1a1a1a',//x轴轴线的颜色
          width: 1,//x轴粗细
        }
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        lineStyle: {
          show: true,//是否显示坐标轴轴线，
          color: '#1a1a1a',//x轴轴线的颜色
          width: 1,//x轴粗细
        }
      },
      splitLine: { show: true },
      axisTick: {
        show: false,//是否显示刻度
        lineStyle: { color: '#1a1a1a' },    // x轴刻度的颜色

      },
      axisLabel: {
        color: '#1a1a1a',// x轴字体颜色
        interval: 0//轴显示所有的数据
      },
    },
    series: [
      {
        name: '已使用',
        data: ec2Date.y[0],
        type: 'bar',
        barGap: '-100%',
        itemStyle: {
          color: '#cccccc'
        },
        label: {
          show: true, // 显示标签
          position: 'top', // 标签位置，可以是 top, bottom, inside 等
        },
      },
      {
        name: '总数量',
        data: ec2Date.y[1],
        type: 'bar',
        barGap: '-100%',
        itemStyle: {
          // color: '#ee6666'
        },
        label: {
          show: true, // 显示标签
          position: 'inside', // 标签位置，可以是 top, bottom, inside 等
        },
      }
    ]
  };



  chart.setOption(option);
  return chart;
}

var if1d = { press: 0 };
var if2d = {};
var if3d = {};
var if4d = {};

//仪表盘
function initf1(canvas, width, height, dpr) {

  // console.log("initf1",if1d);

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

    series: [
      {
        type: 'gauge',
        min: 0,
        max: 3,
        splitNumber: 6,
        progress: {
          show: true,
          width: 5
        },
        axisLine: {

          lineStyle: {
            width: 5
          }
        },
        axisTick: {
          show: false
        },
        // 刻度标签
        splitLine: {
          show: false,
          // length: 2,
          // lineStyle: {
          //   width: 2,
          //   color: '#999'
          // }
        },
        // 轴标签
        axisLabel: {
          distance: -10, // 轴标签与轴线之间的距离
          color: '#999',
          fontSize: 10
        },
        // 轴线
        anchor: {
          show: true,
          showAbove: true,
          size: 5,
          itemStyle: {
            borderWidth: 2
          }
        },
        title: {
          show: false
        },
        detail: {
          show: false,
          valueAnimation: true,
          fontSize: 14,
          offsetCenter: [0, '100%']
        },
        data: [
          {
            value: if1d.press ? if1d.press : 0
          }
        ]
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

function initf2(canvas, width, height, dpr) {

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

    series: [
      {
        type: 'gauge',
        min: 0,
        max: 3,
        splitNumber: 6,
        progress: {
          show: true,
          width: 5
        },
        axisLine: {

          lineStyle: {
            width: 5
          }
        },
        axisTick: {
          show: false
        },
        // 刻度标签
        splitLine: {
          show: false,
          // length: 2,
          // lineStyle: {
          //   width: 2,
          //   color: '#999'
          // }
        },
        // 轴标签
        axisLabel: {
          distance: -10, // 轴标签与轴线之间的距离
          color: '#999',
          fontSize: 10
        },
        // 轴线
        anchor: {
          show: true,
          showAbove: true,
          size: 5,
          itemStyle: {
            borderWidth: 2
          }
        },
        title: {
          show: false
        },
        detail: {
          show: false,
          valueAnimation: true,
          fontSize: 14,
          offsetCenter: [0, '100%']
        },
        data: [
          {
            value: if2d.press
          }
        ]
      }
    ]
  };

  chart.setOption(option);
  return chart;
}


function initf3(canvas, width, height, dpr) {

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

    series: [
      {
        type: 'gauge',
        min: -300,
        max: 0,
        splitNumber: 4,
        progress: {
          show: true,
          width: 5
        },
        axisLine: {

          lineStyle: {
            width: 5
          }
        },
        axisTick: {
          show: false
        },
        // 刻度标签
        splitLine: {
          show: false,
          // length: 2,
          // lineStyle: {
          //   width: 2,
          //   color: '#999'
          // }
        },
        // 轴标签
        axisLabel: {
          distance: -10, // 轴标签与轴线之间的距离
          color: '#999',
          fontSize: 10
        },
        // 轴线
        anchor: {
          show: true,
          showAbove: true,
          size: 5,
          itemStyle: {
            borderWidth: 2
          }
        },
        title: {
          show: false
        },
        detail: {
          show: false,
          valueAnimation: true,
          fontSize: 14,
          offsetCenter: [0, '100%']
        },
        data: [
          {
            value: if3d.press * 1
          }
        ]
      }
    ]
  };

  chart.setOption(option);
  return chart;
}


function initf4(canvas, width, height, dpr) {

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

    series: [
      {
        type: 'gauge',
        min: 0,
        max: 3,
        splitNumber: 6,
        progress: {
          show: true,
          width: 5
        },
        axisLine: {

          lineStyle: {
            width: 5
          }
        },
        axisTick: {
          show: false
        },
        // 刻度标签
        splitLine: {
          show: false,
          // length: 2,
          // lineStyle: {
          //   width: 2,
          //   color: '#999'
          // }
        },
        // 轴标签
        axisLabel: {
          distance: -10, // 轴标签与轴线之间的距离
          color: '#999',
          fontSize: 10
        },
        // 轴线
        anchor: {
          show: true,
          showAbove: true,
          size: 5,
          itemStyle: {
            borderWidth: 2
          }
        },
        title: {
          show: false
        },
        detail: {
          show: false,
          valueAnimation: true,
          fontSize: 14,
          offsetCenter: [0, '100%']
        },
        data: [
          {
            value: if4d.press
          }
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
    interval: null,
    yqzong: undefined,
    areaId: '',
    ec2: undefined,
    tb1: {},
    tb2: [{ name: '空气压力值', data: '5.0', unit: 'bar', state: false }, { name: '氧气压力值', data: '5.0', unit: 'bar', state: true }, { name: '负压力值', data: '5.0', unit: 'bar', state: true }],
    tb3: {},
    tb4: {},
    tb5: {},
    tb6: {},
    tb7: {},
    tb8: {},
    array: [],
    arrayshow: false,
    index: 0,

    ef1_press: { press: 0 },
    ef2_press: { press: 0 },
    ef3_press: { press: 0 },
    ef4_press: { press: 0 },
    ef1: { onInit: initf1 },
    ef2: { onInit: initf2 },
    ef3: { onInit: initf3 },
    ef4: { onInit: initf4 },
    hpl: {},
    kqjz: [],
    fyjz: [],
    sbzxtj: [],
    qygjx: [],
    areaName: '',
    qtnd: []
  },

  // 数据切换
  bindPickerChange: function (e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log("areaId", that.data.array[e.detail.value].areaId);


    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/common/changeArea',
      method: 'get',
      data: {
        areaId: that.data.array[e.detail.value].areaId,
        userId: that.data.array[e.detail.value].userId,
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {

          wx.setStorageSync("areaId", that.data.array[e.detail.value].areaId);


          that.setData({
            areaId: that.data.array[e.detail.value].areaId,
            index: e.detail.value
          })

          that.setData({
            ec2: false
          })

          that.getD();
        } else {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/index',
          })

        }

      },

    });



  },



  onShow() {
    let that = this;

    //5秒后刷新
    // that.setData({
    //   interval: setInterval(() => { that.getD() }, 5000)
    // })
    that.setData({
      areaId: wx.getStorageSync('areaId')
    })

    if (wx.getStorageSync('areaName')) {
      that.setData({
        areaName: wx.getStorageSync('areaName')
      })
    }


    that.getD();
    // console.log("onShow");

  },



  getD() {

    this.getlist0();
    this.getlist1();
    this.getlist2();
    this.getlist3();
    this.getlist13();
    this.getlist4();
    this.getlist5();
    this.getlist6();
    this.getlist7();
  },
  getlist0() {
    let that = this;
    wx.request({
      url: that.data.areaId == '1921753035498872833' ? 'https://medicalgas.lygyy.com.cn/prod-api/common/getAreas' : 'https://medicalgas.lygyy.com.cn/prod-api/common/getAreas',
      method: 'get',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
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

  //调用接口获取数据
  getlist1() {
    let that = this;
    wx.request({

      url: that.data.areaId == '1921753035498872833' ? 'https://medicalgas.lygyy.com.cn/prod-api/kf/home/oxygen/show/list' : 'https://medicalgas.lygyy.com.cn/prod-api/home/oxygen/show',
      method: 'get',
      data: {
        areaId: wx.getStorageSync('areaId'),
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {

          const originalData = res.data.data;

          let x = [], yTotal = [], yRemaining = [];

          for (let key in originalData) {
            x.push(key);
            yTotal.push(parseFloat(originalData[key].totalVolume));
            yRemaining.push(parseFloat(originalData[key].remainingVolume));
          }


          let zyy = yRemaining.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

          let safeNum = Math.round(zyy * 100) / 100;
          safeNum = safeNum.toFixed(2);

          ec2Date = {
            x: x,
            y: [yTotal, yRemaining]
          };
          console.log("111111", ec2Date);


          that.setData({
            yqzong: safeNum,
            ec2: {
              onInit: initChart2
            },
          });




        } else {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/index',
          })

        }

      },

    });
  },


  //调用接口获取数据
  getlist2() {
    let that = this;
    wx.request({
      url: that.data.areaId == '1921753035498872833' ? 'https://medicalgas.lygyy.com.cn/prod-api/kf/home/mainnet/show' : 'https://medicalgas.lygyy.com.cn/prod-api/home/mainnet/show',
      method: 'get',
      data: {
        areaId: wx.getStorageSync('areaId'),
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {

          const originalData = res.data.data;
          // 动态生成设备列表和echarts配置
          let deviceList = [];
          let ecList = [];


          let temp = res.data.data;
          console.log("2222", temp);
          Object.keys(originalData).forEach((key, idx) => {
            const item = originalData[key];
            deviceList.push({
              name: key,
              buildingNo: item.buildingNo,
              buildingName: item.buildingName,

              equipId: item.equipId,
              position: item.position,
              press: item.press,
              sn: item.sn,
              type: item.type,
              warningFlag: item.warningFlag,
              warningGrade: item.warningGrade,
            });
            // 每个设备一个echarts配置
            ecList.push({
              onInit: function (canvas, width, height, dpr) {
                let chart = echarts.init(canvas, null, {
                  width: width,
                  height: height,
                  devicePixelRatio: dpr // new
                });
                canvas.setChart(chart);
                let option = option = {

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


                  series: [
                    {
                      type: 'gauge',
                      min: item.type=='VACUUM'?-300:0,
                      max: item.type=='VACUUM'?0:3,
                      splitNumber: 6,
                      progress: {
                        show: true,
                        width: 5
                      },
                      axisLine: {

                        lineStyle: {
                          width: 5
                        }
                      },
                      axisTick: {
                        show: false
                      },
                      // 刻度标签
                      splitLine: {
                        show: false,
                        // length: 2,
                        // lineStyle: {
                        //   width: 2,
                        //   color: '#999'
                        // }
                      },
                      // 轴标签
                      axisLabel: {
                        distance: -10, // 轴标签与轴线之间的距离
                        color: '#999',
                        fontSize: 10
                      },
                      // 轴线
                      anchor: {
                        show: true,
                        showAbove: true,
                        size: 5,
                        itemStyle: {
                          borderWidth: 2
                        }
                      },
                      title: {
                        show: false
                      },
                      detail: {
                        show: false,
                        valueAnimation: true,
                        fontSize: 14,
                        offsetCenter: [0, '100%']
                      },
                      data: [
                        {
                          value: item.press ? item.press : 0
                        }
                      ]
                    }
                  ]
                };
                chart.setOption(option);
                return chart;
              }
            });

          })

          that.setData({
            deviceList,
            ecList
          });

          console.log("deviceList", deviceList, ecList);
          
return;

          if (that.data.areaId == '1921753035498872833') {
            if1d = temp['空气主官网压力'] ? temp['空气主官网压力'] : ''
            if2d = temp['氧气主管网压力'] ? temp['氧气主管网压力'] : ''
            if3d = temp['负压主管网压力'] ? temp['负压主管网压力'] : ''

            that.setData({
              ef1_press: temp['空气主官网压力'],
              ef2_press: temp['氧气主管网压力'],
              ef3_press: temp['负压主管网压力'],
              ef1: { onInit: initf1 },
              ef2: { onInit: initf2 },
              ef3: { onInit: initf3 },
            });

          }
          if (that.data.areaId == '1797512499696791554') {
            if1d = temp['氧气主管网'] ? temp['氧气主管网'] : ''
            if2d = temp['真空主管网'] ? temp['真空主管网'] : ''
            if3d = temp['空气主管网'] ? temp['空气主管网'] : ''

            that.setData({
              ef1_press: temp['氧气主管网'],
              ef2_press: temp['真空主管网'],
              ef3_press: temp['空气主管网'],
              ef1: { onInit: initf1 },
              ef2: { onInit: initf2 },
              ef3: { onInit: initf3 },
            });

          }

          else {
            if1d = temp['4号楼地下室空气主管网'] ? temp['4号楼地下室空气主管网'] : ''
            if2d = temp['1号楼地下室空气主管网'] ? temp['1号楼地下室空气主管网'] : ''
            if3d = temp['1号楼地下室真空主管网'] ? temp['1号楼地下室真空主管网'] : ''
            if4d = temp['氧气主管网'] ? temp['氧气主管网'] : ''

            that.setData({
              ef1_press: temp['4号楼地下室空气主管网'],
              ef2_press: temp['1号楼地下室空气主管网'],
              ef3_press: temp['1号楼地下室真空主管网'],
              ef4_press: temp['氧气主管网'],
              ef1: { onInit: initf1 },
              ef2: { onInit: initf2 },
              ef3: { onInit: initf3 },
              ef4: { onInit: initf4 },
            });
          }




        } else {

        }

      },

    });
  },



  getlist3() {
    let that = this;
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api/home/busbar/show',
      url: that.data.areaId == '1921753035498872833' ? 'https://medicalgas.lygyy.com.cn/prod-api/kf/home/busbar/show' : 'https://medicalgas.lygyy.com.cn/prod-api/home/busbar/show',
      method: 'get',
      data: {
        areaId: wx.getStorageSync('areaId'),
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {

          let temp = res.data.data;

          const originalData = res.data.data;
          // 动态生成设备列表和echarts配置
          let deviceList = [];

          Object.keys(originalData).forEach((key, idx) => {
            const item = originalData[key];
            deviceList.push({
              name: key,
              buildingNo: item.buildingNo,
              leftPressure: item.leftPressure,
              rightPressure: item.rightPressure,
              ros: item.ros,
              sn: item.sn,
              totalPressure: item.totalPressure,
              type: item.type,
              warningFlag: item.warningFlag,
              warningGrade: item.warningGrade,
              warningInfo: item.warningInfo
            });


            that.setData({
              hpl: deviceList
            });
            console.log("hplhplhplhplhpl", deviceList);
          })



        } else {

        }

      },

    });
  },

  getlist13() {
    let that = this;
    wx.request({

      url: that.data.areaId == '1921753035498872833' ? 'https://medicalgas.lygyy.com.cn/prod-api/kf/home/gasConcentration/show/list' : 'https://medicalgas.lygyy.com.cn/prod-api/home/gasConcentration/show/list',
      method: 'get',
      data: {
        areaId: wx.getStorageSync('areaId'),
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {

          let temp = res.data.data;

          const originalData = res.data.data;
          // 动态生成设备列表和echarts配置
          let deviceList = [];
   
          Object.keys(originalData).forEach((key, idx) => {
            const item = originalData[key];
            deviceList.push({
              name: key,
              buildingNo: item.buildingNo,
              equipId: item.equipId,
              gasName: item.gasName,
              position: item.position,
              sn: item.sn,
              type: item.type,
              val: item.val,
              warningFlag: item.warningFlag,
              warningGrade: item.warningGrade

            });


            that.setData({
              qtnd: deviceList
            });
            console.log("qtndqtndqtnd", deviceList);
          })



        } else {

        }

      },

    });
  },

  getlist4() {
    let that = this;
    wx.request({
      url: that.data.areaId == '1921753035498872833' ? 'https://medicalgas.lygyy.com.cn/prod-api/kf/home/airunit/show' : 'https://medicalgas.lygyy.com.cn/prod-api/home/airunit/show',
      method: 'get',
      data: {
        areaId: wx.getStorageSync('areaId'),
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {
          console.log("kkkqqqqqq", res.data.data);
          let temp = Object.values(res.data.data);
          //  console.log("kkkkkkkkkkkk",temp);
          that.setData({
            kqjz: temp
          });

        } else {

        }

      },

    });
  },

  getlist5() {
    let that = this;
    wx.request({

      url: that.data.areaId == '1921753035498872833' ? 'https://medicalgas.lygyy.com.cn/prod-api/kf/home/vacuumunit/show' : 'https://medicalgas.lygyy.com.cn/prod-api/home/vacuumunit/show',
      method: 'get',
      data: {
        areaId: wx.getStorageSync('areaId'),
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {
          console.log("zzzkkkkkkkkkkkk", res.data.data);
          let temp = Object.values(res.data.data);


          that.setData({
            fyjz: temp
          });




        } else {

        }

      },

    });
  },

  getlist6() {
    let that = this;
    wx.request({
      url: that.data.areaId == '1921753035498872833' ? 'https://medicalgas.lygyy.com.cn/prod-api/kf/home/equipment/online/statistics' : 'https://medicalgas.lygyy.com.cn/prod-api/home/equipment/online/statistics',
      method: 'get',
      data: {
        areaId: wx.getStorageSync('areaId'),
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {

          let temp = Object.values(res.data.data);

          console.log("00000000", temp);

          that.setData({
            sbzxtj: temp
          });

        } else {

        }

      },

    });
  },



  getlist7() {
    let that = this;
    wx.request({
      url: that.data.areaId == '1921753035498872833' ? 'https://medicalgas.lygyy.com.cn/prod-api/kf/home/alarmbox/show/list' : 'https://medicalgas.lygyy.com.cn/prod-api/home/alarmbox/show',
      method: 'get',
      data: {
        areaId: wx.getStorageSync('areaId'),
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {

          console.log("qqqqqqqqqqy", res.data.data);
          let temp = Object.values(res.data.data);

          console.log("qqqqqqqqqqy2222", temp);
          that.setData({
            qygjx: temp
          });


        } else {

        }

      },

    });
  },




  onLoad: function () {
    const _this = this
    // console.log("dddd", wx.getStorageSync('token'));
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    // that.getD();
  },

  onHide() {
    let that = this;
    //停止定时器
    clearInterval(that.data.interval)
    that.setData({ interval: null });
  },


  onUnload() {
    // 页面卸载时也清除定时器，防止残留
    clearInterval(this.data.interval);
    this.setData({ interval: null });
  },

  // other
  nav1() {
    wx.navigateTo({
      url: '/pages/task_list/task_list',
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

