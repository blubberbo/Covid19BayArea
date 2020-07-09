const formatDate = (date) => {
  let formattedDate = date;
  // remove the time
  formattedDate = formattedDate.replace('T00:00:00', '');
  // change the '-'s to '/'s
  formattedDate = formattedDate.replace(/-/g, '/');
  // parse it into a date and then back into a string with a 2 digit year
  formattedDate = new Date(formattedDate).toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
  // if the first character is 0, remove it
  if (formattedDate.charAt(0) === '0') {
    formattedDate = formattedDate.substring(1);
  }
  // remove any 0 after a '/' - this should only be possible with the day
  formattedDate = formattedDate.replace('/0', '/');
  // return the formatted date
  return formattedDate;
};

export default formatDate;
