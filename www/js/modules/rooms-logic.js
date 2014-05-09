$(document).on("pageinit", "#rooms", function () {
	$("div[data-role='campusmenu']").campusmenu({ onChange: updateRoomData });
	$("div[data-role='timeselection']").timeselection({ onChange: updateTimeData });
});

$(document).on("pageshow", "#rooms", function () {
	$("div[data-role='campusmenu']").campusmenu("pageshow");
	$("div[data-role='timeselection']").timeselection("pageshow");
});

$(function() {
	$.widget("up.timeselection", {
		options: {
			onChange: function(bounds) {}
		},
		
		_create: function() {
			// create html code
			this.element.append(
				'<div data-role="controlgroup"> \
					<h3>Zeitraum:</h3> \
					<div data-role="navbar" id="timeNavbar"> \
						<ul> \
							<li><a href="#now" class="time-menu ui-btn-active" id="radioNow" data-template="Jetzt (%02d:%02d-%02d:%02d)">Jetzt</a></li> \
							<li><a href="#then" class="time-menu" id="radioNext" data-template="Demnächst (%02d:%02d-%02d:%02d)">Demnächst</a></li> \
						</ul> \
					</div> \
				</div>');
			this.element.trigger("create");
			
			// Set current time values in radio labels
			var template = $("#radioNow").attr("data-template");
			
			var now = new Date();
			var centered = this._upperAndLowerDate(now);
			var upper = centered.upper;
			var lower = centered.lower;
			var label = _.sprintf(template, lower.getHours(), lower.getMinutes(), upper.getHours(), upper.getMinutes());
			
			$("#radioNow").text(label);
			$("#radioNow").attr("data-timestamp", now.toISOString());
			
			var template = $("#radioNext").attr("data-template");
			
			now.setHours(now.getHours() + 2);
			centered = this._upperAndLowerDate(now);
			upper = centered.upper;
			lower = centered.lower;
			label = _.sprintf(template, lower.getHours(), lower.getMinutes(), upper.getHours(), upper.getMinutes());
			
			$("#radioNext").text(label);
			$("#radioNext").attr("data-timestamp", now.toISOString());
			
			var widgetHost = this;
			$(".time-menu").bind("click", function (event) {
				var bounds = widgetHost._retreiveActiveBounds($(this));
				widgetHost.options.onChange({ from: bounds.lower, to: bounds.upper });
				
				// For some unknown reason the usual tab selection code doesn't provide visual feedback, so we have to use a custom fix
				widgetHost._fixActiveTab($(this), event);
			});
		},
		
		_destroy: function() {
		},
		
		_setOption: function(key, value) {
			this._super(key, value);
		},
		
		pageshow: function() {
//			var bounds = this._retreiveActiveBounds($(".ui-btn-active", this));
//			this.options.onChange({ from: bounds.lower, to: bounds.upper });
		},
		
		_upperAndLowerDate: function(center) {
			var lowerHour = center.getHours() - (center.getHours() % 2);
			var upperHour = lowerHour + 2;
			
			var lower = new Date(center.getFullYear(), center.getMonth(), center.getDate(), lowerHour, 0, 0, 0);
			var upper = new Date(center.getFullYear(), center.getMonth(), center.getDate(), upperHour, 0, 0, 0);
			return {upper: upper, lower: lower};
		},
		
		_retreiveActiveBounds: function(activeElement) {
			var timestamp = activeElement.attr("data-timestamp");
			var time = new Date(timestamp);
			return this._upperAndLowerDate(time);
		},
		
		getActive: function() {
			var activeId = $(".ui-btn-active", this.element).attr("id");
			var bounds = this._retreiveActiveBounds($("#" + activeId));
			return { from: bounds.lower, to: bounds.upper };
		},
		
		_fixActiveTab: function(target, event) {
			event.preventDefault();
			$(".time-menu", this.element).removeClass("ui-btn-active");
			target.addClass("ui-btn-active");
		}
	});
});

function selector(li) {
	var house = li.attr("data-house");
	return "Haus " + house;
};

var FreeRooms = Backbone.Model.extend({
	
	mapToId: function(campusName) {
		var campusId;
		if (campusName === "griebnitzsee") {
			campusId = 3;
		} else if (campusName === "neuespalais") {
			campusId = 1;
		} else {
			campusId = 2;
		}
		return campusId
	},
	
	loadFreeRooms: function(filter) {
		var campus = this.mapToId(filter.campus);
		var building = filter.building;
		var startTime = filter.startTime;
		var endTime = filter.endTime;
		
		var request = "http://usb.soft.cs.uni-potsdam.de/roomsAPI/1.0/rooms4Time?format=json&startTime=%s&endTime=%s&campus=%d";
		if (building) {
			request = request + "&building=%s";
		}
		request = _.sprintf(request, encodeURIComponent(startTime.toISOString()), encodeURIComponent(endTime.toISOString()), campus, building);
		
		headers = { "Authorization": getAuthHeader() };
		$.ajax({
			url: request,
			headers: headers
		}).done(this.requestSuccess(filter)).fail(this.requestFail);
	},
	
	requestSuccess: function(filter) {
		var modelHost = this;
		return function(result) {
			var rooms = result["rooms4TimeResponse"]["return"];
			rooms = _.chain(rooms)
						.map(modelHost.parseFreeRoom)
						.map(function(room) { return _.extend(room, { startTime: filter.startTime.toISOString() }); })
						.map(function(room) { return _.extend(room, { endTime: filter.endTime.toISOString() }); })
						.groupBy("house")
						.value();
			
			modelHost.set({rooms: rooms});
		};
	},
	
	requestFail: function(error) {
		alert("Daten nicht geladen");
	},
	
	/*
	 * Code taken from http://area51-php.erstmal.com/rauminfo/static/js/ShowRooms.js?cb=1395329676756 with slight modifications
	 */
	parseFreeRoom: function(room_string) {
        var room_match = room_string.match(/^([^\.]+)\.([^\.]+)\.(.+)/);
		
		var room = {};
        if (room_match) {
            room.campus = room_match[1];
            room.house = parseInt(room_match[2], 10);
            room.room = room_match[3];
        } else {
			room.raw = room_string;
		}
		return room;
    }
});

