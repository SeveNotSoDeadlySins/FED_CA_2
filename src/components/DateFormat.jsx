export const formatDateDMY = (value) => {
    if (!value) return "";
    // create a Date object from the input
    // if the value is a number we assume it's a unix timestamp (seconds),
    // so multiply by 1000 to convert to milliseconds
    let date;
    if (typeof value === "number") {
      date = new Date(value * 1000);
    } else {
      // otherwise try to parse the value as an ISO/date string
      date = new Date(value);
    }
    // if parsing failed (invalid date), return the original value as a fallback
    if (isNaN(date)) return String(value);
    // extract day, month, year and pad day/month to 2 digits
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    // return formatted string in dd/mm/yyyy format
    return `${dd}/${mm}/${yyyy}`;
  };