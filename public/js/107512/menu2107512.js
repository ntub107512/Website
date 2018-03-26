console.clear();

var app = function () {
	var body = void 0;
	var menu = void 0;
	var menuItems = void 0;

	var init = function init() {
		body = document.querySelector('body');
		menu = document.querySelector('.menu-icon107512');
		menuItems = document.querySelectorAll('.nav__list-item');

		applyListeners();
	};

	var applyListeners = function applyListeners() {
		menu.addEventListener('click', function () {
			return toggleClass(body, 'nav107512-active');
		});
	};

	var toggleClass = function toggleClass(element, stringClass) {
		if (element.classList.contains(stringClass)) element.classList.remove(stringClass);else element.classList.add(stringClass);
	};

	init();
}();