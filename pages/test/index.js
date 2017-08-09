var compute = require('../../utils/compute.js')
//获取应用实例
var app = getApp()
Page({
  data: {
  },
  onLoad: function() {
    this.allCombination()
  },
  onShow: function() {
  },
  onHide: function() {
  },
  allCombination: function() {
    var charArr = ['+', '-', '']
    recursion(2, '1')
    function recursion(index, str) {
      if (index == 10) {
        if (compute(str) == 100) {
          console.log(str)
        }
        return str
      }
      for (var i = 0; i < 3; i++) {
        var tempstr = str + charArr[i] + index
        var tempindex = index + 1
        recursion(tempindex, tempstr)
      }
    }
  }
})
