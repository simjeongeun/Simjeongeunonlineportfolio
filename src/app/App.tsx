import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './lib/auth';
import { ContentProvider } from './lib/content';
import { ProjectsProvider } from './lib/projects';
import { NavProvider } from './lib/nav';
import { ExperienceProvider } from './lib/experience';
import { SocialLinksProvider } from './lib/social-links';

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <ProjectsProvider>
          <NavProvider>
            <ExperienceProvider>
              <SocialLinksProvider>
                <RouterProvider router={router} />
              </SocialLinksProvider>
            </ExperienceProvider>
          </NavProvider>
        </ProjectsProvider>
      </ContentProvider>
    </AuthProvider>
  );
}
