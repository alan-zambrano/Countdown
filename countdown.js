let TIMER_ID = null;
let INTERVAL_NODE;

//Class to hold the current time
//@hours, @minutes, @seconds - Integer value used to represent the time
class Clock{
	constructor(iHours, iMinutes, iSeconds){
		this.hours = parseInt(iHours);
		this.minutes = parseInt(iMinutes);
		this.seconds = parseInt(iSeconds);
	}

	//returns the current time as a string. Automatically pads single digits with
	// the appropriate number of zeros i.e. 1 becomes 01
	get time(){
		//pad single digit numbers with zeros
		let stringHours = this.hours < 10 ? "0" + this.hours: this.hours;
		let stringMinutes = this.minutes < 10 ? "0" + this.minutes: this.minutes;
		let stringSeconds = this.seconds < 10 ? "0" + this.seconds: this.seconds;
		return stringHours + ":" + stringMinutes + ":" + stringSeconds;
	}

	//Checks for input to be within range [0-60] and not the empty string, then
	// sets @hours, @minutes, and @seconds
	setTime(iHours, iMinutes, iSeconds){
		this.hours = checkValidInput(iHours);
		this.minutes = checkValidInput(iMinutes);
		this.seconds = checkValidInput(iSeconds);
	}

	//calculates the current time - 1 second, then returns the Clock object
	decrement(){
		if(this.seconds > 0){
			this.seconds--;
		}
		else if(this.minutes > 0){
			this.minutes--;
			this.seconds += 59;
		}
		else if(this.hours > 0){
			this.hours--;
			this.minutes += 59;
			this.seconds += 59;
		}
		else{
			return null;
		}

		return this;
	}
}

let CLOCK = new Clock();

//checks for:
// empty string
// values outside of valid range [0-59]
function checkValidInput(time){
	if(time == "")
		return 0;
	else if(time >= 60)
		return 60;
	else if(time <= 0)
		return 0;
	else
		return time;
}

function highlightInterval(){
	$(".intervalInput").css("background-color", "green");
	INTERVAL_NODE.css("background-color", "magenta");
}
//Points INTERVAL_NODE to the next interval if it exists
//returns- true if the interval exists
// false otherwise.
function getNextInterval(){
	//find the next valid time interval
	for(INTERVAL_NODE = INTERVAL_NODE.next(); INTERVAL_NODE.length != 0; INTERVAL_NODE = INTERVAL_NODE.next()){
		if(checkValidInput(INTERVAL_NODE.children(".iHours").val()) != "0" ||
		   checkValidInput(INTERVAL_NODE.children(".iMinutes").val()) != "0" ||
		   checkValidInput(INTERVAL_NODE.children(".iSeconds").val()) != "0"){
			highlightInterval();
			return true;
		}
	}
	//no further intervals exist
	return false;
}
//updates the html of the clock to match @str
function printClock(str){
	$("#clock").html(str);
}

//recursively calls itself with setTimeout to count down.
//Uses the global CLOCK to keep track of time
function startCountdown(){
	//this prevents the clock from counting down to zero and waiting for another
	//second before updating to the next interval
	if(CLOCK.time == "00:00:00"){
		//point INTERVAL_NODE to the next valid interval if it exists
		if(getNextInterval() == false){
			//point back to the first interval if user has opted to restart when finished
			if($("#frestart").prop('checked')){
				startClock();
				return;
			}
			//time's up
			else{
				printClock("00:00:00");
				TIMER_ID = null;
				return;
			}
		}
		else{
			//if we find a nonempty interval, when time's up, reset time
			CLOCK.setTime(INTERVAL_NODE.children(".iHours").val(),
						  INTERVAL_NODE.children(".iMinutes").val(),
						  INTERVAL_NODE.children(".iSeconds").val());
		}
	}

	//write to HTML
	printClock(CLOCK.time);

	TIMER_ID = setTimeout(function(){
		CLOCK.decrement();
		startCountdown();
	}, 1000);
}

function resumeClock(){
	startCountdown();

	$("#fresume").attr("disabled", true);
}

function pauseClock(){
	if(TIMER_ID == null)
		return;

	clearTimeout(TIMER_ID);
	TIMER_ID = null;
	$("#fresume").attr("disabled", false);
}



function startClock(){
	//if a timer exists, kill it and start a new one
	if(TIMER_ID){
		clearTimeout(TIMER_ID);
		TIMER_ID = null;
	}
	//sets INTERVAL_NODE to the first time interval
	INTERVAL_NODE = $("#intervalTop").children().first();

	highlightInterval();

	//gets time from input box in html
	CLOCK.setTime(INTERVAL_NODE.children(".iHours").val(),
				 INTERVAL_NODE.children(".iMinutes").val(),
				 INTERVAL_NODE.children(".iSeconds").val());

 	//prevents infinite recursion for all empty intervals
 	if(CLOCK.time == "00:00:00" && getNextInterval() == false) return;

	CLOCK.setTime(INTERVAL_NODE.children(".iHours").val(),
				 INTERVAL_NODE.children(".iMinutes").val(),
				 INTERVAL_NODE.children(".iSeconds").val());
	startCountdown();
}

function main(){
	$("#fstart").click(startClock);
	$("#fpause").click(pauseClock);
	$("#fresume").click(resumeClock);
}

$(document).ready(function(){
	main();
});
