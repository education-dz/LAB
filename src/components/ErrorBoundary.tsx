import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, ExternalLink } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let isFirestoreError = false;
      let firestoreDetails = null;

      try {
        if (this.state.errorInfo) {
          const parsed = JSON.parse(this.state.errorInfo);
          if (parsed.error || parsed.isOffline) {
            isFirestoreError = true;
            firestoreDetails = parsed;
          }
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-[#fcf9f3] flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-[#2b3d22]/10 p-8 border border-[#2b3d22]/5">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-[#2b3d22]">
                  {isFirestoreError ? 'خطأ في قاعدة البيانات' : 'حدث خطأ غير متوقع'}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {isFirestoreError 
                    ? (firestoreDetails?.error || 'فشل الاتصال بقاعدة البيانات. يرجى التأكد من إعداد Firestore بشكل صحيح.')
                    : 'نعتذر عن هذا الخلل. يرجى محاولة تحديث الصفحة أو العودة لاحقاً.'}
                </p>
              </div>

              {isFirestoreError && (
                <div className="w-full bg-red-50 rounded-2xl p-4 text-left text-sm font-mono text-red-800 overflow-auto max-h-32">
                  <p className="font-bold mb-1">تفاصيل الخطأ:</p>
                  <p>{this.state.error?.message || 'Unknown error'}</p>
                </div>
              )}

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={this.handleReset}
                  className="w-full py-4 bg-[#2b3d22] text-white rounded-2xl font-semibold hover:bg-[#1a2615] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2b3d22]/20"
                >
                  <RefreshCcw className="w-5 h-5" />
                  تحديث الصفحة
                </button>
                
                {isFirestoreError && (
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-white text-[#2b3d22] border-2 border-[#2b3d22]/10 rounded-2xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    فتح Firebase Console
                  </a>
                )}
              </div>

              <p className="text-xs text-gray-400">
                إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
