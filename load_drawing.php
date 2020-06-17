<?php

	/* Loads a file from POST data and echo */
	$fileName = $_POST['file_name'];

	readfile("files/".$fileName);
