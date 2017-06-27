//获取应用实例
var app = getApp()
var timer
var touchstart = {x: 0, y: 0}
var touchend = {x: 0, y: 0}
Page({
  data: {
    showUser: true,
    userInfo: {},
    userRecord: [],
    currentScore: 0,
    bestScore: '无',
    doubleArr: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    // 通关分数
    endScore: 131072
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo
      })
    })
    that.addNum()
  },
  onShow: function () {
    var that = this
    // 头部动画
    timer = setInterval(() => {
      that.setData({
        showUser: !that.data.showUser
      })
    }, 2000)
    // 获取个人记录
    if (wx.getStorageSync('record')) {
      var record = wx.getStorageSync('record')
      that.setData({
        userRecord: record,
        bestScore: record[0].score
      })
    }
  },
  onHide: function () {
    clearInterval(timer)
  },
  // 不包含max
  randomFn: function (min, max) {
    return parseInt(Math.random() * (max - min)) + min
  },
  sameArr: function (arr1, arr2) {
    // 一样为真
    for (var i = 0; i < arr1.length; i++) {
      for (var j = 0; j < arr1[i].length; j++) {
        if (arr1[i][j] != arr2[i][j]) {
          return false
        }
      }
    }
    return true
  },
  // 返回当前时间
  dealTime: function () {
    var time = new Date()
    var year = time.getFullYear()
    var month = time.getMonth() + 1
    var date = time.getDate()
    var hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours()
    var minute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()
    var second = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds()
    var currentTime = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
    return currentTime
  },
  // 重新开始
  restart: function (overMsg) {
    var that = this
    var newScore = {
      time: that.dealTime(),
      score: that.data.currentScore
    }
    var userRecord = that.data.userRecord
    var hasInject = false
    if (userRecord.length > 0) {
      var scoreArr = []
      userRecord.forEach((v, i) => {
        scoreArr.push(v.score)
      })
      for (var i = 0; i < scoreArr.length; i++) {
        if (scoreArr[i] <= newScore.score) {
          userRecord.splice(i, 0, newScore)
          hasInject = true
          break
        }
      }
      if ((userRecord.length < 4) && (!hasInject)) {
        userRecord.push(newScore)
      }
      if (userRecord.length > 4) {
        userRecord = userRecord.splice(0, 4)
      }
    }else {
      userRecord = [newScore]
    }
    that.setData({
      userRecord
    })
    wx.setStorageSync('record', userRecord)
    wx.showModal({
      title: '提示',
      content: overMsg,
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          that.setData({
            doubleArr: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            currentScore: 0,
            bestScore: userRecord[0].score,
          })
          that.addNum()
        }
      }
    })
  },
  // 在空位随机生成一个2或4
  addNum: function () {
    var that = this
    var doubleArr = JSON.parse(JSON.stringify(that.data.doubleArr))
    var nullArry = []
    for (var i = 0; i < doubleArr.length; i++) {
      for (var j = 0; j < doubleArr[i].length; j++) {
        if (doubleArr[i][j] == 0) {
          nullArry.push([i, j])
        }
      }
    }
    if (nullArry.length > 0) {
      var randomNum = that.randomFn(0, nullArry.length)
      if (that.randomFn(0, 10) > 7) {
        doubleArr[nullArry[randomNum][0]][nullArry[randomNum][1]] = 4
      }else {
        doubleArr[nullArry[randomNum][0]][nullArry[randomNum][1]] = 2
      }
      that.setData({
        doubleArr
      })
      that.searchMaxnum()
      if (that.data.currentScore >= that.data.endScore) {
        that.restart('Game Win !')
      }
      if (nullArry.length == 1) {
        that.isOver()
      }
    }else {
      that.restart('Game Over !')
    }
  },
  // 寻找最大的分数，随机生成2后触发
  searchMaxnum: function () {
    var that = this
    var doubleArr = JSON.parse(JSON.stringify(that.data.doubleArr))
    for (var i = 0; i < doubleArr.length; i++) {
      for (var j = 0; j < doubleArr[i].length; j++) {
        if (that.data.currentScore < doubleArr[i][j]) {
          that.setData({
            currentScore: doubleArr[i][j]
          })
        }
      }
    }
    // 更新最佳分数
    if (that.data.bestScore == '无' || that.data.bestScore < that.data.currentScore) {
      that.setData({
        bestScore: that.data.currentScore
      })
    }
  },
  isOver: function () {
    var that = this
    var arr = JSON.parse(JSON.stringify(that.data.doubleArr))
    var arr1 = JSON.parse(JSON.stringify(that.data.doubleArr))
    var arr2 = JSON.parse(JSON.stringify(that.data.doubleArr))
    var arr3 = JSON.parse(JSON.stringify(that.data.doubleArr))
    var arr4 = JSON.parse(JSON.stringify(that.data.doubleArr))
    arr1 = this.upMerge(arr1)
    arr2 = this.downMerge(arr2)
    arr3 = this.leftMerge(arr3)
    arr4 = this.rightMerge(arr4)
    if (this.sameArr(arr1, arr) && this.sameArr(arr2, arr) && this.sameArr(arr3, arr) && this.sameArr(arr4, arr)) {
      this.restart('Game Over !')
    }
  },
  // 手指滑动开始
  touchstartFn: function (e) {
    touchstart.x = e.changedTouches[0].pageX
    touchstart.y = e.changedTouches[0].pageY
  },
  // 手指滑动结束，判断滑动方向
  touchendFn: function (e) {
    var that = this
    touchend.x = e.changedTouches[0].pageX
    touchend.y = e.changedTouches[0].pageY
    var changeX = touchend.x - touchstart.x
    var changeY = touchend.y - touchstart.y
    if ((Math.abs(changeX) > 20) || (Math.abs(changeY) > 20)) {
      var doubleArr = JSON.parse(JSON.stringify(that.data.doubleArr))
      var preArr = JSON.parse(JSON.stringify(that.data.doubleArr))
      if (Math.abs(changeX) - Math.abs(changeY) > 0) {
        if (changeX > 0) {
          var preDoubleArr  = JSON.parse(JSON.stringify(doubleArr))
          var currentDoubleArr = []
          var flag = true
          do {
            flag = false
            doubleArr = that.rightMerge(doubleArr)
            doubleArr = that.rightGather(doubleArr)
            currentDoubleArr = JSON.parse(JSON.stringify(doubleArr))
            if (!that.sameArr(preDoubleArr, currentDoubleArr)) {
              flag = true
              preDoubleArr  = JSON.parse(JSON.stringify(currentDoubleArr))
            }
          } while(flag)
        }else {
          var preDoubleArr  = JSON.parse(JSON.stringify(doubleArr))
          var currentDoubleArr = []
          var flag = true
          do {
            flag = false
            doubleArr = that.leftMerge(doubleArr)
            doubleArr = that.leftGather(doubleArr)
            currentDoubleArr = JSON.parse(JSON.stringify(doubleArr))
            if (!that.sameArr(preDoubleArr, currentDoubleArr)) {
              flag = true
              preDoubleArr  = JSON.parse(JSON.stringify(currentDoubleArr))
            }
          } while(flag)
        }
      }else {
        if (changeY > 0) {
          var preDoubleArr  = JSON.parse(JSON.stringify(doubleArr))
          var currentDoubleArr = []
          var flag = true
          do {
            flag = false
            doubleArr = that.downMerge(doubleArr)
            doubleArr = that.downGather(doubleArr)
            currentDoubleArr = JSON.parse(JSON.stringify(doubleArr))
            if (!that.sameArr(preDoubleArr, currentDoubleArr)) {
              flag = true
              preDoubleArr  = JSON.parse(JSON.stringify(currentDoubleArr))
            }
          } while(flag)
        }else {
          var preDoubleArr  = JSON.parse(JSON.stringify(doubleArr))
          var currentDoubleArr = []
          var flag = true
          do {
            flag = false
            doubleArr = that.upMerge(doubleArr)
            doubleArr = that.upGather(doubleArr)
            currentDoubleArr = JSON.parse(JSON.stringify(doubleArr))
            if (!that.sameArr(preDoubleArr, currentDoubleArr)) {
              flag = true
              preDoubleArr  = JSON.parse(JSON.stringify(currentDoubleArr))
            }
          } while(flag)
        }
      }
      that.setData({
        doubleArr
      })
      if (!that.sameArr(preArr, that.data.doubleArr)) {
        that.addNum()
      }
    }
  },
  // 向上合并
  upMerge: function (arr) {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 4; j++) {
        if (arr[i][j] == arr[i + 1][j]) {
          arr[i][j] *= 2
          arr[i + 1][j] = 0
        }
      }
    }
    return arr
  },
  upGather: function (arr) {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 4; j++) {
        if (arr[i][j] == 0) {
          arr[i][j] = arr[i + 1][j]
          arr[i + 1][j] = 0
        }
      }
    }
    return arr
  },
  // 向下合并
  downMerge: function (arr) {
    for (var i = 3; i > 0; i--) {
      for (var j = 0; j < 4; j++) {
        if (arr[i][j] == arr[i - 1][j]) {
          arr[i][j] *= 2
          arr[i - 1][j] = 0
        }
      }
    }
    return arr
  },
  downGather: function (arr) {
    for (var i = 3; i > 0; i--) {
      for (var j = 0; j < 4; j++) {
        if (arr[i][j] == 0) {
          arr[i][j] = arr[i - 1][j]
          arr[i - 1][j] = 0
        }
      }
    }
    return arr
  },
  // 向左合并
  leftMerge: function (arr) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 3; j++) {
        if (arr[i][j] == arr[i][j + 1]) {
          arr[i][j] *= 2
          arr[i][j + 1] = 0
        }
      }
    }
    return arr
  },
  leftGather: function (arr) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 3; j++) {
        if (arr[i][j] == 0) {
          arr[i][j] = arr[i][j + 1]
          arr[i][j + 1] = 0
        }
      }
    }
    return arr
  },
  // 向右合并
  rightMerge: function (arr) {
    for (var i = 0; i < 4; i++) {
      for (var j = 3; j > 0; j--) {
        if (arr[i][j] == arr[i][j - 1]) {
          arr[i][j] *= 2
          arr[i][j - 1] = 0
        }
      }
    }
    return arr
  },
  rightGather: function (arr) {
    for (var i = 0; i < 4; i++) {
      for (var j = 3; j > 0; j--) {
        if (arr[i][j] == 0) {
          arr[i][j] = arr[i][j - 1]
          arr[i][j - 1] = 0
        }
      }
    }
    return arr
  }
})
