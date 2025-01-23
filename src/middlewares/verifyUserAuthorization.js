const AppError = require('../utils/AppError')

function verifyUserAuthorization(roleToVerify) {
  return (request, response, next) => {
    const { role } = request.user

    if(role !== roleToVerify) {
      throw new AppError("Não autorizado!");
    }

    return next()
  }
}

module.exports = verifyUserAuthorization