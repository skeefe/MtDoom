//Takes a collection and Id and returns a property (Armies, Generals).
export function propertyFromID(Collection, Id: string, Property: string) {
  const selectedItem = Collection.find((item) => item.id === Id);
  return selectedItem ? selectedItem[Property] : false;
}
