export function getTeacherInitial(name: string): string {
  const nameTokens = name.split(" ").filter(Boolean);
  const givenName = nameTokens.find((token) => !token.endsWith(".")) ?? nameTokens[0] ?? "";
  return givenName.charAt(0);
}
