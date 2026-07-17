import { messagingRepository } from '@/services/messaging/repository';
import type {
  BroadcastInput,
  CreateCampaignInput,
  CreateTemplateInput,
  MarkReadInput,
  MessagingFilters,
  SendMessageInput,
} from '@/services/messaging/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const messagingService = {
  async dashboard(facilityId?: string) {
    await delay();
    return messagingRepository.dashboard(facilityId);
  },
  async analytics(facilityId?: string) {
    await delay();
    return messagingRepository.analytics(facilityId);
  },
  async getMessages(filters?: MessagingFilters) {
    await delay();
    return messagingRepository.getMessages(filters);
  },
  async getMessage(messageId: string) {
    await delay();
    return messagingRepository.getMessage(messageId);
  },
  async getInbox(filters?: MessagingFilters) {
    await delay();
    return messagingRepository.getInbox(filters);
  },
  async getAnnouncements(filters?: MessagingFilters) {
    await delay();
    return messagingRepository.getAnnouncements(filters);
  },
  async getThreads(filters?: MessagingFilters) {
    await delay();
    return messagingRepository.getThreads(filters);
  },
  async getChatMessages(threadId: string, filters?: MessagingFilters) {
    await delay();
    return messagingRepository.getChatMessages(threadId, filters);
  },
  async getSecureMessages(filters?: MessagingFilters) {
    await delay();
    return messagingRepository.getSecureMessages(filters);
  },
  async getBroadcasts(filters?: MessagingFilters) {
    await delay();
    return messagingRepository.getBroadcasts(filters);
  },
  async getTemplates(filters?: MessagingFilters) {
    await delay();
    return messagingRepository.getTemplates(filters);
  },
  async getTemplate(templateId: string) {
    await delay();
    return messagingRepository.getTemplate(templateId);
  },
  async getCampaigns(filters?: MessagingFilters) {
    await delay();
    return messagingRepository.getCampaigns(filters);
  },
  async getCampaign(campaignId: string) {
    await delay();
    return messagingRepository.getCampaign(campaignId);
  },
  async getDeliveries(filters?: MessagingFilters) {
    await delay();
    return messagingRepository.getDeliveries(filters);
  },
  async getChannels() {
    await delay();
    return messagingRepository.getChannels();
  },
  async getIntegrations() {
    await delay();
    return messagingRepository.getIntegrations();
  },

  async send(input: SendMessageInput) {
    await delay();
    return messagingRepository.send(input);
  },
  async markRead(input: MarkReadInput) {
    await delay();
    return messagingRepository.markRead(input);
  },
  async createTemplate(input: CreateTemplateInput) {
    await delay();
    return messagingRepository.createTemplate(input);
  },
  async createCampaign(input: CreateCampaignInput) {
    await delay();
    return messagingRepository.createCampaign(input);
  },
  async broadcast(input: BroadcastInput) {
    await delay();
    return messagingRepository.broadcast(input);
  },
  async startCampaign(campaignId: string) {
    await delay();
    return messagingRepository.startCampaign(campaignId);
  },

  async search(query: string, filters?: MessagingFilters) {
    await delay();
    return messagingRepository.search(query, filters);
  },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    await delay();
    return messagingRepository.exportData(format);
  },
  async favorite(
    userId: string,
    entityType: 'message' | 'template' | 'campaign' | 'thread',
    entityId: string,
  ) {
    await delay();
    return messagingRepository.favorite(userId, entityType, entityId);
  },
  async getFavorites(userId: string) {
    await delay();
    return messagingRepository.getFavorites(userId);
  },
};
