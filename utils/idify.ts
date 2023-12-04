export function idify(value: string) {
  const id = value
    .toLowerCase() //Lower case
    .replace(/\s+/g, "-") //Replace spaces
    .replace(/[^A-Za-z0-9-]/g, ""); //Removed special characters
  return id;
}
