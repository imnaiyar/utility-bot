import { ContextType, IntegrationType, type SlashCommand } from '@/structures';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { time } from '@discordjs/builders';
import { parseDate } from 'chrono-node';

const timestampFormats = [
	{ style: 't', label: 'Short time' },
	{ style: 'T', label: 'Long time' },
	{ style: 'd', label: 'Short date' },
	{ style: 'D', label: 'Long date' },
	{ style: 'f', label: 'Short date/time' },
	{ style: 'F', label: 'Long date/time' },
	{ style: 'R', label: 'Relative' },
] as const;

const timestampPattern = /^<t:\d+:[tTdDfFR]>$/;

const parseInputDate = (value: string) => parseDate(value, new Date(), { forwardDate: true });

const buildTimestampChoices = (date: Date) => {
	const unix = Math.floor(date.getTime() / 1000);
	return timestampFormats.map(({ style, label }) => {
		const formatted = time(unix, style);
		return {
			name: `${label}: ${formatted}`,
			value: formatted,
		};
	});
};

export default {
	data: {
		name: 'time',
		description: 'convert a natural language time to a Discord timestamp',
		options: [
			{
				name: 'input',
				description: 'describe a time, e.g. "in 2 hours" or "tomorrow at 5pm"',
				type: ApplicationCommandOptionType.String,
				required: true,
				autocomplete: true,
			},
		],
		integration_types: [IntegrationType.Users],
		contexts: [ContextType.BotDM, ContextType.Guild, ContextType.PrivateChannels],
	},
	async run(app, interaction, options) {
		const value = options.getString('input', true).trim();
		if (timestampPattern.test(value)) {
			await app.editReply(interaction, { content: value });
			return;
		}

		const parsedDate = parseInputDate(value);
		if (!parsedDate) {
			await app.editReply(interaction, { content: 'Unable to parse that time description.' });
			return;
		}

		await app.editReply(interaction, { content: time(Math.floor(parsedDate.getTime() / 1000), 'F') });
	},
	async autocomplete(_app, _interaction, options) {
		const focused = options.getFocusedOption();
		const value = typeof focused.value === 'string' ? focused.value.trim() : '';

		if (!value) {
			return {
				choices: [
					{
						name: 'Start typing a time description',
						value: 'invalid',
					},
				],
			};
		}

		const parsedDate = parseInputDate(value);
		if (!parsedDate) {
			return {
				choices: [
					{
						name: 'Unable to parse that time description',
						value: 'invalid',
					},
				],
			};
		}

		return { choices: buildTimestampChoices(parsedDate) };
	},
} satisfies SlashCommand<true>;

export { buildTimestampChoices };
