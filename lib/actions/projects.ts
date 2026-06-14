"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getProjectForUser,
  requireAuth,
  NotFoundError,
} from "@/lib/auth-utils";
import { projectSchema, type ProjectInput } from "@/lib/validations/project";
import { logActivity } from "@/lib/portfolio/activity";

export type ProjectActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function formatZodErrors(
  fieldErrors: Record<string, string[] | undefined>
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(fieldErrors).filter(
      (entry): entry is [string, string[]] => !!entry[1]?.length
    )
  );
}

export async function createProjectAction(
  _prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  let session;
  try {
    session = await requireAuth();
  } catch {
    return { success: false, message: "You must be logged in" };
  }

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    budget: formData.get("budget"),
    timeline: formData.get("timeline"),
    teamSize: Number(formData.get("teamSize")),
    experienceLevel: formData.get("experienceLevel"),
    status: formData.get("status") || "draft",
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      status: parsed.data.status ?? "draft",
      userId: session.user.id,
    },
  });

  await logActivity({
    userId: session.user.id,
    projectId: project.id,
    type: "project_created",
    title: `Project created: ${project.title}`,
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  revalidatePath("/portfolio");
  redirect(`/projects/${project.id}`);
}

export async function updateProjectAction(
  projectId: string,
  _prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  let session;
  try {
    session = await requireAuth();
  } catch {
    return { success: false, message: "You must be logged in" };
  }

  try {
    await getProjectForUser(projectId, session.user.id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, message: "Project not found" };
    }
    throw error;
  }

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    budget: formData.get("budget"),
    timeline: formData.get("timeline"),
    teamSize: Number(formData.get("teamSize")),
    experienceLevel: formData.get("experienceLevel"),
    status: formData.get("status"),
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
  }

  await prisma.project.update({
    where: { id: projectId },
    data: parsed.data,
  });

  await logActivity({
    userId: session.user.id,
    projectId,
    type: "project_updated",
    title: `Project updated: ${parsed.data.title}`,
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
  revalidatePath("/portfolio");
  redirect(`/projects/${projectId}`);
}

export async function deleteProjectAction(projectId: string) {
  const session = await requireAuth();

  try {
    await getProjectForUser(projectId, session.user.id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, message: "Project not found" };
    }
    throw error;
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect("/projects");
}

export async function updateProjectStatusAction(
  projectId: string,
  status: ProjectInput["status"]
) {
  const session = await requireAuth();

  try {
    await getProjectForUser(projectId, session.user.id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { success: false, message: "Project not found" };
    }
    throw error;
  }

  if (!status) {
    return { success: false, message: "Invalid status" };
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { status },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");

  return { success: true };
}
