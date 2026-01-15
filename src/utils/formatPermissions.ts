import { PermissionFlagsBits } from "discord-api-types/v10";
export function formatPermissions(bits: string = "0") {
  const int = BigInt(bits);
  const formatted = [];
  
  for (const [perm, bit] of Object.entries(PermissionFlagsBits)) {
    let check = ""
    if ((int & bit) === bit) check = "✔️"
    else check = "❌";
    formatted.push(check + `${perm} (\` 1 << ${bit.toString(2).length - 1}\`)`)
  }
  return formatted.join("\n")
}