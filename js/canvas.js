var canvasOrig, contextOrig, canvas, rulerCanvas, rulerContext, context, currentObj;

var zoom = 1;
var minZoom = 1;

var drawElements = new Array();
var selObj, scaleObj, scaleDirection;
var scaleFactor = 1; /* Scale of the map. This get changes when user scales up or down the map */

/* set ruler variables */

	var mmMarkingHeight = 10;
	var cmMarkingHeight = 30;
	var rulerHeight = 30 ;
	var rulerWidth = 30;
	var rulerOffsetX = 0;
	var rulerOffsetY = 0;
	var mmLineWidth = 1;
	var mmLineColor = "#F4F4F4";
	var cmLineWidth = 1;
	var cmLineColor = "#CECECE";
	

function init() {
    canvasOrig = document.getElementById('draw-tool-canvas');
    contextOrig = canvasOrig.getContext("2d");
    contextOrig.strokeStyle = "#0000FF";

    rulerCanvas = document.getElementById('ruler-canvas');
    rulerContext = rulerCanvas.getContext("2d");

    rulerCanvas.width = $(window).width();
    rulerCanvas.height = $(window).height();

    canvasOrig.width = $(window).width() - 60;
    canvasOrig.height = $(window).height() - 60;

    var container = canvasOrig.parentNode;
    canvas = document.createElement('canvas');
    canvas.id = "top-canvas";
    canvas.width = canvasOrig.width;
    canvas.height = canvasOrig.height;

    container.appendChild(canvas);
    context = canvas.getContext('2d');
    context.strokeStyle = "#FF0000";
    
}


/* Increments the zoom ratio */
function zoomIn() {
    zoom = zoom + minZoom;
    drawAllObjects();
}

/* Decrements the zoom ratio */
function zoomOut() {
    this.zoom = this.zoom - minZoom;
    if (this.zoom < minZoom) this.zoom = minZoom;
    drawAllObjects();
}

/* Resets the zoom ratio to 1 */
function zoomReset() {
    this.zoom = 1;
    drawAllObjects();
}

/* Scales up all elements */
function scale(currentScaleFactor, newScaleFactor) {

    for (var i = 0; i < drawElements.length; i++) {
        drawElements[i].scale(currentScaleFactor, newScaleFactor);
    }

    drawAllObjects();
}

/* Sets the scale variable to a lower value and calls scale function */
function scaleUp() {
    var currentScaleFactor = this.scaleFactor;
    var newScaleFactor = currentScaleFactor - 0.25;
    if (newScaleFactor <= 0.25) newScaleFactor = 0.25;
    this.scaleFactor = newScaleFactor;
    scale(currentScaleFactor, newScaleFactor);

}

/* Sets the scale variable to a higher value and calls scale function */
function scaleDown() {
    var currentScaleFactor = this.scaleFactor;
    var newScaleFactor = currentScaleFactor + 0.25;
    this.scaleFactor = newScaleFactor;
    scale(currentScaleFactor, newScaleFactor);
}

function scaleReset() {
    var currentScaleFactor = this.scaleFactor;
    var newScaleFactor = 1;
    this.scaleFactor = newScaleFactor;
    scale(currentScaleFactor, newScaleFactor);
}

/* Sets a zoom value directly */
function setZoom(zoomValue) {
    this.zoom = zoomValue;
    if (this.zoom < minZoom) this.zoom = minZoom;
}


