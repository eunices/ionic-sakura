import document from "document";
import { preferences } from "user-settings";

import clock from "clock";                     // clock
import { display } from "display";             // display on/ off
import { HeartRateSensor } from "heart-rate";  // heart rate
import { me as appbit } from "appbit";         // user permissions
import { today } from "user-activity";         // today's stats

import * as util from "../common/utils";


// CLOCK ----------------------------------------------------------
// Update the clock every minute
clock.granularity = "seconds";

// Get a handle on the <text> element
const myClock = document.getElementById("myClock");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
	let today = evt.date;
	let hours = today.getHours();
	if (preferences.clockDisplay === "12h") {
		// 12h format
		hours = hours % 12 || 12;
	} else {
		// 24h format
		hours = util.monoDigits(hours);
	}
	let mins = util.monoDigits(today.getMinutes());
	let sec = util.monoDigits(today.getSeconds());
	myClock.text = `${hours}:${mins}:${sec}`;
}


// HEART RATE ---------------------------------------------------
const myHeartRate = document.getElementById("myHeartRate");

if (HeartRateSensor) {
	const hrm = new HeartRateSensor();
	hrm.addEventListener("reading", () => {
		myHeartRate.text = `${util.zeroPad(hrm.heartRate)}`;
		console.log(`Current heart rate: ${hrm.heartRate}`);
	});
	display.addEventListener("change", () => {
		
		// Automatically stop the sensor when the screen is off to conserve battery
		display.on ? hrm.start() : hrm.stop();	
	});
	hrm.start();
}




// STEPS, DISTANCE -------------------------------------------------
const mySteps = document.getElementById("mySteps");
const myDistance = document.getElementById("myDistance");

if (appbit.permissions.granted("access_activity")) {
	let steps = today.adjusted.steps;
	let distance = today.adjusted.distance/1000;

	mySteps.text = `${steps}`;
	myDistance.text = `${distance} km`;

	console.log(`${steps} steps`);
	console.log(`${distance} km`);
 }