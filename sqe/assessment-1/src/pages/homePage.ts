import { Page } from '@playwright/test';

export class HomePage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createRepository(repositoryName: string): Promise<void> {
    const inputSelector = 'input[name="repository[name]"]';

    // Set text in the input field
    await this.page.fill(inputSelector, repositoryName);

    // Click the submit button
    await this.page.getByRole('button', { name: 'submit' }).click();
  }

}