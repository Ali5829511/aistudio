import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="size-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-rounded text-3xl">error</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-4">عذراً، حدث خطأ غير متوقع</h1>
            <p className="text-slate-500 mb-6">
              نأسف لذلك. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني إذا استمرت المشكلة.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-primary text-brand-dark font-bold rounded-2xl hover:bg-brand-yellow transition-colors"
            >
              إعادة تحميل الصفحة
            </button>
            {this.state.error && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl text-left overflow-auto max-h-40 text-xs text-slate-600 font-mono">
                {this.state.error.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
