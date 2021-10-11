module.exports = async function (time = 1000) {
  return await new Promise(r => setTimeout(r, time));
}