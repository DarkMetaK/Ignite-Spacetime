import { FastifyInstance } from 'fastify'
import { resolve } from 'node:path'
import { unlink } from 'node:fs'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/memories', async (request) => {
    const memories = await prisma.memory.findMany({
      where: {
        user_id: request.user.sub,
      },
      orderBy: {
        created_at: 'asc',
      },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        cover_url: memory.cover_url,
        excerpt: memory.content.substring(0, 120).concat('...'),
        created_at: memory.created_at,
      }
    })
  })

  app.get('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (!memory.is_public && memory.user_id !== request.user.sub) {
      return reply.status(401).send()
    }

    return {
      ...memory,
      is_owner: memory.user_id === request.user.sub,
    }
  })

  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      cover_url: z.string().url().optional().nullable(),
      content: z.string(),
      is_public: z.coerce.boolean().default(false),
    })

    const { cover_url, content, is_public } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        cover_url,
        content,
        is_public,
        user_id: request.user.sub,
      },
    })
    return memory
  })

  app.put('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const bodySchema = z.object({
      cover_url: z.string().url().optional().nullable(),
      content: z.string(),
      is_public: z.coerce.boolean().default(false),
    })

    const { id } = paramsSchema.parse(request.params)
    const { cover_url, content, is_public } = bodySchema.parse(request.body)

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.user_id !== request.user.sub) {
      return reply.status(401).send()
    }

    memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        cover_url,
        content,
        is_public,
      },
    })

    return memory
  })

  app.delete('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.user_id !== request.user.sub) {
      return reply.status(401).send()
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    })

    if (memory.cover_url) {
      const fullURL = request.protocol
        .concat('://')
        .concat(request.hostname)
        .concat('/uploads/')
      const fileName = memory.cover_url.replace(fullURL, '')

      unlink(resolve(__dirname, '..', '..', 'uploads', fileName), (error) => {
        if (error) return console.log(error)
        console.log('file deleted successfully')
      })
    }
  })
}
