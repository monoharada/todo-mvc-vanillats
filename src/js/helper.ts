export function delegate(el, event, selector, handler, data) {
	el.addEventListener(event, function (e: { target: any }) {
		var target = e.target;
		if (target.matches(selector)) {
			handler(data, el, e);
		}
	});
}

export function escapeForHTML(str: string) {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

export function getURLHash() {
	return document.location.hash.replace(/^#\//, "");
}
