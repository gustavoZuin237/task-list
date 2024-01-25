import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"
import { randomUUID } from "node:crypto"

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.query

            let tasks

            tasks = database.select('tasks', {
                title: title ?? "",
                description: description ?? ""
            })

            if (!title && !description) {
                tasks = database.select('tasks')
            }

            return res
            .end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                created_at: new Date(),
                updated_at: null,
                completed_at: null,
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            try {
                database.update('tasks', id, {
                    title: title,
                    description: description
                })
    
                return res.writeHead(204).end()
            } catch (error) {
                return res.writeHead(404).end()
            }
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            try {
                database.update('tasks', id, {
                    completed_at: new Date()
                })
    
                return res.writeHead(204).end()
            } catch (error) {
                return res.writeHead(404).end()
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            database.delete('tasks', id, )
    
            return res.writeHead(204).end()
        }
    }
]