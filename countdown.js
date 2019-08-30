let TIMER_ID = null;
let CLOCK_HOURS;
let CLOCK_MINUTES;
let CLOCK_SECONDS;
let INTERVAL_NODE;


function nonzeroInterval(){
	return checkValidInput(INTERVAL_NODE.children(".iHours").val()) != "0" ||
		   checkValidInput(INTERVAL_NODE.children(".iMinutes").val()) != "0" ||
		   checkValidInput(INTERVAL_NODE.children(".iSeconds").val()) != "0";
}

function getNextInterval(){
	//find the next valid time interval
	for(INTERVAL_NODE = INTERVAL_NODE.next(); INTERVAL_NODE.length != 0; INTERVAL_NODE = INTERVAL_NODE.next()){
		if(checkValidInput(INTERVAL_NODE.children(".iHours").val()) != "0" ||
		   checkValidInput(INTERVAL_NODE.children(".iMinutes").val()) != "0" ||
		   checkValidInput(INTERVAL_NODE.children(".iSeconds").val()) != "0"){
			return true;
		}
	}
	//no further intervals exist
	return false;
}
function printClock(str){
	$("#clock").html(str);
}
function startCountdown(hours, minutes, seconds){
	//Pad minutes, hours, and seconds with zeros if necessary
	CLOCK_HOURS = hours < 10 ? "0" + hours : hours;
	CLOCK_MINUTES = minutes < 10 ? "0" + minutes : minutes;
	CLOCK_SECONDS = seconds < 10 ? "0" + seconds : seconds;

	//update the HTML
	$("#clock").html(CLOCK_HOURS + ":" + CLOCK_MINUTES + ":" + CLOCK_SECONDS);

	//casting to int to preserve formatting
	CLOCK_HOURS = parseInt(CLOCK_HOURS);
	CLOCK_MINUTES = parseInt(CLOCK_MINUTES);
	CLOCK_SECONDS = parseInt(CLOCK_SECONDS);

	//change time for the next iteration
	CLOCK_SECONDS--;

	//percolate up from seconds, updating minutes and hours
	if(CLOCK_SECONDS < 1){
		CLOCK_SECONDS += 60;
		CLOCK_MINUTES -= 1;
		if(CLOCK_MINUTES < 0){
			CLOCK_MINUTES += 60;
			CLOCK_HOURS -= 1;
			if(CLOCK_HOURS < 0){
				//when time's up, move to the next valid interval, update clock
				if(getNextInterval()){
					CLOCK_HOURS = checkValidInput(INTERVAL_NODE.children(".iHours").val());
					CLOCK_MINUTES = checkValidInput(INTERVAL_NODE.children(".iMinutes").val());
					CLOCK_SECONDS = checkValidInput(INTERVAL_NODE.children(".iSeconds").val());
				}
				else{
					setTimeout(printClock, 1000, "00:00:00");
					TIMER_ID = null;
					return;
				}
			}
		}
	}
	TIMER_ID = setTimeout(startCountdown, 1000, CLOCK_HOURS, CLOCK_MINUTES, CLOCK_SECONDS);
}

function resumeClock(){
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

//checks for:
// empty string
// values outside of valid range (0-60)
function checkValidInput(time){
	if(time == "")
		return 0;
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
	//sets INTERVAL_NODE to the first interval
	INTERVAL_NODE = $("#intervalTop").children().first();
	if(!nonzeroInterval()) getNextInterval();

	//sets global time to that in the first hr/min/sec textbox interval
	CLOCK_HOURS = checkValidInput(INTERVAL_NODE.children(".iHours").val());
	CLOCK_MINUTES = checkValidInput(INTERVAL_NODE.children(".iMinutes").val());
	CLOCK_SECONDS = checkValidInput(INTERVAL_NODE.children(".iSeconds").val());
	
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
