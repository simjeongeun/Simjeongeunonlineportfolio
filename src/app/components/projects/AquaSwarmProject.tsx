import { useEffect } from 'react';
import { ProjectDetailTemplate } from './ProjectDetailTemplate';

export function AquaSwarmProject() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ProjectDetailTemplate
      projectId="aquaswarm"
      title="AquaSwarm"
      subtitle="모듈형 해양 미세플라스틱 포집 솔루션"
      category="Startup Project"
      year="2024"
      description="A modular marine microplastic collection solution utilizing swarm robotics and advanced filtration systems to address ocean pollution. Designed for scalability and deployment in various marine environments."
    />
  );
}
