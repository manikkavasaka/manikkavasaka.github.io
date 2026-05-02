import * as XLSX from 'xlsx';
import { Lead, Campaign, Service } from '../types';

export const excelExport = {
  exportLeads: (leads: Lead[]): void => {
    const data = leads.map((lead, index) => ({
      'S.No': index + 1,
      'Lead Name': lead.name,
      'Email': lead.email,
      'Company': lead.company || 'N/A',
      'Phone': lead.phone || 'N/A',
      'Service Interested': lead.serviceInterested || 'General',
      'Budget ($)': lead.budget || 0,
      'Status': lead.status,
      'Date Received': lead.date,
      'Message': lead.message || 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [
      { wch: 6 }, { wch: 20 }, { wch: 28 }, { wch: 22 }, { wch: 16 },
      { wch: 30 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 40 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, `MKShopZone_Leads_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  exportCampaigns: (campaigns: Campaign[]): void => {
    const data = campaigns.map((camp, index) => ({
      'S.No': index + 1,
      'Campaign Name': camp.name,
      'Platform': camp.platform,
      'Status': camp.status,
      'Budget ($)': camp.budget,
      'Spent ($)': camp.spent,
      'Clicks': camp.clicks,
      'Impressions': camp.impressions,
      'Conversions': camp.conversions,
      'CTR (%)': camp.impressions > 0 ? ((camp.clicks / camp.impressions) * 100).toFixed(2) : '0',
      'CPA ($)': camp.conversions > 0 ? (camp.spent / camp.conversions).toFixed(2) : '0',
      'Start Date': camp.startDate
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [
      { wch: 6 }, { wch: 35 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 14 },
      { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 14 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Campaigns');
    XLSX.writeFile(wb, `MKShopZone_Campaigns_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  exportServices: (services: Service[]): void => {
    const data = services.map((svc, index) => ({
      'S.No': index + 1,
      'Service Name': svc.title,
      'Category': svc.category,
      'Price': svc.price,
      'Description': svc.description
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 6 }, { wch: 35 }, { wch: 12 }, { wch: 14 }, { wch: 60 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Services');
    XLSX.writeFile(wb, `MKShopZone_Services_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  exportAllData: (leads: Lead[], campaigns: Campaign[], services: Service[]): void => {
    const wb = XLSX.utils.book_new();

    const summaryData = [
      { 'Metric': 'Total Leads', 'Value': leads.length },
      { 'Metric': 'Converted Leads', 'Value': leads.filter(l => l.status === 'Converted').length },
      { 'Metric': 'Total Revenue from Leads', 'Value': `$${leads.reduce((sum, l) => sum + (l.budget || 0), 0).toLocaleString()}` },
      { 'Metric': 'Active Campaigns', 'Value': campaigns.filter(c => c.status === 'Active').length },
      { 'Metric': 'Total Ad Spend', 'Value': `$${campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}` },
      { 'Metric': 'Total Conversions', 'Value': campaigns.reduce((sum, c) => sum + c.conversions, 0) },
      { 'Metric': 'Services Offered', 'Value': services.length },
      { 'Metric': 'Report Generated', 'Value': new Date().toLocaleString() }
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 28 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    const leadsData = leads.map((lead, i) => ({
      '#': i + 1, 'Name': lead.name, 'Email': lead.email, 'Company': lead.company,
      'Phone': lead.phone, 'Service': lead.serviceInterested, 'Budget': lead.budget,
      'Status': lead.status, 'Date': lead.date, 'Message': lead.message
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(leadsData), 'Leads');

    const campaignsData = campaigns.map((c, i) => ({
      '#': i + 1, 'Campaign': c.name, 'Platform': c.platform, 'Status': c.status,
      'Budget': c.budget, 'Spent': c.spent, 'Clicks': c.clicks,
      'Impressions': c.impressions, 'Conversions': c.conversions, 'Start': c.startDate
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(campaignsData), 'Campaigns');

    const servicesData = services.map((s, i) => ({
      '#': i + 1, 'Service': s.title, 'Category': s.category, 'Price': s.price, 'Description': s.description
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(servicesData), 'Services');

    XLSX.writeFile(wb, `MKShopZone_MasterReport_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
};
