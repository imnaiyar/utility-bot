import { describe, expect, it } from 'vitest';
import { time } from '@discordjs/builders';
import { buildTimestampChoices } from '../src/commands/slash/time';

describe('buildTimestampChoices', () => {
	it('returns all Discord timestamp styles', () => {
		const date = new Date('2030-01-01T12:34:00Z');
		const unix = Math.floor(date.getTime() / 1000);
		const choices = buildTimestampChoices(date);

		expect(choices).toHaveLength(7);
		expect(choices.map((choice) => choice.value)).toEqual(
			expect.arrayContaining([time(unix, 'R'), time(unix, 'F')]),
		);
	});
});
