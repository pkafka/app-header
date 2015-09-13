/*global require, alert, console*/
'use strict';

require('../../main');
require('o-dropdown-menu');

document.addEventListener('DOMContentLoaded', function() {

	var themeLightCheckbox = document.getElementById('theme-light');
	themeLightCheckbox.checked = localStorage.getItem('theme') === 'light';
	themeLightCheckbox.addEventListener('change', function () {
		localStorage.setItem('theme', themeLightCheckbox.checked ? 'light' : '');
		window.location.reload();
	});

	window.session = {
		sessionState: 'nosession',
		eventHandlers: {},
		login: function (redirectUrl) {
			this.trigger(this.LoginEvent);
		},
		logout: function (redirectUrl) {
			this.trigger(this.LogoutEvent);
		},
		hasValidSession: function (gracePeriodSeconds) { return this.sessionState; },
		on: function (eventType, handler) {
			this.eventHandlers[eventType] = this.eventHandlers[eventType] || [];
			this.eventHandlers[eventType].push(handler);
		},
		off: function (eventType, handler) {},
		trigger: function (eventType) {
			(this.eventHandlers[eventType] || []).forEach(function (handler) {
				handler.call();
			});
		},
		// Events
		SessionStateKnownEvent: 'sessionstateknown',
		LoginEvent: 'login',
		LogoutEvent: 'logout',
		// States
		Unknown: 'unknown',
		NoSession: 'nosession',
		NoToken: 'notoken',
		RequiredLifetimeTooLong: 'requiredlifetimetoolong',
		Success: 'success',
		TimedOut: 'timedout'
	};

	var config = {
		session: 'session',
		user: { givenName: 'XXXXXXXXXXXXXXXX' },
		menu: {
			showAllCoursesMenuItem: true,
			siteNav: {
				items: {
					'U.S. History 201': 'https://example.com/us-history-201',
					'Intro to Sociology': 'https://example.com/intro-to-sociology'
				}
			},
			appAbout: { text: 'About this app', href: 'https://example.com/about' },
			appNav: {
				heading: {
					text: 'Physics',
					href: 'https://example.com/us-history-201'
				},
				items: {
					'Assignments': 'https://example.com/assignments',
					'Performance': { href: 'https://example.com/performance', active: true },
					'Highlights and Notes': 'https://example.com/highlights-and-notes',
					'Table of Contents': 'https://example.com/table-of-contents',
					'Glossary': 'https://example.com/glossary',
					'Resources': 'https://example.com/resources'
				}
			}
		}
	};

	if (localStorage.getItem('disable_session')) {
		config.session = false;
	}

	if (localStorage.getItem('theme')) {
		config.theme = localStorage.getItem('theme');
	}

	if (localStorage.getItem('nav_help_menu')) {
		config.help = {
			'Regular link': 'https://example.com',
			'Opens in a new window or tab': { href: 'https://example.com', target: '_blank' }
		};
	} else {
		document.addEventListener('oAppHeader.help.toggle', function () {
			alert('You toggled help');
		});
	}

	if (localStorage.getItem('long_username')) {
		config.user.givenName = 'XXXXXXX XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
	}

	if (localStorage.getItem('disable_all_courses_menu_item')) {
		config.menu.showAllCoursesMenuItem = false;
	}

	if (localStorage.getItem('disable_site_nav_menu_items')) {
		delete config.menu.siteNav;
	}

	if (localStorage.getItem('disable_app_about_menu_item')) {
		delete config.menu.appAbout;
	}

	if (localStorage.getItem('disable_app_nav_menu_items')) {
		delete config.menu.appNav;
	}

	var configEl = document.createElement('script');
	configEl.setAttribute('data-o-app-header-config', '');
	configEl.type = 'application/json';
	configEl.innerHTML = JSON.stringify(config);
	document.head.appendChild(configEl);

	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));

	// Debug
	console.log(
		'You can change the o-app-header component demo\'s default settings. To change a setting, copy and paste the provided command into the dev tools console, then press Enter and reload the page.' + '\n\n' +
		'* Disable user session: localStorage.setItem(\'disable_session\', true);' + '\n' +
		'* Change the Help nav item to a dropdown menu: localStorage.setItem(\'nav_help_menu\', true);' + '\n' +
		'* Change the username to a long string: localStorage.setItem(\'long_username\', true);' + '\n' +
		'* Disable the \'All courses\' menu item: localStorage.setItem(\'disable_all_courses_menu_item\', true);' + '\n' +
		'* Disable the site nav menu items: localStorage.setItem(\'disable_site_nav_menu_items\', true);' + '\n' +
		'* Disable the app about menu item: localStorage.setItem(\'disable_app_about_menu_item\', true);' + '\n' +
		'* Disable the app nav menu items: localStorage.setItem(\'disable_app_nav_menu_items\', true);' + '\n' +
		'* Clear all settings: localStorage.clear();'
	);
});
