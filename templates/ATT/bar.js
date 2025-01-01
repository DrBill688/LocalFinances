/* dashboard panel*/

app.bar_panel_InitStyles = function() {
    console.log('bar_panel_InitStyles');
    app.addStyle('.bar_panel{}');
    app.addStyle('.bar_panel-content{display:inline;}');
    app.addStyle('.barchart{float:left;}');
    app.addStyle('.barlegend{float:right;}');
    app.addStyle('.bar_panel_data0{fill:red;stroke:black;}.legendcolorblock>.bar_panel_data0{height:inherit;background-color:red;}');
    app.addStyle('.bar_panel_data1{fill:blue;stroke:black;}.legendcolorblock>.bar_panel_data1{height:inherit;background-color:blue;}');
    app.addStyle('.bar_panel_data2{fill:purple;stroke:black;}.legendcolorblock>.bar_panel_data2{height:inherit;background-color:purple;}');
    app.addStyle('.bar_panel_data3{fill:green;stroke:black;}.legendcolorblock>.bar_panel_data3{height:inherit;background-color:green;}');
    app.addStyle('.bar_panel_data4{fill:brown;stroke:black;}.legendcolorblock>.bar_panel_data4{height:inherit;background-color:brown;}');
    app.addStyle('.bar_panel_data5{fill:yellow;stroke:black;}.legendcolorblock>.bar_panel_data5{height:inherit;background-color:yellow;}');
    app.addStyle('.bar_panel_data6{fill:pink;stroke:black;}.legendcolorblock>.bar_panel_data6{height:inherit;background-color:pink;}');
}
app.bar_panel_PanelInit = function() {
    console.log('bar_panel_PanelInit');
    app.addPanel('bar_panel', 'bar Example', 'Loading, please wait...');
}
app.bar_panel_DataLoad = function() {
    console.log('bar_panel_DataLoad');
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

    let content = document.getElementById('bar_panel-content');
    content.innerHTML="";
    barchart = document.createElement("div");
    barchart.id='barchart';
    barchart.classList.add('barchart');
    let viz = new DrBillsVisualization();
    barchart.appendChild(viz.setEventHandler(function (id) {alert("Selected "+id);})
                              .setClassPrefix('bar_panel_data')
                              .setMaxValue(150)
                              .setBackgroundColor('cyan')
                              .addBarGraph(dataset)
                              .asSVG());
    content.appendChild(barchart);
    let legend = document.createElement("div");
    legend.id='barlegend';
    legend.classList.add('barlegend');
    l = viz.generateLegend();
    if (l!==undefined)
        legend.appendChild(viz.generateLegend())
    content.appendChild(legend);
}
