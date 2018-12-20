const Utils = require('./utils.js');

const STATES = {//enum
	LOGING_IN: 0,
	LOGIN_SUCCESS: 1,
	WORLD_OPENED: 2
};

var current_state = STATES.LOGING_IN;

async function login(win) {
	let login = Utils.prompt('login'),
        password = Utils.prompt('password');

    await Utils.executeJS(win, () => {
        document.getElementById("login_userid").focus();
    });
    await Utils.wait(100);
    await Utils.sendKeys(win, login, 20);

    await Utils.executeJS(win, () => {
        document.getElementById("login_password").focus();
    });
    await Utils.wait(100);
    await Utils.sendKeys(win, password, 20);
    
    await Utils.executeJS(win, () => {
        document.getElementById("login_Login").click();
    });

    current_state = STATES.LOGIN_SUCCESS;
}

async function openWorld(win, world_name) {
	var result = await Utils.executeJS(win, (name) => {
        var worlds = document.querySelectorAll('#worlds > div > ul > li > div');
        for(var i in worlds) {
			if(worlds[i].innerText === name) {
				worlds[i].click();
				return true;
			}
        }
        return false;
    }, world_name);
    if(result !== true)
		throw new Error('Nie mozna wybrac swiata');
	current_state = STATES.WORLD_OPENED;
}

/*var test = await Utils.executeJS(win, () => {
    return document.querySelector('#cookie-notice > div > p').innerHTML;
});
Utils.saveFile(__dirname + '/test.txt', test.replace(/\s{2,}/gi, ''));*/

module.exports = {
	start: function(window) {
		login(window);//first step
	},
	onPageNavigate: function(window) {
		//console.log( current_state );
		switch(current_state) {
			case STATES.LOGIN_SUCCESS:
				openWorld(window, 'IALISSOS');
				break;
		}
	}
};