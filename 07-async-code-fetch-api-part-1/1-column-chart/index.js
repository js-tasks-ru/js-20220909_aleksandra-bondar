import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {

    chartHeight = 50;
    element;
    subElements = {};
    
    constructor({label = '', value = 0, link = '', formatHeading = (data) => data} = {})
        {        
        this.label = label;
        this.value = value;
        this.link = link;
        this.formatHeading = formatHeading;
        this.data = {}
        this.max = 0;
        this.url = new URL(`/api/dashboard/${this.label}`, BACKEND_URL);
        
        this.render();
        }

        render() {
        
            const element = document.createElement('div');
            element.innerHTML = this.getHTML();
            this.element = element.firstElementChild;
            this.subElements = this.getSubElements();
        }
    
        getHTML() {  
            
            return `
            <div class="column-chart_loading" class="column-chart" style="--chart-height: ${this.chartHeight}">
                <div class="column-chart__title">Total ${this.label} ${this.getLink()}</div>        
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header">${this.value}</div>
                    <div data-element="body" class="column-chart__chart">${this.getCharts()}</div> 
                </div>  
            </div>`;
    
        }
 
        getLink() {
            return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
        }
    
        getCharts() {
    
            if (this.max === 0) return ''; 
            
            const coef = this.chartHeight / this.max; 
            let columns = Object.values(this.data).map(elem => {
                const percent = Math.round(elem/this.max*100);
                const chartValue = Math.floor(coef*elem);
            return `<div style="--value: ${chartValue}" data-tooltip="${percent}%"></div>`;
            });
    
            return columns.join("");
    
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
        
        async update(from, to) {

            this.element.classList.add('column-chart_loading');
            await this.getJson(from, to);

            if (Object.values(this.data).length) {
                this.element.classList.remove('column-chart_loading');
                this.updateCharts();
            }

            return this.data;
        }

        async getJson(from, to){

            this.url.searchParams.set('from', from.toJSON());
            this.url.searchParams.set('to', to.toJSON());
            try {
                await fetchJson(this.url)
                    .then(json => {
                        this.data = json;                        
                });   
            } catch(err) {
                throw new Error(err);
                };
                
        }

        updateCharts() {
            
            this.value = 0;
            this.max = 0;
            
            for (const value of Object.values(this.data)) {
                this.value += value;
                this.max = this.max < value ? value : this.max;
            }
            
            this.subElements.header.textContent = this.formatHeading(this.value);
            this.subElements.body.innerHTML = this.getCharts();
    
        }

        remove() {
            if (this.element) {
                this.element.remove();
            }
        }
          
        destroy() {
            this.remove;
            this.element = null;
            this.subElements = {};
        }

}