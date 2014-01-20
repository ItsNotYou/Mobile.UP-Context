function activeTabFix(target, event) {
	    event.preventDefault();
	    $(".location-menu").removeClass("ui-btn-active");
	    target.addClass("ui-btn-active");
}

	$(document).ready(function () {
	    $.support.cors = true;
	    $.mobile.allowCrossDomainPages = true;
	});
	
	$(document).on("pageinit", "#mensa", function () {
	    $(".location-menu").bind("click", function (event) {
	        var source = $(this);
	        updateMenu(source);
	        
	        // For some unknown reason the usual tab selection code doesn't provide visual feedback, so we have to use a custom fix
	        activeTabFix(source, event);
	    });
	});
	
	$(document).on("pageshow", "#mensa", function () {
	    var source = $(".ui-btn-active");
	    updateMenu(source);
	});
	
	function updateMenu(source) {
	    var targetMensa = source.attr("href");
		var mensa = targetMensa.slice(1);
	
	    Q(clearMenu())
	        .then(function () { return loadMenu(mensa); })
	        .then(function (menu) {
	            var meals = Q(selectMeals(menu))
	                .then(sortMealsByDate)
	
	            var icons = Q(selectIcons(menu))
	                .then(convertToMap);
	
	            return [meals, icons];
	        })
	        .spread(prepareMeals)
	        .then(filterEmptyMeals)
	        .then(drawMeals)
	        .catch(function (e) {
	            console.log("Fehlschlag: " + e.stack);
	            alert("Fehlschlag: " + e.stack);
	        });
	}
	
	function clearMenu() {
	    $("#todaysMenu").empty();
	}
	
	/**
	 * Loads all meals and some meta data for a given mensa.
	 * @param location One of the values ["Griebnitzsee", "NeuesPalais", "Golm"]
	 */
	function loadMenu(location) {
	    var d = Q.defer();
	    var url = "http://usb.soft.cs.uni-potsdam.de/mensaAPI/1.0";
	
	    // If we are not in an app environment, we have to use the local proxy
	    if (navigator.app === undefined) {
	        url = "/usb-services/mensaAPI/1.0";
	    }
		
		headers = { Authorization: "Bearer 44b61d3e121a2e98db3a26bba804a4" };
		$.ajax({
			url: url + "/readCurrentMeals?format=jsons&location=" + location,
			headers: headers
		}).done(d.resolve).fail(d.reject);
	    return d.promise;
	}
	
	function selectIcons(menu) {
	    return menu.readCurrentMealsResponse.meals.iconHashMap.entry;
	}
	
	function convertToMap(icons) {
	    var result = {};
	    for (var index in icons) {
	        var key = icons[index].key;
	        var value = icons[index].value;
	        result[key] = value;
	    }
	    return result;
	}
	
	function selectMeals(menu) {
	    return menu.readCurrentMealsResponse.meals.meal;
	}
	
	function sortMealsByDate(meals) {
	    return meals.sort(function (a, b) {
	        var first = new Date(a.key);
	        var second = new Date(b.key);
	        return first - second;
	    });
	}
	
	function sortByAnzeigeprio(element) {
	    return element.anzeigeprio;
	}
	
	function mapToMeal(icons) {
	    return function (meal) {
	        var mealData = {};
			mealData.contentId = _.uniqueId("id_");
	        mealData.title = meal.title;
	        mealData.description = meal.description;
			
			mealData.prices = {};
			if (meal.prices) {
				mealData.prices.students = meal.prices.student;
				mealData.prices.staff = meal.prices.staff;
				mealData.prices.guests = meal.prices.guest;
			} else {
				mealData.prices.students = "?";
				mealData.prices.staff = "?";
				mealData.prices.guests = "?";
			}
	
	        mealData.ingredients = [];
	        if ($.isArray(meal.type)) {
	            for (var typIndex in meal.type) {
	                mealData.ingredients.push(icons[meal.type[typIndex]]);
	            }
	        } else {
	            mealData.ingredients.push(icons[meal.type]);
	        }
	
	        return mealData;
	    };
	}
	
	/**
	 * Prepare data.
	 * @param meals
	 * @param icons
	 */
	function prepareMeals(meals, icons) {
	    return _.map(meals, mapToMeal(icons));
	}
	
	/**
	 * Filter a meal if its description is empty.
	 * @param days
	 * @returns {Array|*|j.map}
	 */
	function filterEmptyMeals(days) {
	    return _.map(days, function (day) {
	        day.meals = _.filter(day.meals, function (meal) {
	            return meal.description != "";
	        });
	        return day;
	    });
	}
	
	function drawMeals(meals) {
		var createMeals = render('mensa');
		
		// Add day section to html
		var htmlDay = createMeals({meals: meals});
		$("#todaysMenu").append(htmlDay);

		// Tell collapsible set to refresh itself
		$("#todaysMenu").collapsibleset("refresh");

		// Open the first section
		$("#" + meals[0].contentId).trigger('expand');
		
}