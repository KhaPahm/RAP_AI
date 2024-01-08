export default class UserInfor {
	constructor(user_id, user_name, email, day_of_birth, full_name, phone_number) {
		this.userId = user_id;
		this.userName = user_name;
		this.email = email;
		this.dayOfBirth = day_of_birth;
		this.fullName = full_name;
		this.phoneNumber = phone_number;
	}

	set SetToken(accessToken = "") {
		this.accessToken = accessToken;
	}

	set SetRole(role = {}) {
		this.role = role;
	}
}