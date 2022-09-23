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
        element.classList.add((this.data.length) ? "column-chart" : "column-chart_loading");
        this.element = element;
    }

    getHTML() {
        if (!this.data.length) {
            return `
            <div class="column-chart_loading">
                <div class="column-chart__title">Total ${this.label} ${this.getLink()}</div>                   
                <div class="column-chart__container">
                    <div class="column-chart__header">${this.value}</div>
                </div> 
            </div>`;
        }

        return `
        <div class="column-chart">
            <div class="column-chart__title">Total ${this.label} ${this.getLink()}</div> 
            <div class="column-chart__container">
                <div class="column-chart__header">${this.value}</div>
                <div class="column-chart__chart">${this.getCharts()}</div> 
            </div>  
        </div>`;

    }

    getLink() {
        if (!this.link) return '';
        return `<a class="column-chart__link" href="${this.link}">View all</a>`;
    }

    getCharts() {
        
        const maxElem = Math.max(...this.data);
        const coef = this.chartHeight / maxElem;     
        let columns = ``;
        
        for (const elem of this.data) { 
            const percent = Math.round(elem/maxElem*100);
            const chartValue = Math.floor(coef*elem);
            columns += `<div style="--value:${chartValue}" data-tooltip="${percent}%"></div>`;            
        }
        return columns;

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