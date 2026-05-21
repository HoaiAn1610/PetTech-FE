import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class AdminErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[AdminErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, fontFamily: 'Inter, sans-serif' }}>
          <div style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 16, padding: 40, maxWidth: 480, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <AlertTriangle style={{ width: 40, height: 40, color: '#dc2626', marginBottom: 16 }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Đã xảy ra lỗi</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 24 }}>{this.state.message || 'Lỗi không xác định. Thử tải lại trang.'}</p>
            <button
              onClick={() => this.setState({ hasError: false, message: '' })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <RefreshCw style={{ width: 14, height: 14 }} />
              Thử lại
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
