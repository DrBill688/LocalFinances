
class PageHandler {
    initialize() {
        Object.getOwnPropertyNames(this)
            .filter(this.pageInitFoo)
            .forEach(function (e) {this[e]()}, this);
        this.styles = "";
        Object.getOwnPropertyNames(this)
            .filter(this.initStylesFoo)
            .forEach(function (e) {this[e]()}, this);
        let mystyles = document.createElement('style');
        mystyles.type='text/css';
        mystyles.innerHTML = this.styles;
        document.getElementsByTagName('head')[0].appendChild(mystyles)
        Object.getOwnPropertyNames(this)
            .filter(this.dataLoadFoo)
            .forEach(function (e) {this[e]()}, this);
    }
    initStylesFoo(funcname) { return funcname.endsWith('_InitStyles');}
    pageInitFoo(funcname) { return funcname.endsWith('_PanelInit');}
    dataLoadFoo(funcname) { return funcname.endsWith('_DataLoad');}
    addStyle(s) {this.styles+=s;return this;}
    addPanel(id, title, content) {
        let panel = document.createElement('div');
        panel.id = id;
        panel.classList.add('panel');
        panel.classList.add(panel.id);
        let titlediv = document.createElement('div');
        titlediv.id = id+'-title';
        titlediv.classList.add('panel-title');
        titlediv.classList.add(titlediv.id);
        titlediv.innerHTML=title;
        panel.appendChild(titlediv);
        let contentdiv = document.createElement('div');
        contentdiv.id = id+'-content';
        contentdiv.classList.add('panel-content');
        contentdiv.classList.add(contentdiv.id);
        contentdiv.innerHTML=content;
        panel.appendChild(contentdiv);
        document.getElementById('contentmain').appendChild(panel)
    }
}

