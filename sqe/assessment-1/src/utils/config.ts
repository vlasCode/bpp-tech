import { config as loadEnvironment } from "dotenv";
import { readEnvironmentVariable } from "./environment";

loadEnvironment();

export const config = {
  username: readEnvironmentVariable("GITHUB_USERNAME"),
  email: readEnvironmentVariable("GITHUB_EMAIL"),
  password: readEnvironmentVariable("GITHUB_PASSWORD"),
  token: readEnvironmentVariable("GITHUB_TOKEN"),
};

export type Config = typeof config;
