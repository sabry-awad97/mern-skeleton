import { Schema, model, Document } from "mongoose";
import crypto from "crypto";

interface IUser {
    name: string;
    email: string;
    hashed_password: string;
    salt: string;
    updated: Date;
    created: number;
}

interface InstanceMethods {
    encryptPassword(password: string): string;
    authenticate(text: string): string;
    makeSalt(): string;
}

interface IUserDoc extends IUser, InstanceMethods, Document {
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
    updated: Date,
    created: {
        type: Number,
        default: Date.now,
    },
});

UserSchema.virtual("password")
    .set(function (this: IUserDoc, password: string) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function (this: IUserDoc) {
        return this._password;
    });

UserSchema.path("hashed_password").validate(function (
    this: IUserDoc,
    v: string
) {
    if (this._password && this._password.length < 6) {
        this.invalidate("password", "Password must be at least 6 characters.");
    }
    if (this.isNew && !this._password) {
        this.invalidate("password", "Password is required");
    }
});

UserSchema.methods.authenticate = function (plainText: string): boolean {
    return this.encryptPassword(plainText) === this.hashed_password;
};

UserSchema.methods.encryptPassword = function (password: string): string {
    if (!password) return "";
    try {
        return crypto
            .createHmac("sha1", this.salt)
            .update(password)
            .digest("hex");
    } catch (err) {
        return "";
    }
};

UserSchema.methods.makeSalt = function (): string {
    return Math.round(new Date().valueOf() * Math.random()) + "";
};

export default model<IUserDoc>("User", UserSchema);
