import botana from '#lib/assets/images/botana.webp';
import burger from '#lib/assets/images/burger.webp';
import cheesedip from '#lib/assets/images/cheesedip.webp';
import fingers from '#lib/assets/images/fingers.webp';
import chicken from '#lib/assets/images/friedchicken.webp';

export type MenuItem = {
	title: string;
	image: string;
};

export const menu: MenuItem[] = [
	{
		title: 'Chicken Botana',
		image: botana
	},
	{
		title: 'Burger',
		image: burger
	},
	{
		title: 'Cheese Dipp',
		image: cheesedip
	},
	{
		title: 'Chicken Fingers',
		image: fingers
	},
	{
		title: 'Fried Chicken',
		image: chicken
	}
];
