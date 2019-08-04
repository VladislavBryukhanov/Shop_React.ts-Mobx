import moment from 'moment';

export const dateFormatFilter = (date: string) => {
  return moment(date).format("DD.MM.YYYY");
};