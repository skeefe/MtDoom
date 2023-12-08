import { selectOption } from "../app/types/select-option";

//Takes a collection and turns it into an array of Select Options.
export function collectionToSelect(Collection, Label, Value) {
  let options: selectOption[] = new Array();
  Collection.map((item) =>
    options.push({ Label: item[Label], Value: item[Value], Active: true })
  );
  return options;
}
