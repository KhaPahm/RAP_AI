module.exports = (totalResult = 0, data = null, resultCode = 0, message = "Successful!") => {
    this.resultCode = resultCode,
    this.totalResult = totalResult,
    this.data = data,
    this.message = message
}