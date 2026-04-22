import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router';
import { ProjectDetailTemplate } from './ProjectDetailTemplate';
import { useProjects } from '../../lib/projects';

export function GenericProject() {
  const { slug } = useParams<{ slug: string }>();
  const { getProject, ready } = useProjects();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!ready) {
    return <div style={{ minHeight: '100vh', background: '#fff' }} />;
  }

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const project = getProject(slug);
  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <ProjectDetailTemplate
      projectId={project.id}
      title={project.title}
      subtitle={project.subtitle}
      category={project.category}
      description=""
    />
  );
}
