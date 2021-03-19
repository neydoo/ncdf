import BaseRepository from "@ncdf/core/repository/base.repository";
import { Injectable } from "@nestjs/common";
import { User } from "../entities/user.entity";

@Injectable()
export class UserRespository extends BaseRepository {
  constructor() {
    super(User);
  }

}
