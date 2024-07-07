import jwt from "jsonwebtoken";

export const generateToken = ({
	userId,
	email,
}: {
	userId: string;
	email: string;
}) => {
	return jwt.sign({ userId, email }, process.env.JWT_SECRET!);
};
