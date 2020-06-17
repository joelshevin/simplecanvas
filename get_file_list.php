<?php 
/* Returns a list of saved file names (in JSON format)*/
$fileNames = [];

foreach (glob("files/*.drf") as $filename) {
    $fileNames [] = substr($filename,6, strlen($filename)-6);
}

echo json_encode($fileNames);