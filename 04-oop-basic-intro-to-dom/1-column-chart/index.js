export default class ColumnChart {    
    
    constructor({data = [], label = '', value = 0, link = '', formatHeading = (data) => data} = {})
        {
        this.data = data;
        this.label = label;
        this.value = formatHeading(value);
        this.link = link;
    
        this.createCharts();
        }

    chartHeight = 50;
    
    createCharts() {
        
        const element = document.createElement('div');
        element.innerHTML = this.getHTML();
        this.element = element.firstElementChild;
    }

    getHTML() {  
        
        const curClass = this.data.length ? "column-chart" : "column-chart_loading";
        
        return `
        <div class=${curClass}>
            <div class="column-chart__title">Total ${this.label} ${this.getLink()}</div> 
            <div class="column-chart__container">
                <div class="column-chart__header">${this.value}</div>
                ${this.getCharts()} 
            </div>  
        </div>`;

    }

    getLink() {
        return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
    }

    getCharts() {

        if (!this.data.length) return ''; 
        
        const maxElem = Math.max(...this.data);
        const coef = this.chartHeight / maxElem;     
        let columns = this.data.map(elem => {
            const percent = Math.round(elem/maxElem*100);
            const chartValue = Math.floor(coef*elem);
        return `<div style="--value:${chartValue}" data-tooltip="${percent}%"></div>`;
        });

        return `<div class="column-chart__chart">` + columns.join("") + `</div>`;

    }
 
    remove() {
        if (this.element) {
            this.element.remove();
        }
    }
      
    destroy() {this.remove}

    update(newData = []) {
        this.data = newData;
        this.element.innerHTML = this.getHTML();
    }
}