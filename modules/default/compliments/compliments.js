/* global Cron */

Module.register("compliments", {
	// Module config defaults.
	defaults: {
		compliments: {
			// Remover mensagens padrão - apenas usar mensagens meteorológicas informativas
			anytime: [],
			morning: [],
			afternoon: [],
			evening: [],
			"....-01-01": ["Feliz ano novo!"]  // Manter apenas mensagem de ano novo
		},
		updateInterval: 30000,
		remoteFile: null,
		remoteFileRefreshInterval: 0,
		fadeSpeed: 4000,
		morningStartTime: 3,
		morningEndTime: 12,
		afternoonStartTime: 12,
		afternoonEndTime: 17,
		random: true,
		specialDayUnique: false,
		
		// Configurações para funcionalidade meteorológica informativa
		weatherAware: true,
		enableWeatherMessages: true,
		enableForecastMessages: true,
		// Configurações de período do dia para mensagens informativas
		morningStartTime: 7,
		morningEndTime: 11,
		middayStartTime: 12,
		middayEndTime: 14,
		afternoonStartTime: 14,
		afternoonEndTime: 17,
		eveningStartTime: 17,
		eveningEndTime: 20,
		nightStartTime: 21,
		nightEndTime: 23,
		lateNightStartTime: 23,
		lateNightEndTime: 7
	},
	urlSuffix: "",
	compliments_new: null,
	refreshMinimumDelay: 15 * 60 * 60 * 1000, // 15 minutes
	lastIndexUsed: -1,
	// Set currentweather from module
	currentWeatherType: "",
	// Propriedades para dados meteorológicos
	weatherData: null,
	forecastData: null,
	cron_regex: /^(((\d+,)+\d+|((\d+|[*])[/]\d+|((JAN|FEB|APR|MA[RY]|JU[LN]|AUG|SEP|OCT|NOV|DEC)(-(JAN|FEB|APR|MA[RY]|JU[LN]|AUG|SEP|OCT|NOV|DEC))?))|(\d+-\d+)|\d+(-\d+)?[/]\d+(-\d+)?|\d+|[*]|(MON|TUE|WED|THU|FRI|SAT|SUN)(-(MON|TUE|WED|THU|FRI|SAT|SUN))?) ?){5}$/i,
	date_regex: "[1-9.][0-9.][0-9.]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])",
	pre_defined_types: ["anytime", "morning", "afternoon", "evening"],
	// Define required scripts.
	getScripts () {
		return ["croner.js", "moment.js"];
	},

	// Define translations
	getTranslations: function() {
		return {
			en: "translations/en.json",
			pt: "translations/pt.json"
		};
	},

	// Define start sequence.
	async start () {
		Log.info(`Starting module: ${this.name}`);

		this.lastComplimentIndex = -1;
		// Inicializar dados meteorológicos
		this.weatherData = null;
		this.forecastData = null;

		if (this.config.remoteFile !== null) {
			const response = await this.loadComplimentFile();
			this.config.compliments = JSON.parse(response);
			this.updateDom();
			if (this.config.remoteFileRefreshInterval !== 0) {
				if ((this.config.remoteFileRefreshInterval >= this.refreshMinimumDelay) || window.mmTestMode === "true") {
					setInterval(async () => {
						const response = await this.loadComplimentFile();
						if (response) {
							this.compliments_new = JSON.parse(response);
						}
						else {
							Log.error(`${this.name} remoteFile refresh failed`);
						}
					},
					this.config.remoteFileRefreshInterval);
				} else {
					Log.error(`${this.name} remoteFileRefreshInterval less than minimum`);
				}
			}
		}
		let minute_sync_delay = 1;
		// loop thru all the configured when events
		for (let m of Object.keys(this.config.compliments)) {
			// if it is a cron entry
			if (this.isCronEntry(m)) {
				// we need to synch our interval cycle to the minute
				minute_sync_delay = (60 - (moment().second())) * 1000;
				break;
			}
		}
		// Schedule update timer. sync to the minute start (if needed), so minute based events happen on the minute start
		setTimeout(() => {
			setInterval(() => {
				this.updateDom(this.config.fadeSpeed);
			}, this.config.updateInterval);
		},
		minute_sync_delay);
	},

	// check to see if this entry could be a cron entry wich contains spaces
	isCronEntry (entry) {
		return entry.includes(" ");
	},

	/**
	 * @param {string} cronExpression The cron expression. See https://croner.56k.guru/usage/pattern/
	 * @param {Date} [timestamp] The timestamp to check. Defaults to the current time.
	 * @returns {number} The number of seconds until the next cron run.
	 */
	getSecondsUntilNextCronRun (cronExpression, timestamp = new Date()) {
		// Required for seconds precision
		const adjustedTimestamp = new Date(timestamp.getTime() - 1000);

		// https://www.npmjs.com/package/croner
		const cronJob = new Cron(cronExpression);
		const nextRunTime = cronJob.nextRun(adjustedTimestamp);

		const secondsDelta = (nextRunTime - adjustedTimestamp) / 1000;
		return secondsDelta;
	},

	/**
	 * Generate a random index for a list of compliments.
	 * @param {string[]} compliments Array with compliments.
	 * @returns {number} a random index of given array
	 */
	randomIndex (compliments) {
		if (compliments.length <= 1) {
			return 0;
		}

		const generate = function () {
			return Math.floor(Math.random() * compliments.length);
		};

		let complimentIndex = generate();

		while (complimentIndex === this.lastComplimentIndex) {
			complimentIndex = generate();
		}

		this.lastComplimentIndex = complimentIndex;

		return complimentIndex;
	},

	/**
	 * Retrieve an array of compliments for the time of the day.
	 * @returns {string[]} array with compliments for the time of the day.
	 */
	complimentArray () {
		const now = moment();
		const hour = now.hour();
		const date = now.format("YYYY-MM-DD");
		let compliments = [];

		// Add time of day compliments
		let timeOfDay;
		if (hour >= this.config.morningStartTime && hour < this.config.morningEndTime) {
			timeOfDay = "morning";
		} else if (hour >= this.config.afternoonStartTime && hour < this.config.afternoonEndTime) {
			timeOfDay = "afternoon";
		} else {
			timeOfDay = "evening";
		}

		if (timeOfDay && this.config.compliments.hasOwnProperty(timeOfDay)) {
			compliments = [...this.config.compliments[timeOfDay]];
		}

		// Add compliments based on weather
		if (this.currentWeatherType in this.config.compliments) {
			Array.prototype.push.apply(compliments, this.config.compliments[this.currentWeatherType]);
			// if the predefine list doesn't include it (yet)
			if (!this.pre_defined_types.includes(this.currentWeatherType)) {
				// add it
				this.pre_defined_types.push(this.currentWeatherType);
			}
		}

		// Add compliments for anytime
		Array.prototype.push.apply(compliments, this.config.compliments.anytime);

		// get the list of just date entry keys
		let temp_list = Object.keys(this.config.compliments).filter((k) => {
			if (this.pre_defined_types.includes(k)) return false;
			else return true;
		});

		let date_compliments = [];
		// Add compliments for special day/times
		for (let entry of temp_list) {
			// check if this could be a cron type entry
			if (this.isCronEntry(entry)) {
				// make sure the regex is valid
				if (new RegExp(this.cron_regex).test(entry)) {
					// check if we are in the time range for the cron entry
					if (this.getSecondsUntilNextCronRun(entry, now.set("seconds", 0).toDate()) <= 1) {
						// if so, use its notice entries
						Array.prototype.push.apply(date_compliments, this.config.compliments[entry]);
					}
				} else Log.error(`compliments cron syntax invalid=${JSON.stringify(entry)}`);
			} else if (new RegExp(entry).test(date)) {
				Array.prototype.push.apply(date_compliments, this.config.compliments[entry]);
			}
		}

		// if we found any date compliments
		if (date_compliments.length) {
			// and the special flag is true
			if (this.config.specialDayUnique) {
				// clear the non-date compliments if any
				compliments.length = 0;
			}
			// put the date based compliments on the list
			Array.prototype.push.apply(compliments, date_compliments);
		}

		return compliments;
	},

	/**
	 * Retrieve a file from the local filesystem
	 * @returns {Promise} Resolved when the file is loaded
	 */
	async loadComplimentFile () {
		const isRemote = this.config.remoteFile.indexOf("http://") === 0 || this.config.remoteFile.indexOf("https://") === 0,
			url = isRemote ? this.config.remoteFile : this.file(this.config.remoteFile);
		// because we may be fetching the same url,
		// we need to force the server to not give us the cached result
		// create an extra property (ignored by the server handler) just so the url string is different
		// that will never be the same, using the ms value of date
		if (isRemote && this.config.remoteFileRefreshInterval !== 0) this.urlSuffix = `?dummy=${Date.now()}`;
		//
		try {
			const response = await fetch(url + this.urlSuffix);
			return await response.text();
		} catch (error) {
			Log.info(`${this.name} fetch failed error=`, error);
		}
	},

	/**
	 * Retrieve a random compliment.
	 * @returns {string} a compliment
	 */
	getRandomCompliment () {
		// get the current time of day compliments list
		const compliments = this.complimentArray();
		// variable for index to next message to display
		let index;
		// are we randomizing
		if (this.config.random) {
			// yes
			index = this.randomIndex(compliments);
		} else {
			// no, sequential
			// if doing sequential, don't fall off the end
			index = this.lastIndexUsed >= compliments.length - 1 ? 0 : ++this.lastIndexUsed;
		}

		return compliments[index] || "";
	},

	/**
	 * Obter mensagem informativa baseada no tempo meteorológico
	 * @returns {string|null} mensagem informativa baseada no tempo ou null se não aplicável
	 */
	getWeatherBasedCompliment() {
		Log.log(this.name + " === INICIANDO getWeatherBasedCompliment ===");
		
		// Debug: verificar se a funcionalidade está ativa
		if (!this.config.weatherAware) {
			Log.log(this.name + " weatherAware is false");
			return null;
		}
		
		if (!this.weatherData) {
			Log.log(this.name + " weatherData is null/undefined");
			return null;
		}

		Log.log(this.name + " weatherData received:", this.weatherData);
		
		// Forçar sempre a exibição de mensagens meteorológicas quando há dados disponíveis
		// Remover a verificação que impede a exibição
		
		const temp = this.weatherData.temperature;
		const hour = moment().hour();
		const weatherType = this.weatherData.weatherType;
		const location = this.weatherData.locationName || this.translate("LOCATION_DEFAULT");
		const currentTime = moment().format("HH:mm");
		
		Log.log(this.name + " processing weather message - temp:", temp, "hour:", hour, "weatherType:", weatherType);

		// Obter dados de previsão se disponíveis
		let maxTemp = null;
		let minTemp = null;
		let rainProb = 0;
		
		if (this.forecastData && this.forecastData.length > 0) {
			const today = this.forecastData[0];
			maxTemp = today.maxTemperature;
			minTemp = today.minTemperature;
			rainProb = today.precipitationProbability || 0;
			
			Log.log(this.name + " forecast data:", {
				maxTemp: maxTemp,
				minTemp: minTemp,
				rainProb: rainProb,
				today: today
			});
		} else {
			Log.log(this.name + " no forecast data available");
		}

		// Determinar período do dia e gerar mensagem apropriada
		let weatherMessage = null;
		
		if (hour >= 7 && hour < 11) {
			// Manhã (07h-11h)
			weatherMessage = this.generateMorningMessage(currentTime, location, temp, weatherType, maxTemp, rainProb);
			Log.log(this.name + " generating morning message:", weatherMessage);
		} else if (hour >= 12 && hour < 14) {
			// Meio-dia (12h-14h)
			weatherMessage = this.generateMiddayMessage(currentTime, temp, weatherType, maxTemp);
			Log.log(this.name + " generating midday message:", weatherMessage);
		} else if (hour >= 14 && hour < 17) {
			// Tarde (14h-17h)
			weatherMessage = this.generateAfternoonMessage(currentTime, temp, weatherType, maxTemp);
			Log.log(this.name + " generating afternoon message:", weatherMessage);
		} else if (hour >= 17 && hour < 20) {
			// Fim de tarde (17h-20h)
			weatherMessage = this.generateEveningMessage(currentTime, temp, weatherType, minTemp);
			Log.log(this.name + " generating evening message:", weatherMessage);
		} else if (hour >= 21 && hour < 23) {
			// Noite (21h-23h)
			weatherMessage = this.generateNightMessage(currentTime, location, temp, weatherType, minTemp);
			Log.log(this.name + " generating night message:", weatherMessage);
		} else if (hour >= 23 || hour < 7) {
			// Noite tardia (23h-07h)
			weatherMessage = this.generateLateNightMessage(currentTime, location, temp, weatherType, maxTemp);
			Log.log(this.name + " generating late night message:", weatherMessage);
		}
		
		Log.log(this.name + " final weather message:", weatherMessage);
		Log.log(this.name + " === TERMINANDO getWeatherBasedCompliment ===");
		return weatherMessage;
	},

	/**
	 * Gerar mensagem da manhã
	 */
	generateMorningMessage(time, location, temp, weatherType, maxTemp, rainProb) {
		const weather = this.getWeatherDescription(weatherType);
		const rainInfo = this.getRainInfo(rainProb);
		const maxTempText = maxTemp ? Math.round(maxTemp) : "N/A";
		
		return this.translate("MORNING_INFO", {
			time: time,
			location: location,
			temp: Math.round(temp),
			weather: weather,
			maxTemp: maxTempText,
			rainInfo: rainInfo
		});
	},

	/**
	 * Gerar mensagem do meio-dia
	 */
	generateMiddayMessage(time, temp, weatherType, maxTemp) {
		const weather = this.getWeatherDescription(weatherType);
		const maxTempText = maxTemp ? Math.round(maxTemp) : "N/A";
		
		return this.translate("MIDDAY_INFO", {
			time: time,
			temp: Math.round(temp),
			weather: weather,
			maxTemp: maxTempText
		});
	},

	/**
	 * Gerar mensagem da tarde
	 */
	generateAfternoonMessage(time, temp, weatherType, maxTemp) {
		const weather = this.getWeatherDescription(weatherType);
		const maxTempText = maxTemp ? Math.round(maxTemp) : "N/A";
		
		return this.translate("AFTERNOON_INFO", {
			time: time,
			temp: Math.round(temp),
			weather: weather,
			maxTemp: maxTempText
		});
	},

	/**
	 * Gerar mensagem do fim de tarde
	 */
	generateEveningMessage(time, temp, weatherType, minTemp) {
		const weather = this.getWeatherDescription(weatherType);
		const minTempText = minTemp ? Math.round(minTemp) : "N/A";
		const nightDesc = this.getNightDescription(minTemp);
		
		return this.translate("EVENING_INFO", {
			time: time,
			temp: Math.round(temp),
			weather: weather,
			nightDesc: nightDesc,
			minTemp: minTempText
		});
	},

	/**
	 * Gerar mensagem da noite
	 */
	generateNightMessage(time, location, temp, weatherType, minTemp) {
		const weather = this.getWeatherDescription(weatherType);
		const minTempText = minTemp ? Math.round(minTemp) : "N/A";
		
		return this.translate("NIGHT_INFO", {
			time: time,
			location: location,
			temp: Math.round(temp),
			weather: weather,
			minTemp: minTempText
		});
	},

	/**
	 * Gerar mensagem da noite tardia
	 */
	generateLateNightMessage(time, location, temp, weatherType, maxTemp) {
		const weather = this.getWeatherDescription(weatherType);
		const maxTempText = maxTemp ? Math.round(maxTemp) : "N/A";
		
		return this.translate("LATE_NIGHT_INFO", {
			time: time,
			location: location,
			temp: Math.round(temp),
			weather: weather,
			maxTemp: maxTempText
		});
	},

	/**
	 * Obter descrição do tempo baseada no tipo
	 */
	getWeatherDescription(weatherType) {
		if (!weatherType) return this.translate("WEATHER_CLEAR");
		
		Log.log(this.name + " mapping weather type:", weatherType);
		
		const weatherMap = {
			"clear-day": "WEATHER_CLEAR",
			"clear-night": "WEATHER_CLEAR",
			"partly-cloudy-day": "WEATHER_PARTLY_CLOUDY",
			"partly-cloudy-night": "WEATHER_PARTLY_CLOUDY",
			"cloudy": "WEATHER_CLOUDY",
			"overcast": "WEATHER_OVERCAST",
			"rain": "WEATHER_RAIN",
			"light-rain": "WEATHER_LIGHT_RAIN",
			"fog": "WEATHER_FOG",
			"mist": "WEATHER_MIST",
			"day-cloudy": "WEATHER_PARTLY_CLOUDY",  // Adicionar mapeamento para day-cloudy
			"night-cloudy": "WEATHER_CLOUDY"         // Adicionar mapeamento para night-cloudy
		};
		
		const translationKey = weatherMap[weatherType] || "WEATHER_CLEAR";
		Log.log(this.name + " mapped to translation key:", translationKey);
		return this.translate(translationKey);
	},

	/**
	 * Obter informação sobre chuva
	 */
	getRainInfo(rainProb) {
		if (rainProb < 20) return this.translate("RAIN_INFO_NONE");
		if (rainProb < 50) return this.translate("RAIN_INFO_LIGHT");
		if (rainProb < 80) return this.translate("RAIN_INFO_MODERATE");
		return this.translate("RAIN_INFO_HEAVY");
	},

	/**
	 * Obter descrição da noite baseada na temperatura mínima
	 */
	getNightDescription(minTemp) {
		if (!minTemp) return this.translate("NIGHT_AMENA");
		
		if (minTemp < 10) return this.translate("NIGHT_FRIA");
		if (minTemp < 15) return this.translate("NIGHT_FRESCA");
		if (minTemp > 20) return this.translate("NIGHT_QUENTE");
		return this.translate("NIGHT_AMENA");
	},

	/**
	 * Obter mensagem baseada em previsões meteorológicas
	 * @returns {string|null} mensagem baseada em previsões ou null se não aplicável
	 */
	getForecastBasedMessage() {
		// Esta função agora é integrada na função principal getWeatherBasedCompliment
		// que já inclui informações de previsão nas mensagens informativas
		return null;
	},

	// Override dom generator.
	getDom () {
		const wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin medium bright pre-line";
		
		// Tentar obter mensagem baseada no tempo primeiro
		const weatherMessage = this.getWeatherBasedCompliment();
		const forecastMessage = this.getForecastBasedMessage();
		const randomCompliment = this.getRandomCompliment();
		
		// Forçar sempre mensagens meteorológicas - se não existirem, não mostrar nada
		let complimentText;
		if (weatherMessage) {
			complimentText = weatherMessage;
			Log.log(this.name + " Using weather message:", weatherMessage);
		} else if (forecastMessage) {
			complimentText = forecastMessage;
			Log.log(this.name + " Using forecast message:", forecastMessage);
		} else {
			// Não mostrar nada se não há mensagens meteorológicas
			complimentText = "";
			Log.log(this.name + " No weather messages available - showing nothing");
		}
		
		// Debug: verificar qual mensagem está a ser usada
		Log.log(this.name + " DOM generation - weatherMessage:", weatherMessage);
		Log.log(this.name + " DOM generation - forecastMessage:", forecastMessage);
		Log.log(this.name + " DOM generation - randomCompliment:", randomCompliment);
		Log.log(this.name + " DOM generation - final complimentText:", complimentText);
		
		// split it into parts on newline text
		Log.log(this.name + " Processing complimentText:", complimentText);
		const parts = complimentText.split("\n");
		Log.log(this.name + " Parts after split:", parts);
		
		// create a span to hold the compliment
		const compliment = document.createElement("span");
		// process all the parts of the compliment text
		for (const part of parts) {
			Log.log(this.name + " Processing part:", part);
			if (part !== "") {
				// create a text element for each part
				compliment.appendChild(document.createTextNode(part));
				// add a break
				compliment.appendChild(document.createElement("BR"));
			}
		}
		// only add compliment to wrapper if there is actual text in there
		Log.log(this.name + " compliment.children.length:", compliment.children.length);
		if (compliment.children.length > 0) {
			// remove the last break
			compliment.lastElementChild.remove();
			wrapper.appendChild(compliment);
			Log.log(this.name + " Added compliment to wrapper");
		} else {
			Log.log(this.name + " No children to add to wrapper");
		}
		// if a new set of compliments was loaded from the refresh task
		// we do this here to make sure no other function is using the compliments list
		if (this.compliments_new) {
			// use them
			if (JSON.stringify(this.config.compliments) !== JSON.stringify(this.compliments_new)) {
				// only reset if the contents changes
				this.config.compliments = this.compliments_new;
				// reset the index
				this.lastIndexUsed = -1;
			}
			// clear new file list so we don't waste cycles comparing between refreshes
			this.compliments_new = null;
		}
		// only in test mode
		if (window.mmTestMode === "true") {
			// check for (undocumented) remoteFile2 to test new file load
			if (this.config.remoteFile2 !== null && this.config.remoteFileRefreshInterval !== 0) {
				// switch the file so that next time it will be loaded from a changed file
				this.config.remoteFile = this.config.remoteFile2;
			}
		}
		return wrapper;
	},

	// Override notification handler.
	notificationReceived (notification, payload, sender) {
		if (notification === "CURRENTWEATHER_TYPE") {
			this.currentWeatherType = payload.type;
		}
		
		// Nova funcionalidade: receber dados meteorológicos completos
		if (notification === "WEATHER_UPDATED") {
			Log.log(this.name + " received weather data from: " + (sender ? sender.name : "unknown"));
			Log.log(this.name + " payload received:", payload);
			
			// Só atualizar se os dados não forem null/undefined
			if (payload.currentWeather) {
				this.weatherData = payload.currentWeather;
				Log.log(this.name + " Updated weatherData:", this.weatherData);
			} else {
				Log.log(this.name + " payload.currentWeather is null/undefined - keeping existing data");
			}
			
			if (payload.forecastArray) {
				this.forecastData = payload.forecastArray;
				Log.log(this.name + " Updated forecastData:", this.forecastData);
			} else {
				Log.log(this.name + " payload.forecastArray is null/undefined - keeping existing data");
			}
			
			this.updateDom();
		}
	}
});
