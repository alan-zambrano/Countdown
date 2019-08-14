let TIMER_ID = null;
let CLOCK_HOURS;
let CLOCK_MINUTES;
let CLOCK_SECONDS;

function startCountdown(hours, minutes, seconds){
	//Pad minutes, hours, and seconds with zeros if necessary
	CLOCK_HOURS = hours < 10 ? "0" + hours : hours;
	CLOCK_MINUTES = minutes < 10 ? "0" + minutes : minutes;
	CLOCK_SECONDS = seconds < 10 ? "0" + seconds : seconds;

	//format and print the time
	let combined = CLOCK_HOURS + ":" + CLOCK_MINUTES + ":" + CLOCK_SECONDS;
	$("#clock").html(combined);

	CLOCK_HOURS = parseInt(CLOCK_HOURS);
	CLOCK_MINUTES = parseInt(CLOCK_MINUTES);
	CLOCK_SECONDS = parseInt(CLOCK_SECONDS);

	//change time for the next iteration
	let nextSeconds = CLOCK_SECONDS - 1;
	let nextMinutes = CLOCK_MINUTES;
	let nextHours = CLOCK_HOURS;

	if(nextSeconds < 0){
		nextSeconds += 60;
		nextMinutes -= 1;
		if(nextMinutes < 0){
			nextMinutes += 60;
			nextHours -= 1;
			if(nextHours < 0){
				TIMER_ID = null;
				return;
			}
		}
	}

	TIMER_ID = setTimeout(startCountdown, 1000, nextHours, nextMinutes, nextSeconds);
}

function resumeClock(){
/*
	currTime = $("#clock").html();
	currTime = currTime.split(":");

	let hours = parseInt(currTime[0]);
	let minutes = parseInt(currTime[1]);
	let seconds = parseInt(currTime[2]);
*/	
	startCountdown(CLOCK_HOURS, CLOCK_MINUTES, CLOCK_SECONDS);

	$("#fresume").attr("disabled", true);
}

function pauseClock(){
	if(TIMER_ID == null)
		return;

	clearTimeout(TIMER_ID);
	TIMER_ID = null;
	$("#fresume").attr("disabled", false);
}

function checkValidInput(time){
	if(time == "")
		return "0";
	else if(time > 60)
		return 60;
	else if(time < 0)
		return 0;
	else
		return time;
}

function startClock(){
	//if a timer exists, kill it and start a new one
	if(TIMER_ID){
		clearTimeout(TIMER_ID);
		TIMER_ID = null;
	}

	let CLOCK_HOURS = checkValidInput($("#fhours").val());
	let CLOCK_MINUTES = checkValidInput($("#fminutes").val());
	let CLOCK_SECONDS = checkValidInput($("#fseconds").val());

	startCountdown(CLOCK_HOURS, CLOCK_MINUTES, CLOCK_SECONDS);
}

function main(){
	$("#fstart").click(startClock);
	$("#fpause").click(pauseClock);
	$("#fresume").click(resumeClock);
	
}
$(document).ready(function(){
	main();
});
