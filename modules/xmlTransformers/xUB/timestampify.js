
function timestampify(text) {
    return text.replace(/^[0-5]?\d(?::[0-5]?\d){1,2}/gm, '<a data-time="$&" class="timestamp-link">$&</a>')
}

module.exports = timestampify