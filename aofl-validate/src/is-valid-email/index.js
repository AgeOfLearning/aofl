/**
 * isValidEmail
 *
 * @param {String} email
 * @return {Boolean} True or false if the given email is valid
 */
function isValidEmail(email) {
  const emailRegex = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;
  return emailRegex.test(email);
}

export {
  isValidEmail
};
