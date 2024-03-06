// src/cat.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards,Res } from '@nestjs/common';
import { CR } from './chngerequest.entity';
import { CrService } from './chngerequest.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../authantication/jwtAuthGuard';


@Controller('crs')
@UseGuards(JwtService)
export class CrController {
  constructor(private readonly crService: CrService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<CR[]> {
    return this.crService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() cr: CR): Promise<CR> {
    return this.crService.create(cr);
  }


  @Put(':crId/priority')
  async updateCrPriority(@Param('crId') crId: number, @Body('priority') priority: string) {
    return await this.crService.updatePriority(crId, priority);
  }

  @Delete(':crId')
  delete(@Param('crId') crId: string): Promise<void> {
    return this.crService.delete(+crId);
  }
  
  
}
