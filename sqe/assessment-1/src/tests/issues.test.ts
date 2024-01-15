import { expect, test } from "@playwright/test";
import GithubApiClient from "../api/gitHubClient";
import { RepositoryPage } from "../pages/repositoryPage";
import { CreateRepository } from '../api/createRepositoryRequest';
import Chance from 'chance';

const client = new GithubApiClient();

const repositoryData: CreateRepository = {
  name: `TestRepo_${Date.now()}`,
  description: 'This is your repository',
  homepage: 'https://github.com',
  private: true,
  has_issues: true,
  has_projects: true,
  has_wiki: true,
};

const chance = new Chance();

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await client.createRepository(repositoryData);
});

test.afterEach(async ({ page }) => {
  await client.deleteRepository(repositoryData.name);
});

test("should create an issue", async ({ page }) => {
  const randomTitle = chance.name();
  const randomBody = chance.name();
  var repositoryPage = new RepositoryPage(page);

  // Create the issue journey
  // 1. From the repository page, navigate to the Issues page
  // 2. Click "New issue"
  // 3. Fill in the contents of the issue
  // 4. Create the new issue

  await repositoryPage.openPage(repositoryData.name);

  await repositoryPage.clickIssueTab();
  await repositoryPage.createNewIssue(randomTitle, randomBody);

  // Assert
  const actualTitle = await repositoryPage.getIssueTitle();
  expect(actualTitle).toEqual(randomTitle);

  const actualBody = await repositoryPage.getIssueBody();
  expect(actualBody).toEqual(randomBody);
});
