import { useEffect } from 'react';
import { ProjectDetailTemplate } from './ProjectDetailTemplate';

export function FragmentsProject() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ProjectDetailTemplate
      projectId="fragments"
      title="Fragments of Light, Movements of Emotion"
      subtitle="빛의 조각과 감정의 흐름 주제의 호텔 리디자인"
      category="Design Project"
      year="2024"
      description="A hotel redesign project centered on the theme of light fragments and emotional flows, creating immersive spatial experiences that evoke feelings through carefully orchestrated lighting and material choices."
    />
  );
}
