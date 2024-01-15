import { Page } from '@playwright/test';
import { config } from "../utils/config";

export class RepositoryPage {
    private page: Page;
  
    constructor(page: Page) {
      this.page = page;
    }
  
    async openPage(repositoryName: string): Promise<void> {
        await this.page.goto(`/${config.username}/${repositoryName}`);
    }

    async clickIssueTab(): Promise<void> {
        await this.page.click('#issues-tab');
    }

    async createNewIssue(title: string, body: string | null = null): Promise<void> {
        await this.page.click(`a[href*="issues/new/choose"]`);
        await this.page.fill(`input[name="issue[title]"]`, title);

        if (body !== null) {
            await this.page.fill(`textarea[name="issue[body]"]`, body);
        }
        
        await this.page.click(`button:has-text("Submit new issue")`);
    }

    async getIssueTitle(){
        const issueTitleElement = await this.page.$('bdi'); 
        return issueTitleElement?.innerText();
    }

    async getIssueBody(){
        const commentBodyElement = await this.page.$('.comment-body.markdown-body.js-comment-body');
        return commentBodyElement?.innerText();
    }
  
  }