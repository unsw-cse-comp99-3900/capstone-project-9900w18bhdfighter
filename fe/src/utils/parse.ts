const shortName = (firstName = '', lastName = '') => {
  console.log('firstName:', firstName)

  return firstName.charAt(0) + ' ' + lastName.charAt(0)
}
export { shortName }
