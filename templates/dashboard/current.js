/* dashboard panel*/

app.dashboard_current_InitStyles = function() {
    console.log('dashboard_current_InitStyles');
    app.addStyle('.dashboard_current{}');
}
app.dashboard_current_PanelInit = function() {
    console.log('dashboard_current_PanelInit');
    app.addPanel('dashboard_current', 'Dashboard current Title', 'Loading, please wait...');
}
app.dashboard_current_DataLoad = function() {
    console.log('dashboard_current_DataLoad');
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        let content = document.getElementById('dashboard_current-content');
        dataset = JSON.parse(this.responseText);
        console.log(dataset);
        content.innerHTML=this.responseText;
    };
    
    uri = '/data?whatIwant=currentValue'; // +encodeURIComponent('string')
    xmlhttp.open("GET", uri);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.send();
}
