// Canned functionality for JIRA Vacation
$(function() {
 "use strict";

 // Get parameters from query string
 // and stick them in an object
 function getQueryParams(qs) {
	 qs = qs.split("+").join(" ");

	 var params = {}, tokens,
		 re = /[?&]?([^=]+)=([^&]*)/g;

	 while (tokens = re.exec(qs)) {
		 params[decodeURIComponent(tokens[1])] =
			 decodeURIComponent(tokens[2]);
	 }

	 return params;
 }
 
 function timeFormat(fullTimeInSeconds) {
	 var result = "";
	 if (fullTimeInSeconds < 0) {
		fullTimeInSeconds = -fullTimeInSeconds;
		result = "-";
	 }
	 var timeInHours = Math.floor(fullTimeInSeconds/3600);
	 var timeInMinutes = Math.floor(fullTimeInSeconds/60 - timeInHours*60);
	 var timeInHoursStr = "";
	 var timeInMinutesStr = "";
	 
	 if (timeInHours > 0)
		 timeInHoursStr = timeInHours+"h ";
	 if (timeInMinutes > 0)
		 timeInMinutesStr = timeInMinutes+"m";
	 result += timeInHoursStr+timeInMinutesStr;
	 if (result == "" || result == "-")
		 result = "0";
	 return result;
 }

 AP.define('JiraVacation', {
	 buildProjectTable: function(users, selector) {

		 var params = getQueryParams(document.location.search);
		 var baseUrl = params.xdm_e + params.cp;

		 function buildTableAndReturnTbody(hostElement) {
			 var projTable = hostElement.append('table')
				 .classed({'project': true, 'aui': true});

			 // table > thead > tr, as needed below
			 var projHeadRow = projTable.append("thead").append("tr");
			 // Empty header
			 projHeadRow.append("th");
			 // Now for the next column
			 projHeadRow.append("th").text("Name");
			 projHeadRow.append("th").text("Work Time");
			 projHeadRow.append("th").text("Sick Gained");
			 projHeadRow.append("th").text("Sick Used");
			 projHeadRow.append("th").text("Sick Balance");
			 projHeadRow.append("th").text("Vacation Gained");
			 projHeadRow.append("th").text("Vacation Used");
			 projHeadRow.append("th").text("Vacation Balance");

			 return projTable.append("tbody");
		 }

		 var projectBaseUrl = baseUrl + "/browse/";

		 var rootElement = d3.select(selector);
		 var projBody = buildTableAndReturnTbody(rootElement);

		 // For each data item in users
		 var row = projBody.selectAll("tr")
			 .data(users)
			 .enter()
			 .append("tr");

		 // Add a td for the avatar, stick a span in it
		 row.append("td").append('span')
			 // Set the css classes for this element
			 .classed({'aui-avatar': true, 'aui-avatar-xsmall': true})
			 .append('span')
			 .classed({'aui-avatar-inner': true})
			 .append('img')
			 // Set the atribute for the img element inside this td > span > span
			 .attr('src', function(item) { return item.avatar });
			 
		// Add a td for the project key
		row.append("td").append('span')
			.classed({'project-name': true})
			.append("a")
			// make the name a link to the project
			.attr('href', function(item) { return projectBaseUrl + item.key; })
			// since we're in the iframe, we need to set _top
			.attr('target', "_top")
			.text(function(item) { return item.name; });

		// Add a td for the project key
		row.append("td").append('span')
			.classed({'project-name': true})
			// set the content of the element to be some text
			.text(function(item) { return timeFormat(item.workTime); });
			 
		row.append("td").append('span')
			.classed({'project-name': true})
			// set the content of the element to be some text
			.text(function(item) { return timeFormat(item.sickTimeGained); });
			 
		row.append("td").append('span')
			 .classed({'project-name': true})
			 // set the content of the element to be some text
			 .text(function(item) { return timeFormat(item.sickTimeUsed); });
			 
		row.append("td").append('span')
			 .classed({'project-name': true, "negative-value":true})
			 // set the content of the element to be some text
			 .text(function(item) { return timeFormat(item.sickTimeBalance); });
			 
		row.append("td").append('span')
			.classed({'project-name': true})
			// set the content of the element to be some text
			.text(function(item) { return timeFormat(item.vacationTimeGained); });
			 
		row.append("td").append('span')
			 .classed({'project-name': true})
			 // set the content of the element to be some text
			 .text(function(item) { return timeFormat(item.vacationTimeUsed); });
			 
		row.append("td").append('span')
			 .classed({'project-name': true})
			 // set the content of the element to be some text
			 .text(function(item) { return timeFormat(item.vacationTimeBalance); });
	 }
 });
});