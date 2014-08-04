// Handle schema upgrades

function latestVersion() {
	return 7;
}

function getId(url) {
	return "TaskMatrixData-" + url;
}

function upgradeSchema(url, data) {

    if (typeof data === 'undefined') {
        return initModel(url);
    } else {

        console.log("restored state");

        if (!data.taskCategories) {
            return initModel(url);
        }

		switch(data.version) {
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
			data._id = getId(url);
		default:
			data.version = latestVersion();
		}

		return data;
    }
}

function initModel(url) {
    return {
        _id: getId(url),

        version: latestVersion(),

        taskCategories: {
            urgentImportant: {
                description: "Now",
                tasks: {
                    list: []
                }
            },
            urgent: {
                description: "Delegate",
                tasks: {
                    list: []
                }
            },
            important: {
                description: "Schedule",
                tasks: {
                    list: []
                }
            },
            waste: {
                description: "Waste",
                tasks: {
                    list: []
                }
            }
        }
    };
}
