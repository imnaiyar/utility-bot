import type { Bot } from '@/bot';
import { EmbedBuilder } from '@discordjs/builders';

interface ReminderRow {
	id: string;
	author_id: string;
	text: string;
	remind_at: number;
	username: string;
	set_at: number;
	dm_id: string;
	sent: number;
}

export default async (_app: Bot) => {
	try {
		const { results: reminders } = await _app.env.db
			.prepare(`SELECT * FROM reminders WHERE sent = 0 AND remind_at <= ?`)
			.bind(Date.now())
			.all<ReminderRow>();

		for (const reminder of reminders) {
			const { text, username, set_at, dm_id, id } = reminder;

			const embed = new EmbedBuilder()
				.setAuthor({ name: `${username} Reminder` })
				.setTitle('Reminder')
				.setDescription(`You asked me to remind you about: \`${text}\``)
				.setFields({
					name: 'Set on',
					value: '<t:' + Math.trunc(Number(set_at) / 1000) + ':F> (<t:' + Math.trunc(Number(set_at) / 1000) + ':R>)',
				});

			await _app.api
				.createMessage(dm_id, {
					embeds: [embed.toJSON() as any],
				})
				.then(() => _app.env.db.prepare(`DELETE FROM reminders WHERE id = ?`).bind(id).run())
				.catch(console.error);
		}
	} catch (error) {
		console.error('Error handling reminders:', error);
	}
};
