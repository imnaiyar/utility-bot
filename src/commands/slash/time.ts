import { ContextType, IntegrationType, type SlashCommand } from '@/structures';
import { MessageFlags } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import * as chrono from "chrono-node";
import { DateTime } from "luxon";

const format_tokens = {
  "t": "HH:mm", // "10:30"
  "T": "HH:mm:ss", // "10:30:30"
  "d": "dd/MM/yyyy", // "04/06/2026"
  "D": "MMMM dd, yyyy", // "August 04, 2021"
  "f": "MMMM dd, yyyy at HH:mm", // "August 04, 2021 at 10:30"
  "F": "cccc, MMMM dd, yyyy at HH:mm", // "Wednesday, August 04, 2021 at 10:30",
  "s": "dd/MM/yyyy, HH:mm", // "04/10/2026, 10:30"
  "S": "dd/MM/yyyy HH:mm:ss" // "04/10/2026, 10:30:30"
 }
export default {
	data: {
		name: 'time',
		description: 'get discord formatted timestamp',
		options: [
			{
				name: 'date-time',
				description: 'mention or describe a date',
				type: ApplicationCommandOptionType.String,
				required: true,
				autocomplete: true
			},
			{
			  name: "timezone",
			  description: "tz if mentioned time is absolute & not relative",
			 type: ApplicationCommandOptionType.String,
				required: false,
				autocomplete: true 
			}
		],
		integration_types: [IntegrationType.Users],
		contexts: [ContextType.BotDM, ContextType.Guild, ContextType.PrivateChannels],
	},
	async run(app, interaction, options) {
		const [timestamp, format] = options.getString("date-time", true).split("/")
		const formatted = `<t:${Number(timestamp)}:${format}>`;
		await app.api.editInteractionReply(interaction.application_id, interaction.token, {
			content: `${formatted}` + `\n Inline: \`${formatted}\`` + `\nCode Block\n\`\`\`${formatted}\`\`\``,
		});
	},
	async autocomplete(app, int, op) {
	  const { name, value } = op.getFocusedOption();
	  
	  const tz = op.get("timezone")?.value;
	  
	  const options = [];
	  
	  switch (name) {
	    case "timezone": 
	      options.push(...Intl.getSupportedValuesOf("timeZone").filter(n => n.toLowerCase().includes(value.toLowerCase())).map(n => ({ name: n, value: n })));
	      break;
	    case "date-time": {
	      const parsed = chrono.parseDate(value, { timezone: getOffset(tz) });
	      if (!parsed) break;
	      
	      const instance = DateTime.fromJSDate(parsed, { zone: tz ?? "Asia/Kolkata" })
	      
	      for (const [k, format] of Object.entries(format_tokens)) {
	        options.push({ name: instance.toFormat(format), value: `${Math.round(instance.toSeconds())}/${format}` })
	      }
	      options.push({ name: instance.toRelative(DateTime.now().setZone(tz ?? "Asia/Kolkata")), value: `${Math.round(instance.toSeconds())}/R` })
	      break
	    }
	  }
	  
	  return options.length ? options.splice(0, 25) : [{ name: "Nothing matching, or error", value: "null"}]
	}
} satisfies SlashCommand<true>;


function getOffset(zone = "Asia/Kolkata") {
  return DateTime.now().setZone(zone).offset;
}