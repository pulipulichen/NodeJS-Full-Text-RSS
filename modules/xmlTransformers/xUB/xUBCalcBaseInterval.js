
const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

function median(values){
  if (values.length === 0) {
    return 0
  }

  values.sort(function(a,b){
    return a-b;
  });

  var half = Math.floor(values.length / 2);
  
  if (values.length % 2)
    return values[half];
  
  return (values[half - 1] + values[half]) / 2.0;
}

function getStandardDeviation (array) {
  if (array.length === 0) {
    return 0
  }
  
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

const xUBCalcSeperateInterval = function (captions) {
  
  let intervals = captions.map(c => c.interval)
  if (intervals.length > 2) {
    intervals = intervals.splice(0, -1)
  }
  
  let base = median(intervals) + getStandardDeviation(intervals)
  return base
  /*
  //console.log(avg)
  if (base < 0.02) {
    base = 0.02
  }

  let newHeaderInterval = base * 20
  let newParagraphInterval = base * 10

  return {
    section: newHeaderInterval,
    paragraph: newParagraphInterval
  }
   * 
   */
}

module.exports = xUBCalcSeperateInterval