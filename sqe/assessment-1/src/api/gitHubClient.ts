import { config } from "../utils/config";
import { CreateRepository } from './createRepositoryRequest';

class GithubApiClient {
  token: string;
    apiUrl: string;
  constructor() {
    this.token = config.token;
    this.apiUrl = "https://api.github.com/";
  }

  async createRepository(repositoryRequest: CreateRepository) {
    const response = await fetch(`${this.apiUrl}${"user/repos"}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(repositoryRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create repository: ${errorData.message}`);
    }

    const data = await response.json();
    return data;
  }

  async deleteRepository(repositoryName:string) {
    const url = `${this.apiUrl}repos/${config.username}/${repositoryName}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (response.status !== 204) {
      const errorData = await response.json();
      throw new Error(`Can't delete ${repositoryName} repository: ${errorData.message}`);
    }
  }
}

export default GithubApiClient;