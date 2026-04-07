//获取应用实例
import * as echarts from '../../components/ec-canvas/echarts';

let chart = null;
var ec1Date= null;


function initChart5(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);

  var option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: 20,
      bottom: 30,
      left: 20,
      right: 30,
      padding: [0, 0, 0, 0],
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ec1Date ? ec1Date.x : [],
      // axisLabel: {
      //   rotate: 45,
      //   interval: 0,
      // },
      // 设置超出7个标签时自动滚动
      axisPointer: {
        show: true
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return Math.round(value); // 去掉小数
        }
      },
      splitLine: {
        show: true
      },
      interval: 1, // 强制每 1 个单位显示一个刻度
      min: 0     // 可选，从 0 开始显示
    },
    dataZoom: [{
      type: 'slider',     // 滑动型缩放
      start: 0,            // 初始显示从第一个开始
      end: 100,            // 显示全部
      height: 12,          // 滚动条高度
      bottom: 5,           // 距离底部位置
      handleSize: '80%',   // 控制滑块大小
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
    }],
    series: [
      {
        data: ec1Date ? ec1Date.y : [],
        type: 'bar'
      }
    ]
  };

  // 格式化 X 轴日期：例如 "2025-05-01" → "05-01"
  if (ec1Date && ec1Date.x && Array.isArray(ec1Date.x)) {
    option.xAxis.data = ec1Date.x.map(dateStr => {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // 非法日期不处理
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}-${day}`;
    });
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
    tab:1,
    ec1:'',
    ec5show:false,
    ec5: {
      onInit: initChart5
    }
  },

  
  _tab(e){
    this.setData({
      tab: e.currentTarget.dataset.tab,
    });
  },



  getlist1() {
    let that = this;
    
   

     let turl =   that.data.areaId == '1921753035498872833'?'/kf/report/mainnet/warning/statistics':'/report/mainnet/warning/statistics';
    wx.request({
      url: 'https://medicalgas.lygyy.com.cn/prod-api'+turl,
      method: 'get',
      data: {
        areaId:wx.getStorageSync('areaId'),
      },
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function success(res) {
        if (res.data.code == 200) {

          const obj =res.data.data;
        
        
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

          
           ec1Date={
             x:names,
             y:volumes
           }
         
            that.setData({
              ec5: {
                onInit: initChart5
              },
              ec5show:true
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
