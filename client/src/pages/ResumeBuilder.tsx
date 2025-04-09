import React from 'react';
import ResumeBuilderComponent from '@/components/resume/ResumeBuilder';
import Layout from '@/components/layout/Layout';

const ResumeBuilderPage: React.FC = () => {
  return (
    <Layout title="Resume Builder">
      <ResumeBuilderComponent />
    </Layout>
  );
};

export default ResumeBuilderPage;