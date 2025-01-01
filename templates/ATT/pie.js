/* dashboard panel*/

app.pie_panel_InitStyles = function() {
    console.log('pie_panel_InitStyles');
    app.addStyle('.pie_panel{}');
    app.addStyle('.pie_panel-content{display:inline;}');
    app.addStyle('.piechart{float:left;}');
    app.addStyle('.pielegend{float:right;min-width:10px;min-height:10px;}');
}
app.pie_panel_PanelInit = function() {
    console.log('pie_panel_PanelInit');
    app.addPanel('pie_panel', 'Pie Example', 'Loading, please wait...');
}
app.pie_panel_DataLoad = function() {
    console.log('pie_panel_DataLoad');
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

    let content = document.getElementById('pie_panel-content');
    content.innerHTML="";
    let piechart = document.createElement("div");
    piechart.id='piechart';
    piechart.classList.add('piechart');
    let viz = new DrBillsVisualization();
//    piechart.appendChild(viz.setEventHandler(selectWedge)
    piechart.appendChild(viz.setEventHandler(function (id) {alert("Selected "+id);})
                              .setMaxValue(150)
                              .setBackgroundColor('white')
                              .addPieGraph(dataset, 50)
                              .asSVG());
    content.appendChild(piechart);
    let legend = document.createElement("div");
    legend.id='pielegend';
    legend.classList.add('pielegend');
    l = viz.generateLegend();
    if (l!==undefined)
        legend.appendChild(viz.generateLegend())
    content.appendChild(legend);
}
