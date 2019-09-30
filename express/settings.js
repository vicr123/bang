class Settings {
	constructor() {
		this.settingsObject = {};
	}

	set(key, value) {
		this.settingsObject[key] = value;
	}

	get(key, defaultValue = null) {
		if (this.settingsObject.hasOwnProperty(key)) {
			return this.settingsObject[key];
		} else {
			return this.defaultValue;
		}
	}
}

var applicationSettings = new Settings();
module.exports = applicationSettings;
