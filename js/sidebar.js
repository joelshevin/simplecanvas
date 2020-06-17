//sidebar animations and transitions
$(document).ready(function() {

	$("#menu-site-bar").draggable();
	$("#menu-site-bar").draggable("disable");

	$(".main-lab").mouseup(function() {
		$("#menu-site-bar").draggable("disable");
	});


	$("#minimize-btn").on("click", function() {
		$("#d-area").slideToggle();
	});

	$(".main-lab").mousedown("click", function() {
		$("#menu-site-bar").draggable("enable");
	});


	$("#e-btn").on("click", function() {
		$("#e-item-div").slideToggle();

		var btn_e = $(this);
		var itemheading = btn_e.parent();

		if($("#e-btn").text() == "+") {
			$("#e-btn").html("-");
			itemheading.removeClass("close").addClass("open");
		} else {
			$("#e-btn").html("+");
			itemheading.removeClass("open").addClass("close");
		}
	});


});