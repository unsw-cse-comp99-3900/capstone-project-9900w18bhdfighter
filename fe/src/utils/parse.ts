const shortName = (firstName = '', lastName = '') => {
  console.log('firstName:', firstName)

  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
}
export { shortName }
