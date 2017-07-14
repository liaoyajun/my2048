/*
  加: A
  减: S
  乘: M
  除: D
  + - × ÷
*/
function compute (formulas) {
  // 需要处理一下小数
  formulas = formulas
  return ASSplit(formulas)
}
// 分割加减+ -
function ASSplit (formulas) {
  var subResult
  var ASNumArr = []
  var ASCharArr = []
  function ASSplitDetail (formulas) {
    var before
    var after
    var indexA = formulas.indexOf('+')
    var indexS = formulas.indexOf('-')
    if ((indexA != -1) && (indexS != -1)) {
      if (indexA < indexS) {
        ASCharArr.push('+')
        before = formulas.substring(0, indexA)
        after = formulas.substring(indexA + 1, formulas.length + 1)
        before = MDSplit(before)
        ASNumArr.push(before)
        if ((after.indexOf('+') != -1) || (after.indexOf('-') != -1)) {
          ASSplitDetail(after)
        } else {
          after = MDSplit(after)
          ASNumArr.push(after)
          return
        }
      } else {
        ASCharArr.push('-')
        before = formulas.substring(0, indexS)
        after = formulas.substring(indexS + 1, formulas.length + 1)
        before = MDSplit(before)
        ASNumArr.push(before)
        if ((after.indexOf('+') != -1) || (after.indexOf('-') != -1)) {
          ASSplitDetail(after)
        } else {
          after = MDSplit(after)
          ASNumArr.push(after)
          return
        }
      }
    } else if (indexA != -1) {
      ASCharArr.push('+')
      before = formulas.substring(0, indexA)
      after = formulas.substring(indexA + 1, formulas.length + 1)
      before = MDSplit(before)
      ASNumArr.push(before)
      if ((after.indexOf('+') != -1) || (after.indexOf('-') != -1)) {
        ASSplitDetail(after)
      } else {
        after = MDSplit(after)
        ASNumArr.push(after)
        return
      }
    } else if (indexS != -1) {
      ASCharArr.push('-')
      before = formulas.substring(0, indexS)
      after = formulas.substring(indexS + 1, formulas.length + 1)
      before = MDSplit(before)
      ASNumArr.push(before)
      if ((after.indexOf('+') != -1) || (after.indexOf('-') != -1)) {
        ASSplitDetail(after)
      } else {
        after = MDSplit(after)
        ASNumArr.push(after)
        return
      }
    } else {
      formulas = MDSplit(formulas)
      ASNumArr.push(formulas)
      return
    }
  }
  ASSplitDetail(formulas)
  subResult = Number(ASNumArr[0])
  // 计算加减
  for (var i = 0; i < ASCharArr.length; i++) {
    if (ASCharArr[i] == '+') {
      subResult += Number(ASNumArr[i + 1])
    } else if (ASCharArr[i] == '-') {
      subResult -= Number(ASNumArr[i + 1])
    }
  }
  return subResult
}
// 分割乘除× ÷
function MDSplit (formulas) {
  var partResult
  var MDNumArr = []
  var MDCharArr = []
  function MDSplitDetail (formulas) {
    var before
    var after
    var indexM = formulas.indexOf('×')
    var indexD = formulas.indexOf('÷')
    if ((indexM != -1) && (indexD != -1)) {
      if (indexM < indexD) {
        MDCharArr.push('×')
        before = formulas.substring(0, indexM)
        after = formulas.substring(indexM + 1, formulas.length + 1)
        MDNumArr.push(before)
        if ((after.indexOf('×') != -1) || (after.indexOf('÷') != -1)) {
          MDSplitDetail(after)
        } else {
          MDNumArr.push(after)
          return
        }
      } else {
        MDCharArr.push('÷')
        before = formulas.substring(0, indexD)
        after = formulas.substring(indexD + 1, formulas.length + 1)
        MDNumArr.push(before)
        if ((after.indexOf('×') != -1) || (after.indexOf('÷') != -1)) {
          MDSplitDetail(after)
        } else {
          MDNumArr.push(after)
          return
        }
      }
    } else if (indexM != -1) {
      MDCharArr.push('×')
      before = formulas.substring(0, indexM)
      after = formulas.substring(indexM + 1, formulas.length + 1)
      MDNumArr.push(before)
      if ((after.indexOf('×') != -1) || (after.indexOf('÷') != -1)) {
        MDSplitDetail(after)
      } else {
        MDNumArr.push(after)
        return
      }
    } else if (indexD != -1) {
      MDCharArr.push('÷')
      before = formulas.substring(0, indexD)
      after = formulas.substring(indexD + 1, formulas.length + 1)
      MDNumArr.push(before)
      if ((after.indexOf('×') != -1) || (after.indexOf('÷') != -1)) {
        MDSplitDetail(after)
      } else {
        MDNumArr.push(after)
        return
      }
    }  else {
      MDNumArr.push(formulas)
      return
    }
  }
  MDSplitDetail(formulas)
  partResult = Number(MDNumArr[0])
  // 计算加减
  for (var i = 0; i < MDCharArr.length; i++) {
    if (MDCharArr[i] == '×') {
      partResult *= Number(MDNumArr[i + 1])
    } else if (MDCharArr[i] == '÷') {
      partResult /= Number(MDNumArr[i + 1])
    }
  }
  return partResult
}
module.exports = compute
