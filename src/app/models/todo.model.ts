export class Todo {
    id: number;
    title = '';
    complete = false;
    category: number;
    editing: Boolean;

    constructor(public rowId: number, public isRowCategory: boolean, public ordinal?: number, public name?: string, public done?: boolean, public dueDate?: string, parentId?: number, values: Object = {}) {
        this.editing = false;
        Object.assign(this, values);
    }
}

//remove "values: Object = {}" and "Object.assign(this, values);" and "id..title..complete..category"