var RoomDetailsModel = Backbone.Model.extend({
	
	loadRoomDetails: function(room) {
		this.set({room: room});
		
		// Set start and end time
		var startTime = new Date(room.startTime);
		startTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 0, 0, 0, 0);
		startTime = startTime.toISOString();
		var endTime = new Date(room.endTime);
		endTime = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate() + 1, 0, 0, 0, 0);
		endTime = endTime.toISOString();
		
		// Debug: Other start and end time
		// startTime = new Date(2010, 1, 0, 0, 0, 0, 0).toISOString();
		// endTime = new Date(2020, 1, 0, 0, 0, 0, 0).toISOString();
		
		var request = "http://usb.soft.cs.uni-potsdam.de/roomsAPI/1.0/reservations4Room?format=json&startTime=%s&endTime=%s&campus=%s&building=%s&room=%s";
		request = _.sprintf(request, encodeURIComponent(startTime), encodeURIComponent(endTime), encodeURIComponent(room.campus), encodeURIComponent(room.house), encodeURIComponent(room.room));
		headers = { "Authorization": getAuthHeader() };
		$.ajax({
			url: request,
			headers: headers
		}).done(this.showRoomDetailsSuccess()).fail(this.showRoomDetailsFail());
	},
	
	showRoomDetailsSuccess: function() {
		var modelHost = this;
		return function(data) {
			if (typeof data.reservations4RoomResponse === "object") {
				// The response is non-empty
				var reservations = data.reservations4RoomResponse["return"];
				
				if (Array.isArray(reservations)) {
					reservations = _.map(reservations, modelHost.parseDates);
				} else {
					reservations = [modelHost.parseDates(reservations)];
				}
				
				modelHost.set({reservations: reservations});
			}
		};
	},
	
	parseDates: function(room) {
		var result = {};
		result.startTime = new Date(room.startTime);
		result.endTime = new Date(room.endTime);
		result.persons = room.personList;
		result.title = room.veranstaltung;
		return result;
	},
	
	showRoomDetailsFail: function() {
		var modelHost = this;
		return function() {
			modelHost.trigger("change");
		};
	}
});

var RoomsOverview = Backbone.View.extend({
	
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
	},
	
	render: function() {
		$("#roomsDetailsHint").hide();
		$("#roomsOverviewHint").show();
		
		var host = this.$el;
		host.empty();
		
		// Create and add html
		var createRooms = rendertmpl('rooms');
		var htmlDay = createRooms({rooms: this.model.get("rooms")});
		host.append(htmlDay);
		
		// Refresh html
		host.trigger("create");
		
		$("a", host).bind("click", function(event) {
			event.preventDefault();
			
			var href = $(this).attr("href");
			var roomDetails = new URI(href).search(true).room;
			if (roomDetails) {
				var room = JSON.parse(roomDetails);
				showRoomDetails(room);
			}
		});
	}
});

var RoomDetailsView = Backbone.View.extend({
	
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
	},
	
	render: function() {
		$("#roomsOverviewHint").hide();
		$("#roomsDetailsHint").show();
		
		var host = this.$el;
		host.empty();
		
		// Create and add html
		var createDetails = rendertmpl('roomDetails');
		var htmlDay = createDetails({reservations: this.model.get("reservations"), room: this.model.get("room")});
		host.append(htmlDay);
		
		// Refresh html
		host.trigger("create");
	}
});

function updateTimeData(bounds) {
	var campus = $("div[data-role='campusmenu']").campusmenu("getActive");
	updateRoom(campus, bounds);
}

function updateRoomData(campus) {
	var timeBounds = $("div[data-role='timeselection']").timeselection("getActive");
	updateRoom(campus.campusName, timeBounds);
}

function showRoomDetails(room) {
	currentView && currentView.remove();
	var div = $("<div></div>").appendTo("#roomsHost");
	
	var roomDetails = new RoomDetailsModel;
	currentView = new RoomDetailsView({el: div, model: roomDetails});
	
	roomDetails.loadRoomDetails(room);
}

var lastRoomsCampus = undefined;
var currentView = undefined;

function updateRoom(campusName, timeBounds) {
	lastRoomsCampus = campusName;
	currentView && currentView.remove();
	var div = $("<div></div>").appendTo("#roomsHost");
	
	var roomsModel = new FreeRooms;
	currentView = new RoomsOverview({el: div, model: roomsModel});
	
	roomsModel.loadFreeRooms({campus: campusName, startTime: timeBounds.from, endTime: timeBounds.to});
}

function roomsReset() {
	$("div[data-role='campusmenu']").campusmenu("changeTo", lastRoomsCampus);
}
