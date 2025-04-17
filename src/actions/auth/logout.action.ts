/** @format */

import { firebase } from '@/firebase';
import { defineAction } from 'astro:actions';
import { signOut } from 'firebase/auth';

export const logout = defineAction({
	accept: 'json',
	handler: async (input, context) => {
		const { cookies } = context;

		return await signOut(firebase.auth);
	},
});
