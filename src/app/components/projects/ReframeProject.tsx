import { useEffect } from 'react';
import { ProjectDetailTemplate } from './ProjectDetailTemplate';

export function ReframeProject() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ProjectDetailTemplate
      projectId="reframe"
      title="RE:FRAME"
      subtitle="삶의 변화에 맞춰 해체하고 조립하는 반응형 가구"
      category="Design Project"
      year="2024"
      description="Responsive furniture that can be disassembled and reassembled to adapt to life's changes. A modular system designed for flexibility, sustainability, and personal customization."
    />
  );
}
