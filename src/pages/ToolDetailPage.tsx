import React, { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { TOOLS_REGISTRY } from '../data/tools';
import { ToolLayout } from '../components/layout/ToolLayout';
import { EmptyState } from '../components/common/EmptyState';

const ToolResolver = lazy(() => import('../tools/ToolResolver').then(m => ({ default: m.ToolResolver })));

export const ToolDetailPage: React.FC = () => {
  const { toolSlug } = useParams<{ toolSlug: string }>();

  const tool = TOOLS_REGISTRY.find(t => t.slug === toolSlug || t.id === toolSlug);

  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Tool Not Found"
          description="The tool you are looking for does not exist in our directory or has moved."
          actionLabel="Browse All Tools"
          actionPath="/tools"
        />
      </div>
    );
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading tool workspace...</p>
        </div>
      }>
        <ToolResolver tool={tool} />
      </Suspense>
    </ToolLayout>
  );
};