/* Draws scale on top and left */
function drawRuler() {
    var curZoom = this.zoom;

    var pixelsPerMm = Math.ceil(5 * this.zoom);
    var pixelsPerCm = pixelsPerMm * 10;

    /* Draw top line */
    rulerContext.fillStyle = "#000000";
    rulerContext.strokeStyle = "#000000";
    rulerContext.clearRect(0, 0, rulerCanvas.width, rulerCanvas.height);

    rulerContext.font = "12px Georgia";
    /* Draw top line markings */
    rulerContext.lineWidth = 1;
    rulerContext.beginPath();

    /* Draw top center to right ruler */
    for (var i = rulerOffsetX; i <= (canvasOrig.width); i = i + pixelsPerMm) {

        j = i + rulerWidth;
        if (j < rulerWidth) continue;
        rulerContext.moveTo(j, rulerHeight);
        if ((i - rulerOffsetX) % pixelsPerCm == 0) {
            rulerContext.lineTo(j, rulerHeight - cmMarkingHeight);
            drawGridLine(i, 0, i, canvasOrig.height, cmLineWidth, cmLineColor);
            rulerContext.fillText((i - rulerOffsetX) / 10 / pixelsPerMm, j + 2, cmMarkingHeight / 2);
        } else {
            rulerContext.lineTo(j, rulerHeight - mmMarkingHeight);
            drawGridLine(i, 0, i, canvasOrig.height, mmLineWidth, mmLineColor);
        }
    }

    /* Draw top center to left ruler */
    for (var i = rulerOffsetX; i > 0; i = i - pixelsPerMm) {
        j = i + rulerWidth;
        rulerContext.moveTo(j, rulerHeight);
        if ((i - rulerOffsetX) % pixelsPerCm == 0) {
            rulerContext.lineTo(j, rulerHeight - cmMarkingHeight);
            rulerContext.fillText((i - rulerOffsetX) / 10 / pixelsPerMm, j + 2, cmMarkingHeight / 2);
            drawGridLine(i, 0, i, canvasOrig.height, cmLineWidth, cmLineColor);
        } else {
            rulerContext.lineTo(j, rulerHeight - mmMarkingHeight);
            drawGridLine(i, 0, i, canvasOrig.height, mmLineWidth, mmLineColor);
        }
    }

    /* Draw left middle to bottom ruler */
    for (var i = rulerOffsetY; i <= (canvasOrig.height); i = i + pixelsPerMm) {
        j = i + rulerHeight;
        if (j < rulerHeight) continue;
        rulerContext.moveTo(rulerWidth, j);
        if ((i - rulerOffsetY) % pixelsPerCm == 0) {
            rulerContext.lineTo(rulerWidth - cmMarkingHeight, j);
            drawGridLine(0, i, canvasOrig.width, i, cmLineWidth, cmLineColor);
            rulerContext.fillText((i - rulerOffsetY) / 10 / pixelsPerMm, cmMarkingHeight / 2 - 10, j - 2);
        } else {
            rulerContext.lineTo(rulerWidth - mmMarkingHeight, j);
            drawGridLine(0, i, canvasOrig.width, i, mmLineWidth, mmLineColor);
        }
    }

    /* Draw left middle to top ruler */
    for (var i = rulerOffsetY; i >= 0; i = i - pixelsPerMm) {
        j = i + rulerHeight;
        rulerContext.moveTo(rulerWidth, j);
        if ((i - rulerOffsetY) % pixelsPerCm == 0) {
            rulerContext.lineTo(rulerWidth - cmMarkingHeight, j);
            rulerContext.fillText((i - rulerOffsetY) / 10 / pixelsPerMm, cmMarkingHeight / 2 - 10, j - 2);
            drawGridLine(0, i, canvasOrig.width, i, cmLineWidth, cmLineColor);
        } else {
            rulerContext.lineTo(rulerWidth - mmMarkingHeight, j);
            drawGridLine(0, i, canvasOrig.width, i, mmLineWidth, mmLineColor);
        }
    }
    rulerContext.stroke();
}

function drawGridLine(x1, y1, x2, y2, lineWidth, color) {
    contextOrig.lineWidth = (lineWidth == undefined) ? 1 : lineWidth;
    contextOrig.strokeStyle = (color == undefined) ? "#E5E5E5" : color;
    contextOrig.beginPath();
    contextOrig.moveTo(x1, y1);
    contextOrig.lineTo(x2, y2);
    contextOrig.stroke();
}

function drawAllObjects() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    contextOrig.clearRect(0, 0, canvasOrig.width, canvasOrig.height);
    drawRuler();

    for (var i = 0; i < drawElements.length; i++) {
        drawObjectOnCanvas(drawElements[i]);
    }

    for (var i = 0; i < drawElements.length; i++) {
        drawWiresOnCanvas(drawElements[i]);
    }
    drawScaleFactorDetails();
    drawZoomFactorDetails();
}

function drawObjectOnCanvas(obj) {
    var x, y, w, h;
    var pointsArr;
    var curZoom = this.zoom;
    var tmpPointsArr = new Array();

    if (obj.getType() == ObjectType.CONT_WALL) {
        pointsArr = obj.getVerticesArr();

        $(pointsArr).each(function (i, e) {
            tmpPointsArr.push({x: e.x * curZoom, y: e.y * curZoom});
        });
    } else {
        sX = obj.getObjStartX() * curZoom;
        sY = obj.getObjStartY() * curZoom;
        eX = obj.getObjEndX() * curZoom;
        eY = obj.getObjEndY() * curZoom;
    }

    if (toolAction == ToolActionEnum.SCALE || toolAction == ToolActionEnum.DRAG) {
        drawOutlinesOnCanvas(obj);
    }

    if (obj.getStatus() == ObjectStatus.SCALE) {
        drawObjectScalerOnCanvas(obj);
    }
}







