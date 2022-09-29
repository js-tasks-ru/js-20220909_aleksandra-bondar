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

  sort () {
    if (this.isSortLocally) {
      this.sortOnClient();
    } else {
      //this.sortOnServer();
    }
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
 
  sortOnClient() {
  
    const columns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    
    this.subElements.body.innerHTML = this.getRows(this.sortData(this.sortedId, this.sortedOrder));
    
    columns.forEach(column => {
      column.dataset.order = column.matches(`[data-id=${this.sortedId}]`) ? this.sortedOrder : '';
    });
    
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
      if (name === "title" && subElement.dataset.sortable === 'true') {
        subElement.addEventListener('pointerdown', this.pointerDownHandler)
      }
    }

    return result;
  }  

  pointerDownHandler = (event) => {

    this.sortedId = event.currentTarget.dataset.id;
    this.sortedOrder = this.sortedOrder === 'asc' ? 'desc' : 'asc';
    this.sortOnClient();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  removeEventListeners() {
    if (this.element) {
      const columns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
      columns.forEach(column => {
        column.removeEventListener('pointerdown', this.pointerDownHandler);
      });
    }
  }

}