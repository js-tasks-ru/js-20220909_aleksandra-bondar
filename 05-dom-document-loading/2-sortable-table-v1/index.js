export default class SortableTable {
  
  subElements = {};

  constructor(headerConfig = [], data = []) {
    
    this.headerConfig = headerConfig;
    this.data = data;
    this.render();

  }

  render() {

    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getHTML();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();

  }

  getHTML() {  
      
    return `
      <div class="sortable-table">
        <div class="sortable-table__header sortable-table__row">
          ${this.headerConfig.map(item => this.getHeader(item)).join('')}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.getRows()}
        </div>
      </div>`;

  }

  getHeader({title, id, sortable}) {
    return `<div class="sortable-table__cell" data-id=${id} data-sortable=${sortable} data-order="">
      <span>${title}</span>
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    </div>`;
  }

  getRows(data = []) {

    const output = data.length ? data : this.data;

    return output.map(rowObject => {
      return `<div class="sortable-table__row">
      ${this.headerConfig.map(item => {
        const value = rowObject[item.id] === undefined ? '' : rowObject[item.id];
        return item.template !== undefined ? item.template(value) : `<div class="sortable-table__cell">${value}</div>`;
      }).join('')}
      </div>`;
    }).join('');

  }

  sort(fieldValue, orderValue){

    const sortingElem = this.headerConfig.find(field => field.id === fieldValue);

    if (sortingElem === undefined || !sortingElem.sortable) return;

    const dirArr = {asc: 1, desc: -1};
    const sortingDirection = dirArr[orderValue];
    const copyData = [...this.data];    
    const {sortType} = sortingElem;
    const columns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    

    copyData.sort((a, b) => {
      if (sortType === 'string'){
        return sortingDirection * a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en']);
      } else {
        return sortingDirection * (a[fieldValue] - b[fieldValue]);
      }
    });

    this.subElements.body.innerHTML = this.getRows(copyData);
    
    columns.forEach(column => {
      column.dataset.order = column.matches(`[data-id=${fieldValue}]`) ? orderValue : '';
    });
    
  }
 
  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }  

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}