// Really stupid that I have to write this. JS needs to have more sense!

/**
 * Takes a string, a separator char, and a max number of splits and then splits
 * the string at most the desired number of times (instead of stupidly)
 * returning the desired number of splits. For now, this is NOT extensible and
 * all parameters are required. Nor am I doing any error checking
 *
 * @param string The string to be split
 * @param separator The character(s) to separate the string on
 * @param maxSplits The maximum number of splits desired
 * @returns An array containing the strings split as desired
 */
module.exports = function(string, separator, maxSplits) {
	if (!string) {
		return null;
	}

	var split = string.split(separator);
	var results = split.splice(0, maxSplits);

	if (split.length > 0) {
		results.push(split.join(separator));
	}

	return results;
};
