import { Injectable } from '@nestjs/common';

/**
 * Base repository class handling common mongodb queries.
 *
 * Coupled tightly to mongodb.
 *
 * @todo document all methods.
 * @todo decouple from mongodb.
 */
@Injectable()
export default class BaseRepository {
  protected model: any;

  constructor(dbModel: any) {
    this.model = dbModel;
  }

  public createNew(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.create(data).then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public updateData(id: any, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.findByIdAndUpdate(id, { $set: data }, { upsert: true, returnNewDocument: true })
        .then((res: any) => {
          resolve(res);
        }).catch((err: any) => {
          reject(err);
        });
    });
  }

  public findAll(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.find({ deletedAt: null }).then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public findAllDeleted(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.find({ deletedAt: { $ne: null } }).then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public findAllWithDeleted(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.find().then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public findLimit(limit: number, orderColumn: string, orderDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.model.find({ deletedAt: null })
        .sort({ [orderColumn]: orderDir })
        .limit(limit)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  public findById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.findById(id).then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public findBy(where: any, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.find({ [where]: value }).then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public findByFirst(where: any, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.findOne({ [where]: value }).then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public findByFirstInArray(where: any, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.find({ [where]: { $in: value } }).then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public softDelete(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.findById(id).then((res: any) => {
        res.deletedAt = new Date();
        res.save();
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public forceDelete(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.findOneAndRemove({ _id: id }).then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public countAllDocuments(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.countDocuments().then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public countDocumentsWhere(where: any, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.model.countDocuments({ [where]: value }).then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }
}
