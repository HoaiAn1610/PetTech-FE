import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../renderWithProviders';
import AdminOverviewPage from '@/pages/admin/AdminOverviewPage';
import AdminTenantsPage from '@/pages/admin/AdminTenantsPage';
import AdminBillingPage from '@/pages/admin/AdminBillingPage';
import AdminSupportPage from '@/pages/admin/AdminSupportPage';

beforeEach(() => {
  localStorage.setItem('token', 'test-token');
});

// ─── AdminOverviewPage ───────────────────────────────────────────────────────

describe('AdminOverviewPage', () => {
  it('renders page title', async () => {
    renderWithProviders(<AdminOverviewPage />);
    await waitFor(() => expect(screen.getByText('Tổng quan nền tảng')).toBeInTheDocument());
  });

  it('shows total tenant count from mock data', async () => {
    renderWithProviders(<AdminOverviewPage />);
    // mockTenants.totalCount = 2
    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument());
  });

  it('shows recent tenant names', async () => {
    renderWithProviders(<AdminOverviewPage />);
    await waitFor(() =>
      expect(screen.getByText('Paws & Claws Clinic')).toBeInTheDocument()
    );
  });

  it('shows recent ticket subjects', async () => {
    renderWithProviders(<AdminOverviewPage />);
    await waitFor(() =>
      expect(screen.getByText('Sự cố kết nối API')).toBeInTheDocument()
    );
  });

  it('shows system health section', async () => {
    renderWithProviders(<AdminOverviewPage />);
    await waitFor(() => expect(screen.getByText('Tình trạng hệ thống')).toBeInTheDocument());
  });
});

// ─── AdminTenantsPage ────────────────────────────────────────────────────────

describe('AdminTenantsPage', () => {
  it('renders page heading', async () => {
    renderWithProviders(<AdminTenantsPage />);
    await waitFor(() => expect(screen.getByText('Danh sách Tenant')).toBeInTheDocument());
  });

  it('shows tenant rows after data loads', async () => {
    renderWithProviders(<AdminTenantsPage />);
    await waitFor(() => {
      expect(screen.getByText('Paws & Claws Clinic')).toBeInTheDocument();
      expect(screen.getByText('Clearview Vet Group')).toBeInTheDocument();
    });
  });

  it('shows tenant owner names in row subtitle', async () => {
    renderWithProviders(<AdminTenantsPage />);
    // Owner names appear as "t1 · Dr. Smith" in row subtitle — use regex
    await waitFor(() => {
      expect(screen.getByText(/Dr\. Smith/)).toBeInTheDocument();
      expect(screen.getByText(/Dr\. Lee/)).toBeInTheDocument();
    });
  });

  it('shows action buttons for tenants', async () => {
    renderWithProviders(<AdminTenantsPage />);
    await waitFor(() => expect(screen.getByText('Paws & Claws Clinic')).toBeInTheDocument());
    const allButtons = screen.getAllByRole('button');
    expect(allButtons.length).toBeGreaterThan(0);
  });
});

// ─── AdminBillingPage ────────────────────────────────────────────────────────

describe('AdminBillingPage', () => {
  it('renders billing page heading', async () => {
    renderWithProviders(<AdminBillingPage />);
    await waitFor(() => expect(screen.getAllByText('Doanh thu & Thanh toán').length).toBeGreaterThan(0));
  });

  it('shows total plan count KPI', async () => {
    renderWithProviders(<AdminBillingPage />);
    // 3 plans in mock — shows "3" in KPI card
    await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument());
  });

  it('shows failed invoice status', async () => {
    renderWithProviders(<AdminBillingPage />);
    await waitFor(() => expect(screen.getAllByText('Thất bại').length).toBeGreaterThan(0));
  });

  it('shows paid invoice status', async () => {
    renderWithProviders(<AdminBillingPage />);
    await waitFor(() => expect(screen.getAllByText('Đã thanh toán').length).toBeGreaterThan(0));
  });

  it('shows tenant names in invoice list', async () => {
    renderWithProviders(<AdminBillingPage />);
    await waitFor(() => {
      expect(screen.getByText('Paws & Claws Clinic')).toBeInTheDocument();
      expect(screen.getByText('Clearview Vet Group')).toBeInTheDocument();
    });
  });
});

// ─── AdminSupportPage ────────────────────────────────────────────────────────

describe('AdminSupportPage', () => {
  it('renders support page heading', async () => {
    renderWithProviders(<AdminSupportPage />);
    await waitFor(() => expect(screen.getAllByText('Phiếu hỗ trợ').length).toBeGreaterThan(0));
  });

  it('shows ticket subjects after data loads', async () => {
    renderWithProviders(<AdminSupportPage />);
    await waitFor(() => {
      expect(screen.getByText('Sự cố kết nối API')).toBeInTheDocument();
      expect(screen.getByText('Lỗi cổng thanh toán')).toBeInTheDocument();
    });
  });

  it('shows tenant names in ticket rows', async () => {
    renderWithProviders(<AdminSupportPage />);
    await waitFor(() => {
      expect(screen.getByText(/Vet Harmony Clinic/)).toBeInTheDocument();
    });
  });

  it('shows High priority tickets', async () => {
    renderWithProviders(<AdminSupportPage />);
    await waitFor(() => {
      const highLabels = screen.getAllByText('Cao');
      expect(highLabels.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('search filters ticket list by subject', async () => {
    renderWithProviders(<AdminSupportPage />);
    await waitFor(() => expect(screen.getByText('Sự cố kết nối API')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/Tìm theo ID phiếu/i);
    fireEvent.change(searchInput, { target: { value: 'thanh toán' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Lỗi cổng thanh toán')).toBeInTheDocument();
      expect(screen.queryByText('Sự cố kết nối API')).not.toBeInTheDocument();
    });
  });
});
