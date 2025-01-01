/* dashboard panel*/

app.line_panel_InitStyles = function() {
    console.log('line_panel_InitStyles');
    app.addStyle('.line_panel{}');
    app.addStyle('.line_panel-content{display:inline;}');
    app.addStyle('.linechart{float:left;}');
    app.addStyle('.linelegend{float:right;}');
    app.addStyle('.lineclass{stroke:green;stroke-width:1;}');
}
app.line_panel_PanelInit = function() {
    console.log('line_panel_PanelInit');
    app.addPanel('line_panel', 'line Example', 'Loading, please wait...');
}
app.line_panel_DataLoad = function() {
    console.log('line_panel_DataLoad');
/*
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        let content = document.getElementById('dashboard_panel1-content');
        dataset = JSON.parse(this.responseText);
        console.log(dataset);
        content.innerHTML=this.responseText;
    };
    
    uri = '/data?whatIwant=isThis'; // +encodeURIComponent('string')
    xmlhttp.open("GET", uri);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.send();
*/
    let dataset = { 'First Label': 23.4, 
                    'Second Label': 22.5,
                    'Third Label': 41.5,
                    'Fourth Label': 52.5,
                    'Fifth Label': 12.5,
                    'Last Label': 80.4};

    let content = document.getElementById('line_panel-content');
    content.innerHTML="";
    linechart = document.createElement("div");
    linechart.id='linechart';
    linechart.classList.add('linechart');
    let viz = new DrBillsVisualization();
    linechart.appendChild(viz.setEventHandler(function (id) {alert("Selected "+id);})
                              .setMaxValue(150)
                              .setBackgroundColor('white')
                              .addLineGraph(dataset, lineclass='lineclass', dotsize=3)
                              .asSVG());
    content.appendChild(linechart);
    let legend = document.createElement("div");
    legend.id='linelegend';
    legend.classList.add('linelegend');
    l = viz.generateLegend();
    if (l!==undefined)
        legend.appendChild(viz.generateLegend())
    content.appendChild(legend);
}
