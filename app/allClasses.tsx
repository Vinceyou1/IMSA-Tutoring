import { classes } from "./classes/classes";
import { Filter } from "./page";

export function getAllClasses(){
    let temp_filter:Filter = {classes:[]};
    for (const [key, value] of Object.entries(classes)) {
      value.forEach((element) => {
        temp_filter.classes.push(element);
      })
    }
    return temp_filter
}