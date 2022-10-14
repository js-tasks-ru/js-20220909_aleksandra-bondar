import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';


const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {

    element;
    subElements = {};
    url = new URL('/api/dashboard', BACKEND_URL);
    columnCharts = [];
    table;
    
    async render() {   
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getHTML();
        this.element = wrapper.firstElementChild;
        this.subElements = this.getSubElements();

        this.renderComponents();
        this.element.addEventListener("date-select", this.rangeSelected);
            
        return this.element;
    }

    getHTML() {
        return `<div class="dashboard">
        <div class="content__top-panel">
            <h2 class="page-title">Dashboard</h2>
            <!-- RangePicker component -->
            <div data-element="rangePicker"></div>
        </div>
        <div data-element="chartsRoot" class="dashboard__charts">
            <!-- column-chart components -->
            <div data-element="ordersChart" class="dashboard__chart_orders"></div>
            <div data-element="salesChart" class="dashboard__chart_sales"></div>
            <div data-element="customersChart" class="dashboard__chart_customers"></div>
        </div>

        <h3 class="block-title">Best sellers</h3>

        <div data-element="sortableTable">
            <!-- sortable-table component -->
        </div>
        </div>`;
    }

    renderComponents() {        
        const to = new Date();
        const from = new Date();
        from.setMonth(from.getMonth() - 1);
        
        this.addRangePicker(from, to);
        this.addColumnChart("orders", from, to, 'sales');
        this.addColumnChart("sales", from, to, '', (data) => `$${data}`);
        this.addColumnChart("customers", from, to);
        this.addSortableTable(from, to);
    }  

    addRangePicker(from, to) {
        const top = this.element.querySelector(".content__top-panel");
        const rangePicker = new RangePicker({from, to});
        rangePicker.render();
        top.append(rangePicker.element);
    }

    addColumnChart(label, from, to, link = '', formatHeading = data => data){
        const newChart = new ColumnChart({
            label: label,
            link: link,
            formatHeading: formatHeading,
            url: `${this.url}/${label}`,
            range: {
              from,
              to,
            },
          });

        this.subElements[`${label}Chart`].append(newChart.element);
        this.columnCharts.push(newChart);
    }

    addSortableTable(from, to) {
        const newTable = new SortableTable(header, {
        url: `${this.url}/bestsellers`,
        isSortLocally: true,
        range: {
            from,
            to,
        }
        });

        this.subElements.sortableTable.append(newTable.element);
        this.table = newTable;
    }

    rangeSelected = async (event) => {
        const {from, to} = event.detail;
        const promises = [...this.columnCharts.map((ColumnChart) => ColumnChart.update(from, to)),
        this.table.loadData(from, to)];
        await Promise.all(promises);
    };
  
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