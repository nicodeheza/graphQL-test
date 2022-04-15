import "dotenv/config";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {AuthenticationError} from "apollo-server";

export async function createHashAndSalt(password) {
	return new Promise((resolve, reject) => {
		const salt = crypto.randomBytes(16).toString("base64");
		crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, res) => {
			if (err) reject(err);
			resolve({hash: res.toString("base64"), salt});
		});
	});
}

export async function logInJWT(hashPassword, salt, password, userName, id) {
	return new Promise((resolve, reject) => {
		crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, res) => {
			if (err) reject(err);
			const hash = res.toString("base64");
			if (hashPassword === hash) {
				resolve(signAuthJWT(userName, id));
			} else {
				reject(new AuthenticationError("Invalid password"));
			}
		});
	});
}

export async function signAuthJWT(userName, id) {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{userName, id},
			process.env.SECRET,
			{
				expiresIn: "1h"
			},
			(err, token) => {
				if (err) reject(err);
				resolve(token);
			}
		);
	});
}

export function verifyAuthJWT(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.SECRET, (err, user) => {
			if (err) resolve(null);
			if (user) resolve(user);
			resolve(null);
		});
	});
}
