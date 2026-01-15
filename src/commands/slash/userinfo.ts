import { formatUserInfo } from '@/utils';
import type { SlashCommand } from '@/structures';
import { ApplicationCommandOptionType, MessageFlags } from 'discord-api-types/v10';
export default {
	data: {
		name: 'userinfo',
		description: 'info about a user',
		options: [
			{
				name: 'user',
				description: 'the user',
				type: ApplicationCommandOptionType.User,
				required: true,
			},
		],
		integration_types: [1],
		contexts: [0, 1, 2],
	},
	async run(app, interaction, options) {
		const member = options.getMember('user');
		const targetUser = options.getUser('user')!;
		// prettier-ignore
		const container = formatUserInfo( member ?? undefined as any, targetUser, interaction, app);
		await app.api.editInteractionReply(interaction.application_id, interaction.token, {
			components: [container],
			flags: app.ephemeral | MessageFlags.IsComponentsV2,
		});
	},
} satisfies SlashCommand;
