import { formatUserInfo } from '@/utils';
import type { ContextMenu } from '@/structures';
import { ApplicationCommandType, MessageFlags } from 'discord-api-types/v10';
export default {
	data: {
		name: 'Info',
		type: ApplicationCommandType.User,
		integration_types: [1],
		contexts: [0, 1, 2],
	},
	async run(app, interaction, options) {
		const targetUser = await app.api.getUser(interaction.data.target_id);
		const member = options.getTargetMember();
		// prettier-ignore
		const container = formatUserInfo( member ?? undefined as any , targetUser, interaction, app);
		await app.api.editInteractionReply(interaction.application_id, interaction.token, {
			components: [container],
			flags: app.ephemeral | MessageFlags.IsComponentsV2
		});
	},
} satisfies ContextMenu<'User'>;
