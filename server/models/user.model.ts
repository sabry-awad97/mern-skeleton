import { Schema, model, Document } from "mongoose";
import crypto from "crypto";

interface IUser {
	name: string;
	email: string;
	hashed_password?: string;
	salt?: string;
	updated: Number;
	created: number;
}

interface InstanceMethods {
	/** This method is used to generate an encrypted hash 
	 * from the plain-text password and a unique salt value using the crypto 
	 * module from Node.
	 */
	encryptPassword(password: string): string;

	/** This method is called to verify sign-in attempts by 
	 * matching the user-provided password text with the hashed_password 
	 * stored in the database for a specific user.
	 */
	authenticate(text: string): string;

	/** 
	 * This method generates a unique and random salt value using 
	 * the current timestamp at execution and Math.random().
	 */
	makeSalt(): string;
}

export interface IUserDoc extends IUser, InstanceMethods, Document {
	_password: string;
}

const UserSchema = new Schema<IUserDoc>({
	name: {
		type: String,
		trim: true,
		required: [true, "Name is required"],
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		match: [/.+\@.+\..+/, "Please fill a valid email address"],
		required: [true, "Email is required"],
	},
	hashed_password: {
		type: String,
		required: [true, "Password is required"],
	},
	salt: String,
	updated: Number,
	created: {
		type: Number,
		default: Date.now,
	},
});

UserSchema.virtual("password")
	.set(function (this: IUserDoc, password: string) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashed_password = this.encryptPassword(this._password);
	})
	.get(function (this: IUserDoc) {
		return this._password;
	});

// add custom validation logic and associate it with the hashed_password
// before Mongoose attempts to store the hashed_password value.
UserSchema.path("hashed_password").validate(function (
	this: IUserDoc,
	_val: string
) {
	// has a length of at least six characters when 
	// a new user is created or an existing password is updated.
	if (this._password && this._password.length < 6) {
		this.invalidate("password", "Password must be at least 6 characters.");
	}

	// ensure that a password value is provided
	if (this.isNew && !this._password) {
		this.invalidate("password", "Password is required");
	}
});

// instance methods
UserSchema.methods = {
	authenticate(plainText: string): boolean {
		return this.encryptPassword(plainText) === this.hashed_password;
	},
	encryptPassword(this: IUserDoc, password: string): string {
		if (!password) return "";
		try {
			return crypto
				.createHmac("sha1", this.salt!)
				.update(password)
				.digest("hex");
		} catch (err) {
			return "";
		}
	},
	makeSalt(): string {
		return Math.round(new Date().valueOf() * Math.random()) + "";
	},
};

export const User = model<IUserDoc>("User", UserSchema);

/*
	Hashing algorithms generate the same hash for the same input
	value. But to ensure two users don't end up with the same hashed
	password if they happen to use the same password text, we pair
	each password with a unique salt value before generating the
	hashed password for each user. This will also make it difficult to
	guess the hashing algorithm being used because the same user input
	is seemingly generating different hashes.
*/