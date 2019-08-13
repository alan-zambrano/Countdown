let TIMER_ID = null;

function startCountdown(hours, minutes, seconds){
	//Pad minutes, hours, and seconds with zeros if necessary
	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;

	//format and print the time
	let combined = hours + ":" + minutes + ":" + seconds;
	$("#clock").html(combined);

	//change time for the next iteration
	seconds -= 1;
	if(seconds < 0){
		seconds += 60;
		minutes -= 1;
		if(minutes < 0){
			minutes += 60;
			hours -= 1;
			if(hours < 0){
				return;
			}
		}
	}

	TIMER_ID = setTimeout(startCountdown, 1000, parseInt(hours), parseInt(minutes), parseInt(seconds));
}

function pauseClock(){
	if(TIMER_ID == null)
		return;

	clearTimeout(TIMER_ID);
	TIMER_ID = null;
	$("#fresume").attr("disabled", false);
}

function resumeClock(){
	currTime = $("#clock").html();
	currTime = currTime.split(":");

	let hours = parseInt(currTime[0]);
	let minutes = parseInt(currTime[1]);
	let seconds = parseInt(currTime[2]);
	
	startCountdown(hours, minutes, seconds);

	$("#fresume").attr("disabled", true);
}

function startClock(){
	//if a timer exists, kill it and start a new one
	if(TIMER_ID){
		clearTimeout(TIMER_ID);
		TIMER_ID = null;
	}

	let hours = $("#fhours").val();
	let minutes = $("#fminutes").val();
	let seconds = $("#fseconds").val();
	console.log(hours, minutes, seconds);
	if(hours == "")
		hours = "0";
	if(minutes == "")
		minutes = "0";
	if(seconds == "")
		seconds = "0";
	startCountdown(hours, minutes, seconds);
}
function main(){
	$("#fstart").click(startClock);
	$("#fpause").click(pauseClock);
	$("#fresume").click(resumeClock);
	
}
$(document).ready(function(){
	main();
});
