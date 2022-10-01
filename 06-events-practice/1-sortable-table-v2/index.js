export default class SortableTable {

  element;
  subElements = {};

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {

    this.headerConfig = headersConfig;
    this.data = data;
    this.sortedId = sorted.id;
    this.sortedOrder = sorted.order;
    this.isSortLocally = true;
    this.render();
    this.subElements.header.addEventListener('pointerdown', this.pointerDownHandler);

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
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.headerConfig.map(item => this.getHeader(item)).join('')}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.getRows(this.sortData(this.sortedId, this.sortedOrder))}
        </div>
      </div>`;

  }

  getHeader({title, id, sortable}) {

    const order = id === this.sortedId ? this.sortedOrder : "";
    return `<div data-element="title" class="sortable-table__cell" data-id=${id} data-sortable=${sortable} data-order=${order}>
      <span>${title}</span>
      ${this.getArrow(order)}
    </div>`;
  }

  getArrow(order){
    if(order === '') return '';
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>`;
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

  sortData(fieldValue, orderValue){

    const sortingElem = this.headerConfig.find(field => field.id === fieldValue);

    if (sortingElem === undefined || !sortingElem.sortable) return;

    const dirArr = {asc: 1, desc: -1};
    const sortingDirection = dirArr[orderValue];
    const copyData = [...this.data];    
    const {sortType} = sortingElem;
    
    copyData.sort((a, b) => {
      if (sortType === 'string'){
        return sortingDirection * a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en']);
      } else {
        return sortingDirection * (a[fieldValue] - b[fieldValue]);
      }
    });

    return copyData;
    
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

  pointerDownHandler = (event) => {

    const column = event.target.closest('[data-sortable="true"]'); 
    
    if (column) {
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      this.sortedOrder = this.sortedOrder === 'asc' ? 'desc' : 'asc';
      this.sortedId = column.dataset.id;      
      column.dataset.order = this.sortedOrder;      
      this.subElements.body.innerHTML = this.getRows(this.sortData(this.sortedId, this.sortedOrder));
      
      if (!arrow) {
        column.append(this.subElements.arrow);
      }

    }
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