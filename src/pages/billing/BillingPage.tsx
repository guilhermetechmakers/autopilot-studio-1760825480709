import React from 'react';
import { useParams } from 'react-router-dom';
import { BillingSystem } from '@/components/billing';

const BillingPage: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <BillingSystem projectId={projectId} />
      </div>
    </div>
  );
};

export default BillingPage;