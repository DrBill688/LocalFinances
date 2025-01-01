/* Utility Functions*/

class DrBillsVisualization {
    constructor() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.setMargin(5);
        this.setBackgroundColor('white');
        this.setHeight(250);
        this.setWidth(300);
        this.setClassPrefix('palette');
        this.setMaxValue(undefined);
        this.legendtable = undefined;
        this.legendtablebody = undefined;
        this.clearLegend();
//        this.legendtable = document.createElement("table");
//       this.legendtablebody = document.createElement("tbody");
    }
    clearLegend() {this.legendtable = this.legendtablebody = undefined;return this.endLegend();}
    generateLegend() {return this.legendtable;}
    startLegend() {if (this.legendtable === undefined) {
                       this.legendtable === undefined
                       this.isBuildingLegend=true;
                       this.legendtable = document.createElement("table");
                       this.legendtablebody = document.createElement("tbody");
                   } else this.endLegend(); 
                   return this;}
    endLegend() {this.isBuildingLegend=false;if(this.legendtable !== undefined)this.legendtable.appendChild(this.legendtablebody);return this;}
    addLegend(label, cn) {  if (this.isBuildingLegend) {
                                let row = document.createElement("tr");
                                    let collabel = document.createElement("td");
                                        collabel.innerHTML="<div class='legendlabel'><div class='"+cn+"'>"+label+"</div></div>";
                                    let colcolor = document.createElement("td");
                                        colcolor.innerHTML="<div class='legendcolorblock'><div class='"+cn+"'></div></div>";
                                    row.appendChild(collabel);
                                    row.appendChild(colcolor);
                                this.legendtablebody.append(row);
                                }
                        }
    setClassPrefix(cn) {this.cnprefix=cn;return this;}
    setMargin(m) {this.margin=m;return this;}
    setBackgroundColor(color) {this.background=color;return this;}
    setHeight(y) {this.maxY=y;return this;}
    setMaxValue(m) {this.maxValue=m;return this;}
    setWidth(x) {this.maxX=x;return this;}
    

    asSVG() {return this.svg;}
    setEventHandler(foo) {
        this.svg.addEventListener("mouseup", function(e){
            if ((e.target.id !== undefined) && (e.target.id !== null) && (e.target.id != ""))
                foo(e.target.id);
            });
        return this;
    }

    static __dataTotalCount(data) {
        let count=0
        let total=0;
        for (const [key, value] of Object.entries(data)){
            if ((value !== undefined) && (value !== null) && (value.constructor == Object)) {
                total += value['value'];
            } else {
                total += value;
            }
            count++;
        }
        return [total, count];
    }
    static __dataMaxCount(data) {
        let count=0
        let max=0;
        for (const [key, value] of Object.entries(data)){
            if ((value !== undefined) && (value !== null) && (value.constructor == Object)) {
                max = (max > value['value'] ? max : value['value'])
            } else {
                max = (max > value ? max : value)
            }
            count++;
        }
        return [max, count];
    }
    __addAxis() {
        let yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            yAxis.setAttribute('x1', this.margin);
            yAxis.setAttribute('y1', this.margin);
            yAxis.setAttribute('x2', this.margin);
            yAxis.setAttribute('y2', this.maxY-this.margin);
            yAxis.setAttribute('style', "stroke:black;stroke-width:2;");
        this.svg.appendChild(yAxis);
        let xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            xAxis.setAttribute('x1', this.margin);
            xAxis.setAttribute('y1', this.maxY-this.margin);
            xAxis.setAttribute('x2', this.maxX-this.margin);
            xAxis.setAttribute('y2', this.maxY-this.margin);
            xAxis.setAttribute('style', "stroke:black;stroke-width:2;");
        this.svg.appendChild(xAxis);
        return this;
    }
    addPieGraph(data, radius){
        let [total, count] = DrBillsVisualization.__dataTotalCount(data);
        
        let startangle = 0;
        let pathDef = "";
        let paletteNbr=0;
        this.startLegend();
        for (const [key, value] of Object.entries(data)) {
            let radians = (value/total) * 2 * Math.PI;
            let startX = Math.cos(startangle)*radius+radius;
            let startY = Math.sin(startangle)*radius+radius;
            let endX = Math.cos(startangle+radians)*radius+radius;
            let endY = Math.sin(startangle+radians)*radius+radius;
            let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathDef  = "M " +(Math.cos(startangle)*radius+radius)+","+(Math.sin(startangle)*radius+radius)+ " ";
                pathDef += "A " + radius +","+radius+ " ";
                pathDef +=    "0 "+(radians < Math.PI? '0':'1')+ " ";
                pathDef +=    "1 "+ (Math.cos(startangle+radians)*radius+radius)+","+(Math.sin(startangle+radians)*radius+radius)+ " ";
                pathDef +=    "L "+radius+","+radius+" ";
                pathDef += "Z ";
                path.setAttribute('d', pathDef);
                path.setAttribute('id', key);
                path.setAttribute('class', this.cnprefix+(paletteNbr));
            this.addLegend(key, this.cnprefix+(paletteNbr++));
            this.svg.appendChild(path);
            startangle += radians;
        }        
        this.endLegend();

        this.svg.setAttribute('style',"background-color:"+self.background);
        this.svg.setAttribute('width', this.maxX);
        this.svg.setAttribute('height', this.maxY);
        return this;
    }
    addDonutGraph(data, innerradius, outerradius){
        let [total, count] = DrBillsVisualization.__dataTotalCount(data);
        let startangle = 0;
        let pathDef = ""
        let paletteNbr=0;
        this.startLegend();
        for (const [key, value] of Object.entries(data)) {
            let radians = (value/total) * 2 * Math.PI;
            let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    pathDef  = "M " +(Math.cos(startangle)*outerradius+outerradius)+","+(Math.sin(startangle)*outerradius+outerradius)+ " ";
                    pathDef += "A " + outerradius +","+outerradius+ " ";
                    pathDef +=    "0 "+(radians < Math.PI? '0':'1')+ " ";
                    pathDef +=    "1 "+ (Math.cos(startangle+radians)*outerradius+outerradius)+","+(Math.sin(startangle+radians)*outerradius+outerradius)+ " ";
                    pathDef += "L " + (Math.cos(startangle+radians)*innerradius+outerradius)+","+(Math.sin(startangle+radians)*innerradius+outerradius)+ " ";
                    pathDef += "A " + innerradius +","+innerradius+ " ";
                    pathDef +=    "0 "+(radians < Math.PI? '0':'1')+ " ";
                    pathDef +=    "0 "+ (Math.cos(startangle)*innerradius+outerradius)+","+(Math.sin(startangle)*innerradius+outerradius)+ " ";
                    pathDef += "Z ";
                    path.setAttribute('d', pathDef);
                    path.setAttribute('id', key);
                path.setAttribute('class', this.cnprefix+(paletteNbr));
            this.addLegend(key, this.cnprefix+(paletteNbr++));
            this.svg.appendChild(path);
            startangle += radians;
        }
        this.endLegend();

        this.svg.setAttribute('style',"background-color:"+self.background);
        this.svg.setAttribute('width', this.maxX);
        this.svg.setAttribute('height', this.maxY);
        return this;
    }
    addLineGraph(data, lineclass=undefined, dotsize=2){
        let [max, count] = DrBillsVisualization.__dataMaxCount(data);
        if (this.maxValue !== undefined) max = this.maxValue;

        let spacing = (this.maxX - 2*this.margin) / count;
        let scaleY = (this.maxY-2*this.margin) / max;
        let curX=this.margin+1;    
        let myX = undefined;
        let myY = undefined;
        let prevX = undefined;
        let prevY = undefined;
        let paletteNbr=0;
        this.startLegend();
        for (const [key, value] of Object.entries(data)){
            myX = curX+spacing/2;
            myY = (this.maxY-this.margin) - (value * scaleY);
            let dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dot.setAttribute('r', dotsize);
                dot.setAttribute('cx', myX);
                dot.setAttribute('cy', myY);
                dot.setAttribute('class', this.cnprefix+(paletteNbr));
            this.svg.appendChild(dot);
            if (prevX !== undefined) {
                let trace = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    trace.setAttribute('x1', prevX);
                    trace.setAttribute('y1', prevY);
                    trace.setAttribute('x2', myX);
                    trace.setAttribute('y2', myY);
                    if (lineclass !== undefined) trace.setAttribute('class', lineclass);
                    else trace.setAttribute('style', "stroke:black;stroke-width:1;");
                this.svg.appendChild(trace);
            }
            prevX = myX;
            prevY = myY;
            curX += spacing+1;
            this.addLegend(key, this.cnprefix+(paletteNbr++));
        }
        this.endLegend();

        this.__addAxis()
        this.svg.setAttribute('style',"background-color:"+self.background);
        this.svg.setAttribute('width', this.maxX);
        this.svg.setAttribute('height', this.maxY);
        return this;
    }
    addBarGraph(data){
        let [max, count] = DrBillsVisualization.__dataMaxCount(data);
        if (this.maxValue !== undefined) max = this.maxValue;
        let curX = this.margin+1;
        let spacing = (this.maxX - 2*this.margin) / count;
        let scaleY = (this.maxY-2*this.margin) / max;
        let paletteNbr=0;
        console.log('Before Start: '+this.legendtable);
        console.log('Before Start Should Add: '+this.isBuildingLegend);
        this.startLegend();
        console.log('After Start: '+this.legendtable);
        console.log('After Start Should Add: '+this.isBuildingLegend);
        for (const [key, value] of Object.entries(data)){
            let height = (value * scaleY);
            let bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar.setAttribute('width', spacing-1);
                bar.setAttribute('height', height);
                bar.setAttribute('x', curX);
                bar.setAttribute('y', this.maxY-this.margin-height);
                bar.setAttribute('id', key);
                bar.setAttribute('class', this.cnprefix+(paletteNbr));
            this.svg.appendChild(bar);        
    
            curX += spacing;
            this.addLegend(key, this.cnprefix+(paletteNbr++));
        }
        this.endLegend();
        console.log('After End Should Add: '+this.isBuildingLegend);
        console.log(this.legendtable);
        
        this.__addAxis()
        this.svg.setAttribute('style',"background-color:"+self.background);
        this.svg.setAttribute('width', this.maxX);
        this.svg.setAttribute('height', this.maxY);
        return this;
    }
}
