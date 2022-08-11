export const blocksNeed = (level) => {
	if (level === 0) {
		return '7200';
	} else if (level === 1) {
		return '72000';
	} else if (level === 2) {
		return '201600';
	} else if (level === 3) {
		return '374400';
	} else if (level === 4) {
		return '618400';
	} else if (level === 5) {
		return '964000';
	} else if (level === 6) {
		return '1482400';
	} else if (level === 7) {
		return '2173600';
	} else if (level === 8) {
		return '3037600';
	} else if (level === 9) {
		return '4074400';
	}
};