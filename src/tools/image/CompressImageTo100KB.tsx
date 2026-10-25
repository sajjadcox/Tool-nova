import React from 'react';
import { BulkImageCompressor } from './BulkImageCompressor';

export const CompressImageTo100KB: React.FC = () => {
  return <BulkImageCompressor initialTargetKB={100} />;
};

export const CompressImageTo50KB: React.FC = () => {
  return <BulkImageCompressor initialTargetKB={50} />;
};

export const CompressImageTo200KB: React.FC = () => {
  return <BulkImageCompressor initialTargetKB={200} />;
};
