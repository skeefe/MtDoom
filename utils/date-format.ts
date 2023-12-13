export function formatDate(timeStamp) {
  const date: Date = new Date(timeStamp * 1000);
  const formattedDate: {
    full: string;
    short: string;
  } = {
    full: `${date.getDate()}/${date.getMonth() + 1}/${
      date.getFullYear() - 2000
    }`,
    short: `${date.getDate()}/${date.getMonth() + 1}`,
  };
  return formattedDate;
}
