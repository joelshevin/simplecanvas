//Contains controllers for save, zoom and load functions

$(document).on("ready", function() {


    $('#elements').hide();

    $('#scale').click(function () {
        toolAction = ToolActionEnum.SCALE;
        document.getElementsByTagName("body")[0].style.cursor = "auto";
    });

    $('#print-btn').click(function () {
        printCanvas();
    }); 

});


$(function () {
    $('#print').click(function () {
        window.print();
    });

    /* Saves the current drawing to the file specified */
    $('#save').click(function () {
        var saveData = {
            metaData: {scaleFactor: scaleFactor},
            objectData: drawElements
        }

        console.log(saveData);


        var fileName = $('#file_name').val();

        if (fileName != "") {
            $.ajax({
                type: 'POST',
                url: 'file_save.php',
                data: 'file_name=' + $('#file_name').val() + '&file_data=' + JSON.stringify(saveData),
                success: function (msg) {
                    alert(msg);
                    // showLoadableFiles();
                },
                error: function () {
                    alert('Network Error!');
                }
            });
        } else {
            alert('Please enter a file name');
        }
    });

    $('#loadable_files').on('click', 'a', function () {
        var fileName = $(this).attr('data-file-name');
        loadSavedFile(fileName);
    });

    /* Zoom in and out control */
    $('.zoom-control').click(function () {
        var action = $(this).attr('data-action');

        switch (action) {
            case 'zoom-in':
                zoomIn();
                break;
            case 'zoom-out':
                zoomOut();
                break;
            case 'zoom-reset':
                zoomReset();
                break;
            default:
                alert('Invalid zoom option');
        }
    });


    /* Scale up,down,reset control */
    $('.scale-control').click(function () {
        var action = $(this).attr('data-action');

        switch (action) {
            case 'scale-up':
                scaleUp();
                break;
            case 'scale-down':
                scaleDown();
                break;
            case 'scale-reset':
                scaleReset();
                break;
            default:
                alert('Invalid scale option');
        }
    });
});

/* Load a saved file */
function loadSavedFile(fileName) {
    $.ajax({
        type: 'POST',
        url: 'load_drawing.php',
        data: 'file_name=' + fileName,
        success: function (msg) {
            var fileDetails = JSON.parse(msg);

            clearDrawElements();

            var metaData = fileDetails.metaData;
            scaleFactor = metaData.scaleFactor;
            var objectData = fileDetails.objectData;

            $(objectData).each(function (i, e) {
                generateAndLoadObjectFromParams(e);
            });

            rePopulateConnectedBulbs();

            drawAllObjects();
        }
    });
}

/* Loads already saved files */
function showLoadableFiles() {
    $.ajax({
        type: 'POST',
        url: 'get_file_list.php',
        data: "",
        success: function (msg) {
            var files = jQuery.parseJSON(msg);
            var fileNames = [];

            $(files).each(function (i, e) {
                fileNames.push("<li><a href='#' class='load_file' data-file-name='" + e + "'>" + e + "</a></li>");
            });
            $('#loadable_files').html('');
            $('#loadable_files').append(fileNames.join(""));
        },
        error: function () {
            alert('Error loading files. Network Error!');
        }
    });
}

function printCanvas()
{
    var dataUrl = document.getElementById('draw-tool-canvas').toDataURL();
    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Drawing</title></head>';
    windowContent += '<body>'
    windowContent += '<img src="' + dataUrl + '">';
    windowContent += '</body>';
    windowContent += '</html>';
    var printWin = window.open('','','width=600,height=300');
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
}




