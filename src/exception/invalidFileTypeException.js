function InvalidFileTypeException (message) {
  this.name = 'Invalid file type'
  this.message = message || 'Invalid file type'
  this.code = 'INVALID_FILE_TYPE'
  this.stack = new Error().stack
}
InvalidFileTypeException.prototype = Object.create(
  InvalidFileTypeException.prototype
)
InvalidFileTypeException.prototype.constructor = InvalidFileTypeException

export default InvalidFileTypeException
