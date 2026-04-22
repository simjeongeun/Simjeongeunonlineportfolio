import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './lib/auth';
import { ContentProvider } from './lib/content';
import { ProjectsProvider } from './lib/projects';
import { NavProvider } from './lib/nav';

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <ProjectsProvider>
          <NavProvider>
            <RouterProvider router={router} />
          </NavProvider>
        </ProjectsProvider>
      </ContentProvider>
    </AuthProvider>
  );
}
