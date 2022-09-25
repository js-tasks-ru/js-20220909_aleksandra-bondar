export default class NotificationMessage {

    static openedNotify;
    static timeoutId;

    constructor(message = '', {type = 'success', duration = 2000} = {})
        {
        this.message = message;
        this.type = type;
        this.duration = duration;

        this.createNotification();
        }

    createNotification(){

        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getHTML();
        this.element = wrapper.firstElementChild;

    }

    getHTML() {  
        
        return `
        <div class="notification ${this.type}" style="--value:${this.duration/1000}s">
            <div class="timer"></div> 
            <div class="inner-wrapper">
                <div class="notification-header">Notification</div>
                <div class="notification-body">${this.message}</div>
            </div>             
        </div>`;

    }

    show(parentElem){

        this.clearOpenedNotify();

        const parent = (parentElem) ? parentElem : document.body;
        parent.append(this.element);

        NotificationMessage.timeoutId = setTimeout(this.destroy.bind(this), this.duration);
        NotificationMessage.openedNotify = this;

    }

    clearOpenedNotify(){

        if (NotificationMessage.openedNotify) {
            clearTimeout(NotificationMessage.timeoutId);            
            this.destroy.call(NotificationMessage.openedNotify);
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
        NotificationMessage.timeoutId = null;
        NotificationMessage.openedNotify = null;
    }
}