/* eslint-disable prettier/prettier */
// src/cat.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CR } from './chngerequest.entity';
import { Getcr} from '../getcr/getcr.entity';
import { User } from 'src/user/user.entity';


@Injectable()
export class CrService {
  constructor(
    @InjectRepository(CR)
    private readonly CrRepository: Repository<CR>,
    @InjectRepository(Getcr)
    private readonly GetCrRepository: Repository<Getcr>,
    @InjectRepository(User)
    private readonly  UserRepository: Repository<User>
    

  ) {}

  async findAll(): Promise<CR[]> {
    return await this.CrRepository.find();
  }

  async startDevelopment(crId: number, userId: number): Promise<CR> {
    try {
        const cr = await this.CrRepository.findOne({ where: { crId } });
        if (!cr) {
            throw new Error(`CR with ID ${crId} not found`);
        }

        // Update CR status
        cr.status = 'Starting Development';

        // Save the updated CR
        await this.CrRepository.save(cr);

        // Retrieve the user by ID
        const user = await this.UserRepository.findOne({ where: { userId } });
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        // Log the crId and userId in Getcr table
        const getcr = new Getcr();
        getcr.cr = cr;
        getcr.user = user;

        // Ensure getcr is correctly passed and of the correct type
        await this.GetCrRepository.save(getcr);

        return cr;
    } catch (error) {
        console.error("Error in startDevelopment:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

  

  async findByStatus(status: string): Promise<CR[]> {
    return this.CrRepository.find({ where: { status } });
  }
  

  async create(cr: CR): Promise<CR> {
    // Find the maximum priority in the database
    const maxPriorityCR = await this.CrRepository
      .createQueryBuilder("cr")
      .select("MAX(cr.priority)", "maxPriority")
      .getRawOne();

    let maxPriority = 0;
    if (maxPriorityCR && maxPriorityCR.maxPriority) {
      maxPriority = parseInt(maxPriorityCR.maxPriority);
    }

    // Assign the new priority
    cr.priority = (maxPriority + 1).toString();

    // Save the CR
    const createdCR = await this.CrRepository.save(cr);
    return createdCR;
  }



  async update(crId: number, cr: CR): Promise<CR> {
    await this.CrRepository.update(crId, cr);
    return await this.CrRepository.findOne({ where: { crId } });
  }

  async delete(crId: number): Promise<void> {
    await this.CrRepository.delete(crId);
  }

//   async updatePriority(crId: number, priority: string): Promise<CR> {
//     const cr = await this.CrRepository.findOne({ where: { crId } });
//     cr.priority = priority;
//     return await this.CrRepository.save(cr);
// }


async updatePriority(crId: number, priority: number) {
  const cr = await this.CrRepository.findOne({ where: { crId } });
  if (!cr) {
    throw new Error(`CR with ID ${crId} not found`);
  }

  cr.priority = String(priority);


  return await this.CrRepository.save(cr);
}

}


