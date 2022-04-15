import User from "../../../models/User.js";
import {AuthenticationError, UserInputError} from "apollo-server";
import {createHashAndSalt, logInJWT, signAuthJWT} from "../../../auth/auth.js";

export const signUpFunc = async (parent, args, ctx) => {
	try {
		const hashAndSalt = await createHashAndSalt(args.password);
		const newUser = new User({
			userName: args.userName,
			password: hashAndSalt.hash,
			salt: hashAndSalt.salt
		});
		const user = await newUser.save();
		return await signAuthJWT(user.userName, user._id);
	} catch (err) {
		console.log(err);
		if (err.code === 11000) throw new UserInputError("Username already taken");
	}
};

export const logInFunc = async (parent, args, ctx) => {
	try {
		const user = await ctx.usersLoader.load(args.userName);
		console.log(user);

		return await logInJWT(
			user.password,
			user.salt,
			args.password,
			user.userName,
			user._id
		);
	} catch (err) {
		console.log(err);
		throw new AuthenticationError("Invalid user name or password");
	}
};
