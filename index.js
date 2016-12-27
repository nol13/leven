/* eslint-disable no-nested-ternary */
'use strict';
var arr = [];
var charCodeCache = [];

var collator;  // from https://github.com/hiddentao/fast-levenshtein
try {
	collator = (typeof Intl !== 'undefined' && typeof Intl.Collator !== 'undefined') ? new Intl.Collator('generic', {sensitivity: 'base'}) : null;
} catch (err) {
	console.log('Collator could not be initialized and wouldn\'t be used');
}

module.exports = function (a, b, options) {
	var useCollator = (options && collator && options.useCollator);

	if (a === b) {
		return 0;
	}

	var aLen = a.length;
	var bLen = b.length;

	if (aLen === 0) {
		return bLen;
	}

	if (bLen === 0) {
		return aLen;
	}

	var bCharCode;
	var ret;
	var tmp;
	var tmp2;
	var i = 0;
	var j = 0;

	while (i < aLen) {
		charCodeCache[i] = a.charCodeAt(i);
		arr[i] = ++i;
	}

	if (useCollator) {
		while (j < bLen) {
			bCharCode = b.charCodeAt(j);
			tmp = j++;
			ret = j;
			for (i = 0; i < aLen; i++) {
				tmp2 = collator.compare(String.fromCharCode(bCharCode), String.fromCharCode(charCodeCache[i])) === 0 ? tmp : tmp + 1;
				tmp = arr[i];
				ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
			}
		}
	} else {
		while (j < bLen) {
			bCharCode = b.charCodeAt(j);
			tmp = j++;
			ret = j;

			for (i = 0; i < aLen; i++) {
				tmp2 = bCharCode === charCodeCache[i] ? tmp : tmp + 1;
				tmp = arr[i];
				ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
			}
		}
	}

	return ret;
};
