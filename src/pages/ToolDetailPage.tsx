import React from 'react';
import { useParams } from 'react-router-dom';
import { TOOLS_REGISTRY } from '../data/tools';
import { ToolLayout } from '../components/layout/ToolLayout';
import { ToolResolver } from '../tools/ToolResolver';
import { EmptyState } from '../components/common/EmptyState';

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
      <ToolResolver tool={tool} />
    </ToolLayout>
  );
};
