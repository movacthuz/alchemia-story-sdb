var xhr_navigate = null;

function outputImageDescription() {
	$("img").each(function () {
		let alt = $(this).attr("alt");
		if (alt) {
			console.log("Image Description: " + alt);
		}
	});
}

function showLoading(bool = true) {
	if (bool) {
		$(".loading").addClass("shown");
		$("body").css("overflow", "hidden");
	} else {
		$(".loading").removeClass("shown");
		$("body").css("overflow", "auto");
	}
}

function navigate(filename = null, timeout = 500) {
	if (!filename) return false;

	if (xhr_navigate != null) xhr_navigate.abort();

	xhr_navigate = $.ajax({
		type: "GET",
		url: filename + ".html",
		dataType: "html",
		async: true,
		beforeSend: function (e) {
			showLoading(true);
		},
		success: function (e) {
			setTimeout(() => {
				$("#content").html(e);
				$("#content")
					.find("*")
					.addBack()
					.promise()
					.done(function () {
						showLoading(false);
					});
			}, timeout);
		},
		error: function (xhr, status, error) {
			console.error("Error loading content: ", error);
			setTimeout(() => {
				showLoading(false);
			}, timeout);
		},
	});
}

/**
 * Generates a random hexadecimal string of a specified length.
 * @param {number} length - The length of the hexadecimal string to generate.
 * @returns {string} A random hexadecimal string of the specified length.
 */
function generateRandomHex(length) {
	let result = "";
	const characters = "0123456789ABCDEF"; // Hexadecimal characters

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return result;
}

function fetchDatasets(filepath, filters = false) {
	return new Promise((resolve, reject) => {
		fetch(filepath + ".js")
			.then((response) => response.text())
			.then((data) => {
				eval(data);

				let filteredData = datasets;

				if (filters) {
					filteredData = datasets.filter((item) => {
						return Object.keys(filters).every((key) => {
							return item[key] === filters[key];
						});
					});
				}

				resolve(filteredData); // Resolve the Promise with filtered data
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
				reject(error); // Reject the Promise if there's an error
			});
	});
}

/**
 * Init Datatable into your desired namespace, but please declare an empty array variable called datatableArray before using this function
 * @param {string} datatableID - what do you want to call your datatable is
 */
function initDatatable(
	datatableID,
	tableID,
	dataPath = "datasets/example_001"
) {
	datatableArray[datatableID] = $("#" + tableID).DataTable({
		responsive: true,
		processing: true,
		serverSide: false,
		orderCellsTop: true,
		dom:
			'<"row g-2"' +
			'<"col-12 col-sm-6"l><"col-12 col-sm-6"f>' +
			'<"col-12"tr>' +
			'<"col-12 col-sm-6"i><"col-12 col-sm-6"p>' +
			">",
		order: [[0, "asc"]],
		language: {
			searchPlaceholder: "Keyword..",
		},
		columns: [
			{
				name: "no",
			},
			{
				name: "name",
			},
			{
				name: "gender",
			},
			{
				name: "age",
			},
			{
				name: "active",
			},
			{
				name: "wallet",
			},
			{
				name: "arsenal",
			},
			{
				name: "codename",
			},
		],
		drawCallback: function (settings) {
			// draw callback here
		},
	});
}
