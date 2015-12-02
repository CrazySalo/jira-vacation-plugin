/* add-on script */
// MyAddon functionality
$(function() {
	
	// Call REST API via the iframe
	// Bridge functionality
	// JiraVacation is registered by an external script that was included
	AP.require(['request', 'JiraVacation'], getProjects);
 
 	function getProjects(request, JiraVacation) {
		request({
			url: '/rest/api/2/search?fields=project,worklog',
			success: function(response) {
				// Convert the string response to JSON
				response = JSON.parse(response);
				console.log(response.toSource());
				// Call your helper function to build the
				// table, now that you have the data
				JiraVacation.buildProjectTable(makeData(response), ".users");
			},
			error: function(response) {
				console.log("Error loading API (" + uri + ")");
				console.log(arguments);
			},
			contentType: "application/json"
		});
	}
	
	function makeData(response) {
		
		var users = new Array;
		var year = new Date().getFullYear();
		//console.log(issues.toSource());
		for(var i=0; i<response.issues.length; i++) {
			var issue = response.issues[i];
			//console.log(issue.toSource());
			for(var j=0; j<issue.fields.worklog.worklogs.length; j++) {
				var worklog = issue.fields.worklog.worklogs[j];
				var key = worklog.author.name;
				if (users[key] == null) {
					users[key] = new Object;
					users[key].name = worklog.author.displayName;
					users[key].key = worklog.author.key;
					users[key].avatar = worklog.author.avatarUrls["16x16"];
					users[key].workTime = 0;
					users[key].vacationTimeGained = 0;
					users[key].vacationTimeUsed = 0;
					users[key].vacationTimeBalance = 0;
					users[key].sickTimeGained = 0;
					users[key].sickTimeUsed = 0;
					users[key].sickTimeBalance = 0;
				}
				
				if (issue.fields.project.key == 'SICK') {
					var workYear = new Date(worklog.started).getFullYear();
					if (workYear == year) {
						users[key].sickTimeUsed += worklog.timeSpentSeconds;
					}
				}
				else if (issue.fields.project.key == 'VACATION')
					users[key].vacationTimeUsed += worklog.timeSpentSeconds;
				else {
					users[key].workTime += worklog.timeSpentSeconds;
					var workYear = new Date(worklog.started).getFullYear();
					if (workYear == year) {
						users[key].sickTimeGained += worklog.timeSpentSeconds/workHoursPerSickHour;
					}
				}
			}
		}
		
		var result = [];
		var i = 0;
		for(var key in users) {
			var user = users[key];
			user.vacationTimeGained = user.workTime/workHoursPerVacationHour;
			user.vacationTimeBalance = user.vacationTimeGained - user.vacationTimeUsed;
			user.sickTimeBalance = user.sickTimeGained - user.sickTimeUsed;
			result[i++] = user;
		}
		console.log(users.toSource());
		console.log(result);
		return result;
	}
  
});