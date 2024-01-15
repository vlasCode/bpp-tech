export const readEnvironmentVariable = (name: string): string => {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is not defined`);
  }

  return process.env[name]!;
};
