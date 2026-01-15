import { ButtonBuilder, roleMention, time, ContainerBuilder } from "@discordjs/builders";
import { ImageFormat, type APIGuildMember, type APIInteraction, type APIUser, ButtonStyle } from "discord-api-types/v10";
import { UserUtil as utils } from "@/utils";
import { type Bot } from "@/bot";
import { DiscordSnowflake } from "@sapphire/snowflake";

export function formatUserInfo(
  member: Omit<APIGuildMember, "deaf" | "mute"> | undefined,
  targetUser: APIUser | undefined,
  interaction: APIInteraction,
  app: Bot,
) {
  const title = (member && member.nick) || targetUser?.global_name || targetUser?.username;
  const avatarUrl =
    (member?.avatar && targetUser && utils.memberAvatarURL(app, member, targetUser.id, interaction.guild_id!)) ||
    (targetUser && utils.userAvatarURL(app, targetUser, ImageFormat.PNG));
  const banner = targetUser && targetUser.banner && utils.bannerURL(app, targetUser);
  
  const createdAt = targetUser && time(Math.floor(DiscordSnowflake.timestampFrom(targetUser.id) / 1000), "F");
  
const text = `# ${title}\n` + `**Account Type**: ${targetUser?.bot ? "Bot" : "User"}\n**Username**: ${targetUser?.username}\n**Account CreatedAt**: ${createdAt}\n${member && member.joined_at ? `**Joined GuildAt**: ${time(new Date(member.joined_at), "F")}` : ""}`;
  const container = new ContainerBuilder()
  
  
  if (avatarUrl) container.addSectionComponents(sc => sc.setThumbnailAccessory(th => th.setURL(avatarUrl)).addTextDisplayComponents(td => td.setContent(text)))
  else container.addTextDisplayComponents(td => td.setContent(text))
  
  if (banner) container.addMediaGalleryComponents(mg => mg.addItems(item => item.setURL(banner)))
  
  if (member) {
   if (member.roles.length) {
     container.addSeparatorComponents(sp => sp.setDivider(true))
    .addTextDisplayComponents(td => td.setContent(`# Roles\n ${member.roles.map((role) => roleMention(role)).join(", ")}`));
   }
    
    container.addActionRowComponents(ar => ar.addComponents(new ButtonBuilder().setLabel("Permissions").setStyle(ButtonStyle.Secondary).setCustomId(`member_perms:${member.permissions}`)))
  }

  return container.toJSON();
}
