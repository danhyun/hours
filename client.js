(function($){
	$(document).ready(function(){
		var picker = $("#picker");
		picker.datepicker({
			dateFormat: "yy-mm-dd"
		});
		
		if (localStorage["weekly.1"]) {
			$(".days").each(function(){
				this.value = localStorage["weekly."+this.id];
			});
		}
		
		var getDailyHoursFromForm = function() {
			var total = 0;
			var week = {
				1: {
					hours: 0
				},
				2: {
					hours: 0
				},
				3: {
					hours: 0
				},
				4: {
					hours: 0
				},
				5: {
					hours: 0
				}
			};
			$("input.days").each(function(){
				week[this.id].hours = Number(this.value);
				localStorage["weekly."+this.id] = Number(this.value);
			});
			return week;
		};
		
		var getDateRangeHours = function(startingDate, dailyHours) {
			var today = startingDate || new Date();
			var totalHours = 0;
			var hourLog = [];
			if (today.getDate() < 16) {
				var start = new Date(today.getFullYear(), today.getMonth(), 1);
				do {
					if (start.getDay() > 0 && start.getDay() < 6) {
						totalHours += dailyHours[start.getDay()].hours;
						hourLog.push({
							date: new Date(start),
							hours: dailyHours[start.getDay()].hours
						});
					}
					start.setDate(start.getDate() + 1);
				} while (start.getDate() < 16);
			} else {
				var start = new Date(today.getFullYear(), today.getMonth(), 16);
				do {
					if (start.getDay() > 0 && start.getDay() < 6) {
						totalHours += dailyHours[start.getDay()].hours;
						hourLog.push({
							date: new Date(start),
							hours: dailyHours[start.getDay()].hours
						});
					}
					start.setDate(start.getDate() + 1);
				} while(start.getMonth() === today.getMonth());
			}
			var returnLog = {
				total: totalHours,
				log: hourLog
			};
			return returnLog;
		};
		
		$("#button").click(function(){
			var week = getDailyHoursFromForm();
			console.log(week);
			
			var startingDate = null; 
			if (picker.val()) {
				startingDate = new Date(picker.val());
			}
			
			var summary = getDateRangeHours(startingDate, week);
			console.log(summary);
			
			var out = $("#out");
			out.empty();
			for (var i = 0; i < summary.log.length; i++) {
				var log = summary.log[i];
				out.append(log.date.toLocaleDateString() + ": " + log.hours + " hours\n");
			}
			out.append("\nTotal hours: " + summary.total);
		});
	});
})(jQuery);