export function formatDate(timeStamp) {
    const date:Date = new Date(timeStamp*1000);
    const formattedDate:string = `${date.toLocaleDateString()}`;
    return formattedDate;
}