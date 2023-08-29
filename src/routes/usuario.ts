import express, { Request, Response } from 'express'
import { check, validationResult } from 'express-validator'
import connection from '../config/connection'

const router = express.Router()

interface User {
  id: number | string
  nome: string
  email: string
  login: string
  senha: string
  genero: string
}

const buscarUsuarioPorId = async (id: number | string, res: Response) => {
  try {
    const [query] = await connection.execute(`SELECT * FROM usuario WHERE id = ${id}`)
    if (Array.isArray(query) && query.length === 0) {
      throw new Error()
    }
    res.json(query).status(200)
    if (Array.isArray(query)) {
      return query.length
    }
  } catch (error) {
    res.status(404).json({ mesagem: 'Erro ao buscar usuário' })
    return null
  }
}

router.post('/cadastro',
  [check('email').notEmpty().withMessage('O campo de email não pode estar vazio!'),
  check('email').isEmail().withMessage('Informe um email válido'),
  check('nome').notEmpty().withMessage('O campo nome não pode estar vazio!'),
  check('senha').isLength({ min: 8 }).withMessage('O campo senha deve ter no mínimo 8 caracteres!'),
  check('genero').notEmpty().withMessage('O campo genero não pode estar vazio!')],

  async (req: Request, res: Response) => {
    const erros = validationResult(req)

    if (!erros.isEmpty()) {
      return res.status(400).json({ errors: erros.array() })
    }

    const user: User = req.body
    
    const sql = `INSERT INTO usuario (nome, email, login, senha, genero)
  VALUES (?, ?, ?, ?, ?)`

    const valores = [
      user.nome,
      user.email,
      user.login,
      user.senha,
      user.genero,
    ]

    try {
      const con = await connection.getConnection()
      const [result] = await connection.query(sql, valores)
      con.release()
      res.status(201).send("Usuário cadastrado com sucesso!")
    } catch (error: any) {
      if (error.errno == 1062) {
        if (error.sqlMessage.includes('usuario.email')) {
          res.status(400).send("email de usuario já esta em uso")
        } else if (error.sqlMessage.includes('usuario.login')) {
          res.status(400).send("login de usuario já esta em uso")
        }
      } else {
        res.status(400).json({ mensagem: 'Erro ao tentar salvar usuário' })
      }
    }
  })

router.post('/login',
  [check('login').notEmpty().withMessage('O campo de login não pode estar vazio!'),
  check('senha').isLength({ min: 8 }).withMessage('O campo senha deve ter no mínimo 8 caracteres!')],

  async (req: Request, res: Response) => {
    const erros = validationResult(req)

    if (!erros.isEmpty()) {
      return res.status(400).json({ errors: erros.array() })
    }

    const { login, senha }: User = req.body
    const loginSenhaSql = `SELECT * FROM usuario WHERE login=?`

    try {
      const [result] = await connection.query(loginSenhaSql, [login])
      const resultType = result as User[]

      if (resultType.length) {
        if (resultType[0].senha === senha) {
          res.status(200).send('Login bem-sucedido!')
        } else {
          res.status(401).send('Login de usuário ou senha incorreto.')
        }
      } else {
        res.status(401).send('Login de usuário ou senha incorreto.')
      }
    } catch (e) {
      res.status(400).send('Ops, algo deu errado. Verifique suas credenciais e tente novamente.')
    }
  })

router.get('/buscar-todos', async (req: Request, res: Response) => {
  try {
    const [query] = await connection.execute('SELECT * FROM usuario')
    res.json(query).status(200) // Envia o resultado da busca como resposta JSON
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    res.status(404).json({ mensagem: 'Erro ao buscar usuários' })
  }
})

router.get('/buscar/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  const resultado = buscarUsuarioPorId(id, res)
})

router.put('/atualizar/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const user: User = req.body

  const sql = `UPDATE usuario SET nome=?, email=?, login=?, senha=?, genero=? WHERE id=${id}`
  const valores = [
    user.nome,
    user.email,
    user.login,
    user.senha,
    user.genero,
  ]
  try {
    const con = await connection.getConnection()
    const [result] = await connection.query(sql, valores)
    con.release()
    res.status(200).send('usuario autualizado com sucesso')
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error)
    res.status(400).send('erro ao atualizar')
  }
})
//Deletar / DELETE - DELETE

router.delete('/deletar/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const sql = `DELETE FROM usuario WHERE id=${id}`
  try {
    connection.execute(sql)
    res.status(204).send('Usuário deletado com sucesso!')
  } catch (error) {
    res.status(400).send('erro ao deletar usuário!')
  }
})




export default router
