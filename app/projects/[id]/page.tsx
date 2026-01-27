import { getDatabase } from '@/lib/mongodb';
import type { Project } from '@/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github, ArrowLeft } from 'lucide-react';
import ProjectDetailClient from '@/components/ProjectDetailClient';

async function getProject(id: string): Promise<Project | null> {
  try {
    const db = await getDatabase();
    const { ObjectId } = await import('mongodb');
    
    const project = await db.collection<Project>('projects').findOne({
      _id: new ObjectId(id),
    });

    if (!project) return null;

    return {
      ...project,
      _id: project._id?.toString(),
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
