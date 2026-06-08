import { useEffect } from 'react';
import { ProjectDetailTemplate } from './ProjectDetailTemplate';

export function SmartRefrigeratorProject() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ProjectDetailTemplate
      projectId="smart-refrigerator"
      title="Smart Refrigerator Project"
      subtitle="학생들의 학교 생활을 위한 스마트 냉장고 디자인 프로젝트"
      category="Startup Project"
      year="2023"
      description="A smart refrigerator design project tailored for student life, incorporating IoT technology to help students manage food inventory, reduce waste, and maintain healthy eating habits."
    />
  );
}
