'use client';

import { createContext, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { Project } from '../generated/prisma/browser';

interface ProjectState {
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  isLoadingProjects: boolean;
  setIsLoadingProjects: (loading: boolean) => void;
}

// Zustand store factory
const createProjectStore = () =>
  createStore<ProjectState>(set => ({
    activeProject: null,
    setActiveProject: (project: Project | null) => set(() => ({ activeProject: project })),
    projects: [],
    setProjects: (projects: Project[]) => set(() => ({ projects })),
    isLoadingProjects: false,
    setIsLoadingProjects: (isLoadingProjects: boolean) => set(() => ({ isLoadingProjects })),
  }));

// Context for the store instance
const ProjectStoreContext = createContext<ReturnType<typeof createProjectStore> | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const store = createProjectStore();
  return <ProjectStoreContext.Provider value={store}>{children}</ProjectStoreContext.Provider>;
}

// Hook to access the project context (zustand-powered)
export function useProjectContext<T = ProjectState>(selector?: (state: ProjectState) => T): T {
  const store = useContext(ProjectStoreContext);
  if (!store) throw new Error('useProjectContext must be used within ProjectProvider');
  // Allow selector for performance, default to full state
  return useStore(store, selector ?? ((s: ProjectState) => s as T));
}
