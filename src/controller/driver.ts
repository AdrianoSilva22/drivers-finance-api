import { Request, Response } from "express";
import { CreateDriverUseCase } from "../usecase/driver";
import { CreateDriverUseCaseRequest } from "../usecase/ucio/drive";
import { CreateDriverUseCaseValidate } from "../validate/driver";
import { CreateDriverUseCaseRepository } from "../repository/driver";

class CreateDriverController {
  async createDrive(req: Request, res: Response): Promise<void> {
    try {
      const { cpf, email, gender, name, password, phone } = req.body;

      const ucReq = new CreateDriverUseCaseRequest(cpf, name, email, password, gender, phone);

      const validate = new CreateDriverUseCaseValidate();
      const repository = new CreateDriverUseCaseRepository();
      const usecase = new CreateDriverUseCase(validate, repository);

      await usecase.createDriver(ucReq);

      res.status(201).json({ message: "Motorista criado com sucesso" });
    } catch (error: any) {
      console.error("Erro ao criar motorista:", error);
      res.status(500).json({ error: "Erro ao processar a requisição" });
    }
  }
}

export { CreateDriverController };
