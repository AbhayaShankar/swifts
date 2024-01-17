import moment from "moment";

export const momentDate = (date: Date | undefined) => {
  return moment(date).calendar();
};
