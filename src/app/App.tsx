import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './lib/auth';
import { ContentProvider } from './lib/content';
import { ProjectsProvider } from './lib/projects';

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <ProjectsProvider>
          <RouterProvider router={router} />
        </ProjectsProvider>
      </ContentProvider>
    </AuthProvider>
  );
}
