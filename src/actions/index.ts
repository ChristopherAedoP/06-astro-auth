import { loginUser, loginWithGoogle, logout, registerUser } from './auth';

export const server = {
	registerUser,
	logout,
	loginUser,
	loginWithGoogle,
};
