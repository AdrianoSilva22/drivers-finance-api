import { Router } from "express";
import { CreateDriverController } from "../controller/driver";
class DriverRouter {
  private router: Router

  constructor() {
    this.router = Router()
    this.router.post('/createDrive', new CreateDriverController().createDrive)
  }

  getRouter(): Router {
    return this.router
  }
}

export {
  DriverRouter
}