export const getNumOfDayInMonth = (currentDate: Date) => {
	let temp = new Date(currentDate);
	temp.setMonth(temp.getMonth() + 1);

	return Math.floor(
		(Number(new Date(`${temp.getFullYear()}-${temp.getMonth() + 1}-01`)) -
			Number(
				new Date(
					`${currentDate.getFullYear()}-${
						currentDate.getMonth() + 1
					}-01`
				)
			)) /
			(24 * 60 * 60 * 1000)
	);
};
