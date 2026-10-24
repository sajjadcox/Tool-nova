export type ToolStatus = 
  | 'Implemented' 
  | 'Tested' 
  | 'Requires API' 
  | 'Requires Backend' 
  | 'Experimental' 
  | 'Planned';

export type ProcessingMode = 'client' | 'server' | 'hybrid' | 'external-api';

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  keywords: string[];
  icon: string;
  route: string;
  status: ToolStatus;
  processingMode: ProcessingMode;
  requiredDependencies?: string[];
  privacyInfo: string;
  relatedToolIds: string[];
  popular?: boolean;
  featured?: boolean;
  componentKey?: string;
}

export interface CategoryDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}

export interface ToolExecutionResult {
  success: boolean;
  message?: string;
  error?: string;
  downloadUrl?: string;
  downloadFilename?: string;
  data?: unknown;
}
