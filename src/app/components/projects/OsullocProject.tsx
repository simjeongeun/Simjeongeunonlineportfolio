import { useEffect } from 'react';
import { ProjectDetailTemplate } from './ProjectDetailTemplate';

export function OsullocProject() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ProjectDetailTemplate
      projectId="osulloc"
      title="Green Visuals & Experiential Branding at Osulloc"
      subtitle="오설록의 친환경 비주얼 및 체험형 브랜딩, 소비자 주의력에 대한 시선 추적 연구"
      category="Design Project"
      year="2024"
      location="Jeju Island, Korea"
      description="A comprehensive study on eco-friendly visual design and experiential branding for Osulloc, including eye-tracking research on consumer attention patterns in retail environments."
    />
  );
}
