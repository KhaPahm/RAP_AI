export function StringIsNullOrEmpty(data) {
	if (data == null || data == "") return true;
	return false;
}



export function ConverDateTimeToString(date = new Date()) {
	let dd = String(date.getDate()).padStart(2, "0");
	let MM = String(date.getMonth() + 1).padStart(2, "0");
	let yyyy = date.getFullYear();

	let hh = String(date.getHours()).padStart(2, "0");
	let mm = String(date.getMinutes()).padStart(2, "0");
	let ss = String(date.getSeconds()).padStart(2, "0");

	return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}