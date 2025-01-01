/* dashboard panel*/

app.combo2_panel_InitStyles = function() {
    console.log('combo2_panel_InitStyles');
    app.addStyle('.combo2_panel{width:600px !important;height:400px !important;}');
    app.addStyle('.combo2_panel-content{display:inline;width:500px !important;height:300px !important;}');
    app.addStyle('.combo2chart{float:left;}');
    app.addStyle('.combo2legend{float:right;}');
}
app.combo2_panel_PanelInit = function() {
    console.log('combo2_panel_PanelInit');
    app.addPanel('combo2_panel', 'combo2 Example', 'Loading, please wait...');
}
app.combo2_panel_DataLoad = function() {
    console.log('combo2_panel_DataLoad');
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
    let datasetLine = { 'First Label': 23.4, 
                    'Second Label': 22.5,
                    'Third Label': 41.5,
                    'Fourth Label': 52.5,
                    'Fifth Label': 12.5,
                    'Last Label': 80.4};
    let datasetBar = { 'First Label': 33.4, 
                    'Second Label': 32.5,
                    'Third Label': 51.5,
                    'Fourth Label': 62.5,
                    'Fifth Label': 22.5,
                    'Last Label': 90.4};

    let content = document.getElementById('combo2_panel-content');
    content.innerHTML="";
    let combochart = document.createElement("div");
    combochart.id='combo2chart';
    combochart.classList.add('combo2chart');
    let viz = new DrBillsVisualization();
    combochart.appendChild(viz.setEventHandler(function (id) {alert("Selected "+id);})
                              .setMaxValue(150)
                              .setBackgroundColor('cyan')
//                              .addPieGraph(datasetBar, 50)
//                              .addDonutGraph(datasetBar, 100, 200)
                              .addBarGraph(datasetBar)
                              .addLineGraph(datasetLine, lineclass='uirlineclass', dotsize=5)
                              .asSVG());
    content.appendChild(combochart);
    let legend = document.createElement("div");
    legend.id='combo2legend';
    legend.classList.add('combo2legend');
    l = viz.generateLegend();
    if (l!==undefined)
        legend.appendChild(viz.generateLegend())
    content.appendChild(legend);
}
