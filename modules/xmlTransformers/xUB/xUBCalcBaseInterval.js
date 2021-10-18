
const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

function median(values){
  if(values.length ===0) throw new Error("No inputs");

  values.sort(function(a,b){
    return a-b;
  });

  var half = Math.floor(values.length / 2);
  
  if (values.length % 2)
    return values[half];
  
  return (values[half - 1] + values[half]) / 2.0;
}

const xUBCalcSeperateInterval = function (captions) {
  
  let intervals = captions.splice(1).map(c => c.interval)
  
  let base = median(intervals)
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
}

module.exports = xUBCalcSeperateInterval