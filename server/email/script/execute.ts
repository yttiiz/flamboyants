import { EmailContentType, Helper } from "@utils";

export async function createEmailTemplate(
  emailJsonPath: string,
  emailHtmlPath: string,
) {
  // 1. Retreive "email.json".
  const baseEmailJson = await Helper.convertJsonToObject<
    { toUser: EmailContentType; toMaintainer: EmailContentType }
  >(emailJsonPath);

  // 2. Replace previous "messageHtml" property content by "{{ emailHmtlContent }} mark."
  baseEmailJson.toUser.messageHtml = "{{ emailHtmlContent }}";

  // 3. Rewrite "email.json".
  const baseEmailJsonClean = JSON.stringify(baseEmailJson);
  await Deno.writeTextFile(Deno.cwd() + emailJsonPath, baseEmailJsonClean);

  // 4. Convert files.
  let emailHtml = await Helper.convertFileToString(emailHtmlPath);
  let emailJson = await Helper.convertFileToString(emailJsonPath);

  // 5. Replace whitespaces & double quote | Insert new content.
  emailHtml = emailHtml.replaceAll("\n", "\\n");
  emailHtml = emailHtml.replaceAll('"', '\\"');
  emailHtml = emailHtml.replace(
    "{{ currentYear }}",
    new Date().getFullYear().toString(),
  );

  emailJson = emailJson.replace("{{ emailHtmlContent }}", emailHtml);

  // 6. Rewrite "email.json" again.
  await Deno.writeTextFile(Deno.cwd() + emailJsonPath, emailJson);
}
