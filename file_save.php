<?php
	/* Saves file using POST data */
	
	$data  = $_POST['file_data'];
	$fileName = $_POST['file_name'].".png";
	
	$f = fopen("files/".$fileName,"w");
	fwrite($f, $data);
	fclose($f);
	
	echo "File Saved : ".$fileName;
	
	
