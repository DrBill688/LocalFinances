/* dashboard panel*/

app.dashboard_panel1_InitStyles = function() {
    console.log('dashboard_panel1_InitStyles');
    app.addStyle('.dashboard_panel1{}');
}
app.dashboard_panel1_PanelInit = function() {
    console.log('dashboard_panel1_PanelInit');
    app.addPanel('dashboard_panel1', 'Dashboard Panel1 Title', 'Loading, please wait...');
}
app.dashboard_panel1_DataLoad = function() {
    console.log('dashboard_panel1_DataLoad');
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        let content = document.getElementById('dashboard_panel1-content');
        content.innerHTML=this.responseText;
    };
    
    uri = '/datadict'; // +encodeURIComponent('string')
    xmlhttp.open("GET", uri);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.send();
}
