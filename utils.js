const prompt = require('prompt-sync')();
const fs = require('fs');

const makeIIFstring = (func, ...args) => {
	return `(${func.toString()})(${ args.map(arg => JSON.stringify(arg)).join(',') });`;
};

const self = {
	wait: (miliseconds) => {
		return new Promise((resolve) => {
			setTimeout(resolve, miliseconds);
		});
	},

	prompt: (name, prompt_message) => {
		//when app is started from command like: npm start --arg_name=GIVEN_VALUE
		var out = process.env['npm_config_' + name];

		if(out)
			return out;
		try {
			let user_input = prompt(prompt_message || (name + ': '));
			return user_input;
		}
		catch(e) {
			console.error('prompting error:', e.message);
			return undefined;
		}
	},

	executeJS: (window, func, ...args) => {
		return window.webContents.executeJavaScript(makeIIFstring(func, ...args));
	},

	sendKeys: async (window, keys, delay) => {
		for(let ch of keys) {
			await self.wait(delay);
            await window.webContents.sendInputEvent({keyCode: ch, type: 'char'});
		}
	},

	// FILES
	saveFile: (filename, content) => {
		fs.writeFileSync(filename, content, 'utf8');
	}
};

module.exports = self;