/* dashboard panel*/

app.donut_panel_InitStyles = function() {
    console.log('donut_panel_InitStyles');
    app.addStyle('.donut_panel{}');
    app.addStyle('.donut_panel-content{display:inline;}');
    app.addStyle('.donutchart{float:left;}');
    app.addStyle('.donutlegend{float:right;min-width:10px;min-height:10px;}');
    app.addStyle('.wedge{stroke:yellow;stroke-width:2;fill:red;}');
    app.addStyle('.wedge:hover{stroke:green;stroke-width:5;}');
}
app.donut_panel_PanelInit = function() {
    console.log('donut_panel_PanelInit');
    app.addPanel('donut_panel', 'donut Example', 'Loading, please wait...');
}
app.donut_panel_DataLoad = function() {
    console.log('donut_panel_DataLoad');
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

    let content = document.getElementById('donut_panel-content');
    content.innerHTML="";
    donutchart = document.createElement("div");
    donutchart.id='donutchart';
    donutchart.classList.add('donutchart');
    let viz = new DrBillsVisualization();
    donutchart.appendChild(viz.setEventHandler(function (id) {alert("Selected "+id);})
                              .setWidth(300)
                              .setHeight(250)
                              .setMaxValue(150)
                              .setBackgroundColor('cyan')
                              .addPieGraph(dataset, 250/2)
                              .asSVG());
    content.appendChild(donutchart);
    let legend = document.createElement("div");
    legend.id='donutlegend';
    legend.classList.add('donutlegend');
    l = viz.generateLegend();
    if (l!==undefined)
        legend.appendChild(viz.generateLegend())
    content.appendChild(legend);
}
