// Handle schema upgrades

function getId(url) {
	return "TaskMatrixData-" + url;
}

function upgradeSchema(url, data) {
	var latestVersion = 2;

    if (typeof data === 'undefined') {
        return initModel(url, latestVersion);
    } else {

        console.log("restored state");

        if (!data.taskCategories) {
            return initModel(url, latestVersion);
        }

		/*switch(data.version) {
		case 1:
			data._id = "TaskMatrixData-" + url;
		default:
			data.version = latestVersion;
		}*/
    }
}

function initModel(url, latestVersion) {
    return {
        _id: getId(url),

        version: latestVersion,

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
