import { Prisma } from '@prisma/client';
import { httpError } from '../../shared/errors.js';
import type { AddMemberInput, CreateProjectInput } from './project.schema.js';
import type { createProjectRepository } from './project.repository.js';
import { forgetProjectRole } from './membership.service.js';

type ProjectRepository = ReturnType<typeof createProjectRepository>;

const summarizeTasks = (tasks: Array<{ status: string }>) =>
    tasks.reduce(
        (summary, task) => ({
            ...summary,
            [task.status]: summary[task.status] + 1,
        }),
        { PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0 } as Record<string, number>
    );

export const createProjectService = (projects: ProjectRepository) => ({
    create: (ownerId: string, input: CreateProjectInput) =>
        projects.createOwnedProject(ownerId, input),

    listForUser: async (userId: string) => {
        const rows = await projects.userProjects(userId);

        return rows.map(({ members, ...project }) => ({
            ...project,
            role: members[0]?.role ?? null,
        }));
    },

    getDetails: async (projectId: string, userId: string) => {
        const project = await projects.detailedProject(projectId);
        if (!project) throw httpError.notFound('Project not found');

        const currentMember = project.members.find((member) => member.userId === userId);
        const { tasks, ...rest } = project;

        return {
            ...rest,
            currentUserId: userId,
            currentUserRole: currentMember?.role ?? null,
            taskSummary: summarizeTasks(tasks),
        };
    },

    addMember: async (projectId: string, input: AddMemberInput) => {
        const user = await projects.userByEmail(input.email);
        if (!user) throw httpError.notFound('User not found');

        try {
            const member = await projects.addMember(projectId, user.id, input.role);
            forgetProjectRole(projectId, user.id);
            return member;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw httpError.badRequest('User already in project');
            }

            throw error;
        }
    },
});
