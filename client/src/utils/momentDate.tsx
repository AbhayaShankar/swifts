import moment from "moment";

export const momentDate = (date: Date) => {
  return moment(date).calendar();
};
